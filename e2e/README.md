# e2e: device flows and benchmarks

Everything here drives the `example` app on an Android device or emulator. Build and install it first
(`npx expo run:android -w example`, or a release APK for benchmarks).

## Flows (Maestro)

```bash
maestro test e2e/flows                 # all flows
maestro test e2e/flows/switch.yaml     # one
```

| flow | checks |
| --- | --- |
| `smoke.yaml` | every preview screen opens and returns to the home list without a red box |
| `switch.yaml` | tapping a switch flips the state React sees |
| `buttons.yaml` | each press counts exactly once |
| `text-field.yaml` | typed text reaches `onChangeText` |
| `native-list.yaml` | scrolling to the end loads more rows |
| `bench.yaml` | runs "Compare all strategies" in the stress test (used by the benchmark runner) |

The flows find elements by the text shown on screen and by `accessibilityLabel`, so they work on a development
build. They have not been run against a device yet: expect to adjust a selector or two on the first run.
The `E2E (Maestro)` GitHub workflow runs them on an emulator on demand.

## Benchmarks

The stress test logs every result as a `[stress]` line. The runner turns those into a report where each
strategy is a **ratio against a baseline** (default `rn-flatlist`), which stays meaningful on noisy emulators
where absolute milliseconds do not.

```bash
# A) from a capture: adb logcat -v raw -s ReactNativeJS:V > capture.txt
npm run bench -- --log capture.txt

# B) fully automatic: capture logcat while Maestro runs the comparison
npm run bench -- --adb --flow e2e/flows/bench.yaml --md bench.md --json bench.json

# C) regression gate: fail (exit 1) if the NativeList recipe is >15% slower than raw LazyColumn
npm run bench -- --log capture.txt \
  --gate "native-list/native-single-host-lazy:mount:1.15" \
  --gate "native-list/native-single-host-lazy:flip all:1.15"
```

Use a **release build** for numbers you want to quote (`npx expo run:android --variant release`): dev builds add
React and Metro overhead, and the runner says which kind it saw. Repeat a run a few times; the report uses the
median of repeats. `commit` and `frame` are JS-thread timings, so also watch scrolling by eye and check native
cost in Android Studio's profiler when a result looks surprising.
