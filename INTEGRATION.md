# Connected nPay app

Login, partner interest, profile/name/shop/email updates, password reset/change, M-PIN setup/change/reset, wallet, recharge submission and transaction receipts now use `npay-server`. Balances, credentials and transaction statuses come from PostgreSQL; the app no longer creates successful payments or validates an in-memory M-PIN.

## Local development

In `npay-server`, enable `DEMO_MODE=true` for development and run:

```bash
npm run seed-demo
npm run dev
```

The seed command creates a dedicated development retailer only if its slug is absent. It preserves existing credentials and balance on repeat runs. Phone: **9999900002**, password: **DemoLogin123!**, M-PIN: **1234**. Start with Add balance; the demo account has a zero-balance wallet initially. These credentials are fixtures, not a replacement for normal retailer onboarding.

The app derives the backend address from Expo's development host and uses port 3000. To override it, create `.env.local` in `npay-recharge`:

```dotenv
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_LAN_IP:3000/api/retailer
```

For an Android emulator, the host can be `10.0.2.2`. A physical phone must reach your computer's LAN IP; `localhost` on the phone refers to the phone. Production builds require an explicit HTTPS API URL. Only the API address is public configuration; never put JWT, OTP or provider secrets in `EXPO_PUBLIC_*` variables. For the web build, configure backend `CORS_ORIGINS` to include the exact web origin if it differs from localhost ports 8081/8082.

`expo-secure-store` was installed using Expo SDK 58's package installer. Rebuild the existing native development app so its new native module is available:

```bash
npx expo run:android
# or, on a Mac:
npx expo run:ios
```

Then run `npm start` and open the development build. Access tokens remain in memory. Refresh tokens use SecureStore on native devices and sessionStorage in the web prototype. Session refresh is serialized; logout clears app/account data, revokes the backend session, and returns to login. Private screens are protected with Expo Router's protected routes. Password and M-PIN changes invalidate existing sessions and require signing in again.

## Development mocks

With `DEMO_MODE=true` outside production:

- Phone and email OTP requests create real expiring challenges, but delivery is simulated. The development OTP **123456** is shown in the form. Incorrect codes still fail; verified proof tokens are purpose-bound and consumed once.
- Wallet top-ups simulate a successful payment gateway response and post one credit to the ledger. No external gateway is contacted.
- Prepaid uses the prototype plan catalog, validated against server-owned fixtures; the server resolves operator, circle and plan IDs. DTH customer lookup returns server-side dummy customer/plan data.
- Recharges simulate success, debit the wallet through the ledger and credit configured commissions. Gift-code transactions return encrypted, persistent codes prefixed `DEMO-`; they are not redeemable gift codes.
- Idempotency keys are retained for a screen's submission/retries, so a lost response does not create a second debit or credit.

The development banner identifies mocked providers. No real payment or operator calls occur. With mocks disabled, normal authenticated backend APIs remain; top-ups/recharges stay pending for external settlement. Dummy plan identifiers are not accepted as live provider catalogs. `NODE_ENV=production` always disables mocks, even if DEMO_MODE is true. Admin/distributor/retailer account validation remains real in every mode.

## Validation

Run `node --test api-client.test.mjs` for client session/retry tests, `npm run lint`, and `npx tsc --noEmit`. Backend `api.test.js` covers ordinary operation plus development settlement/OTP behavior and production mock disabling. Browser testing used an isolated database to verify login, refresh after page reload, wallet checkout, profile name/email changes and server-generated recharge receipts.

Expo references used: [authentication](https://docs.expo.dev/router/advanced/authentication/), [SecureStore](https://docs.expo.dev/versions/v58.0.0/sdk/securestore/), [public environment variables](https://docs.expo.dev/guides/environment-variables/).

## This machine's Android connection

The connected phone cannot reach the computer's port 3000 directly over LAN. Local development currently uses a paired ADB tunnel and `.env.local` points to `http://127.0.0.1:3000/api/retailer`. A dedicated Metro server runs on port 8099. After reconnecting the device, recreate the tunnels and start Metro:

```bash
$ANDROID_HOME/platform-tools/adb -s YOUR_DEVICE_ID reverse tcp:3000 tcp:3000
$ANDROID_HOME/platform-tools/adb -s YOUR_DEVICE_ID reverse tcp:8099 tcp:8099
npx expo start --dev-client --localhost --port 8099
```

Use the SDK's ADB executable consistently; a different system ADB version can restart the daemon and drop wireless transports. If you switch to direct LAN access or iOS, change `.env.local` to your reachable computer/server address and reload the app.


## SMEPay checkout

SMEPay Inline DQR is implemented on the backend and connected to Add balance. Activation is intentionally left to local backend configuration; no credentials were supplied. See `/home/taposh/npay-server/SMEPAY.md` for the exact configuration and verification prerequisite. Do not put SMEPay secrets in this app's environment.

When PAYMENT_GATEWAY=smepay, Add balance navigates to `app/wallet/payment.tsx`. It displays the returned PNG QR, opens the supplied UPI payment link on mobile, checks server status when the app becomes active, and polls every 10 seconds while the link is valid. After expiry, manual checks remain available. Returning from another app does not itself mark payment successful. Pending SMEPay transactions have a resume button in transaction details. The app displays test mode explicitly. No new native dependency was added: Expo SDK 58's installed expo-linking opens UPI URLs directly, with an error fallback instead of installed-app enumeration. Test on a physical device with a supported UPI app before enabling live payments.


## MRobotics recharge

The backend supports MRobotics LAPU automation when RECHARGE_PROVIDER=mrobotics. Credentials and live provider activation were left unconfigured. See `/home/taposh/npay-server/MROBOTICS.md` for setup, operator mappings, admin plan flags and acceptance-test requirements. No provider token belongs in the Expo environment.

When mock_recharge=false, prepaid plans load from the authenticated server catalog and submit real plan UUIDs. DTH uses a direct subscriber-ID and amount form because the provider docs do not include customer lookup. The backend periodically reconciles pending requests. Pending MRobotics receipts also reconcile through the authenticated status endpoint; retries never resubmit an attempted provider recharge. The status screen displays uncertainty/support messages and history includes a check-status action. Old-day uncertainty remains pending for support because the provider's status search only covers the current date.
