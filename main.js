const { app, BrowserWindow } = require('electron')
const isDev = require("electron-is-dev");

const SerialPort = require('serialport')
console.log(SerialPort.list())

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    devTools: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  })

  if (isDev) {
    win.loadURL('http://localhost:1234')
  } else {
    console.log('This will not work...')
    win.loadFile('index.html')
  }
}


app.whenReady().then(() => {
  app.allowRendererProcessReuse = false

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

console.log('process.versions', process.versions)
