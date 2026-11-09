# NPay Recharge

A mobile-first Expo recharge app prototype built with React Native and Expo Router.
It includes a wallet, prepaid and DTH recharge flows, Google Play gift codes,
transaction history, profile, help, settings, and login/signup screens.

## Getting started

Install dependencies and start the Expo development server:

```bash
npm install
npm start
```

Open the app with Expo Go, a development build, or an emulator/simulator. The
home screen is available at launch; the bottom navigation opens Home, History,
Profile, and Help.

## Project structure

- `app/` contains Expo Router screens and layouts. Recharge, wallet, settings,
  login, and signup flows each have their own route file.
- `app/(tabs)/` contains the four bottom-navigation screens.
- `components/` contains shared UI and session-only demo wallet state.
- `app/global.css` contains Tailwind CSS imports.
- `metro.config.js` and `postcss.config.mjs` configure NativeWind.

This is a UI prototype: balances and transactions live only in app memory.
Recharge, wallet top-ups, login, and signup do not contact a payment provider,
telecom operator, or authentication service.

Use NativeWind utility classes with `className` on supported React Native
components. Shared palette colors are defined in `app/global.css` with Tailwind's
`@theme` directive; use those tokens (for example, `bg-canvas`, `text-ink`, and
`bg-green`) when adding UI:

```tsx
<View className="flex-1 items-center justify-center bg-canvas">
  <Text className="text-xl font-bold text-ink">Hello NPay</Text>
</View>
```

## Rename the project

To update the package name and Expo app identifiers:

```bash
npm run rename-project -- my-new-project-name
```

Use a lowercase name containing only letters, numbers, and hyphens.

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router documentation](https://docs.expo.dev/router/introduction/)
- [NativeWind documentation](https://www.nativewind.dev/)
