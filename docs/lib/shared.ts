import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'expo-ui-easy';
export const tagline = 'Jetpack Compose components for React Native, with the names you already know';
export const siteDescription =
  "Typed React Native wrappers for Expo UI's Jetpack Compose components. Expo's names and props, React Native names for the props both share, and a Host model built for speed.";
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';

// Set NEXT_PUBLIC_SITE_URL in production: it feeds canonical URLs, the sitemap and Open Graph tags.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

// TODO: fill in the real GitHub location of the repository.
export const gitConfig = {
  user: 'your-org',
  repo: 'expo-ui-easy',
  branch: 'main',
};

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
