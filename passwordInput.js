// Verify that SJCL is loaded
console.log('SJCL loaded:', typeof sjcl !== 'undefined');

document.getElementById('passwordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredPassword = document.getElementById('passwordInput').value;

    // Use the exposed API to verify the password
    window.electronAPI.verifyPassword(enteredPassword);
});

// Handle incorrect password feedback
window.electronAPI.onPasswordIncorrect(() => {
    alert('Incorrect password. Please try again.');
});
