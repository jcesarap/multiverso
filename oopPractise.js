// # Ask LLM crawler for exercises
// * For creation of objects, printing and editing its properties
// * ...then using classes

// readline function holds whatever "require()" returns
// Require is the C's "include" function equivalent
// "node:" prefix indicates one of its modules, then its name
// const readline = require('node:readline'); // Old syntax which doesn't work for this project strucutre defined in package.json

// "import"             is a keyword for loading modules to current file
// "* as readline"      imports everything into a single object named readline
// "from 'node:..."     Specifies which module to load - the version that supports "promises" instead of using callbacks
import * as readline from 'node:readline/promises'

// Create rl object
// .createInterface is a METHOD of readline
// {} are used to denote objects, just as () denote functions in C
// "input:/output:" are usual Object properties
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Overview:                Method (function belong to object) call on object
//                          Takes a function as argument to define what happens after an event
// .question is a method of readline
// 'What...?' is the first argument to the .question Method
// (name) => {} is the second argument
rl.question('What is your name? ', (name) => {
  // 4. Handle the input
  console.log(`Hello, ${name}!`);

  // 5. Close the interface
  rl.close();
});

// -----------------------

console.log("Hello, ${name}!");
