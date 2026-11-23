import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import './global.css';
import { appName, siteDescription, siteUrl, tagline } from '@/lib/shared';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${appName}: ${tagline}`, template: `%s | ${appName}` },
  description: siteDescription,
  applicationName: appName,
  keywords: ['expo ui', 'jetpack compose', 'react native', 'expo', 'material 3', 'android', 'typescript'],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: appName, title: `${appName}: ${tagline}`, description: siteDescription },
  twitter: { card: 'summary_large_image' },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
