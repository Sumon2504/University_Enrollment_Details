document.addEventListener("DOMContentLoaded", () => {
    if(typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

const loginForm = document.getElementById("faculty-secure-form");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        window.location.href = "../../faculty_dashboard/Faculty.html";
    });
}

const forgotLink = document.getElementById("forgot-link");
if (forgotLink) {
    forgotLink.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Demo Prototype: Please contact the administrator to reset your password.");
    });
}