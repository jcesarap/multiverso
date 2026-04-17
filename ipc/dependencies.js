const { ipcMain } = require('electron');
const { exec } = require('child_process');
const os = require('os');

/**
 * registerDependenciesHandlers
 * Handles system-level requirements like Git installation and global config.
 */
function registerDependenciesHandlers() {

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
}

module.exports = { registerDependenciesHandlers };
