module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@firebaseConfig': '../../Smsark-App/android/app/src/config/firebaseConfig.native.js',
            '@FireBase': '../../FireBase',
            // ... other aliases ...
          },
        },
      ],
    ],
  };
};
