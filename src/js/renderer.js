// const versionTest = document.getElementById('output')
// versionTest.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

let selectedCommitHash = null;
let selectedCommitDate = null;
let previousBranchName = 'main'; // or set dynamically

/*
async function setupCLI() {
    const input = document.querySelector('#command input'); // Selects the first element that matches the css selector between quotes
    const output = document.querySelector('#output');

    input.addEventListener('keydown', async (event) => { // Needs be async, as it evokes shell, which is async
        if (event.key === 'Enter') {
            const cmd = input.value.trim(); // Gets value inside input field
            try {
                const result = await window.api.runCommand(cmd); // Import 
                output.innerText = result;
            } catch (err) {
                output.innerText = `Error: ${err.message}`;
            }
        }
    })
}
*/

let currentBranch = localStorage.getItem('currentBranch') || "";
console.log(`Current branch is: ${currentBranch}`);

async function signUp() {
    // You could even set this based on system username
    const emailInput = document.getElementById('email');
    const userNameInput = document.getElementById('username');
    const signInButton = document.getElementById('sign'); // This is the BUTTON, not its `.value`

    if (!emailInput || !userNameInput || !signInButton) {
        await window.api.showDialog('HTML elements not found');
        return;
    }

    signInButton.addEventListener('click', async () => {
        const email = emailInput.value.trim();          // Get values in input, in the moment the button is pressed
        const userName = userNameInput.value.trim();

        if (!email || !userName) {
            await window.api.showDialog("Precisa cadastrar tanto nome quanto e-mail.");
            return;
        }

        const emailSet = await window.api.setGitEmail(email);
        const userSet = await window.api.setGitUsername(userName);

        if (emailSet && userSet) {
            await window.api.showDialog("Cadastro bem-sucedido");
            await window.api.showDialog(`email cadastrado: ${email}`);
            await window.api.showDialog(`username cadastrado: ${userName}`);
        } else {
            await window.api.showDialog("Cadastro contém caracteres inválidos");
        }
    });
}

function parseText(rawOutput) {
    // Turns string into an array
    // Split into array (breaking at \n)
    const linesArray = rawOutput.split('\n');

    // .map is a method for arrays that takes argument in regards to what it does specifically
    // IT DOES WHATEVER IS INSIDE (), FOR EACH ARRAY ELEMENT
    const trimmedLines = linesArray.map(line => line.trim()); // given (arbitrary name for aux_function) line => use .trim() on line

    // .filter has the same structure, but keep only items that return true
    const nonEmptyLines = trimmedLines.filter(line => line.length > 0);

    return nonEmptyLines;
}

function outputToList(lines, domElement) {
    lines.forEach(line => {
        const li = document.createElement('li');

        if (line.startsWith('*')) {
            li.textContent = line.slice(1).trim(); // Remove asterisk
            li.classList.add('selected'); // Active branch
            localStorage.setItem('currentBranch', li.textContent); // Save to localStorage
            currentBranch = li.textContent; // Save to global variable
            console.log(`Current branch is: ${currentBranch}`);
        } else {
            li.textContent = line;
        }

        domElement.appendChild(li);
    });
    return currentBranch;
}

function parseText(rawOutput) {
    // Turns string into an array
    // Split into array (breaking at \n)
    const linesArray = rawOutput.split('\n');

    // .map is a method for arrays that takes argument in regards to what it does specifically
    // IT DOES WHATEVER IS INSIDE (), FOR EACH ARRAY ELEMENT
    const trimmedLines = linesArray.map(line => line.trim()); // given (arbitrary name for aux_function) line => use .trim() on line

    // .filter has the same structure, but keep only items that return true
    const nonEmptyLines = trimmedLines.filter(line => line.length > 0);

    return nonEmptyLines;
}

async function loadBranches() {
    let branchesElement = document.getElementById('branches');
    branchesElement.innerHTML = ''; // Clear existing list

    let savedPath = localStorage.getItem('selectedPath');
    if (savedPath) {
        await window.api.setWorkingDirectory(savedPath);
    }

    let rawOutput = await window.api.loadBranches();
    if (!rawOutput) {
        await window.api.showDialog('Nenhuma versão alternativa ainda foi criada');
        return;
    }

    let lines = parseText(rawOutput);
    outputToList(lines, branchesElement);
}

