const { contextBridge, ipcRenderer } = require('electron') // Get object from electron

// This versions object has the properties before :, defined by the return of () =>
contextBridge.exposeInMainWorld('api', { // To object named versions
    node: () => process.versions.node,          // process(object).versions(object(property of process)).node(property)
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'), // invoke (send message on) ping (channel); what is the response?
    // runCommand: (cmd) => ipcRenderer.invoke('run-command', cmd),
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    basename: (fullPath) => path.basename(fullPath),
    openExternal: (url) => ipcRenderer.send('open-external', url),
    checkGit: () => ipcRenderer.invoke('check-git'),
    checkGitSetup: () => ipcRenderer.invoke('check-git-setup'),
    setGitUsername: (username) => ipcRenderer.invoke('set-git-username', username),
    setGitEmail: (email) => ipcRenderer.invoke('set-git-email', email),
    loadBranches: () => ipcRenderer.invoke('load-branches'),
    setWorkingDirectory: (dirPath) => ipcRenderer.invoke('set-working-directory', dirPath),
    printDir: () => ipcRenderer.invoke('printDir'),
    switchBranchOnClick: (branchName) => ipcRenderer.invoke('switch-branch', branchName),
    addBranch: (branchTitle) => ipcRenderer.invoke('add-branch', branchTitle),
    renameBranch: (newBranchTitle) => ipcRenderer.invoke('rename-branch', newBranchTitle),
    deleteBranch: (currentBranch) => ipcRenderer.invoke('delete-branch', currentBranch),
    ensureGitSetup: () => ipcRenderer.invoke('ensure-git-setup'),
    showDialog: (message) => ipcRenderer.invoke('show-dialog', message),
    gitCommit: (commitTitle, commitBody) => ipcRenderer.invoke('git-commit', commitTitle, commitBody),
    loadCommits: () => ipcRenderer.invoke('load-commits'),
    createPastBranch: (previousBranchName, hash, selectedCommitDate) => ipcRenderer.invoke('create-past-branch', previousBranchName, hash, selectedCommitDate),
}) 
