// Managing menus

// SOURCING DOM ELEMENTS

const profileButton = document.getElementById('profile'); // It stores a REFERENCE to that (DOM) ELEMENT in a VARIABLE - so you can attach behavior to it.
const profileOverlay = document.getElementById('profile-overlay'); // Same as above here

const closeButton = document.getElementById('close'); // Same as above here

const dropdownButton = document.getElementById('dropdown-button'); // Same as above here
const dropdownMenu = document.getElementById('dropdown-menu'); // Same as above here
const dropdownIcon = document.getElementById('dropdown-icon');

// INTERACTIONS

profileButton.addEventListener('click', () => { // the method/function      ".addEventListener"     receives another function (anonymous) as its 2st parameter
    profileOverlay.classList.toggle('show'); // It uses it when appropriate
    // References DOM element defined in JS above; classList manipulates class property of DOM element; adds/removes (toggles) show
});

closeButton.addEventListener('click', () => { // the method/function      ".addEventListener"     receives another function (anonymous) as its 2st parameter
    profileOverlay.classList.toggle('show'); // It uses it when appropriate
    // References DOM element defined in JS above; classList manipulates class property of DOM element; adds/removes (toggles) show
});

dropdownButton.addEventListener('click', () => { // the method/function      ".addEventListener"     receives another function (anonymous) as its 2st parameter
    dropdownMenu.classList.toggle('show'); // It uses it when appropriate
    // References DOM element defined in JS above; classList manipulates class property of DOM element; adds/removes (toggles) show
    dropdownIcon.textContent = dropdownMenu.classList.contains('show') ? '∧' : '∨';
});

// MOUSE INDICATIONS

document.addEventListener("DOMContentLoaded", function () {
    const versionItems = document.querySelectorAll(".versions li");

    versionItems.forEach(item => {
        item.addEventListener("click", function () {
            // Remove 'selected' from all
            versionItems.forEach(i => i.classList.remove("selected"));
            // Add 'selected' to the clicked one
            this.classList.add("selected");
        });
    });
});