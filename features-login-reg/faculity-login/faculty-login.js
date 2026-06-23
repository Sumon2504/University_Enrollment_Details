document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
});

const API_URL = "http://localhost:3000";

function resetState(groupId) {
    const group = document.getElementById(groupId);
    group.classList.remove("error");
}

function showError(groupId, errorId, msg) {
    const group = document.getElementById(groupId);
    const err = document.getElementById(errorId);

    group.classList.add("error");
    err.textContent = msg;
    err.classList.remove("hidden");
}

document.getElementById("faculty-secure-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const uid = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value;
    const globalError = document.getElementById("global-error");
    const globalErrorText = document.getElementById("global-error-text");

    globalError.classList.add("hidden");

    let valid = true;

    if (!uid) {
        showError("user-group", "user-error", "Faculty ID required");
        valid = false;
    }
    if (!pass) {
        showError("pass-group", "pass-error", "Password required");
        valid = false;
    }
    if (!valid) return;

    try {
        // 1. Check if the user typed an email (contains '@') or an ID
        const searchParam = uid.includes('@') ? 'email' : 'id';

        // 2. Fetch specific faculty member by ID or Email from db.json
        const response = await fetch(`${API_URL}/faculty?${searchParam}=${uid}`);
        const users = await response.json();

        // Check if user exists and password matches
        if (users.length > 0 && users[0].password === pass) {
            
            // Success! Save session to localStorage
            const activeFaculty = users[0];
// ... rest of your code stays exactly the same
            localStorage.setItem("activeUser", JSON.stringify({
                id: activeFaculty.id,
                name: activeFaculty.name,
                role: "faculty"
            }));

            // Redirect to the actual dashboard HTML page
            window.location.href = "../../faculty_dashboard/Faculty.html"; // Update with your actual dashboard filename

        } else {
            globalError.classList.remove("hidden");
            globalErrorText.innerText = "Incorrect username or password.";
        }
    } catch (error) {
        console.error("Database connection failed", error);
        globalError.classList.remove("hidden");
        globalErrorText.innerText = "Cannot connect to the database.";
    }
});

document.getElementById("forgot-link").addEventListener("click", (e) => {
    e.preventDefault();
    alert("Please contact the administrator to reset your password.");
});