import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';
import sharp from 'sharp';

const REPO = 'henry-sf-ag1/rkay-construction';
const BRANCH = 'master';
const MAX_WIDTH = 1400;
const JPEG_QUALITY = 82;

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

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 20MB)' }, { status: 400 });
    }

    const customName = formData.get('filename') as string | null;
    const safeName = customName
      ? customName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()
      : file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[^a-zA-Z0-9-_]/g, '-')
          .toLowerCase()
          .slice(0, 60);
    const filename = `${safeName}-${Date.now()}.jpg`;
    const filePath = `public/uploads/${filename}`;

    // Compress with sharp — handles large phone photos without timeout
    const buffer = Buffer.from(await file.arrayBuffer());
    const compressed = await sharp(buffer)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, progressive: true })
      .toBuffer();

    const base64 = compressed.toString('base64');

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

    // Return GitHub raw URL — accessible immediately, no Vercel rebuild needed
    const rawUrl = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${filePath}`;
    return NextResponse.json({ path: rawUrl });
  } catch (err: any) {
    const message = err?.message || String(err);
    console.error('Upload error:', message);
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}
