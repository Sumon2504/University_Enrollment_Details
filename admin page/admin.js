document.addEventListener("DOMContentLoaded", () => {
    initApp();
});
 
function initApp() {
    // Display hardcoded stats
    document.getElementById("stat-faculty").textContent = "3";
    document.getElementById("stat-courses").textContent = "2";
    document.getElementById("stat-students").textContent = "2";

    // Display static activity log
    const activityWrap = document.getElementById("dash-activity");
    if (activityWrap) {
        activityWrap.innerHTML = `
            <div class="activity-item">
                <div class="activity-dot" style="background-color:#10B981"></div>
                <div>
                    <div class="activity-text">System database initialized</div>
                    <div class="activity-time">Just now</div>
                </div>
            </div>
            <div class="activity-item">
                <div class="activity-dot" style="background-color:#2563EB"></div>
                <div>
                    <div class="activity-text">prathap added as faculty</div>
                    <div class="activity-time">5 mins ago</div>
                </div>
            </div>
        `;
    }

    // Populate static faculty records
    const facultyBody = document.getElementById("faculty-body");
    if (facultyBody) {
        facultyBody.innerHTML = `
            <tr>
                <td><strong>Dr. Ramesh Kumar</strong></td>
                <td style="color:#64748B">ramesh@uni.edu</td>
                <td><span class="badge badge-blue">Computer Science</span></td>
                <td>+91 98001 11111</td>
                <td><span class="badge badge-green">Active</span></td>
                <td><button class="btn btn-danger btn-sm" onclick="actionAlert()">Remove</button></td>
            </tr>
            <tr>
                <td><strong>Prof. Sunita Rao</strong></td>
                <td style="color:#64748B">sunita@uni.edu</td>
                <td><span class="badge badge-blue">Mathematics</span></td>
                <td>+91 98001 22222</td>
                <td><span class="badge badge-green">Active</span></td>
                <td><button class="btn btn-danger btn-sm" onclick="actionAlert()">Remove</button></td>
            </tr>
        `;
    }

    // Populate static course records
    const coursesBody = document.getElementById("courses-body");
    if (coursesBody) {
        coursesBody.innerHTML = `
            <tr>
                <td><strong>Introduction to Computer Science</strong></td>
                <td>4 cr</td>
                <td><span class="badge badge-blue">Computer Science</span></td>
                <td><span class="badge badge-amber">Fall 2024</span></td>
                <td>40</td>
                <td><button class="btn btn-danger btn-sm" onclick="actionAlert()">Remove</button></td>
            </tr>
            <tr>
                <td><strong>Data Structures & Algorithms</strong></td>
                <td>3 cr</td>
                <td><span class="badge badge-blue">Computer Science</span></td>
                <td><span class="badge badge-amber">Spring 2025</span></td>
                <td>35</td>
                <td><button class="btn btn-danger btn-sm" onclick="actionAlert()">Remove</button></td>
            </tr>
        `;
    }

    // Populate static student records
    const studentsBody = document.getElementById("students-body");
    if (studentsBody) {
        studentsBody.innerHTML = `
            <tr>
                <td><strong>Alice Johnson</strong></td>
                <td style="color:#64748B">alice@uni.edu</td>
                <td><span class="badge badge-blue">Computer Science</span></td>
                <td>2024</td>
                <td>+91 98000 11111</td>
                <td><button class="btn btn-danger btn-sm" onclick="actionAlert()">Remove</button></td>
            </tr>
            <tr>
                <td><strong>Sumon Ghosh</strong></td>
                <td style="color:#64748B">sumon@gmail.com</td>
                <td><span class="badge badge-blue">Information Technology</span></td>
                <td>2026</td>
                <td>7654365432</td>
                <td><button class="btn btn-danger btn-sm" onclick="actionAlert()">Remove</button></td>
            </tr>
        `;
    }
}

function getEl(id) {
  return document.getElementById(id);
}

function navigate(view, el) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
 
  getEl("view-" + view).classList.add("active");
  if (el) el.classList.add("active");
 
  const titles = {
    dashboard: "Dashboard",
    faculty:   "Faculty Management",
    courses:   "Course Catalog",
    students:  "Student Records"
  };
 
  getEl("page-title").textContent = titles[view];
  getEl("page-bc").textContent = "UniAMS Admin / " + titles[view];
}

function openModal(id) { getEl(id).classList.add("open"); }
function closeModal(id) { getEl(id).classList.remove("open"); }

document.querySelectorAll(".modal-overlay").forEach(overlay => {
  overlay.addEventListener("click", function(e) {
    if (e.target === this) closeModal(this.id);
  });
});

function saveFaculty() {
    closeModal("modal-faculty");
    actionAlert();
}

function saveCourse() {
    closeModal("modal-course");
    actionAlert();
}

function actionAlert() {
    alert("Demo Prototype Only");
}

function filterTable(tbodyId, query, cols) {
  const rows = getEl(tbodyId).getElementsByTagName("tr");
  const q = query.toLowerCase();
 
  Array.from(rows).forEach(row => {
    let text = "";
    cols.forEach(col => {
      if (row.cells[col]) text += row.cells[col].textContent + " ";
    });
    row.style.display = (text.toLowerCase().indexOf(q) !== -1) ? "" : "none";
  });
}
 
function filterTableByCol(tbodyId, val, col) {
  const rows = getEl(tbodyId).getElementsByTagName("tr");
  Array.from(rows).forEach(row => {
    const text = row.cells[col] ? row.cells[col].textContent : "";
    row.style.display = (!val || text.indexOf(val) !== -1) ? "" : "none";
  });
}