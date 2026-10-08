const {
  AndroidConfig,
  withAndroidManifest,
  withAppBuildGradle,
  withGradleProperties,
  withAndroidStyles,
} = require('expo/config-plugins');

// Keep release fixes reproducible when Expo regenerates the ignored android folder.
module.exports = function withAndroidRelease(config) {
  config = withGradleProperties(config, (config) => {
    const properties = {
      'android.enableMinifyInReleaseBuilds': 'true',
      'android.enableShrinkResourcesInReleaseBuilds': 'true',
      'android.r8.optimizedResourceShrinking': 'true',
    };
    for (const [key, value] of Object.entries(properties)) {
      config.modResults = config.modResults.filter((entry) => entry.key !== key);
      config.modResults.push({ type: 'property', key, value });
    }
    return config;
  });
  config = withAppBuildGradle(config, (config) => {
    if (!config.modResults.contents.includes('proguard-android')) {
      throw new Error('Android release ProGuard configuration was not found.');
    }
    config.modResults.contents = config.modResults.contents.replaceAll(
      'proguard-android.txt',
      'proguard-android-optimize.txt',
    );
    return config;
  });
  config = withAndroidManifest(config, (config) => {
    const activity = AndroidConfig.Manifest.getMainActivityOrThrow(config.modResults);
    delete activity.$['android:screenOrientation'];
    activity.$['android:resizeableActivity'] = 'true';
    return config;
  });
  return withAndroidStyles(config, (config) => {
    const theme = config.modResults.resources.style?.find((style) => style.$.name === 'AppTheme');
    if (theme?.item) {
      // React Native handles system bars; do not also configure deprecated color attributes.
      theme.item = theme.item.filter((item) => ![
        'android:statusBarColor',
        'android:navigationBarColor',
      ].includes(item.$.name));
    }
    return config;
  });
};
