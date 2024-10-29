document.getElementById("saveButton").addEventListener("click", (event) => {
    const textInApp = document.getElementById("textToEncrypt").value;
    window.electronAPI.sendText(textInApp);
  });

// call method form preload.js and install text from textarea in app
window.electronAPI.loadText().then(text => {
  document.getElementById("textToEncrypt").value = text;
});
//for interaction with button for encrypt
document.getElementById("EncryptButton").addEventListener("click", () => {
  const textToEncrypt = document.getElementById("textToEncrypt").value;
  window.electronAPI.textEncrypt(textToEncrypt);
});
