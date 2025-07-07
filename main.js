const { app, BroserWindow } = require('electron')
// Code is read right to left, inside out!!!
//      Imports electron module/framework
//      Assigns to the left
// What is on the left?
//      Destructuring assignment - unpack values from arrays or properties from objects into distinct variables

const createWindow = () => {
  // Creates a new instance of the BrowserWindow object, with the following properties
  const win = new BrowserWindow({ // Stores reference to new window to win
    width: 800,
    height: 600
  })
  // Populate the instance
  win.loadFile('index.html') // .loadfile() is a method of BrowserWindow (which is stored in win)
}

app.whenReady().then(() => {
  createWindow()
})

// Continue reading from:
// https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app
// and: https://nodejs.org/api/events.html#events & https://react.dev/learn/installation (React is Paced for 2st recess)