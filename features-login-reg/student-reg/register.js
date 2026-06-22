document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
});

function showError(groupId, errorId, message) {
    const group = document.getElementById(groupId);
    const error = document.getElementById(errorId);

    group.classList.add("error");
    error.textContent = message;
    error.classList.remove("hidden");
}

function clearErrors() {
    document.querySelectorAll(".form-group").forEach(g => g.classList.remove("error"));
    document.querySelectorAll(".field-error").forEach(e => e.classList.add("hidden"));
}

document.getElementById("registration-form").addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value;
    const confirm = document.getElementById("confirm-password").value;

    let valid = true;

    if (!name) {
        showError("name-group", "name-error", "Full name is required");
        valid = false;
    }

    if (!email || !email.includes("@")) {
        showError("email-group", "email-error", "Valid email is required");
        valid = false;
    }

    if (pass.length < 6) {
        showError("pass-group", "pass-error", "At least 6 characters required");
        valid = false;
    }

    if (pass !== confirm) {
        showError("confirm-group", "confirm-error", "Passwords do not match");
        valid = false;
    }

    if (!valid) return;

    document.getElementById("register-view").classList.add("hidden");
    document.getElementById("success-view").classList.remove("hidden");
});