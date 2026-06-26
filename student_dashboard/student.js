document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    setupHardcodedData();
});

function setupHardcodedData() {
    // Fill profile fields
    const profile = {
        name: "Alice Johnson",
        id: "S101",
        email: "alice@uni.edu",
        dept: "Computer Science",
        enroll: "2024",
        contact: "+91 98000 11111"
    };

    const vName = document.getElementById("view-name");
    if (vName) vName.innerText = profile.name;
    const vId = document.getElementById("view-id");
    if (vId) vId.innerText = "Student ID: " + profile.id;
    const vEmail = document.getElementById("view-email");
    if (vEmail) vEmail.innerText = profile.email;
    const vDept = document.getElementById("view-dept");
    if (vDept) vDept.innerText = profile.dept;
    const vEnroll = document.getElementById("view-enroll");
    if (vEnroll) vEnroll.innerText = profile.enroll;

    const iName = document.getElementById("input-name");
    if (iName) iName.value = profile.name;
    const iEmail = document.getElementById("input-email");
    if (iEmail) iEmail.value = profile.email;
    const iDept = document.getElementById("input-dept");
    if (iDept) iDept.value = profile.dept;
    const iContact = document.getElementById("input-contact");
    if (iContact) iContact.value = profile.contact;

    // Fill Enrollment Tables
    const availableTable = document.getElementById("availableTable");
    if (availableTable) {
        availableTable.innerHTML = `
            <tr>
                <td>CS202</td>
                <td>Data Structures & Algorithms</td>
                <td>3</td>
                <td><button class="btn btn-success" onclick="actionAlert()">Enroll</button></td>
            </tr>
        `;
    }

    const enrolledTable = document.getElementById("enrolledTable");
    if (enrolledTable) {
        enrolledTable.innerHTML = `
            <tr>
                <td>CS101</td>
                <td>Introduction to Computer Science</td>
                <td><span class="badge badge-success">ENROLLED</span></td>
                <td><button class="btn btn-danger" onclick="actionAlert()">Drop</button></td>
            </tr>
        `;
    }

    // Fill Transcript Table
    const transcriptBody = document.getElementById("transcriptBody");
    if (transcriptBody) {
        transcriptBody.innerHTML = `
            <tr>
                <td>CS101</td>
                <td>Introduction to Computer Science</td>
                <td><strong>A</strong></td>
                <td style="color: #64748B;">SLIGHT IMPROVEMENT NEEDED</td>
            </tr>
        `;
    }

    // Bind form submit
    const profileForm = document.getElementById("profileForm");
    if (profileForm) {
        profileForm.addEventListener("submit", (e) => {
            e.preventDefault();
            actionAlert();
        });
    }
}

window.actionAlert = function() {
    alert("Prototype Demo");
};

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (this.id === "logout-btn") {
                window.location.href = "../features-login-reg/student-login/student-login.html";
                return;
            }
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');

            const targetSection = this.getAttribute('data-target');
            if (targetSection) {
                sections.forEach(sec => {
                    if(sec.getAttribute('id') === targetSection) {
                        sec.classList.add('active-view');
                    } else {
                        sec.classList.remove('active-view');
                    }
                });
            }
            if(window.innerWidth <= 768 && sidebar) sidebar.classList.remove('open');
        });
    });

    if(menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
}