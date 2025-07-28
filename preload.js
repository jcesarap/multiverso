const { contextBridge, ipcRenderer } = require('electron') // Get object from electron

// This versions object has the properties before :, defined by the return of () =>
contextBridge.exposeInMainWorld('api', { // To object named versions
    node: () => process.versions.node,          // process(object).versions(object(property of process)).node(property)
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'), // invoke (send message on) ping (channel); what is the response?
    runCommand: (cmd) => ipcRenderer.invoke('run-command', cmd),
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    basename: (fullPath) => path.basename(fullPath),
}) 