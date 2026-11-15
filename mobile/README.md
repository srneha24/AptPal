# AptPal Mobile

The cross-platform mobile client for AptPal built with React Native and Expo SDK 58, maintaining full design and functional parity with the web platform.

## Tech Stack

- **Framework & SDK:** Expo SDK 58 (`~58.0.25`), React Native 0.88.1
- **Language:** TypeScript (`~6.0.3`)
- **UI & Theming:**
  - React Native `StyleSheet` architecture consuming semantic theme colors
  - Full design system parity with Figma tokens (`Colors.ts`)
  - Triple-theme support (`light`, `dark`, `system`) with automatic system color scheme detection (`useColorScheme()`)
- **Interactive Maps:** OpenStreetMap tiles / Map view for rental exploration, location previews, and pin drops
- **Icons:** `@expo/vector-icons` (mapped to match web's Lucide icons)
- **Networking & Real-Time:**
  - Fetch / Axios for backend REST communications
  - WebSocket client for real-time Django Channels chat
- **App Configuration:** Expo Managed Workflow (`app.json` with `"userInterfaceStyle": "automatic"`, `"name": "AptPal"`, `"slug": "aptpal"`)
- **Package Manager:** `npm` (use `npx expo install <package>` for native module compatibility)

## Core Commands

```bash
# Install dependencies
npm install

# Install Expo-compatible modules
npx expo install <package-name>

# Start Expo development server
npx expo start

# Type-check
npx expo tsc --noEmit
```
