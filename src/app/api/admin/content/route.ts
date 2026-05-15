import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';
import { siteConfig } from '@/config/site';

const REPO = 'henry-sf-ag1/rkay-construction';
const CONFIG_PATH = 'content/site-config.json';
const BRANCH = 'master';

// Fill in any fields missing from stored config with static defaults
function mergeWithDefaults(stored: any) {
  const merged = { ...(siteConfig as any), ...(stored || {}) };
  merged.social = { ...(siteConfig as any).social, ...(stored?.social || {}) };
  merged.about = { ...(siteConfig as any).about, ...(stored?.about || {}) };
  merged.theme = { ...(siteConfig as any).theme, ...(stored?.theme || {}) };
  merged.quoteForm = {
    ...(siteConfig as any).quoteForm,
    ...(stored?.quoteForm || {}),
    fields: {
      ...((siteConfig as any).quoteForm?.fields || {}),
      ...(stored?.quoteForm?.fields || {}),
    },
  };
  merged.sectionSubtitles = {
    ...((siteConfig as any).sectionSubtitles || {}),
    ...(stored?.sectionSubtitles || {}),
  };
  return merged;
}

export async function GET(req: NextRequest) {
  if (!(await verifyAdminToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pat = process.env.GITHUB_PAT;
  if (!pat) {
    return NextResponse.json({ error: 'No content source available' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${CONFIG_PATH}?ref=${BRANCH}`,
      {
        headers: { Authorization: `token ${pat}`, Accept: 'application/vnd.github.v3+json' },
        cache: 'no-store',
      }
    );

    if (res.ok) {
      const data = await res.json();
      const config = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'));
      return NextResponse.json({ config: mergeWithDefaults(config), source: 'github-json' });
    }

    // Fall back to parsing site.ts if JSON config doesn't exist yet
    const tsRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/src/config/site.ts?ref=${BRANCH}`,
      {
        headers: { Authorization: `token ${pat}`, Accept: 'application/vnd.github.v3+json' },
        cache: 'no-store',
      }
    );
    if (!tsRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
    }
    const tsData = await tsRes.json();
    const raw = Buffer.from(tsData.content, 'base64').toString('utf-8');
    const match = raw.match(/export const siteConfig\s*=\s*(\{[\s\S]*\});?\s*$/);
    if (!match) {
      return NextResponse.json({ error: 'Could not parse site config' }, { status: 500 });
    }
    // eslint-disable-next-line no-new-func
    const config = new Function(`return ${match[1]}`)();
    return NextResponse.json({ config: mergeWithDefaults(config), source: 'github-ts' });
  } catch (err) {
    console.error('Content read error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
