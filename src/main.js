// Modules
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const electronWindowState = require('electron-window-state')
const path = require("path");
const { log } = require("./utils/log");
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


// Var defs
let mainWindow;
let winState;
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



// Create main window and load web app into it and pass some basic data
async function createWindow() {

    // Persist state and drag of window etc
    winState = electronWindowState({
        defaultWidth: 800, defaultHeight: 760,
    });

    // Open and configure new mainWindow
    mainWindow = new BrowserWindow({
        x: winState.x, y: winState.y,
        width: winState.width, height: winState.height,
        minWidth: 400, minHeight: 400,
        backgroundColor: "#101010",
        webPreferences: {
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            nodeIntegration: false, // is a security risk but we are not loading in any external websites
        }
    })


    // Manage window state
    winState.manage(mainWindow);

    // Load index.html into the new BrowserWindow
    // mainWindow.loadFile(path.join(__dirname, "webapp/index.html"));
    mainWindow.loadURL("https://di.fm");

    // Send some default data to the page
    mainWindow.webContents.on("did-finish-load", e => {

    });

    // Menu
    let mainMenu = Menu.buildFromTemplate(require('./menu'))
    Menu.setApplicationMenu(mainMenu)

    // Open DevTools - Remove for PRODUCTION!
    // mainWindow.webContents.openDevTools();

    // Listen for window being closed
    mainWindow.on('closed', () => {
        mainWindow = null
    })
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


// Electron `app` is ready
app.on('ready', createWindow)
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
    if (mainWindow === null) createWindow()
})
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
