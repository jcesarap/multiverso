
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require('node:path'); // Get path module from node, assign to path (object)
const { exec } = require('child_process');
const fs = require('fs').promises;
const os = require('os');

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

    // win.setMenu(null); // Menu bar


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
        // Prompt the user to select a directory
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory']
        });

        // If a directory was selected
        if (!result.canceled && result.filePaths.length > 0) {
            const selectedPath = result.filePaths[0]; // Get the selected directory path
            console.log('Selected path:', selectedPath); // DEBUG

            const storageDir = app.getPath('userData'); // Get Electron's user data directory
            const filePath = path.join(storageDir, 'recent-paths.txt'); // Path to store the recents
            console.log('Recent paths file location:', filePath); // DEBUG

            let lines = [];

            try {
                // Try reading the file contents
                const content = await fs.readFile(filePath, 'utf-8');
                lines = content
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0);
                console.log('Loaded recent paths:', lines); // DEBUG
            } catch (err) {
                // File may not exist yet — that's okay
                console.warn('Could not read recent paths file (may not exist yet):', err); // DEBUG
            }

            // Optional: Remove duplicate if it exists (to keep order)
            lines = lines.filter(line => line !== selectedPath); // Remove if already in list
            lines.push(selectedPath); // Add the new one to the end
            console.log('Updated paths list:', lines); // DEBUG

            // Enforce max of 100 paths
            if (lines.length > 100) {
                lines = lines.slice(-100);
                console.log('Trimmed to last 100 entries'); // DEBUG
            }

            // Write the updated list back to the file
            try {
                await fs.writeFile(filePath, lines.join('\n'), 'utf-8');
                console.log('Successfully wrote updated paths to file'); // DEBUG
            } catch (err) {
                console.error('Failed to write recent paths file:', err); // DEBUG
            }
        } else {
            console.log('No path selected or dialog was canceled'); // DEBUG
        }

        // Return the result of the dialog to the renderer
        return result;
    });

    ipcMain.handle('load-recent-paths', async () => {
        try {
            const storageDir = app.getPath('userData');
            const filePath = path.join(storageDir, 'recent-paths.txt');

            // Check if file exists by trying to access it asynchronously
            try {
                await fs.access(filePath);
            } catch {
                // File does not exist
                return [];
            }

            // Read file content
            const content = await fs.readFile(filePath, 'utf-8');
            const paths = content
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);

            return paths;
        } catch (err) {
            return null;
        }
    });

    ipcMain.on('open-external', (__event, url) => {
        shell.openExternal(url);
    });

    ipcMain.handle('check-git', async () => {
        const platform = os.platform();

        return new Promise((resolve) => {
            // Step 1: Check if Git is already installed
            exec('git --version', (error, stdout) => {
                if (!error && stdout.includes('version')) {
                    return resolve(1);
                }

                // Git is NOT installed — try to install silently
                if (platform === 'win32') {
                    // Windows: Check if winget is available
                    exec('where winget', (wingetErr) => {
                        if (wingetErr) {
                            // winget not found, cannot install silently
                            return resolve(0);
                        }

                        // Install Git silently with winget
                        exec('winget install --id Git.Git -e --silent', (installErr) => {
                            if (installErr) {
                                // Git installation failed
                                return resolve(0);
                            }

                            // Step 2: Re-check if Git installed successfully
                            exec('git --version', (postErr, postStdout) => {
                                if (!postErr && postStdout.includes('version')) {
                                    return resolve(1);
                                } else {
                                    return resolve(0);
                                }
                            });
                        });
                    });

                } else if (platform === 'linux') {
                    // Linux: Install Git silently using dnf
                    exec('sudo dnf install -y git', (installErr) => {
                        if (installErr) {
                            // Git installation failed (maybe no sudo access)
                            return resolve(0);
                        }

                        // Step 2: Re-check if Git installed successfully
                        exec('git --version', (postErr, postStdout) => {
                            if (!postErr && postStdout.includes('version')) {
                                return resolve(1);
                            } else {
                                return resolve(0);
                            }
                        });
                    });

                } else {
                    // Unsupported platform
                    return resolve(0);
                }
            });
        });
    });

    ipcMain.handle('check-git-setup', async () => {
        return new Promise((resolve) => {
            // Try to get the Git username
            exec('git config user.name', (err1, name) => {
                // Only continues to the second if the first completes
                exec('git config user.email', (err2, email) => {
                    // Check if name and email are set (no error, and non-empty value)
                    const isNameSet = !err1 && name.trim().length > 0;
                    const isEmailSet = !err2 && email.trim().length > 0;

                    let currentName;
                    let currentEmail;

                    if (isNameSet) {
                        // Properly set up
                        // return output - for placeholder
                        console.log("Username properly set");
                        currentName = name.trim();
                    } else {
                        // Set username based on OS'
                        currentName = os.userInfo().username;
                        exec(`git config --global user.name "${currentName}"`, (err) => {
                            if (err) console.error("Failed to set username");
                        });
                    }

                    if (isEmailSet) {
                        // Properly set up
                        // return output - for placeholder
                        console.log("E-mail properly set");
                        currentEmail = email.trim();
                    } else {
                        // Set e-mail based on OS'
                        currentEmail = `${os.userInfo().username}@guest.com`;
                        exec(`git config --global user.email "${currentEmail}"`, (err) => {
                            if (err) console.error("Failed to set email");
                        });
                    }

                    // Properly set up
                    // return output - for placeholder
                    resolve([currentName, currentEmail]);
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
            if (!currentWorkingDirectory) {
                return resolve({ success: false, error: 'Working directory not set' });
            }

            exec(`git branch "${branchTitle}"`, { cwd: currentWorkingDirectory }, (error, stdout, stderr) => {
                if (error) {
                    return resolve({ success: false, error: error.message });
                }

                if (stderr) {
                    // Git sometimes outputs warnings here
                    console.warn('Git warning:', stderr);
                }

                resolve({ success: true, output: stdout.trim() });
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
            exec(`git branch -D "${currentBranch}"`, { cwd: currentWorkingDirectory }, (error, stdout, stderr) => {
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

    ipcMain.handle('create-past-branch', async (event, previousBranchName, hash, selectedCommitDate) => {
        console.log('create-past-branch called with:');
        console.log('  previousBranchName:', previousBranchName);
        console.log('  hash:', hash);
        console.log('  selectedCommitDate:', selectedCommitDate);

        if (!hash || typeof hash !== 'string' || !/^[0-9a-fA-F]{5,40}$/.test(hash.trim())) {
            console.error('Invalid or missing commit hash:', hash);
            return Promise.reject(new Error(`Invalid or missing commit hash: ${hash}`));
        }

        function getCommitTitle(commitHash) {
            return new Promise((resolve) => {
                const cmd = `git log -1 --pretty=format:%s ${commitHash}`;
                console.log(`Running command to get commit title: ${cmd}`);

                exec(cmd, { cwd: currentWorkingDirectory }, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error getting commit title for ${commitHash}:`, stderr || error.message);
                        resolve('untitled');  // fallback
                        return;
                    }
                    const title = stdout.trim();
                    console.log(`Commit title for ${commitHash}: "${title}"`);
                    resolve(title || 'untitled');
                });
            });
        }

        const commitTitle = await getCommitTitle(hash);

        const safeTitle = commitTitle
            .toLowerCase()
            .replace(/[^0-9a-zA-Z_-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        let baseBranchName = `versao_passada_${safeTitle}`;
        let branchName = baseBranchName;

        console.log('  sanitized branch base name:', baseBranchName);

        function branchExists(name) {
            return new Promise((resolve) => {
                exec(`git branch --list ${name}`, { cwd: currentWorkingDirectory }, (error, stdout) => {
                    resolve(stdout.trim() !== '');
                });
            });
        }

        let suffix = 1;
        while (await branchExists(branchName)) {
            branchName = `${baseBranchName}_${suffix}`;
            suffix++;
        }

        console.log('  final unique branch name:', branchName);

        const cmd = `git switch -c ${branchName} ${hash}`;
        console.log('  running command:', cmd);

        return new Promise((resolve, reject) => {
            exec(cmd, { cwd: currentWorkingDirectory }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error creating past branch: ${stderr}`);
                    reject(new Error(stderr));
                    return;
                }
                console.log(`Created past branch successfully:\n${stdout}`);
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
