import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';
import { put } from '@vercel/blob';

const REPO = 'henry-sf-ag1/rkay-construction';
const FILE_PATH = 'src/config/site.ts';
const BRANCH = 'master';
const BLOB_KEY = 'site-config.json';

export async function POST(req: NextRequest) {
  if (!(await verifyAdminToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { config } = await req.json();

    // 1. Write to Vercel Blob immediately (fast path)
    const jsonContent = JSON.stringify(config, null, 2);
    await put(BLOB_KEY, jsonContent, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 0,
    });

    // 2. Fire-and-forget GitHub commit (backup, non-blocking)
    const pat = process.env.GITHUB_PAT;
    if (pat) {
      commitToGitHub(pat, config).catch((err) =>
        console.error('Background GitHub commit failed:', err)
      );
    }

    return NextResponse.json({ success: true, message: 'Saved! Changes will go live in ~5 seconds.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Save error:', message);
    return NextResponse.json({ error: 'Internal error', detail: message }, { status: 500 });
  }
}

async function commitToGitHub(pat: string, config: unknown) {
  const getRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
    { headers: { Authorization: `token ${pat}`, Accept: 'application/vnd.github.v3+json' } }
  );
  if (!getRes.ok) throw new Error('Failed to fetch current file from GitHub');
  const current = await getRes.json();

  const newContent = `export const siteConfig = ${JSON.stringify(config, null, 2)};\n`;
  const encoded = Buffer.from(newContent).toString('base64');

  const putRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${pat}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: 'Update site content via admin panel',
        content: encoded,
        sha: current.sha,
        branch: BRANCH,
      }),
    }
  );
  if (!putRes.ok) {
    const err = await putRes.json();
    throw new Error(`GitHub PUT error: ${JSON.stringify(err)}`);
  }
}
