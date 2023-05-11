# Renderer to Main (Unidireccional)

En este ejemplo se cambiará el nombre de la ventana desde el front de la aplicación

* El titulo de la ventana solamente puede ser cambiada por nodejs*


## ipcMain.on  Main.js

Se coloca en el main, se matiene a la escucha para cuando sea invocado.

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

# ipcRenderer.send Prelaod.js

1) 'ElectronAPI' es el identificador que va a tener en el renderer.js

2) La segunda parte es un objeto de Javascript, tenemos que el atributo del objeto se puede ver como una función.

### Ejemplo de cómo se vería el objeto
```Javascript
var electronApi = {
  setTitle: function(title) {
   ipcRenderer.send('set-title', title)
  }
};
```

### Ejemplo de cómo se puede ver la función 
```Javascript
function setTitle(title){
  ipcRenderer.send('set-title',title);
}
```

3) Entiendo lo anterior podemos ver que se expone en el render, en este se llamaria a la función setTitle(title) y esto mandaría la información a ipcMain.on

```Javascript
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title)
})
```

## Renderer.js

1) Entonces aquí simplemente obtenemos la información del front,
invcoacmos a electronApi con su función setTitle y mandamos el title
```Javascript
const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')
setButton.addEventListener('click', () => {
  const title = titleInput.value
  window.electronAPI.setTitle(title)
})
```