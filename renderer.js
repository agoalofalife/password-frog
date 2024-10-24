document.getElementById("saveButton").addEventListener("click", (event) => {
    const textInApp = document.getElementById("textToEncrypt").value;
    window.electronAPI.sendText(textInApp);
  });