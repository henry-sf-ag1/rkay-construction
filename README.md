# R Kay Construction

A one-page construction company website built with Next.js 14, Tailwind CSS, and TypeScript. Content is managed via **Sanity CMS** with a fallback to static configuration.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.

## Sanity CMS Setup

The website uses [Sanity](https://www.sanity.io/) as a headless CMS. Content can be edited via the embedded Sanity Studio at `/studio`.

### 1. Create a Sanity Project

1. Go to [sanity.io](https://www.sanity.io/) and create a free account
2. Create a new project (name it "R Kay Construction CMS")
3. Note your **Project ID** from the project dashboard

### 2. Configure Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.local.example .env.local
```

Required variables:

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID | Yes |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset name (default: `production`) | Yes |
| `SANITY_API_TOKEN` | Write token for seeding content | For seeding only |

### 3. Seed Content

To populate Sanity with the default website content:

1. Create an API token at `https://www.sanity.io/manage/project/<projectId>/api#tokens` (Editor role)
2. Run the seed script:

```bash
SANITY_API_TOKEN=your-token \
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id \
npm run seed
```

### 4. Access the Studio

Start the dev server and navigate to [http://localhost:3000/studio](http://localhost:3000/studio) to edit content.

### 5. CORS Configuration

Add your deployment URL to the allowed CORS origins in the Sanity project settings:
- `http://localhost:3000` (development)
- Your production URL

## Content Structure

| Type | Description |
|---|---|
| **Site Settings** | Company name, contact info, tagline, about section, social links |
| **Services** | Construction services offered (with Lucide icon names) |
| **Projects** | Portfolio of completed projects (with optional images) |
| **Testimonials** | Client reviews and quotes |

## Static Fallback

If Sanity isn't configured (project ID is `"placeholder"`), the website falls back to static content from `src/config/site.ts`. This means the site works immediately without any CMS setup.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **CMS:** Sanity v3 (embedded studio at `/studio`)
- **Icons:** Lucide React
- **Language:** TypeScript
- **Rendering:** ISR (revalidate: 60s)
