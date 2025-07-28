
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require('node:path'); // Get path module from node, assign to path (object)
const { exec } = require('child_process');
// Code is read right to left, inside out!!!
//      Imports electron module/framework
//      Assigns to the left
// What is on the left?
//      Destructuring assignment - unpack values from arrays or properties from objects into distinct variables

const createWindow = () => {
    // Creates a new instance of the BrowserWindow object, with the following properties
    const win = new BrowserWindow({ // Stores reference to new window to win
        width: 800,
        height: 600,
        menu: null,
        webPreferences: { // Object
            // Property
            preload: path.join(__dirname, 'preload.js') // gets __dir of this .js, joins with path in cross-platform safe way
        }
    })

    // Populate the instance
    win.maximize();
    win.loadFile('index.html') // .loadfile() is a method of BrowserWindow (which is stored in win)
}

// app is Electron’s module that controls the main application lifecycle.
// whenReady() returns a Promise that resolves when Electron has finished initializing
// .then() is a method used with Promises - when the thing I’m waiting for finishes, then do this next thing
// it could be just app.whenReady().then(createWindow)... but then you couldn't do the following, or add more functions (this acts as a main())
app.whenReady().then(() => {
    ipcMain.handle('run-command', async (_event, command) => { // When renderer sends "run-command" message, this function is called
        return new Promise((resolve) => { // Declare new promise, as shell commands are asynchronous
            exec(command, (error, stdout, stderr) => { // exec, command (objects which return error (to run(js)), output and error on command (system))
                if (error) { // If error exists, ouput error message
                    resolve(`Error: ${error.message}`);
                } else if (stderr) { // Same here
                    resolve(`Stderr: ${stderr}`);
                } else {
                    resolve(stdout); // Just returns the output - if an error isn't returned before
                }
            });
        });
    });

    ipcMain.handle('dialog:openFile', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory']
        });
        return result;
    });

    ipcMain.on('open-external', (__event, url) => {
        shell.openExternal(url);
    });

    ipcMain.handle('check-git', async () => {
        return new Promise((resolve) => {
            exec('git --version', (error, stdout, stderr) => {
                if (error || stderr) {
                    resolve(false); // Git not installed or error
                } else {
                    resolve(stdout.trim()); // Git version string
                }
            });
        });
    });

    createWindow();
});

// Continue reading from:
// https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app
// and: https://nodejs.org/api/events.html#events & https://react.dev/learn/installation (React is Paced for 2st recess)

// NOTES ON PACKAGING CAN BE FOUND ON "r-electron.md"
