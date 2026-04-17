const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('node:path');
const fs = require('fs').promises;
const os = require('os');

// Import modular IPC handlers from the new 'ipc' directory
const { registerGitHandlers } = require('./ipc/git');
const { registerDependenciesHandlers } = require('./ipc/dependencies');
const { registerFsHandlers } = require('./ipc/file_system');

// Application State shared across modules
let currentWorkingDirectory = process.cwd();

const createWindow = () => {
    // Creates a new instance of the BrowserWindow object, with the following properties
    const win = new BrowserWindow({ // Stores reference to new window to win
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'assets/design/icon_heading.png'),
        menu: null,
        webPreferences: { // Object
            // Properties
            preload: path.join(__dirname, 'preload.js'), // gets __dir of this .js, joins with path in cross-platform safe way
            contextIsolation: true,
            nodeIntegration: false
        }
    })

    // win.setMenu(null); // Menu bar

    // Populate the instance
    win.maximize();
    // Point to the Vite development server
    win.loadURL('http://localhost:5173');
}

// app is Electron’s module that controls the main application lifecycle.
// whenReady() returns a Promise that resolves when Electron has finished initializing
// .then() is a method used with Promises - when the thing I’m waiting for finishes, then do this next thing
// it could be just app.whenReady().then(createWindow)... but then you couldn't do the following, or add more functions (this acts as a main())
app.whenReady().then(() => {
    // Setup modules imported/require(d) in the start of this file
    registerGitHandlers(() => currentWorkingDirectory);
    registerDependenciesHandlers();
    registerFsHandlers(
        () => currentWorkingDirectory,
        (newPath) => { currentWorkingDirectory = newPath; }
    );

    ipcMain.on('open-external', (__event, url) => {
        shell.openExternal(url);
    });

    ipcMain.handle('show-dialog', async (_event, message) => {
        await dialog.showMessageBox({
            type: 'warning',
            title: 'Erro',
            message: message,
        });
    });

    createWindow();
});
