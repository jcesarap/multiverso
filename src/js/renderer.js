document.addEventListener("DOMContentLoaded", () => {
    // Load attribute in js
    const page = document.body.dataset.page;
    if (page === 'index') {
        Index();
    } else if (page === 'home') {
        Home();
    } else if (page === 'edit') {
        Edit();
    } else if (page === 'newVersion') {
        newVersion();
    } else if (page === 'history') {
        History();
    }
});

function Index() {
    // Criar
    //      Warning; File picker; Define path; Go home
    const createButton = document.getElementById("continue");
    // Abrir
    //      File picker; Define path; Go home
    const openButton = document.getElementById("open");
    // Recentes
    //      Define path; Go home
    // const recentButton = document.querySelector("dropdown-menu");
    if (!createButton || !openButton /*|| !recentButton*/) {
        alert("Element on renderer.js doesn't exit");
        return;
    }

    createButton.addEventListener('click', () => {
        window.location.href = 'home.html' // gets window object, .location obj/var, then href obj/var, and replaces it
    })

    openButton.addEventListener('click', () => {
        window.location.href = 'home.html'
    })

    // recentButton.addEventListener('click', () => {
    //     window.location.href = 'home.html'
    // })

}

function Home() {
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
        window.location.href = 'new-version.html';
    })
    editButton.addEventListener('click', () => {
        window.location.href = 'edit.html';
    })
    historyButton.addEventListener('click', () => {
        window.location.href = 'history.html';
    })
    saveButton.addEventListener('click', () => {
        alert("Documento salvo");
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

function newVersion() {
    const cancelButton = document.getElementById('cancel');
    const saveButton = document.getElementById('save');
    if (!cancelButton || !saveButton) {
        alert("Element on renderer.js doesn't exit");
        return;
    }

    cancelButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    })
    saveButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    })
}

function History() {
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