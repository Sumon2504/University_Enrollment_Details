document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
});

const systemRegistryLogs = {
    userId: "faculty123",
    password: "password123"
};

// Reset error
function resetState(groupId) {
    const group = document.getElementById(groupId);
    group.classList.remove("error");
}

// Show error
function showError(groupId, errorId, msg) {
    const group = document.getElementById(groupId);
    const err = document.getElementById(errorId);

    group.classList.add("error");
    err.textContent = msg;
    err.classList.remove("hidden");
}

// Form submit
document.getElementById("faculty-secure-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const uid = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value;
    const globalError = document.getElementById("global-error");

    globalError.classList.add("hidden");

    let valid = true;

    if (!uid) {
        showError("user-group", "user-error", "Username required");
        valid = false;
    }

    if (!pass) {
        showError("pass-group", "pass-error", "Password required");
        valid = false;
    }

    if (!valid) return;

    if (uid === "student123") {
        globalError.classList.remove("hidden");
        document.getElementById("global-error-text").innerText =
            "Access Denied: Student login not allowed.";
        return;
    }

    if (uid === systemRegistryLogs.userId && pass === systemRegistryLogs.password) {
        document.getElementById("login-view").classList.add("hidden");
        document.getElementById("dashboard-view").classList.remove("hidden");

        document.getElementById("dash-text").innerText =
            "Secure session initialized for " + uid;
    } else {
        globalError.classList.remove("hidden");
        document.getElementById("global-error-text").innerText =
            "Incorrect username or password.";
    }
});

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
    document.getElementById("dashboard-view").classList.add("hidden");
    document.getElementById("login-view").classList.remove("hidden");
    document.getElementById("faculty-secure-form").reset();
});

// Forgot password
document.getElementById("forgot-link").addEventListener("click", (e) => {
    e.preventDefault();
    alert("Please contact the administrator to reset your password.");
});