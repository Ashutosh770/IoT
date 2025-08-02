# IoT Expo App Structure

## 1. Directory Structure

```
src/
  screens/         # All screen components (UI pages)
  services/        # API and MQTT service logic
  utils/           # Utility/helper functions
  navigation/      # Navigation setup (React Navigation)
  components/      # (Optional) Reusable UI components
App.js             # Entry point
```

## 2. Screens (`src/screens/`)

- **HomeScreen.tsx**: Welcome/landing page, entry to the app.
- **DevicesScreen.tsx**: List and control your IoT devices (switches, sensors).
- **ConnectedDevicesScreen.tsx**: Shows all connected devices, with status and quick info.
- **SensorDetailScreen.tsx**: Detailed view for a sensor, with charts and controls.
- **ControlPanelScreen.tsx**: (If used) For advanced device controls.
- **SettingsScreen.tsx**: App and account settings.
- **HistoryScreen.js**: (If used) Shows historical sensor/device data.
- **DashboardScreen.js**: (If used) Main dashboard with summary widgets.

## 3. API & Services (`src/services/`)

- **api.js**: Handles HTTP requests to your backend (fetch latest data, fetch history, etc.) using Axios. Uses `EXPO_PUBLIC_API_URL` from your environment.
- **mqttService.ts**: Handles MQTT connections, subscriptions, and publishing (mocked or real).

## 4. Utilities (`src/utils/`)

- **deviceUtils.ts**: Device type definitions, ID generation, value formatting, MQTT message parsing/creation.

## 5. Navigation (`src/navigation/`)

- **index.tsx**: Sets up React Navigation (tab and stack navigators). Example: Home, Devices, Settings tabs, with nested stacks for device details.

## 6. Example `App.js`

```js
import React from 'react';
import Navigation from './src/navigation';

export default function App() {
  return <Navigation />;
}
```

## 7. Environment Variables

- Use `.env` or `app.json`/`app.config.js` to set `EXPO_PUBLIC_API_URL` for your backend API.

## 8. Dependencies

Install these in your new project:

```sh
npx create-expo-app my-iot-app
cd my-iot-app

npm install @expo/vector-icons @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack react-native-screens react-native-safe-area-context axios mqtt
npm install react-native-reanimated react-native-gesture-handler react-native-svg
npm install --save-dev @types/react @types/react-native typescript
```

## 9. Clean Migration Steps

1. **Create a new Expo project**:  
   `npx create-expo-app my-iot-app`
2. **Copy only these folders/files** from your old project to the new one:
   - `src/screens/`
   - `src/services/`
   - `src/utils/`
   - `src/navigation/`
   - (Optional) `src/components/`
3. **Copy your `App.js`** (see example above).
4. **Install dependencies** as listed above.
5. **Set up your environment variable** for the API URL.
6. **Run the app**:  
   `npm start` or `npx expo run:android`

## 10. Troubleshooting

- If you see errors about missing packages, install them as needed.
- If you see native build errors, make sure you have not copied any `android/` or `ios/` folders from the old project.
- Only copy JavaScript/TypeScript source files and assets. 