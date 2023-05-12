const counter = document.getElementById('counter')

window.electronAPI.handleCounter((event, value) => {
  const oldValue = Number(counter.innerText)
  const newValue = oldValue + value
  counter.innerText = newValue

  //Esto de aca es para retornar
  event.sender.send('counter-value', newValue)
})