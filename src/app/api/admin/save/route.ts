import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';

const REPO = 'henry-sf-ag1/rkay-construction';
const CONFIG_PATH = 'content/site-config.json';
const BRANCH = 'master';

export async function POST(req: NextRequest) {
  if (!(await verifyAdminToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { config } = await req.json();

    const pat = process.env.GITHUB_PAT;
    if (!pat) {
      return NextResponse.json({ error: 'Server misconfigured: missing GITHUB_PAT' }, { status: 500 });
    }

    await commitConfigToGitHub(pat, config);

    return NextResponse.json({
      success: true,
      message: 'Saved! Changes will appear on the site within ~10 seconds.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Save error:', message);
    return NextResponse.json({ error: 'Save failed', detail: message }, { status: 500 });
  }
}

async function commitConfigToGitHub(pat: string, config: unknown) {
  const jsonContent = JSON.stringify(config, null, 2) + '\n';
  const encoded = Buffer.from(jsonContent).toString('base64');

  // Check if file already exists (need its SHA to update)
  let existingSha: string | undefined;
  const getRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${CONFIG_PATH}?ref=${BRANCH}`,
    { headers: { Authorization: `token ${pat}`, Accept: 'application/vnd.github.v3+json' } }
  );
  if (getRes.ok) {
    const data = await getRes.json();
    existingSha = data.sha;
  }

  const putRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${CONFIG_PATH}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${pat}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: 'Update site config via admin panel',
        content: encoded,
        sha: existingSha,
        branch: BRANCH,
      }),
    }
  );
  if (!putRes.ok) {
    const err = await putRes.json();
    throw new Error(`GitHub PUT error: ${JSON.stringify(err)}`);
  }
}
