# expo-ui-easy docs

Next.js + [Fumadocs](https://fumadocs.dev). Static pages, a sitemap, `robots.txt`, `llms.txt`, per-page Open Graph
images and canonical URLs, so the site is easy to index.

```bash
npm run dev -w expo-ui-easy-docs       # http://localhost:3000
npm run build -w expo-ui-easy-docs     # production build
```

Set the public URL **at build time** (it feeds canonical URLs, the sitemap and Open Graph tags):

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build -w expo-ui-easy-docs
```

Also fill in `gitConfig` in `lib/shared.ts` (the repository location).

## What is generated, what is written

| Path | Source |
| --- | --- |
| `content/docs/*.mdx`, `concepts/`, `guides/` | written by hand |
| `content/docs/components/**` | **generated** from `packages/expo-ui-easy/manifest/components.json` |
| `generated/props.json` | **generated** from the package's real TypeScript types |
| `examples/<Name>.tsx` | written by hand, embedded in the matching component page |

`npm run generate -w expo-ui-easy-docs` regenerates the component pages (`dev` and `build` run it first). It adds a page
for every manifest entry, so a new component appears in the docs automatically, with its props table.

## Examples stay correct

`examples/*.tsx` are compiled against the package source:

```bash
npm run typecheck:examples -w expo-ui-easy-docs
```

To give a component an example, add `examples/<ComponentName>.tsx` exporting `Example`.
