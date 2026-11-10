<div align="center">

# 💙 nPay

### Everyday recharges. A simpler way to explore.

An Expo and React Native mobile app prototype for prepaid and DTH recharges,
Google Play gift codes, and wallet activity.

![Expo SDK 58](https://img.shields.io/badge/Expo-SDK%2058-4630EB?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.88-61DAFB?style=for-the-badge&logo=react&logoColor=20232A)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Demo app](https://img.shields.io/badge/Payments-Demo%20Only-16A36A?style=for-the-badge)

</div>

---

## ✨ What you can explore

| Feature | What it does |
| --- | --- |
| 📱 **Prepaid recharge** | Explore mobile recharge plans and a sample confirmation flow. |
| 📺 **DTH recharge** | Try the television top-up flow. |
| 🎮 **Google Play** | Explore the gift-code purchase flow. |
| 💳 **Wallet** | View a sample balance and add demo funds. |
| 🧾 **Activity** | Browse recent transactions and recharge history. |
| ⚙️ **Account & settings** | Explore profile, preferences, help, and demo information. |

> [!IMPORTANT]
> **nPay is a prototype.** It does not process real payments, issue real gift
> codes, or connect to a bank, telecom operator, or authentication service.
> Wallet balances and transactions are simulated in app memory and may reset.

## 🚀 Get started

### Requirements

- Node.js compatible with your installed Expo SDK
- npm
- Android Studio or Xcode for local native builds (optional)

### Install and run

```bash
git clone https://github.com/igtaposh/npay-recharge.git
cd npay-recharge
npm install
npm start
```

Use the Expo CLI prompts to open the app on a connected device, emulator, or
simulator. The project includes `expo-dev-client`; a development build is
required to run native code that is not included in Expo Go.

## 🛠️ Development

### Useful commands

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo development server. |
| `npm run android` | Build and run locally on Android (requires Android tooling). |
| `npm run ios` | Build and run locally on iOS (requires macOS and Xcode). |
| `npm run web` | Start the web version. |
| `npm run lint` | Run Expo's lint checks. |

### EAS development builds

The repository includes an EAS `development` profile for internal
distribution. Sign in to your Expo account, then build for your target:

```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile development
```

For an iOS Simulator build, add `"ios": { "simulator": true }` to the
`development` profile in `eas.json`, then run:

```bash
npx eas-cli@latest build --platform ios --profile development
```

After installing the development build, start the bundler with `npm start`.

## 🧭 App areas

Expo Router screens live in `app/`:

```text
app/
├── (auth)/       # Login flow
├── (tabs)/       # Recharges, wallet, history, and help
├── recharge/     # Prepaid, DTH, and Google Play flows
├── settings.tsx
└── wallet/       # Add demo balance
```

Reusable UI components and session-only recharge state are in `components/`.
Shared NativeWind styles and theme tokens are in `app/global.css`.

## 🎨 UI and styling

The app uses React Native, Expo Router, and NativeWind. Prefer the shared theme
tokens in `app/global.css` when styling screens:

```tsx
<View className="flex-1 items-center justify-center bg-canvas">
  <Text className="text-xl font-bold text-ink">Hello nPay</Text>
</View>
```

## 📚 Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo SDK 58 reference](https://docs.expo.dev/versions/v58.0.0/)
- [Expo Router documentation](https://docs.expo.dev/router/introduction/)
- [Development builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [NativeWind documentation](https://www.nativewind.dev/)

---

<div align="center">

Made with 💙 for exploring a mobile recharge experience.

</div>
