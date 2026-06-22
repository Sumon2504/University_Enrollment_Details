document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
});

// Fake DB
const systemRegistryLogs = {
    userId: "student123",
    password: "password123"
};

// Reset errors
function resetState(groupId) {
    const group = document.getElementById(groupId);
    group.classList.remove("error");
}

// Show field error
function showError(groupId, errorId, message) {
    const group = document.getElementById(groupId);
    const error = document.getElementById(errorId);

    group.classList.add("error");
    error.textContent = message;
    error.classList.remove("hidden");
}

// Form submit
document.getElementById("student-secure-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const uid = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value;
    const globalError = document.getElementById("global-error");

    globalError.classList.add("hidden");

    let valid = true;

    if (!uid) {
        showError("user-group", "user-error", "Student ID required");
        valid = false;
    }

    if (!pass) {
        showError("pass-group", "pass-error", "Password required");
        valid = false;
    }

    if (!valid) return;

    // Faculty restriction
    if (uid === "faculty123") {
        globalError.classList.remove("hidden");
        document.getElementById("global-error-text").innerText =
            "Access Denied: Faculty login not allowed.";
        return;
    }

    // Auth
    if (uid === systemRegistryLogs.userId && pass === systemRegistryLogs.password) {
        document.getElementById("login-view").classList.add("hidden");
        document.getElementById("dashboard-view").classList.remove("hidden");

        document.getElementById("dash-text").innerText =
            "Welcome " + uid;
    } else {
        globalError.classList.remove("hidden");
        document.getElementById("global-error-text").innerText =
            "Invalid credentials.";
    }
});

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
    document.getElementById("dashboard-view").classList.add("hidden");
    document.getElementById("login-view").classList.remove("hidden");
    document.getElementById("student-secure-form").reset();
});

// Forgot password
document.getElementById("forgot-btn").addEventListener("click", (e) => {
    e.preventDefault();
    alert("Contact admin to reset password.");
});
