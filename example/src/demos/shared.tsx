import type { ReactNode } from 'react';
import { Column, Host } from 'expo-ui-easy';

/**
 * Several library components sharing ONE Compose root, stacked and left-aligned. Demos use it so a
 * section of ten buttons costs one Host instead of ten (see the Host page for why that matters).
 */
export function NativeColumn({ children, spacing = 8 }: { children: ReactNode; spacing?: number }): ReactNode {
  return (
    <Host matchContents>
      <Column verticalArrangement={{ spacedBy: spacing }} horizontalAlignment="start">
        {children}
      </Column>
    </Host>
  );
}
