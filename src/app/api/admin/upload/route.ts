import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';

const REPO = 'henry-sf-ag1/rkay-construction';
const BRANCH = 'master';

export async function POST(req: NextRequest) {
  if (!(await verifyAdminToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pat = process.env.GITHUB_PAT;
  if (!pat) {
    return NextResponse.json({ error: 'Server misconfigured: missing GITHUB_PAT' }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    // Sanitize filename
    const customName = formData.get('filename') as string | null;
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeName = customName
      ? customName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()
      : file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[^a-zA-Z0-9-_]/g, '-')
          .toLowerCase()
          .slice(0, 60);
    const timestamp = Date.now();
    const filename = `${safeName}-${timestamp}.${ext}`;
    const filePath = `public/uploads/${filename}`;

    // Convert file to base64 for GitHub API
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // Commit to GitHub
    const putRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${pat}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          message: `Upload image: ${filename}`,
          content: base64,
          branch: BRANCH,
        }),
      }
    );

    if (!putRes.ok) {
      const err = await putRes.json();
      throw new Error(`GitHub upload error: ${JSON.stringify(err)}`);
    }

    // Return the public URL (served by Vercel from /public)
    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ path: publicUrl });
  } catch (err: any) {
    const message = err?.message || String(err);
    console.error('Upload error:', err);
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}
