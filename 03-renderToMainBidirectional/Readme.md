# Pattern 2: Renderer to main (two-way)

En este ejemplo se desde el front se da click al botón, se invoca al preload y este invoca al método en main, posterior a este retorna la información. 

## ipcMain.handle  Main.js
### Primera parte main
Tenemos primero la función que es encargada de abrir el dialog y se retorna el path

```Javascript
async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {

  } else {
    return filePaths[0]
  }
}

```
### Segunda parte main
1)Tenemos que tenemos el handle, dialog:openFile, se le da este nombre ya que dialog es el objeto que vamos a utilizar y el proposito del mismo es abrir un archivo, ya que showOpenDialog puede tener muchas funciones por eso no pones el mismo nombre, es una convención del framework
 
2)Basicamente exponemos la función que en preload.js, luego el preload.js lo expone al renderer.

```Javascript
app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
```
### Primera parte Main 

1) Se obtiene el evento de la ventana, que sirve como identificado de la misma que son las dos primeras lineas de código 

2) Y se coloca el nuevo titulo de la ventana

```Javascript
function handleSetTitle (event, title) {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
}
```

### Segunda parte Main 

1) Le colocamos un identificador como primer argumento y de segundo la función

```Javascript
app.whenReady().then(() => {
  ipcMain.on('set-title', handleSetTitle)
  createWindow()
}
```

# ipcRenderer.invoke Prelaod.js

1) 'ElectronAPI' es el identificador que va a tener en el renderer.js

2) Podemos ver que exponemos al renderer el objeto electronAPI, el cual tiene el método openFile que invocaría al main y recordemos que en el main retorna información, por lo que la función openFile nos retornaría data.

```Javascript
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile')
})
```

## Renderer.js
### Explicación 

1) El window.electronAPI.openFile() se invoca gracias al objeto electronApi que defininimos el cual tiene un método openFile

2) Recordemos que este método invoca al ipcRenderer.invoke('dialog:openFile'), retorna información, recordemos que la javascript infiere el return en la última linea.

3) Por último la información que obtenemos se pega en el dom

```Javascript
const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')

btn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFile()
  filePathElement.innerText = filePath
})
```