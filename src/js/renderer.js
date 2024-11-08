document.getElementById("saveButton").addEventListener("click", (event) => {
    const textInApp = document.getElementById("textToEncrypt").value;
    window.electronAPI.sendText(textInApp);
  });

// call method form preload.js and install text from textarea in app
window.electronAPI.loadText().then(text => {
  document.getElementById("textToEncrypt").value = text;
});

document.getElementById("encryptButton").addEventListener("click", async (event) => {
  const textInApp = document.getElementById("textToEncrypt").value;
  if (textInApp) {

      try {
          await window.electronAPI.encryptText({ text: textInApp });
      } catch (error) {
          console.error('Error during encryption:', error);
      }
  } else {
      alert("Please enter text for encrypt.");
  }
});