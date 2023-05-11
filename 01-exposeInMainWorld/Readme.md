# Preload a Renderer 

## contextBridge.exposeInMainWorld

1) En este ejemplo tenemos que el main ejecuta la parte de front de la aplicación

2) El preload.js se encarga de exponer las funciones al renderer, esta parte puede accerder a nodejs, nosotros especificamos exactamante que se ejecutará.

## ¿Cómo se conectan?

1) El main invoca al preload.js 

2) En el preload.js configuramos lo que se expondrá al renderer.js

3) El html lo conectamos a nuestro renderer.js

4) En el renderer.js invocamos el objeto con el nombre escrito en el preload.js 

 ### Preload.js
```Javascript
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
})
```
### Renderer.js
``` JavaScript
const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`
```
