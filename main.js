
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
        icon: path.join(__dirname, 'assets/design/icon_heading.png'),
        menu: null,
        webPreferences: { // Object
            // Property
            preload: path.join(__dirname, 'preload.js') // gets __dir of this .js, joins with path in cross-platform safe way
        }
    })

    //Menu.setApplicationMenu(null);
    win.setMenu(null);
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

    ipcMain.handle('ensure-git-setup', async (_event) => {
        return new Promise((resolve) => {
            exec('git rev-parse --is-inside-work-tree', { cwd: currentWorkingDirectory }, (err1) => {
                if (err1) {
                    // Not a git repo, initialize it
                    exec('git init', { cwd: currentWorkingDirectory }, (err2) => {
                        if (err2) return resolve(false);
                        proceedWithAddAndCommit();
                    });
                } else {
                    proceedWithAddAndCommit();
                }
            });

            function proceedWithAddAndCommit() {
                exec('git add .', { cwd: currentWorkingDirectory }, (err3) => {
                    if (err3) return resolve(false);

                    // Check if any commits exist
                    exec('git rev-parse HEAD', { cwd: currentWorkingDirectory }, (err4) => {
                        if (err4) {
                            // No commits, make initial commit
                            exec('git commit -am "Estado Inicial"', { cwd: currentWorkingDirectory }, (err5) => {
                                resolve(!err5); // true if commit succeeded
                            });
                        } else {
                            // Repo already has commits, done
                            resolve(true);
                        }
                    });
                });
            }
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
            // Check git status
            exec('git status --porcelain', { cwd: currentWorkingDirectory }, (statusErr, statusStdout, statusStderr) => {
                if (statusErr || statusStderr) {
                    // If error checking status, fail gracefully
                    resolve({ success: false, error: statusStderr || statusErr.message });
                    return;
                }

                // Check if working directory is clean
                // `git status --porcelain` returns empty string if clean
                if (statusStdout.trim() !== '') {
                    // There are uncommitted changes
                    resolve({
                        success: false,
                        error: 'Precisa salvar suas modificações antes de sair de uma versão para outra'
                    });
                    return;
                }

                // Working directory is clean, proceed to checkout
                exec(`git checkout ${branchName}`, { cwd: currentWorkingDirectory }, (checkoutErr, checkoutStdout, checkoutStderr) => {
                    if (checkoutErr || checkoutStderr) {
                        resolve({ success: false, error: checkoutStderr || checkoutErr.message });
                    } else {
                        resolve({ success: true, message: checkoutStdout.trim() });
                    }
                });
            });
        });
    });

    ipcMain.handle('add-branch', async (_event, branchTitle) => {
        return new Promise((resolve) => {
            exec(`git branch "${branchTitle}"`, { cwd: currentWorkingDirectory }, (error, stdout, stderr) => {
                if (error || stderr) {
                    resolve({ success: false, error: stderr || error.message });
                } else {
                    resolve({ success: true });
                }
            });
        });
    });

    ipcMain.handle('rename-branch', async (_event, branchTitle) => {
        return new Promise((resolve) => {
            exec(`git branch -m "${branchTitle}"`, { cwd: currentWorkingDirectory }, (error, stdout, stderr) => {
                if (error || stderr) {
                    resolve({ success: false, error: stderr || error.message });
                } else {
                    resolve({ success: true });
                }
            });
        });
    });

    ipcMain.handle('delete-branch', async (_event, currentBranch) => {
        return new Promise((resolve) => {
            exec(`git branch -d "${currentBranch}"`, { cwd: currentWorkingDirectory }, (error, stdout, stderr) => {
                if (error || stderr) {
                    resolve({ success: false, error: stderr || error.message });
                } else {
                    resolve({ success: true });
                }
            });
        });
    });

    ipcMain.handle('show-dialog', async (_event, message) => {
        await dialog.showMessageBox({
            type: 'warning',
            title: 'Erro',
            message: message,
        });
    });

    ipcMain.handle('git-commit', async (_event, commitTitle, commitBody) => {
        return new Promise((resolve) => {

            exec('git add .', { cwd: currentWorkingDirectory }, (addError, addStdout, addStderr) => {
                if (addError || addStderr) {
                    return resolve({ success: false, error: addStderr || addError.message });
                }

                const commitCommand = `git commit --allow-empty -m "${commitTitle}" -m "${commitBody}"`;
                exec(commitCommand, { cwd: currentWorkingDirectory }, (commitError, commitStdout, commitStderr) => {
                    if (commitError) {

                        const noChangesMessage = 'nothing to commit';
                        if (commitStderr && commitStderr.includes(noChangesMessage)) {
                            return resolve({ success: false, noChanges: true });
                        }
                        return resolve({ success: false, error: commitStderr || commitError.message });
                    }

                    if (commitStdout.includes('nothing to commit')) {
                        return resolve({ success: false, noChanges: true });
                    }

                    resolve({ success: true, output: commitStdout });
                });
            });
        });
    });

    ipcMain.handle('load-commits', async () => {
        return new Promise((resolve) => {
            const cmd = `git log --date=format:"%b %d %H:%M" --pretty=format:"%H%x1f%s%x1f%b%x1f%ad%x1e"`;

            exec(cmd, { cwd: currentWorkingDirectory }, (error, stdout) => {
                if (error) {
                    console.error('Git error:', error);
                    return resolve(null);
                }

                // Make sure output ends with record separator to avoid partial commits
                const output = stdout.endsWith('\x1e') ? stdout : stdout + '\x1e';

                // Split commits by record separator \x1e, filtering empty entries
                const commitsRaw = output.split('\x1e').filter(Boolean);

                // Trim whitespace on each part to clean newlines or spaces
                const commits = commitsRaw.map(commit => {
                    const parts = commit.split('\x1f').map(part => part.trim());
                    const [hash, title, description, date] = parts;
                    return { hash, title, description, date };
                });

                resolve(JSON.stringify(commits));
            });
        });
    });

    ipcMain.handle('create-past-branch', async (event, previousBranchName, hash, date) => {
        // Sanitize date for branch name
        const safeDate = date.replace(/[^0-9a-zA-Z_-]/g, '-');
        const shortHash = hash.substring(0, 7);

        // Add "PASSADO_" prefix to the branch name
        let baseBranchName = `PASSADO_${previousBranchName}_${safeDate}_${shortHash}`;
        let branchName = baseBranchName;

        // Helper function to check if a branch exists
        function branchExists(name) {
            return new Promise((resolve) => {
                exec(`git branch --list ${name}`, { cwd: currentWorkingDirectory }, (error, stdout) => {
                    resolve(stdout.trim() !== '');
                });
            });
        }

        // Find unique branch name by appending a number suffix if needed
        let suffix = 1;
        while (await branchExists(branchName)) {
            branchName = `${baseBranchName}_${suffix}`;
            suffix++;
        }

        // Now create the branch
        const cmd = `git switch -c ${branchName} ${hash}`;

        return new Promise((resolve, reject) => {
            exec(cmd, { cwd: currentWorkingDirectory }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error creating past branch: ${stderr}`);
                    reject(new Error(stderr));
                    return;
                }
                console.log(`Created past branch: ${stdout}`);
                resolve(stdout);
            });
        });
    });


    createWindow();
});

// Continue reading from:
// https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app
// and: https://nodejs.org/api/events.html#events & https://react.dev/learn/installation (React is Paced for 2st recess)

// NOTES ON PACKAGING CAN BE FOUND ON "r-electron.md"
