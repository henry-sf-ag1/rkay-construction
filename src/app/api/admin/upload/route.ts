import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  if (!(await verifyAdminToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
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

    const blob = await put(`images/${filename}`, file, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });

    return NextResponse.json({ path: blob.url });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
