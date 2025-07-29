// const versionTest = document.getElementById('output')
// versionTest.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

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

function signUp() {
    // You could even set this based on system username
    const emailInput = document.getElementById('email');
    const userNameInput = document.getElementById('username');
    const signInButton = document.getElementById('sign'); // This is the BUTTON, not its `.value`

    if (!emailInput || !userNameInput || !signInButton) {
        alert('HTML elements not found');
        return;
    }

    signInButton.addEventListener('click', async () => {
        const email = emailInput.value.trim();          // Get values in input, in the moment the button is pressed
        const userName = userNameInput.value.trim();

        if (!email || !userName) {
            alert("Precisa cadastrar tanto nome quanto e-mail.");
            return;
        }

        const emailSet = await window.api.setGitEmail(email);
        const userSet = await window.api.setGitUsername(userName);

        if (emailSet && userSet) {
            alert("Cadastro bem-sucedido");
            alert(`email cadastrado: ${email}`);
            alert(`username cadastrado: ${userName}`);
        } else {
            alert("Cadastro contém caracteres inválidos");
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
        } else {
            li.textContent = line; // Content of list item = current index of array
        }

        domElement.appendChild(li); // Add the variable to HTML
    })
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
        alert('Nenhuma versão alternativa ainda foi criada');
        return;
    }

    let lines = parseText(rawOutput);
    outputToList(lines, branchesElement);
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
        alert('Pasta vazia');
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
        //printDirectory();
    } else if (page === 'save') {
        Save();
    }
});

async function GitAccountCheck() {
    const profileOverlay = document.getElementById('profile-overlay'); // Same as above here

    if (!profileOverlay) {
        alert("Element on renderer.js doesn't exit");
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
        alert("Element on renderer.js doesn't exit");
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
        alert("Element on renderer.js doesn't exit");
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

            window.location.href = 'home.html'
        }
    })

    // recentButton.addEventListener('click', () => {
    //     window.location.href = 'home.html'
    // })
}

function Home() {
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
    if (!closeButton || !addButton || !editButton || !saveButton || !historyButton) {
        alert("Element on renderer.js doesn't exit");
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
}


function Edit() {
    const deleteButton = document.getElementById('confirm');
    const cancelButton = document.getElementById('cancel');
    const saveButton = document.getElementById('save');
    if (!deleteButton || !cancelButton || !saveButton) {
        alert("Element on renderer.js doesn't exit");
        return;
    }

    deleteButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    })
    cancelButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    })
    saveButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    })
}

function History() {
    // Renderer
    const dirName = document.querySelector('.right h2');

    let savedPath = localStorage.getItem('selectedPath');
    let baseName = savedPath ? savedPath.replace(/^.*[\\/]/, '') : '';
    dirName.innerText = baseName;

    const closeButton = document.getElementById('button-close');
    const revertButton = document.getElementById('revert');
    const deleteButton = document.getElementById('confirm');
    if (!closeButton || !revertButton || !deleteButton) {
        alert("Element on renderer.js doesn't exit");
        return;
    }

    closeButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    })
    revertButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    })
    deleteButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    })
}

function Save() {
    const cancelButton = document.getElementById('cancel');
    const saveButton = document.getElementById('save');

    if (!cancelButton || !saveButton) {
        alert("Element on renderer.js doesn't exit");
        return;
    }

    saveButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    })

    cancelButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    })
}


function newVersion() { // Add new branch
    const cancelButton = document.getElementById('cancel');
    const saveButton = document.getElementById('save');
    if (!cancelButton || !saveButton) {
        alert("Element on renderer.js doesn't exit");
        return;
    }

    // console.log("You're on path: ");
    saveButton.addEventListener('click', async () => {
        let input = document.getElementById('title');
        let branchTitle = input.value.trim();
        if (!input) {
            alert("Element on renderer.js doesn't exit");
            return;
        }
        if (!branchTitle) {
            alert('Nome da versão não pode estar vazio');
            return;
        }
        const outputNewVersion = await window.api.addBranch(branchTitle);
        console.log(outputNewVersion);
        // console.log("You're on path: ");
        window.location.href = 'home.html';
    })

    cancelButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    })
}


