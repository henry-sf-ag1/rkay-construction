import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';

const BLOB_KEY = 'site-config.json';

export async function GET(req: NextRequest) {
  if (!(await verifyAdminToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Try Vercel Blob first (fast path)
  try {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (blobToken) {
      // Construct the public blob URL pattern
      // We use the @vercel/blob head() to find the URL, then fetch it
      const { head } = await import('@vercel/blob');
      try {
        // Try to find the blob by listing (we know the pathname)
        const { list } = await import('@vercel/blob');
        const { blobs } = await list({ prefix: BLOB_KEY });
        const match = blobs.find((b) => b.pathname === BLOB_KEY);
        if (match) {
          const res = await fetch(match.url, { cache: 'no-store' });
          if (res.ok) {
            const config = await res.json();
            return NextResponse.json({ config, source: 'blob' });
          }
        }
      } catch (e) {
        console.error('Blob list failed:', e);
      }
    }
  } catch (e) {
    console.error('Blob read failed:', e);
  }

  // Fallback: read from GitHub
  const pat = process.env.GITHUB_PAT;
  if (!pat) {
    return NextResponse.json({ error: 'No content source available' }, { status: 500 });
  }

  try {
    const REPO = 'henry-sf-ag1/rkay-construction';
    const FILE_PATH = 'src/config/site.ts';
    const BRANCH = 'master';

    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
      { headers: { Authorization: `token ${pat}`, Accept: 'application/vnd.github.v3+json' } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
    }

    const data = await res.json();
    const raw = Buffer.from(data.content, 'base64').toString('utf-8');

    const match = raw.match(/export const siteConfig\s*=\s*(\{[\s\S]*\});?\s*$/);
    if (!match) {
      return NextResponse.json({ error: 'Could not parse site config' }, { status: 500 });
    }

    // eslint-disable-next-line no-new-func
    const config = new Function(`return ${match[1]}`)();
    return NextResponse.json({ config, source: 'github' });
  } catch (err) {
    console.error('Content read error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
