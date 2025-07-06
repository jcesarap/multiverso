// Problems
// 01
// Create an object representing a user, print their details, update their age, and print the new details.
// name with a value of "Alex"; age with a value of 30; occupation with a value of "Software Developer"
// 02
// Define a Person class, create an instance (object) of it, and use a method to display its properties.
// The constructor should accept name, age, and occupation as arguments and assign them to the object's properties.
// Create a method within the class called displayInfo() that logs all the person's properties to the console.
// Create a new instance of the Person class for a user named "Jordan" who is 25 and a "Graphic Designer".
// Call the displayInfo() method on your new "Jordan" object.

// readline function holds whatever "require()" returns
// Require is the C's "include" function equivalent
// "node:" prefix indicates one of its modules, then its name
const readline = require('node:readline'); // Old syntax which doesn't work for this project strucutre defined in package.json

// "import"             is a keyword for loading modules to current file
// "* as readline"      imports everything into a single object named readline
// "from 'node:..."     Specifies which module to load - the version that supports "promises" instead of using callbacks
// import * as readline from 'node:readline/promises'

// Create rl object
// .createInterface is a METHOD of readline
// {} are used to denote objects, just as () denote functions in C
// "input:/output:" are usual Object properties
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
rl.question('What is your name? ', (name) => {
  // Method on console object
  console.log(`Hello, ${name}!`);
  // Method on rl object
  rl.close();
});