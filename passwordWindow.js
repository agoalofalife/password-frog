document.querySelector('.passwordWindowForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('masterPassword').value;
    // Use the exposed API to send the password
    window.electronAPI.submitPassword(password);
  });
  