document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
});

const API_URL = "http://localhost:3000";

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

document.getElementById("registration-form").addEventListener("submit", async function (e) {
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

    // Generate a simple unique ID for the new student (e.g., S8492)
    const newStudentId = "S" + Math.floor(1000 + Math.random() * 9000);

    const newStudent = {
        id: newStudentId,
        name: name,
        email: email,
        password: pass,
        department: "Unassigned" 
    };

    try {
        // Save to db.json
        const response = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        });

        if (response.ok) {
            document.getElementById("register-view").classList.add("hidden");
            document.getElementById("success-view").classList.remove("hidden");
            
            // Add the generated ID to the success screen so the student knows their login ID
            const successMsg = document.createElement("p");
            successMsg.style.marginTop = "10px";
            successMsg.innerHTML = `<strong>Your Student ID is: ${newStudentId}</strong><br>Redirecting to login...`;
            document.getElementById("success-view").appendChild(successMsg);

            // Redirect to the login page after 4 seconds
            setTimeout(() => {
                window.location.href = "../student-login/student-login.html"; // Update with your actual login HTML filename
            }, 2000);
        } else {
            alert("Error registering student.");
        }
    } catch (error) {
        console.error("Database connection failed", error);
        alert("Cannot connect to the database. Is json-server running?");
    }
});