# R Kay Construction

A one-page construction company website built with Next.js 14, Tailwind CSS, and TypeScript. Content is managed via **Keystatic CMS** (file-based) with a fallback to static configuration.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.

## Keystatic CMS

The website uses [Keystatic](https://keystatic.com/) as a file-based CMS. No accounts, API keys, or external services needed — it reads and writes content directly to local JSON files.

### Editing Content

Start the dev server and navigate to [http://localhost:3000/keystatic](http://localhost:3000/keystatic) to edit content through the admin UI.

### Content Structure

| Type | Description |
|---|---|
| **Site Settings** | Company name, contact info, tagline, social links, project types |
| **Services** | Construction services offered (with Lucide icon names) |
| **Projects** | Portfolio of completed projects (with optional images) |
| **Testimonials** | Client reviews and quotes |

Content files are stored in `src/content/` as JSON:

```
src/content/
├── site-settings/index.json
├── services/*/index.json
├── projects/*/index.json
└── testimonials/*/index.json
```

### Adding Project Images

Upload images through the Keystatic admin UI. They're stored in `public/images/projects/`.

## Static Fallback

If Keystatic content files are missing or unreadable, the website falls back to static content from `src/config/site.ts`. This means the site works immediately without any CMS content.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **CMS:** Keystatic (file-based, local mode)
- **Icons:** Lucide React
- **Language:** TypeScript
- **Rendering:** ISR (revalidate: 60s)
