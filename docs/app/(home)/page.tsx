import Link from 'next/link';
import { appName, siteDescription, siteUrl, tagline } from '@/lib/shared';

const FEATURES = [
  { title: "Expo's names, untouched", body: "Components and props keep the names from Expo UI's Jetpack Compose docs. React Native names are used only where both worlds share a prop: onPress, disabled, onValueChange, testID." },
  { title: 'A Host model built for speed', body: 'One shared Host (or the NativeList recipe) instead of a Compose root per component. Measure it on your own device with the stress test.' },
  { title: 'Strictly typed, drift-proof', body: "Types are derived from Expo's own, and a manifest plus contract tests fail CI the moment @expo/ui adds, removes or renames something." },
  { title: 'Android first, iOS ready', body: 'Jetpack Compose today. The structure leaves a placeholder for SwiftUI so the public names can match later.' },
];

const SAMPLE = `import { Host, Switch, Button, NativeList } from 'expo-ui-easy';

<Host matchContents>
  <Switch value={on} onValueChange={setOn} />
  <Button onPress={save} startIcon={<Icon name={SaveIcon} size={18} />}>
    Save
  </Button>
</Host>`;

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: appName,
    description: siteDescription,
    programmingLanguage: 'TypeScript',
    codeRepository: siteUrl,
  };
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{appName}</h1>
        <p className="max-w-2xl text-lg text-fd-muted-foreground">{tagline}.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/docs/getting-started" className="rounded-lg bg-fd-primary px-4 py-2 font-medium text-fd-primary-foreground">
            Get started
          </Link>
          <Link href="/docs/components" className="rounded-lg border border-fd-border px-4 py-2 font-medium">
            Browse components
          </Link>
        </div>
      </header>

      <pre className="overflow-x-auto rounded-xl border border-fd-border bg-fd-card p-4 text-sm">
        <code>{SAMPLE}</code>
      </pre>

      <section aria-labelledby="features" className="grid gap-4 sm:grid-cols-2">
        <h2 id="features" className="sr-only">Features</h2>
        {FEATURES.map((feature) => (
          <article key={feature.title} className="rounded-xl border border-fd-border p-5">
            <h3 className="mb-1 font-semibold">{feature.title}</h3>
            <p className="text-sm text-fd-muted-foreground">{feature.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
