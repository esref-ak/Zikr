const fs = require('node:fs');
const path = require('node:path');
const { AndroidConfig, compileModsAsync } = require('expo/config-plugins');
const withAndroidRelease = require('../plugins/withAndroidRelease');

async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const app = require('../app.json').expo;
  const gradle = fs.readFileSync(path.join(projectRoot, 'android/app/build.gradle'), 'utf8');
  if (!gradle.includes('signingConfig signingConfigs.release')) {
    throw new Error('A release upload signing configuration is required; refusing debug signing.');
  }
  // Apply only release mods in place, preserving the local upload keystore configuration.
  const config = withAndroidRelease(AndroidConfig.Version.withVersion({ ...app }));
  await compileModsAsync(config, { projectRoot, platforms: ['android'] });
  console.log(`Android release prepared: ${app.version} (${app.android.versionCode})`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
