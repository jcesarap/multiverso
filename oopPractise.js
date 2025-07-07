
// ======================================================================= Problems to Learn OOP
// ...Eventually move this to /JS/[23 problems ].md
// 01
// Create an object representing a user, print their details, update their age, and print the new details.
// name with a value of "Alex"; age with a value of 30; occupation with a value of "Software Developer"
// 02
// Define a Person class, create an instance (object) of it, and use a method to display its properties.
// The constructor should accept name, age, and occupation as arguments and assign them to the object's properties.
// 03
// (build on the last problem to) Create a method within the class called displayInfo() that logs all the person's properties to the console.
// Create a new instance of the Person class for a user named "Jordan" who is 25 and a "Graphic Designer".
// Call the displayInfo() method on your new "Jordan" object.

// ======================================================================= Initialisation
// "import"             is a keyword for loading modules to current file
// "* as readline"      imports everything into a single object named readline
// "from 'node:..."     Specifies which module to load - the version that supports "promises" instead of using callbacks
import { read } from 'node:fs';
import * as readline from 'node:readline/promises'

// Create rl object
// .createInterface is a METHOD of readline
// {} are used to denote objects, just as () denote functions in C
// "input:/output:" are usual Object properties
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// async: "This function might contain tasks that take time, but it promises to return a value eventually."
// It automatically returns a Promise - an object representing a future result (it's the "buzzer" you get while you wait for your food).
// Whatever return value will be wrapped in it
async function readCLI(prompt) {
    // 'await' can only be used in async function - tells JS to pause until the promise is resolved (has a result)
    const answer = await rl.question(prompt);
    return answer;
}

// === Old way

// readline function holds whatever "require()" returns
// Require is the C's "include" function equivalent
// "node:" prefix indicates one of its modules, then its name

//const readline = require('node:readline'); // Old syntax which doesn't work for this project strucutre defined in package.json


//    OVERVIEW
//        Method (function belong to object) call on object
//        Takes a function as argument to define what happens after an event
//    ELEMENTS
//        .question is a method of readline
//        'What...?' is the first argument to the .question Method
//        (name) => {} is the second argument
//    ARGUMENTS
//        As always, it's merely a function receiving parameters, and the specific function, defines the flow of using them
//        In this specific case: .question runs the 1st argument; Then waits for input; Then executes the function it held
//        Notice how the function is defined in the argument, and not called

async function promptName() {
    let prompt = "What is your name? "
    let name = await readCLI(prompt);
    console.log(`Hello, ${name}!`);
}

// ================================ Problem 1
// Create an object representing a user, print their details, update their age, and print the new details.
// name with a value of "Alex"; age with a value of 30; occupation with a value of "Software Developer"
// Create a manual way to edit/enter object data
async function manualObject() { // As arrow function: const manualObject = async () => {
    let numOfUsers = 2;
    // =============== Manual
    const sudo = {
        name: "root",
        age: 24,
        occupation: "Software Developer",
    }
    //console.log(`${sudo.name} \n ${sudo.age} \n ${sudo.occupation}`);
    let user = [];
    for (let i = 0; i < numOfUsers; i++) {
        console.log(`\n==== ${i + 1}st user ===`)
        let name = await readCLI('What\'s your name? ')
        let age = await readCLI('What\'s your age? ')
        let occupation = await readCLI('What\'s your occupation? ')
        // Create the object and assign it to the current position in the array.
        // You can create the object directly or use a factory function.
        user[i] = {
            name: name,
            age: age,
            occupation: occupation,
            greet() {
                console.log(`Hello, my name is ${this.name}.`); // ".this" is shorthand for the object who called the method
            },
            isAdult() {
                return this.age >= 18;
            },
            list() {

            }
        };
    }
    // Use the object
    const printUsers = () => {
        console.log("Index              Data ==============");
        for (let j = 0; j < numOfUsers; j++) {
            console.log(`${j + 1} - A ${user[j].occupation} named ${user[j].name}, ${user[j].age}`);
        }
    };

    console.log("\n \n ============== Initialising last test");
    console.log("Object/property extraction");
    // Print admin (default values)
    printUsers();
    // Choose an user to as admin
    let admin = {
        name: "undefined",
        age: 0,
        occupation: "undefined",
    };
    console.log(`Current admin is: ${admin.occupation} named ${admin.name}, ${admin.age} \n`);
    console.log("==================================");
    let userExtraction = await readCLI(' \n Which user do you want TO BE SET AS ADMIN? ');
    // Adding them to a new object - using OBJECT DESTRUCTURING
    let { name, age, occupation } = user[userExtraction - 1]
    admin.name = name;
    admin.age = age;
    admin.occupation = occupation;
    // Print admin (new values)
    console.log("\n");
    printUsers();
    console.log(`Current admin is: ${admin.occupation} named ${admin.name}, ${admin.age} \n`);
    let option = await readCLI('\n ==== \n 1 - Yes \n 2 - No \n Want to edit users? ');
    switch (option) {
        case '1':
            printUsers();
            let userPick = await readCLI(' Which user do you want to edit? ');
            let edit = await readCLI(' 1 - Name \n 2 - Age \n 3 - Occupation \n What do you want to edit? ');
            switch (edit) {
                case '1':
                    let newName = await readCLI(' Type your new name: ');
                    user[userPick - 1].name = newName;
                    break;
                case '2':
                    let newAge = await readCLI(' Type your new age: ');
                    user[userPick - 1].age = newAge;
                    break;
                case '3':
                    let newOccupation = await readCLI(' Type your new occupation: ');
                    user[userPick - 1].occupation = newOccupation;
                    break;
                default:
                    console.log("edit skipped")
            }
            printUsers();
            break;
        case '2':
            break;
        default:
            console.log('Invalid option');
    }
}

const final = () => {
    class People {
        constructor(name, age, occupation) {
            // This function takes the parameters given, and creates a new object with those properties
            this.name = name;
            this.age = age;
            this.occupation = occupation;
        }
        displayVehicle() {
            console.log(`${this.make} ${this.model} (${this.year})`);
        }
    }
    // This is pretty clear. No need for practise. Instead practise extracting properties - on the previous function
}

// ======================================================================= Control Flow
// Since there're promises running on each prompt (waiting for user input), this code requires being wrapped in a function - by the interpreter
async function main() {
    // Since user-input/promise... await
    let option = await readCLI(' 1 - Hello World (with name prompt) \n 2 - Object problem (sign up user, update their age) \n 3 - Class/Method/Constructor problem \n Choose an option: ')


    switch (option) { // readline always returns strings, so the switch needs to compare strings
        case '1':
            console.log("Option 1 was selected");
            await promptName();
            break;
        case '2':
            console.log("Option 2 was selected");
            await manualObject();
            break;
        case '3':
            console.log("Option 3 was selected");
            break;
        default:
            console.log("Invalid option was selected");
    }
    rl.close();
}

main();