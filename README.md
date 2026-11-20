# expo-ui-easy

Typed React Native wrappers for [Expo UI](https://docs.expo.dev/versions/latest/sdk/ui/jetpack-compose/)'s
Jetpack Compose components. Expo's names and props stay as they are; React Native names are used only for props
both share (`onPress`, `disabled`, `onValueChange`, `style`, `testID`, ...). Android only for now.

```
packages/expo-ui-easy/   the npm package (src/android is the real code, src/ios is a placeholder)
example/              Expo app: component previews + stress test, consumes the package from source
e2e/                  device tests and benchmarks (planned)
docs/                 Next.js + Fumadocs documentation site (planned)
```

## Develop

```bash
npm install
npm run typecheck && npm test && npm run build
npm run example            # needs a development build: npx expo run:android -w example once
```

The example resolves `expo-ui-easy` to `packages/expo-ui-easy/src` through its Metro config, so edits hot-reload.
See `packages/expo-ui-easy/README.md` for the API.
