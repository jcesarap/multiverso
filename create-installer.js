const { createWindowsInstaller } = require('electron-winstaller');
const path = require('path');

console.log('Creating Windows installer...');

// Your provided code snippet, adapted for a real project
createWindowsInstaller({
    appDirectory: path.join(__dirname, 'release-builds', 'my-app-win32-x64'), // Directory of your packaged app
    outputDirectory: path.join(__dirname, 'installers'), // Where to put the installer
    authors: 'My App Inc.',
    exe: 'my-app.exe', // Name of your app's executable
    setupExe: 'MyAppInstaller.exe', // Name for the installer itself
    loadingGif: path.join(__dirname, 'assets', 'installer.gif') // Optional GIF
}).then(() => {
    console.log('It worked! Installer created successfully.');
}).catch(error => {
    console.error(`No dice: ${error.message}`);
});