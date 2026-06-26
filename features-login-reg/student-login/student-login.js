document.addEventListener("DOMContentLoaded", () => {
    if(typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

const loginForm = document.getElementById("student-secure-form");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        window.location.href = "../../student_dashboard/student.html";
    });
}

const forgotBtn = document.getElementById("forgot-btn");
if(forgotBtn) {
    forgotBtn.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Demo Prototype: Contact admin to reset password.");
    });
}
