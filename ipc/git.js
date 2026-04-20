const { ipcMain } = require('electron');
const { exec } = require('child_process');

/**
 * registerGitHandlers
 * @param {Function} getCwd - Function to get currentWorkingDirectory from main state
 */
function registerGitHandlers(getCwd) {

    ipcMain.handle('ensure-git-setup', async (_event) => {
        return new Promise((resolve) => {
            exec('git rev-parse --is-inside-work-tree', { cwd: getCwd() }, (err1) => {
                if (err1) {
                    // Not a git repo, initialize it
                    exec('git init', { cwd: getCwd() }, (err2) => {
                        if (err2) return resolve(false);
                        proceedWithAddAndCommit();
                    });
                } else {
                    proceedWithAddAndCommit();
                }
            });

            function proceedWithAddAndCommit() {
                exec('git add .', { cwd: getCwd() }, (err3) => {
                    if (err3) return resolve(false);

                    // Check if any commits exist
                    exec('git rev-parse HEAD', { cwd: getCwd() }, (err4) => {
                        if (err4) {
                            // No commits, make initial commit
                            exec('git commit -am "Estado Inicial"', { cwd: getCwd() }, (err5) => {
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
            exec(`git branch`, { cwd: getCwd() }, (error, stdout, stderr) => {
                if (error || stderr) {
                    resolve(null);
                } else {
                    resolve(stdout.trim());
                }
            });
        });
    });

    ipcMain.handle('switch-branch', async (_event, branchName) => {
        return new Promise((resolve) => {
            // Check git status
            exec('git status --porcelain', { cwd: getCwd() }, (statusErr, statusStdout, statusStderr) => {
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
                exec(`git checkout ${branchName}`, { cwd: getCwd() }, (checkoutErr, checkoutStdout, checkoutStderr) => {
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
            if (!getCwd()) {
                return resolve({ success: false, error: 'Working directory not set' });
            }

            exec(`git branch "${branchTitle}"`, { cwd: getCwd() }, (error, stdout, stderr) => {
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
            exec(`git branch -m "${branchTitle}"`, { cwd: getCwd() }, (error, stdout, stderr) => {
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
            exec(`git branch -D "${currentBranch}"`, { cwd: getCwd() }, (error, stdout, stderr) => {
                if (error || stderr) {
                    resolve({ success: false, error: stderr || error.message });
                } else {
                    resolve({ success: true });
                }
            });
        });
    });

    ipcMain.handle('git-commit', async (_event, commitTitle, commitBody) => {
        return new Promise((resolve) => {

            exec('git add .', { cwd: getCwd() }, (addError, addStdout, addStderr) => {
                if (addError || addStderr) {
                    return resolve({ success: false, error: addStderr || addError.message });
                }

                const commitCommand = `git commit --allow-empty -m "${commitTitle}" -m "${commitBody}"`;
                exec(commitCommand, { cwd: getCwd() }, (commitError, commitStdout, commitStderr) => {
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

            exec(cmd, { cwd: getCwd() }, (error, stdout) => {
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

                exec(cmd, { cwd: getCwd() }, (error, stdout, stderr) => {
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
                exec(`git branch --list ${name}`, { cwd: getCwd() }, (error, stdout) => {
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
            exec(cmd, { cwd: getCwd() }, (error, stdout, stderr) => {
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
}

module.exports = { registerGitHandlers };
