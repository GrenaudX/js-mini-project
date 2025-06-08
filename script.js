window.addEventListener('load', function () {
  const path = window.location.pathname;
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  // Common elements
  const errorMessg    = document.getElementById("errorMessg");
  const doneMessg     = document.getElementById("doneMessg");
  const usernameField = document.getElementById("username");
  const emailField    = document.getElementById("email");
  const passwordField = document.getElementById("password");

  // Hide messages initially
  if (errorMessg) errorMessg.style.display = "none";
  if (doneMessg)  doneMessg.style.display = "none";

  // If already logged in, redirect away from login/register
  if (loggedInUser && (path.includes("login.html") || path.includes("register.html"))) {
    return location.href = "index.html";
  }

  // ----- “Must‑login” overlay on index sub‑pages (if not logged in) -----
  if (path.includes("index.html") && !loggedInUser) {
    const cnmssg        = document.querySelector(".cnmssg");
    const gridContainer = document.querySelector(".grid-container");
    if (gridContainer && cnmssg) {
      gridContainer.addEventListener("click", function(){
        cnmssg.textContent = "Vous devez vous connecter pour accéder à cette page.";
        cnmssg.style.display = "block";
        setTimeout(() => cnmssg.style.display = "none", 2000);
      });
    }
  }

  // ----- Index page UI for a logged‑in user -----
  if (path.includes("index.html") && loggedInUser) {
    const UserNAME        = document.querySelector('.UserNAME');
    const LogOutContainer = document.querySelector(".LogOutContainer");
    const Use_butto       = document.querySelectorAll(".Use_butto");
    const Rl              = document.querySelector('.Rl');

    if (UserNAME) {
      UserNAME.innerHTML = `Bienvenue, <strong>${loggedInUser.username}</strong>`;
      UserNAME.style.display = "block";
    }
    if (Rl)                Rl.style.display            = "none";
    if (LogOutContainer)   LogOutContainer.style.display = "none";
    if (Use_butto.length)  Use_butto.forEach(btn => btn.style.pointerEvents = "auto");

    // Toggle logout menu
    UserNAME.addEventListener("click", function(e){
      LogOutContainer.style.display = "block";
      UserNAME.style.display         = "none";
      e.stopPropagation();
    });
    window.addEventListener("click", function(){
      if (LogOutContainer.style.display === "block") {
        LogOutContainer.style.display = "none";
        UserNAME.style.display         = "block";
      }
    });
    LogOutContainer.addEventListener("click", function(){
      localStorage.removeItem("loggedInUser");
      location.reload();
    });
  }

  // ----------- Register Page ------------
  if (path.includes("register.html")) {
    const regBtn = document.getElementById("RegisteBtn");
    if (regBtn && usernameField && emailField && passwordField && errorMessg && doneMessg) {
      regBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const username = usernameField.value.trim();
        const email    = emailField.value.trim();
        const password = passwordField.value;

        if (users.some(u => u.email === email)) {
          errorMessg.textContent   = "Cet e-mail est déjà utilisé.";
          errorMessg.style.display = "block";
          return;
        }

        users.push({ username, email, password });
        localStorage.setItem("users", JSON.stringify(users));

        doneMessg.textContent   = "Le compte a été créé avec succès.";
        doneMessg.style.display = "block";
        setTimeout(() => location.href = "login.html", 1000);
      });
    }
  }

  // ----------- Login Page ------------
  if (path.includes("login.html")) {
    const loginBtn = document.getElementById("LoginBtn");
    if (loginBtn && emailField && passwordField && errorMessg && doneMessg) {
      loginBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const email    = emailField.value.trim();
        const password = passwordField.value;

        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem("loggedInUser", JSON.stringify({ username: user.username }));
          doneMessg.textContent   = "Vous avez connecté avec succès.";
          doneMessg.style.display = "block";
          setTimeout(() => location.href = "index.html", 1000);
        } else {
          errorMessg.textContent   = "Email ou mot de passe incorrect.";
          errorMessg.style.display = "block";
        }
      });
    }
  }
});
