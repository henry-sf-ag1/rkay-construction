import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';

const REPO = 'henry-sf-ag1/rkay-construction';
const FILE_PATH = 'src/config/site.ts';
const BRANCH = 'master';

export async function POST(req: NextRequest) {
  if (!(await verifyAdminToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pat = process.env.GITHUB_PAT;
  if (!pat) {
    return NextResponse.json({ error: 'GitHub PAT not configured' }, { status: 500 });
  }

  try {
    const { config } = await req.json();

    // Get current SHA
    const getRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
      { headers: { Authorization: `token ${pat}`, Accept: 'application/vnd.github.v3+json' } }
    );
    if (!getRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch current file' }, { status: 500 });
    }
    const current = await getRes.json();

    // Build new file content
    const newContent = `export const siteConfig = ${JSON.stringify(config, null, 2)};\n`;
    const encoded = Buffer.from(newContent).toString('base64');

    // Commit via GitHub API
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
      console.error('GitHub PUT error:', err);
      return NextResponse.json({ error: 'Failed to save to GitHub' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Saved! Changes will go live in ~30 seconds.' });
  } catch (err) {
    console.error('Save error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
