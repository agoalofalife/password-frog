document.getElementById('togglePasswordCheckbox').addEventListener('change', function () {
    var x = document.getElementById("masterPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
});
