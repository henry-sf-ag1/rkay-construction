import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';
import { siteConfig } from '@/config/site';

// Fill in any fields missing from the stored config with static defaults,
// so new config fields show their current site text in the admin UI instead
// of an empty box.
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

  // Read latest config from GitHub (source of truth)
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
      {
        headers: { Authorization: `token ${pat}`, Accept: 'application/vnd.github.v3+json' },
        cache: 'no-store',
      }
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
    return NextResponse.json({ config: mergeWithDefaults(config), source: 'github' });
  } catch (err) {
    console.error('Content read error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
