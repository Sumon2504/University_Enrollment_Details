document.addEventListener("DOMContentLoaded", () => {
    // 1. Storage Initialization Guard Mocks
    if (!localStorage.getItem("studentProfile")) {
        localStorage.setItem("studentProfile", JSON.stringify({
            studentId: "10293",
            name: "Venkataramana Dadineni",
            email: "v.dadineni@university.edu",
            department: "Computer Science",
            contactNumber: "+91 98765 43210",
            enrollmentYear: "2026"
        }));
    }
    if (!localStorage.getItem("coursesMaster")) {
        localStorage.setItem("coursesMaster", JSON.stringify([
            { id: "CS-101", name: "Core Java", credits: 4, dept: "CSE" },
            { id: "CS-202", name: "RDBMS & SQL", credits: 3, dept: "CSE" },
            { id: "CS-301", name: "Web Technologies", credits: 4, dept: "CSE" }
        ]));
    }
    if (!localStorage.getItem("enrollments")) {
        localStorage.setItem("enrollments", JSON.stringify([
            { id: "ENR-101", courseId: "CS-101", status: "ENROLLED" }
        ]));
    }
    if (!localStorage.getItem("grades")) {
        localStorage.setItem("grades", JSON.stringify([
            { id: "G-01", courseId: "CS-101", studentId: "10293", grade: "A-", remarks: "Excellent performance." }
        ]));
    }

    // 2. View Switching Setup
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');

            const targetSection = this.getAttribute('data-target');
            sections.forEach(sec => {
                if(sec.getAttribute('id') === targetSection) {
                    sec.classList.add('active-view');
                } else {
                    sec.classList.remove('active-view');
                }
            });
            
            syncDashboardData();
            if(window.innerWidth <= 768) sidebar.classList.remove('open');
        });
    });

    if(menuToggle) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    }

    // 3. UI Sync Loop Engine
    function syncDashboardData() {
        const profile = JSON.parse(localStorage.getItem("studentProfile"));
        const courses = JSON.parse(localStorage.getItem("coursesMaster"));
        const enrollments = JSON.parse(localStorage.getItem("enrollments"));
        const grades = JSON.parse(localStorage.getItem("grades"));

        // Sync Profile Data Elements
        document.getElementById("view-name").innerText = profile.name;
        document.getElementById("view-id").innerText = "Student ID: " + profile.studentId;
        document.getElementById("view-email").innerText = profile.email;
        document.getElementById("view-dept").innerText = profile.department;
        document.getElementById("view-enroll").innerText = profile.enrollmentYear;
        document.getElementById("input-name").value = profile.name;
        document.getElementById("input-email").value = profile.email;
        document.getElementById("input-dept").value = profile.department;
        document.getElementById("input-contact").value = profile.contactNumber;

        // Sync Enrollment Tables
        const availableTable = document.getElementById("availableTable");
        const enrolledTable = document.getElementById("enrolledTable");
        if(availableTable && enrolledTable) {
            availableTable.innerHTML = "";
            enrolledTable.innerHTML = "";

            courses.forEach(c => {
                const isEnrolled = enrollments.some(e => e.courseId === c.id && e.status === "ENROLLED");
                if(!isEnrolled) {
                    availableTable.innerHTML += `<tr>
                        <td>${c.id}</td><td>${c.name}</td><td>${c.credits}</td>
                        <td><button class="btn btn-success" onclick="enrollCourse('${c.id}')">Enroll</button></td>
                    </tr>`;
                }
            });

            enrollments.forEach(e => {
                const c = courses.find(course => course.id === e.courseId);
                if(c && e.status === "ENROLLED") {
                    enrolledTable.innerHTML += `<tr>
                        <td>${c.id}</td><td>${c.name}</td>
                        <td><span class="badge badge-success">ENROLLED</span></td>
                        <td><button class="btn btn-danger" onclick="dropCourse('${e.id}')">Drop</button></td>
                    </tr>`;
                }
            });
        }

        // Sync Transcript Displays
        const transcriptBody = document.getElementById("transcriptBody");
        if(transcriptBody) {
            transcriptBody.innerHTML = "";
            grades.forEach(g => {
                const c = courses.find(course => course.id === g.courseId);
                if (c) {
                    transcriptBody.innerHTML += `<tr>
                        <td>${c.id}</td><td>${c.name}</td><td>${c.credits}</td><td><strong>${g.grade}</strong></td>
                    </tr>`;
                }
            });
        }
    }

    // 4. Form Submission Interceptor
    document.getElementById("profileForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const data = JSON.parse(localStorage.getItem("studentProfile"));
        data.name = document.getElementById("input-name").value;
        data.email = document.getElementById("input-email").value;
        data.department = document.getElementById("input-dept").value;
        data.contactNumber = document.getElementById("input-contact").value;
        localStorage.setItem("studentProfile", JSON.stringify(data));
        alert("Profile update successfully dispatched via updateProfile()!");
        syncDashboardData();
    });

    // 5. Global Scope Action Routines
    window.enrollCourse = (courseId) => {
        const enrollments = JSON.parse(localStorage.getItem("enrollments"));
        enrollments.push({ id: "ENR-" + Date.now(), courseId: courseId, status: "ENROLLED" });
        localStorage.setItem("enrollments", JSON.stringify(enrollments));
        alert("Enrollment finalized successfully through enrollCourse() rules.");
        syncDashboardData();
    };

    window.dropCourse = (enrollmentId) => {
        let enrollments = JSON.parse(localStorage.getItem("enrollments"));
        enrollments = enrollments.filter(e => e.id !== enrollmentId);
        localStorage.setItem("enrollments", JSON.stringify(enrollments));
        alert("Course section successfully discarded via dropCourse().");
        syncDashboardData();
    };

    // Run Initial Load Render
    syncDashboardData();
});