async function loadCommits() {
    const commitsElement = document.getElementById('commits');
    commitsElement.innerHTML = '';

    console.log('[loadCommits] Fetching commit data...');
    const rawJSON = await window.api.loadCommits();

    if (!rawJSON) {
        console.warn('[loadCommits] No data received (null or empty).');
        await window.api.showDialog('Nenhuma versão do passado foi encontrada');
        return;
    }

    console.log('[loadCommits] Raw JSON string received:');
    console.log(rawJSON);

    let commits;
    try {
        commits = JSON.parse(rawJSON);

        if (commits.length > 0) {
            selectedCommitHash = commits[0].hash;

            // Parse date and convert to ISO string (detailed with time)
            const dateObj = new Date(commits[0].date);
            selectedCommitDate = dateObj.toISOString(); // "2025-07-30T14:23:05.000Z" format

            previousBranchName = 'main'; // Adjust if necessary
        }
    } catch (e) {
        console.error('[loadCommits] Failed to parse JSON:', e);
        await window.api.showDialog('Falha ao interpretar os dados dos commits');
        return;
    }

    console.log(`[loadCommits] Parsed ${commits.length} commits:`, commits);

    commits.forEach((commit, index) => {
        console.log(`[loadCommits] Rendering commit ${index + 1}:`, commit);

        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${commit.title}</strong><br>
          <em>${commit.date}</em><br>
          <code>${commit.hash}</code>
          ${commit.description ? `<p>${commit.description}</p>` : ''}
        `;
        commitsElement.appendChild(li);
    });

    console.log('[loadCommits] Rendering complete.');
}

async function getSelectedBranch() {
    let savedPath = localStorage.getItem('selectedPath');
    if (savedPath) {
        await window.api.setWorkingDirectory(savedPath);
    }

    let rawOutput = await window.api.loadBranches();
    if (!rawOutput) {
        await window.api.showDialog('Nenhuma versão alternativa ainda foi criada');
        return null;
    }

    let lines = parseText(rawOutput);

    // Find the selected branch line (starts with '*')
    let selectedLine = lines.find(line => line.startsWith('*'));
    if (!selectedLine) {
        await window.api.showDialog('No selected branch found.');
        return null;
    }

    let branchName = selectedLine.slice(1).trim();

    // Save the selected branch name to localStorage and global variable
    localStorage.setItem('currentBranch', branchName);
    currentBranch = branchName;
    console.log(`Current branch is: ${branchName}`);

    return branchName;
}

async function printDirectory() {
    let dirElement = document.getElementById('dir');
    dirElement.innerHTML = '';

    let savedPath = localStorage.getItem('selectedPath');
    if (savedPath) {
        await window.api.setWorkingDirectory(savedPath);
    }

    let rawOutput = await window.api.printDir();
    if (!rawOutput) {
        await window.api.showDialog('Pasta vazia');
        return;
    }
    //let lines = parseText(rawOutput);
    outputToList(rawOutput, dirElement);
    //console.log("Directory print output:", lines);
}



// ========================================================



document.addEventListener("DOMContentLoaded", async () => {
    // Load attribute in js
    const page = document.body.dataset.page;
    if (page === 'index') {
        // await setupCLI();
        Index();
        signUp();
    } else if (page === 'home') {
        Home();
        loadBranches();
        printDirectory();
    } else if (page === 'edit') {
        Edit();
    } else if (page === 'newVersion') {
        newVersion();
    } else if (page === 'history') {
        History();
        loadCommits()
        //printDirectory();
    } else if (page === 'save') {
        Save();
    } else if (page === 'delete') {
        Delete();
    }
});

async function GitAccountCheck() {
    const profileOverlay = document.getElementById('profile-overlay'); // Same as above here

    if (!profileOverlay) {
        await window.api.showDialog("Element on renderer.js doesn't exit");
        return;
    }

    const isGitSetup = await window.api.checkGitSetup();
    if (isGitSetup === 1) {
        return 1;
    } else {
        profileOverlay.classList.add('show');
        return 0;
    }
}

async function GitCheck() {
    const gitReminder = document.getElementById('git-overlay');

    if (!gitReminder) {
        await window.api.showDialog("Element on renderer.js doesn't exit");
        return;
    }

    window.api.checkGit().then((result) => {
        if (!result) {
            gitReminder.classList.add('show');
        }
    });
}

async function Index() {
    // Criar
    //      Warning; File picker; Define path; Go home
    const createButton = document.getElementById("continue");
    // Abrir
    //      File picker; Define path; Go home
    const openButton = document.getElementById("open");
    // Recentes
    //      Define path; Go home
    // const recentButton = document.querySelector("dropdown-menu");
    const link = document.getElementById('baixar-git');
    const newProjectOverlay = document.getElementById('new-project-overlay'); // Same as above here 

    if (!link || !createButton || !openButton || !newProjectOverlay /*|| !recentButton*/) {
        await window.api.showDialog("Element on renderer.js doesn't exit");
        return;
    }

    // ======================== GIT CHECK

    await GitCheck();
    await GitAccountCheck();

    // ==================================


    link.addEventListener('click', (e) => {
        e.preventDefault();
        window.api.openExternal('https://github.com/git-for-windows/git/releases/download/v2.50.1.windows.1/Git-2.50.1-64-bit.exe');
    });

    openButton.addEventListener('click', async () => {
        let accounts = await GitAccountCheck();
        if (accounts !== 1) {
            console.warn("Git account not properly set up.");
            return;
        }

        const result = await window.api.openFile();
        if (result.canceled) {
            console.log("Dir picker cancelled"); // Bash usually gets errors for empty conditions, maybe here is the same
        } else {
            localStorage.setItem('selectedPath', result.filePaths[0]);      // Export

            // cd / cwd
            const dirPath = result.filePaths[0];
            await window.api.setWorkingDirectory(dirPath);
            localStorage.setItem('selectedPath', dirPath);
            await window.api.ensureGitSetup();
            window.location.href = 'home.html'
        }
    })

    createButton.addEventListener('click', async () => {
        let accounts = await GitAccountCheck();
        if (accounts !== 1) {
            newProjectOverlay.classList.remove('show');
            console.warn("Git account not properly set up.");
            return;
        }

        const result = await window.api.openFile();
        if (result.canceled) {
            console.log("Dir picker cancelled"); // Bash usually gets errors for empty conditions, maybe here is the same
        } else {
            localStorage.setItem('selectedPath', result.filePaths[0]);      // Export

            // cd / cwd
            const dirPath = result.filePaths[0];
            await window.api.setWorkingDirectory(dirPath);
            localStorage.setItem('selectedPath', dirPath);
            await window.api.ensureGitSetup();
            window.location.href = 'home.html'
        }
    })
    // recentButton.addEventListener('click', () => {
    //     window.location.href = 'home.html'
    // })
}

async function Home() {
    // Renderer
    const dirName = document.querySelector('.right h2');
    let savedPath = localStorage.getItem('selectedPath');
    let baseName = savedPath ? savedPath.replace(/^.*[\\/]/, '') : '';
    dirName.innerText = baseName;

    // Interactivity
    const closeButton = document.getElementById('button-close');
    const addButton = document.getElementById('add');
    const editButton = document.getElementById('editar');
    const historyButton = document.getElementById('history');
    const saveButton = document.getElementById('save');
    const deleteButton = document.getElementById('delete');

    if (!deleteButton || !closeButton || !addButton || !editButton || !saveButton || !historyButton) {
        await window.api.showDialog("Element on renderer.js doesn't exit");
        return;
    }

    closeButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    })
    addButton.addEventListener('click', () => {
        window.location.href = 'new-branch.html';
    })
    editButton.addEventListener('click', () => {
        window.location.href = 'edit.html';
    })
    historyButton.addEventListener('click', () => {
        window.location.href = 'history.html';
    })
    saveButton.addEventListener('click', () => {
        window.location.href = 'save.html';
    })
    deleteButton.addEventListener('click', async () => {
        window.location.href = 'delete.html';
    })
}


async function Edit() {
    // Placeholder takes value 
    let main = await getSelectedBranch();
    let editBranchInput = document.getElementById('title');
    editBranchInput.placeholder = `Versão Selecionada: ${main}`;

    const cancelButton = document.getElementById('cancel');
    const saveButton = document.getElementById('save');

    if (!cancelButton || !saveButton) {
        await window.api.showDialog("Element on renderer.js doesn't exit");
        return;
    }

    cancelButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    })

    saveButton.addEventListener('click', async () => {
        let input = document.getElementById('title');
        let branchTitle = input.value.trim();
        if (!input) {
            await window.api.showDialog("Element on renderer.js doesn't exit");
            return;
        }
        if (!branchTitle) {
            await window.api.showDialog('Nome da versão não pode estar vazio');
            return;
        }
        let outputNewVersion = await window.api.renameBranch(branchTitle);
        console.log(outputNewVersion);
        // console.log("You're on path: ");
        window.location.href = 'home.html';
    })
}

async function History() {
    // Renderer
    const dirName = document.querySelector('.right h2');

    let savedPath = localStorage.getItem('selectedPath');
    let baseName = savedPath ? savedPath.replace(/^.*[\\/]/, '') : '';
    dirName.innerText = baseName;

    const closeButton = document.getElementById('button-close');
    const revertButton = document.getElementById('revert');
    const deleteButton = document.getElementById('confirm');
    if (!closeButton || !revertButton || !deleteButton) {
        await window.api.showDialog("Element on renderer.js doesn't exit");
        return;
    }

    closeButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    })
    revertButton.addEventListener('click', async () => {
        if (!selectedCommitHash || !previousBranchName || !selectedCommitDate) {
            await window.api.showDialog('Dados do commit não carregados ainda.');
            return;
        }

        try {
            console.log(`[Revert] Creating branch from ${previousBranchName} at ${selectedCommitHash} dated ${selectedCommitDate}`);
            await window.api.createPastBranch(previousBranchName, selectedCommitHash, selectedCommitDate);
            await window.api.showDialog('Bifurcação criada com versão do passado!');
            window.location.href = 'home.html';
        } catch (error) {
            console.error('[Revert] Error:', error);
            await window.api.showDialog('Erro ao criar a branch do passado.');
        }
    });
    deleteButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    })
}

async function Save() {
    const cancelButton = document.getElementById('cancel');
    const saveButton = document.getElementById('save');
    if (!cancelButton || !saveButton) {
        await window.api.showDialog("Element on renderer.js doesn't exist");
        return;
    }

    saveButton.addEventListener('click', async () => {
        let inputTitle = document.getElementById('title');
        let inputDescription = document.getElementById('description');
        if (!inputTitle || !inputDescription) {
            await window.api.showDialog("Element on renderer.js doesn't exist");
            return;
        }
        await window.api.gitCommit(inputTitle.value, inputDescription.value);
        window.location.href = 'home.html';
    })

    cancelButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    })
}


async function newVersion() { // Add new branch
    const cancelButton = document.getElementById('cancel');
    const saveButton = document.getElementById('save');
    if (!cancelButton || !saveButton) {
        await window.api.showDialog("Element on renderer.js doesn't exit");
        return;
    }

    // console.log("You're on path: ");
    saveButton.addEventListener('click', async () => {
        let input = document.getElementById('title');
        let branchTitle = input.value.trim();
        if (!input) {
            await window.api.showDialog("Element on renderer.js doesn't exit");
            return;
        }
        if (!branchTitle) {
            await window.api.showDialog('Nome da versão não pode estar vazio');
            return;
        }
        let outputNewVersion = await window.api.addBranch(branchTitle);
        console.log(outputNewVersion);
        // console.log("You're on path: ");
        window.location.href = 'home.html';
    })

    cancelButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    })
}

async function Delete() {
    let main = await getSelectedBranch();
    const cancelButton = document.getElementById('cancel');
    const deleteButton = document.getElementById('save'); // Leave this, so CSS remains unchanged
    if (!cancelButton || !deleteButton) {
        await window.api.showDialog("Element on renderer.js doesn't exit");
        return;
    }

    // console.log("You're on path: ");
    deleteButton.addEventListener('click', async () => {
        let input = document.getElementById('title');
        if (!input) {
            await window.api.showDialog("Element on renderer.js doesn't exist");
            return;
        }
        let target = input.value.trim();
        if (main === target) {
            await window.api.showDialog("Você não pode apagar o universo (versão) que você está. Troque, depois tente de novo");
            return;
        } else if (!target) {
            await window.api.showDialog("Nome da versão não pode estar vazio");
            return;
        }

        const result = await window.api.deleteBranch(target);
        if (!result.success) {
            await window.api.showDialog("Versão não encontrada");
            return;
        }
        // console.log("You're on path: ");
        window.location.href = 'home.html';
    })

    cancelButton.addEventListener('click', () => {
        window.location.href = 'home.html';

    })
}
