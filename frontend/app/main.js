const {app, BrowserWindow} = require('electron')

let mainWindow

function createWindow () {

  mainWindow = new BrowserWindow({width: 300, height: 300, frame: false, transparent: false, show: false})

  mainWindow.loadFile(__dirname+'/index.html')
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
