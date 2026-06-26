document.addEventListener("DOMContentLoaded", () => {
    if(typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

const registrationForm = document.getElementById("registration-form");
if (registrationForm) {
    registrationForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Registration Successful!");
        window.location.href = "../student-login/student-login.html";
    });
}