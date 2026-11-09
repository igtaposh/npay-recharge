# Npay Recharge

An Expo starter for building cross-platform React Native apps with NativeWind and
Tailwind CSS.

## Getting started

Install dependencies and start the Expo development server:

```bash
npm install
npm start
```

Open the app with Expo Go, a development build, or an emulator/simulator.

## Project structure

- `app/` contains Expo Router screens and layouts.
- `app/global.css` contains Tailwind CSS imports.
- `metro.config.js` and `postcss.config.mjs` configure NativeWind.

Use NativeWind utility classes with `className` on supported React Native
components:

```tsx
<View className="flex-1 items-center justify-center bg-white">
  <Text className="text-xl font-bold text-slate-900">Hello NativeWind</Text>
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
