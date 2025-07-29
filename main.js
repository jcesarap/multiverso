
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require('node:path'); // Get path module from node, assign to path (object)
const { exec } = require('child_process');
const fs = require('fs').promises;
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

    /*
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
    */

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
        return new Promise((resolve) => { // Variable in parameter, used in promise
            exec('git --version', (error, stdout) => {
                if (error) {
                    resolve(0); // Something went wrong, treat as no version
                } else if (stdout.includes('version')) {
                    resolve(1); // Git is installed, and output includes "version"
                } else {
                    resolve(0); // Output didn't include the expected word
                }
            });
        });
    });

    ipcMain.handle('check-git-setup', async () => {
        return new Promise((resolve) => {
            exec('git config user.name', (err1, name) => { // Only continues to the second, if the first is properly setup
                exec('git config user.email', (err2, email) => {
                    const isNameSet = !err1 && name.trim().length > 0;
                    const isEmailSet = !err2 && email.trim().length > 0;

                    if (isNameSet && isEmailSet) {
                        resolve(1); // Properly set up
                    } else {
                        resolve(0); // Missing name or email
                    }
                });
            });
        });
    });

    // Set Git username (returns true if success, false otherwise)
    ipcMain.handle('set-git-username', async (_event, userName) => {
        return new Promise((resolve) => {
            exec(`git config --global user.name "${userName}"`, (error, stdout, stderr) => {
                resolve(!error && !stderr); // true if success
            });
        });
    });

    // Set Git email (returns true if success, false otherwise)
    ipcMain.handle('set-git-email', async (_event, email) => {
        return new Promise((resolve) => {
            exec(`git config --global user.email "${email}"`, (error, stdout, stderr) => {
                resolve(!error && !stderr); // true if success
            });
        });
    });

    ipcMain.handle('load-branches', async (_event) => {
        return new Promise((resolve, reject) => {
            exec(`git branch`, { cwd: currentWorkingDirectory }, (error, stdout, stderr) => {
                if (error || stderr) {
                    resolve(null);
                } else {
                    resolve(stdout.trim());
                }
            });
        });
    });

    let currentWorkingDirectory = process.cwd();
    ipcMain.handle('set-working-directory', async (_event, dirPath) => {
        currentWorkingDirectory = dirPath;
        return true; // acknowledge success
    });

    ipcMain.handle('printDir', async (_event) => {
        try {
            const entries = await fs.readdir(currentWorkingDirectory);
            const filtered = entries.filter(name => !name.startsWith('.'));
            return filtered;
        } catch (err) {
            return null;
        }
    });

    ipcMain.handle('switch-branch', async (_event, branchName) => {
        return new Promise((resolve) => {
            exec(`git checkout ${branchName}`, { cwd: currentWorkingDirectory }, (error, stdout, stderr) => {
                if (error || stderr) {
                    resolve({ success: false, error: stderr || error.message });
                } else {
                    resolve({ success: true, message: stdout.trim() });
                }
            });
        });
    });

    ipcMain.handle('add-branch', async (_event, branchTitle) => {
        const sanitizedTitle = branchTitle.replace(/[^a-zA-Z0-9-_]/g, ''); // basic sanitization

        return new Promise((resolve) => {
            exec(`git branch "${sanitizedTitle}"`, (error, stdout, stderr) => {
                if (error || stderr) {
                    resolve({ success: false, error: stderr || error.message });
                } else {
                    resolve({ success: true });
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
