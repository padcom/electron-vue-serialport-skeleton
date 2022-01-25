const { app, BrowserWindow } = require('electron')
const isDev = require("electron-is-dev");
const fetch = require('electron-fetch').default

const SerialPort = require('serialport')

function waitForPageToBuild(timeout = 5000) {
  const t1 = Date.now()
  return new Promise(async (resolve, reject) => {
    while(1) {
      const t2 = Date.now()

      if (t2 - t1 > timeout) {
        reject('Timeout')
        break
      }

      try {
        const response = await fetch('http://localhost:8080')
        if (response.status === 200) {
          resolve()
          break;
        }
      } catch {
        // we can't connect in the beginning so we catch and swallow the exception
      }
    }
  })
}

async function createWindow () {
  await waitForPageToBuild()

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
    win.loadURL('http://localhost:8080')
  } else {
    console.log('This will not work...')
    win.loadFile('index.html')
  }
}

async function main() {
  await app.whenReady()
  app.allowRendererProcessReuse = false

  const ports = await SerialPort.list()
  console.log('serial ports:', ports)

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

  console.log('process.versions', process.versions)
}

main()
