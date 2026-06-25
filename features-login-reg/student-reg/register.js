

document.addEventListener("DOMContentLoaded", () => {
    if(typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

const API_URL = "http://localhost:3000";

function showError(groupId, errorId, message) {
    const group = document.getElementById(groupId);
    const error = document.getElementById(errorId);
    if(group) group.classList.add("error");
    if(error) { error.textContent = message; error.classList.remove("hidden"); }
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
    if (!name) { showError("name-group", "name-error", "Full name is required"); valid = false; }
    if (!email || !email.includes("@")) { showError("email-group", "email-error", "Valid email is required"); valid = false; }
    if (pass.length < 6) { showError("pass-group", "pass-error", "At least 6 characters required"); valid = false; }
    if (pass !== confirm) { showError("confirm-group", "confirm-error", "Passwords do not match"); valid = false; }
    if (!valid) return;

    try {

        const res = await fetch(`${API_URL}/students`);
        const currentStudents = await res.json();
        
        let nextNum = 102; 
        if (currentStudents.length > 0) {
            const ids = currentStudents.map(s => parseInt(s.id.replace("S", "")) || 100);
            nextNum = Math.max(...ids) + 1;
        }
        const newStudentId = "S" + nextNum;

        const newStudent = {
            id: newStudentId,
            name: name,
            email: email,
            department: "Unassigned",
            contactNumber: "",
            enrollmentYear: "2026",
            password: pass
        };

        const response = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        });

        if (response.ok) {
            document.getElementById("register-view").classList.add("hidden");
            document.getElementById("success-view").classList.remove("hidden");
            
            const successMsg = document.createElement("p");
            successMsg.style.marginTop = "10px";
            successMsg.innerHTML = `<strong>Your Assigned Student ID is: ${newStudentId}</strong><br>Redirecting to login portal...`;
            document.getElementById("success-view").appendChild(successMsg);

            setTimeout(() => {
                window.location.href = "../student-login/student.html"; 
            }, 4000);
        } else {
            alert("Error saving record to database backend.");
        }
    } catch (error) {
        console.error("Database connection failed", error);
        alert("Cannot connect to the database. Make sure your json-server terminal is open on port 3000.");
    }
});