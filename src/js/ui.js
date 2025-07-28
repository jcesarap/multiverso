// Managing menus

// Ensure the DOM is fully loaded before running scripts
document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;
    if (page === 'index') {
        consoleMenu();
        profileMenu();
        dropdownMenu();
    } else if (page === 'home') {
        versionSelection();
        confirmDeletion();
    } else if (page === 'edit') {
        versionSelection();
        confirmDeletion();
    } else if (page === 'newVersion') {
        newVersion();
    } else if (page === 'history') {
        versionSelection();
        confirmDeletion();
    } else if (page === 'save') {
        Save();
    }

});

function consoleMenu() {
    const consoleButton = document.getElementById('reminder');
    const commandPrompt = document.getElementById('command');
    if (!consoleButton || !commandPrompt) {
        alert("Missing elements");
        return;
    }
    consoleButton.addEventListener('click', () => {
        commandPrompt.classList.toggle('show');
    })
}

function profileMenu() {
    // CREATE
    const createButton = document.getElementById('create'); // Same as above here
    const newProjectOverlay = document.getElementById('new-project-overlay'); // Same as above here 
    const closeButtonProject = document.getElementById('close-project'); // Same as above here

    // SOURCING DOM ELEMENTS
    const profileButton = document.getElementById('profile'); // It stores a REFERENCE to that (DOM) ELEMENT in a VARIABLE - so you can attach behavior to it.
    const profileOverlay = document.getElementById('profile-overlay'); // Same as above here
    const closeButtonProfile = document.getElementById('close-profile'); // Same as above here



    // LOAD ONLY IF ON PAGE, OTHERWISE SCRIPT CRASHES
    if (!profileButton || !profileOverlay || !closeButtonProject || !closeButtonProfile || !createButton || !newProjectOverlay) return; // If either aren't in current page, exit


    createButton.addEventListener('click', () => { // the method/function      ".addEventListener"     receives another function (anonymous) as its 2st parameter
        newProjectOverlay.classList.toggle('show'); // It uses it when appropriate
        // References DOM element defined in JS above; classList manipulates class property of DOM element; adds/removes (toggles) show
    });

    closeButtonProject.addEventListener('click', () => { // the method/function      ".addEventListener"     receives another function (anonymous) as its 2st parameter
        newProjectOverlay.classList.toggle('show'); // It uses it when appropriate
        // References DOM element defined in JS above; classList manipulates class property of DOM element; adds/removes (toggles) show
    });





    profileButton.addEventListener('click', () => { // the method/function      ".addEventListener"     receives another function (anonymous) as its 2st parameter
        profileOverlay.classList.toggle('show'); // It uses it when appropriate
        // References DOM element defined in JS above; classList manipulates class property of DOM element; adds/removes (toggles) show
    });

    closeButtonProfile.addEventListener('click', () => { // the method/function      ".addEventListener"     receives another function (anonymous) as its 2st parameter
        profileOverlay.classList.toggle('show'); // It uses it when appropriate
        // References DOM element defined in JS above; classList manipulates class property of DOM element; adds/removes (toggles) show
    });
}

function dropdownMenu() {
    const dropdownButton = document.getElementById('dropdown-button'); // Same as above here
    const dropdownMenu = document.getElementById('dropdown-menu'); // Same as above here
    const dropdownIcon = document.getElementById('dropdown-icon');


    // LOAD ONLY IF ON PAGE, OTHERWISE SCRIPT CRASHES
    if (!dropdownButton || !dropdownMenu || !dropdownIcon) return; // Exit early if any missing



    dropdownButton.addEventListener('click', () => { // the method/function      ".addEventListener"     receives another function (anonymous) as its 2st parameter
        dropdownMenu.classList.toggle('show'); // It uses it when appropriate
        // References DOM element defined in JS above; classList manipulates class property of DOM element; adds/removes (toggles) show
        dropdownIcon.textContent = dropdownMenu.classList.contains('show') ? '∧' : '∨';
    });
}


function versionSelection() {
    // SOURCE DOM ELEMENT FOR JS REFERENCING
    const lists = document.querySelectorAll(".versions");

    // Iterates over lists var
    lists.forEach((list) => {
        // # For each
        // * Takes function as argument, and runs it on every element of list/array
        // * "list" is the defion of a parameter to the arrow function, so you can reference in it...
        // * To operate the current iteration of data
        list.addEventListener("click", (event) => {
            // Mark with variable target of click
            const clicked = event.target;

            // Use .closest to find the nearest <li> ancestor of the clicked element
            const li = clicked.closest("li");
            if (!li || !list.contains(li)) return; // Ignore clicks outside valid <li> within the current list

            // Remove 'selected' from all siblings
            const items = list.querySelectorAll("li");
            items.forEach((item) => item.classList.remove("selected")); // Manipulation of class property, remove one named "selected"
            // Removing this class, remove what denotes the blue visual cue

            // Also remove 'selected' from all <p> inside <li>
            const descriptions = list.querySelectorAll("li > p");
            descriptions.forEach((desc) => desc.classList.remove("selected")); // Clean all description highlights

            // Add 'selected' to the clicked item
            li.classList.add("selected");

            // Add 'selected' to its internal <p>, if any
            const description = li.querySelector("p");
            if (description) {
                description.classList.add("selected"); // Visually link description to selection
            }
        });
    });
}


function confirmDeletion() {
    // SOURCING DOM ELEMENTS
    const deleteOverlay = document.getElementById('delete-dialog'); // Same as above here

    const cancelButton = document.getElementById('cancel-delete'); // It stores a REFERENCE to that (DOM) ELEMENT in a VARIABLE - so you can attach behavior to it.
    const confirmButton = document.getElementById('confirm'); // Same as above here
    const deleteButton = document.getElementById('delete'); // Same as above here



    // LOAD ONLY IF ON PAGE, OTHERWISE SCRIPT CRASHES
    if (!cancelButton || !confirmButton || !deleteButton) return; // If either aren't in current page, exit




    cancelButton.addEventListener('click', () => { // the method/function      ".addEventListener"     receives another function (anonymous) as its 2st parameter
        deleteOverlay.classList.remove('show'); // It uses it when appropriate
        // References DOM element defined in JS above; classList manipulates class property of DOM element; adds/removes (toggles) show
    });

    confirmButton.addEventListener('click', () => { // the method/function      ".addEventListener"     receives another function (anonymous) as its 2st parameter
        // profileOverlay.classList.toggle('show'); // It uses it when appropriate
        // References DOM element defined in JS above; classList manipulates class property of DOM element; adds/removes (toggles) show
    });

    deleteButton.addEventListener('click', () => { // the method/function      ".addEventListener"     receives another function (anonymous) as its 2st parameter
        deleteOverlay.classList.toggle('show'); // It uses it when appropriate
        // References DOM element defined in JS above; classList manipulates class property of DOM element; adds/removes (toggles) show
    });
}
