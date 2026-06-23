/* ==========================================
   STUDENT DASHBOARD JAVASCRIPT (JSON API)
========================================== */

const API_URL = "http://localhost:3000";
let activeStudentId = null;

// Global state variables for the dashboard
let studentProfile = {};
let allCourses = [];
let studentEnrollments = [];
let studentGrades = [];

// --- 1. SESSION PROTECTION & INIT ---
document.addEventListener("DOMContentLoaded", () => {
    const sessionData = localStorage.getItem("activeUser");
    
    // Check if logged in and is a student
    if (!sessionData) {
        // FIXED PATH: Go up one folder, then into features-login-reg
        window.location.href = "../features-login-reg/student-login/student.html"; 
        return;
    }

    const currentUser = JSON.parse(sessionData);
    if (currentUser.role !== "student") {
        // FIXED PATH: Go up one folder, then into features-login-reg
        window.location.href = "../features-login-reg/faculty-login/faculty.html"; 
        return;
    }

    // Save the ID so we can use it to fetch data
    activeStudentId = currentUser.id;

    // Load initial data and set up UI
    setupNavigation();
    loadDashboardData();
});


// --- 2. FETCH DATA FROM SERVER ---
async function loadDashboardData() {
    try {
        // Fetch profile, available courses, this student's enrollments, and grading data
        const [profileRes, coursesRes, enrollmentsRes, gradingRes] = await Promise.all([
            fetch(`${API_URL}/students/${activeStudentId}`),
            fetch(`${API_URL}/courses`),
            fetch(`${API_URL}/enrollments?studentId=${activeStudentId}`), // Only get this student's enrollments
            fetch(`${API_URL}/courseGrading`)
        ]);

        studentProfile = await profileRes.json();
        allCourses = await coursesRes.json();
        studentEnrollments = await enrollmentsRes.json();
        const allGrading = await gradingRes.json();

        // Extract this specific student's grades from the Faculty's courseGrading data
        studentGrades = [];
        allGrading.forEach(course => {
            const studentRecord = course.students.find(s => s.id === activeStudentId);
            // If the student is in the roster AND the faculty gave them a grade
            if (studentRecord && studentRecord.grade && studentRecord.grade !== "") {
                studentGrades.push({
                    courseId: course.id,
                    courseName: course.name,
                    grade: studentRecord.grade,
                    remarks: studentRecord.remarks
                });
            }
        });

        syncDashboardUI();

    } catch (error) {
        console.error("Error loading dashboard data:", error);
        alert("Failed to connect to the database. Is JSON Server running?");
    }
}


// --- 3. UI SYNC & RENDER ---
function syncDashboardUI() {
    // Sync Profile Data Elements
    document.getElementById("view-name").innerText = studentProfile.name || "N/A";
    document.getElementById("view-id").innerText = "Student ID: " + studentProfile.id;
    document.getElementById("view-email").innerText = studentProfile.email || "N/A";
    document.getElementById("view-dept").innerText = studentProfile.department || "Unassigned";
    document.getElementById("view-enroll").innerText = studentProfile.enrollmentYear || "2024"; // Default if not set
    
    // Pre-fill Update Profile Form
    document.getElementById("input-name").value = studentProfile.name || "";
    document.getElementById("input-email").value = studentProfile.email || "";
    document.getElementById("input-dept").value = studentProfile.department || "";
    document.getElementById("input-contact").value = studentProfile.contactNumber || "";

    // Sync Enrollment Tables
    const availableTable = document.getElementById("availableTable");
    const enrolledTable = document.getElementById("enrolledTable");
    
    if(availableTable && enrolledTable) {
        availableTable.innerHTML = "";
        enrolledTable.innerHTML = "";

        // Available Courses (Courses the student is NOT enrolled in)
        allCourses.forEach(c => {
            const isEnrolled = studentEnrollments.some(e => String(e.courseId) === String(c.id));
            if(!isEnrolled) {
                availableTable.innerHTML += `<tr>
                    <td>${c.id}</td>
                    <td>${c.name}</td>
                    <td>${c.credits}</td>
                    <td><button class="btn btn-success" onclick="enrollCourse('${c.id}')">Enroll</button></td>
                </tr>`;
            }
        });

        // Enrolled Courses
        studentEnrollments.forEach(e => {
            const c = allCourses.find(course => String(course.id) === String(e.courseId));
            if(c) {
                enrolledTable.innerHTML += `<tr>
                    <td>${c.id}</td>
                    <td>${c.name}</td>
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
        if (studentGrades.length === 0) {
            transcriptBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px;">No grades published yet.</td></tr>`;
        } else {
            studentGrades.forEach(g => {
                transcriptBody.innerHTML += `<tr>
                    <td>${g.courseId}</td>
                    <td>${g.courseName}</td>
                    <td><strong>${g.grade}</strong></td>
                    <td style="color: #64748B;">${g.remarks}</td>
                </tr>`;
            });
        }
    }
}


// --- 4. DATA MUTATIONS (POST/PUT/DELETE) ---

// Update Profile
document.getElementById("profileForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Keep existing data (like passwords) but update form fields
    const updatedData = {
        ...studentProfile,
        name: document.getElementById("input-name").value,
        email: document.getElementById("input-email").value,
        department: document.getElementById("input-dept").value,
        contactNumber: document.getElementById("input-contact").value
    };

    try {
        const response = await fetch(`${API_URL}/students/${activeStudentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert("Profile updated successfully!");
            loadDashboardData(); // Refresh everything
        }
    } catch (error) {
        alert("Error saving profile update.");
    }
});

// Enroll in Course
window.enrollCourse = async (courseId) => {
    try {
        const response = await fetch(`${API_URL}/enrollments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId: activeStudentId,
                courseId: courseId,
                status: "ENROLLED"
            })
        });

        if (response.ok) {
            alert("Enrollment finalized successfully.");
            loadDashboardData(); // Refresh UI
        }
    } catch (error) {
        alert("Error enrolling in course.");
    }
};

// Drop Course
window.dropCourse = async (enrollmentId) => {
    if(!confirm("Are you sure you want to drop this course?")) return;

    try {
        const response = await fetch(`${API_URL}/enrollments/${enrollmentId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Course successfully dropped.");
            loadDashboardData(); // Refresh UI
        }
    } catch (error) {
        alert("Error dropping course.");
    }
};


// --- 5. NAVIGATION SETUP ---
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Handle Logout
            if (this.id === "logout-btn") {
                localStorage.removeItem("activeUser");
                // FIXED PATH: Go up one folder, then into features-login-reg
                window.location.href = "../features-login-reg/student-login/student.html";
                return;
            }

            // Normal Navigation
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