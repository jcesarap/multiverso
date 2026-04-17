const { ipcMain, dialog, app } = require('electron');
const path = require('node:path');
const fs = require('fs').promises;

/**
 * registerFsHandlers
 * @param {Function} getCwd - Function to get currentWorkingDirectory from main state
 * @param {Function} setCwd - Function to update currentWorkingDirectory in main state
 */
function registerFsHandlers(getCwd, setCwd) {

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

    ipcMain.handle('printDir', async (_event) => {
        try {
            const entries = await fs.readdir(getCwd());
            const filtered = entries.filter(name => !name.startsWith('.'));
            return filtered;
        } catch (err) {
            return null;
        }
    });

    ipcMain.handle('set-working-directory', async (_event, dirPath) => {
        setCwd(dirPath);
        return true; // acknowledge success
    });

}

module.exports = { registerFsHandlers };
