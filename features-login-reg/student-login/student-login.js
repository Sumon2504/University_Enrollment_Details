/* ==========================================
   STUDENT LOGIN JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    if(typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

const API_URL = "http://localhost:3000";

function resetState(groupId) {
    const group = document.getElementById(groupId);
    if(group) group.classList.remove("error");
}

function showError(groupId, errorId, message) {
    const group = document.getElementById(groupId);
    const error = document.getElementById(errorId);

    if(group) group.classList.add("error");
    if(error) {
        error.textContent = message;
        error.classList.remove("hidden");
    }
}

document.getElementById("student-secure-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const uid = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value;
    const globalError = document.getElementById("global-error");
    const globalErrorText = document.getElementById("global-error-text");

    if (globalError) globalError.classList.add("hidden");

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

    try {
        // Fetch specific student by ID from db.json
        const response = await fetch(`${API_URL}/students?id=${uid}`);
        const users = await response.json();

        // Check if user exists and password matches
        if (users.length > 0 && users[0].password === pass) {

            const activeStudent = users[0];
            localStorage.setItem("activeUser", JSON.stringify({
                id: activeStudent.id,
                name: activeStudent.name,
                role: "student"
            }));
            window.location.href = "../../student_dashboard/student.html"; 

        } else {
            if (globalError) {
                globalError.classList.remove("hidden");
                globalErrorText.innerText = "Invalid credentials or user not found.";
            } else {
                alert("Invalid credentials or user not found.");
            }
        }
    } catch (error) {
        console.error("Database connection failed", error);
        if (globalError) {
            globalError.classList.remove("hidden");
            globalErrorText.innerText = "Cannot connect to the database.";
        } else {
            alert("Cannot connect to the database. Is json-server running?");
        }
    }
});

const forgotBtn = document.getElementById("forgot-btn");
if(forgotBtn) {
    forgotBtn.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Contact admin to reset password.");
    });
}