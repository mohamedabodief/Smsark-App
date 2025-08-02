export default {
  expo: {
    name: 'SmsarkAlaqary',
    slug: 'SmsarkAlaqary',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      package: 'com.mohamedabodief.smsarkapp',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
      googleServicesFile: './google-services.json',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      eas: {
        projectId: '08550ff4-ff87-4a66-9950-304176c949d2', // معرف المشروع من EAS
      },
      FIREBASE_API_KEY: 'AIzaSyBZDFrAARgCTXF_L5KFqD_EOQm_5nF_uTg',
      AUTH_DOMAIN: 'smsark-app.firebaseapp.com',
      FIREBASE_PROJECT_ID: 'smsark-alaqary',
      STORAGE_BUCKET: 'smsark-alaqary.firebasestorage.app',
      MESSAGING_SENDER_ID: '165621685338',
      APP_ID: '1:165621685338:android:1cec5888597039cce9cc63',
      MEASUREMENT_ID: 'G-0ZMCMWXZ1X',
    },
    cli: {
      appVersionSource: 'local', // لتجنب التحذير
    },
    plugins: [
      'expo-secure-store',
      [
        'expo-image-picker',
        {
          photosPermission: 'نحتاج إذن للوصول إلى الصور لرفع صور العقار.',
          cameraPermission: 'نحتاج إذن لاستخدام الكاميرا لالتقاط صورة للعقار.',
        },
      ],
    ],
  },
};