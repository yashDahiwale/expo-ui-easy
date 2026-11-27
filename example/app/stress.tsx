import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { space } from '../src/theme';
import { IS_ANDROID, PlatformNotice } from '../src/ui';

export default function StressRoute(): ReactNode {
  if (!IS_ANDROID) {
    return (
      <View style={styles.pad}>
        <PlatformNotice what="The stress test" />
      </View>
    );
  }
  const { StressScreen } = require('../src/stress/StressScreen') as typeof import('../src/stress/StressScreen');
  return <StressScreen />;
}

const styles = StyleSheet.create({ pad: { padding: space.lg } });
