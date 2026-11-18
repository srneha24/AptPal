# MyTempHome Mobile

The MyTempHome iOS and Android app, built with React Native and Expo. The app is under development; the current implemented flow includes email and password signup and login, with email verification completed through the web app.

## Tech stack

- **Framework:** Expo SDK 58 and React Native 0.88
- **Language:** TypeScript
- **Navigation:** Expo Router
- **Secure session storage:** Expo SecureStore
- **Icons:** `@expo/vector-icons`
- **Package manager:** npm

## Setup

PowerShell:

```powershell
npm install
Copy-Item .env.example .env
npx expo start
```

Bash:

```bash
npm install
cp .env.example .env
npx expo start
```

Set `EXPO_PUBLIC_API_BASE_URL` in `.env` to the backend API base URL, including `/api`:

- Android emulator: `http://10.0.2.2:8000/api`
- iOS simulator: `http://localhost:8000/api`
- Physical phone: `http://<computer-LAN-IPv4>:8000/api`

For a physical phone, connect it and the development computer to the same network, run Django bound to `0.0.0.0:8000`, and allow port 8000 through the computer's firewall. Restart Expo after changing `.env` so the updated value is loaded.

## Checks

These commands work in PowerShell and Bash:

```shell
npx tsc --noEmit
npx expo lint
```

## Expo configuration

The app uses automatic system light and dark appearance. Install native dependencies with `npx expo install <package-name>` to select versions compatible with the configured Expo SDK.
