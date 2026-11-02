import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "org.diekreative.APPdk",
  appName: "diekreative APP",
  webDir: 'www',
  plugins: {
    "SplashScreen": {
      "launchShowDuration": 0
    },
    "CapacitorHttp": {
      "enabled": true
    },
    "CapacitorCookie": {
      "enabled": true
    }
  }

};

export default config;
