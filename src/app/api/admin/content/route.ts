import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';
import { head } from '@vercel/blob';
import { siteConfig } from '@/config/site';

const BLOB_KEY = 'site-config.json';

// Fill in any fields missing from the stored blob with static defaults,
// so new config fields (e.g. sectionSubtitles added later) show their current
// site text in the admin UI instead of an empty box.
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

  // Try Vercel Blob first (fast path)
  try {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (blobToken) {
      try {
        const blobMeta = await head(BLOB_KEY);
        if (blobMeta?.url) {
          const cacheBust = `${blobMeta.url}${blobMeta.url.includes('?') ? '&' : '?'}t=${Date.now()}`;
          const res = await fetch(cacheBust, { cache: 'no-store' });
          if (res.ok) {
            const config = await res.json();
            return NextResponse.json({ config: mergeWithDefaults(config), source: 'blob' });
          }
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (!msg.includes('not found')) {
          console.error('Blob head failed:', msg);
        }
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
    return NextResponse.json({ config: mergeWithDefaults(config), source: 'github' });
  } catch (err) {
    console.error('Content read error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
