const fs = require('node:fs');
const path = require('node:path');

const projectName = process.argv[2];

if (!projectName || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(projectName)) {
  console.error(
    'Usage: npm run rename-project -- <lowercase-name-with-letters-numbers-and-hyphens>',
  );
  process.exit(1);
}

const root = path.resolve(__dirname, '..');
const packagePath = path.join(root, 'package.json');
const lockPath = path.join(root, 'package-lock.json');
const expoPath = path.join(root, 'app.json');
const readmePath = path.join(root, 'README.md');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

const packageJson = readJson(packagePath);
const packageLock = readJson(lockPath);
const appConfig = readJson(expoPath);

if (!packageLock.packages || !packageLock.packages[''] || !appConfig.expo) {
  throw new Error('Expected npm lockfile and Expo app configuration were not found.');
}

const displayName = projectName
  .split('-')
  .map((word) => {
    if (word === 'nativewind') {
      return 'NativeWind';
    }

    return `${word[0].toUpperCase()}${word.slice(1)}`;
  })
  .join(' ');

packageJson.name = projectName;
packageLock.name = projectName;
packageLock.packages[''].name = projectName;
appConfig.expo.name = displayName;
appConfig.expo.slug = projectName;
appConfig.expo.scheme = projectName.replace(/-/g, '');

const readme = fs.readFileSync(readmePath, 'utf8');
const updatedReadme = readme.replace(/^# .+$/m, `# ${displayName}`);

writeJson(packagePath, packageJson);
writeJson(lockPath, packageLock);
writeJson(expoPath, appConfig);
fs.writeFileSync(readmePath, updatedReadme);

console.log(`Renamed project to "${displayName}" (${projectName}).`);
