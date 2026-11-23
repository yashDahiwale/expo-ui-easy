import propsData from '@/generated/props.json';

interface PropRow {
  name: string;
  type: string;
  optional: boolean;
  description: string;
  defaultValue?: string;
  origin: 'expo' | 'rn' | 'library';
  expoName?: string;
}

const DATA = propsData as unknown as Record<string, PropRow[]>;

const BADGES: Record<PropRow['origin'], { label: string; title: string } | null> = {
  expo: null,
  rn: { label: 'RN name', title: 'Uses the React Native name; Expo calls it something else' },
  library: { label: 'expo-ui-easy', title: 'Added by this library' },
};

/** Props of one component, generated from the real TypeScript types (see scripts/generate-docs.mjs). */
export function PropsTable({ name }: { name: string }) {
  const rows = DATA[name];
  if (!rows || rows.length === 0) {
    return <p>This component accepts the same props as its Expo UI counterpart.</p>;
  }
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-fd-muted/50 text-fd-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Prop</th>
            <th className="px-3 py-2 font-medium">Type</th>
            <th className="px-3 py-2 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const badge = BADGES[row.origin];
            return (
              <tr key={row.name} className="border-t border-fd-border align-top">
                <td className="px-3 py-2 whitespace-nowrap">
                  <code className="font-mono font-semibold">{row.name}</code>
                  {row.optional ? null : <span className="ml-1 text-red-500" title="Required">*</span>}
                  {badge ? (
                    <span title={badge.title} className="ml-2 rounded bg-fd-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-fd-primary">
                      {badge.label}
                    </span>
                  ) : null}
                </td>
                <td className="px-3 py-2 font-mono text-xs break-words text-fd-muted-foreground">{row.type}</td>
                <td className="px-3 py-2 text-fd-muted-foreground">
                  {row.expoName ? <div>Expo: <code className="font-mono">{row.expoName}</code></div> : null}
                  {row.description}
                  {row.defaultValue ? <div>Default: <code className="font-mono">{row.defaultValue}</code></div> : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
