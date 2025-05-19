document.addEventListener("DOMContentLoaded", function () {
  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const html = document.documentElement;

  // Check for saved user preference or use system preference
  const savedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  html.classList.add(savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener("click", () => {
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      updateThemeIcon("light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      updateThemeIcon("dark");
    }
  });

  function updateThemeIcon(theme) {
    if (theme === "dark") {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    } else {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    }
  }

  // Tab switching functionality
  const loginTab = document.getElementById("login-tab");
  const registerTab = document.getElementById("register-tab");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  loginTab.addEventListener("click", () => {
    loginTab.classList.add(
      "text-primary-600",
      "dark:text-primary-500",
      "border-primary-500",
      "dark:border-primary-400"
    );
    loginTab.classList.remove(
      "text-gray-500",
      "dark:text-gray-400",
      "border-transparent"
    );
    registerTab.classList.remove(
      "text-primary-600",
      "dark:text-primary-500",
      "border-primary-500",
      "dark:border-primary-400"
    );
    registerTab.classList.add(
      "text-gray-500",
      "dark:text-gray-400",
      "border-transparent"
    );
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
  });

  registerTab.addEventListener("click", () => {
    registerTab.classList.add(
      "text-primary-600",
      "dark:text-primary-500",
      "border-primary-500",
      "dark:border-primary-400"
    );
    registerTab.classList.remove(
      "text-gray-500",
      "dark:text-gray-400",
      "border-transparent"
    );
    loginTab.classList.remove(
      "text-primary-600",
      "dark:text-primary-500",
      "border-primary-500",
      "dark:border-primary-400"
    );
    loginTab.classList.add(
      "text-gray-500",
      "dark:text-gray-400",
      "border-transparent"
    );
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  });

  // Password visibility toggle
  const toggleLoginPassword = document.getElementById("toggle-login-password");
  const loginPassword = document.getElementById("login-password");
  const toggleRegisterPassword = document.getElementById(
    "toggle-register-password"
  );
  const registerPassword = document.getElementById("register-password");

  toggleLoginPassword.addEventListener("click", function () {
    const type =
      loginPassword.getAttribute("type") === "password" ? "text" : "password";
    loginPassword.setAttribute("type", type);
    this.innerHTML =
      type === "password"
        ? '<i class="fas fa-eye"></i>'
        : '<i class="fas fa-eye-slash"></i>';
  });

  toggleRegisterPassword.addEventListener("click", function () {
    const type =
      registerPassword.getAttribute("type") === "password"
        ? "text"
        : "password";
    registerPassword.setAttribute("type", type);
    this.innerHTML =
      type === "password"
        ? '<i class="fas fa-eye"></i>'
        : '<i class="fas fa-eye-slash"></i>';
  });

  // Form submission (you would replace this with actual form handling)
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // Add your login logic here
    console.log("Login form submitted");
  });

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // Add your registration logic here
    console.log("Register form submitted");
  });
});
