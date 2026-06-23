/* ==========================================
   UNIVERSITY AMS — ADMIN PANEL JAVASCRIPT
========================================== */

const API_URL = "http://localhost:3000";

let DB = {
  faculty: [],
  courses: [],
  students: [],
  activity: []
};
 
let pendingAction = null;

// Wait for HTML to load before running anything
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});
 
async function initApp() {
  try {
    const [facultyRes, coursesRes, studentsRes, activityRes] = await Promise.all([
      fetch(`${API_URL}/faculty`),
      fetch(`${API_URL}/courses`),
      fetch(`${API_URL}/students`),
      fetch(`${API_URL}/activity?_sort=id&_order=desc&_limit=8`) 
    ]);
 
    DB.faculty = await facultyRes.json();
    DB.courses = await coursesRes.json();
    DB.students = await studentsRes.json();
    DB.activity = await activityRes.json();
 
    renderAll();
  } catch (error) {
    console.error("Error fetching data:", error);
    showToast("Failed to connect to the database. Is json-server running?", "error");
  }
}
 
function getEl(id) {
  return document.getElementById(id);
}

/* ---------- NAVIGATION & MODALS ---------- */
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
 
  renderAll();
}

function openModal(id) { getEl(id).classList.add("open"); }
 
function closeModal(id) {
  getEl(id).classList.remove("open");
  clearForm(id);
}
 
function clearForm(id) {
  if (id === "modal-faculty") {
    getEl("fac-name").value    = "";
    getEl("fac-email").value   = "";
    getEl("fac-contact").value = "";
  }
  if (id === "modal-course") {
    getEl("crs-name").value    = "";
    getEl("crs-credits").value = 3;
    getEl("crs-seats").value   = 40;
  }
}
 
document.querySelectorAll(".modal-overlay").forEach(overlay => {
  overlay.addEventListener("click", function(e) {
    if (e.target === this) closeModal(this.id);
  });
});

/* ---------- CONFIRM DIALOG & TOAST ---------- */
function openConfirm(title, msg, action) {
  getEl("confirm-title").textContent = title;
  getEl("confirm-msg").textContent   = msg;
  pendingAction = action;
  getEl("confirm-overlay").classList.add("open");
}
 
function closeConfirm() {
  getEl("confirm-overlay").classList.remove("open");
  pendingAction = null;
}
 
function confirmAction() {
  if (pendingAction) pendingAction();
  closeConfirm();
}

function showToast(msg, type = "success") {
  const container = getEl("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
 
  const icon = type === "success" 
    ? `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>`
    : `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
 
  toast.innerHTML = icon + msg;
  container.appendChild(toast);
 
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ---------- CRUD OPERATIONS ---------- */
async function addActivity(text, color) {
  const newActivity = { text: text, time: "just now", color: color };
  try {
    await fetch(`${API_URL}/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newActivity)
    });
  } catch (error) {
    console.error("Failed to log activity", error);
  }
}
 
async function saveFaculty() {
  const name    = getEl("fac-name").value.trim();
  const email   = getEl("fac-email").value.trim();
  const dept    = getEl("fac-dept").value;
  const contact = getEl("fac-contact").value.trim();
 
  if (!name || !email) {
    showToast("Name and email are required", "error");
    return;
  }

  // Generate unique ID and default password
  const newFacultyId = "F" + Math.floor(1000 + Math.random() * 9000);
  const newFaculty = { 
    id: newFacultyId, 
    name: name, 
    email: email, 
    dept: dept, 
    contact: contact,
    password: "welcome123"
  };
 
  try {
    const response = await fetch(`${API_URL}/faculty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFaculty)
    });
 
    if (response.ok) {
      alert(`Success! ${name} has been registered.\n\nLogin ID: ${newFacultyId}\nPassword: welcome123`);
      showToast(`${name} added as faculty`);
      await addActivity(`${name} added as faculty`, "#2563EB");
      closeModal("modal-faculty");
      await initApp();
    }
  } catch (error) {
    showToast("Error saving to database", "error");
  }
}
 
function removeFaculty(id, name) {
  openConfirm(
    "Remove Faculty",
    `Remove ${name} from the system? Their course assignments may be affected.`,
    async () => {
      try {
        const response = await fetch(`${API_URL}/faculty/${id}`, { method: 'DELETE' });
        if (response.ok) {
          showToast(`${name} removed`, "error");
          await addActivity(`${name} removed from faculty`, "#EF4444");
          await initApp();
        }
      } catch (error) {
        showToast("Error deleting record", "error");
      }
    }
  );
}

async function saveCourse() {
  const name     = getEl("crs-name").value.trim();
  const credits  = parseInt(getEl("crs-credits").value);
  const dept     = getEl("crs-dept").value;
  const semester = getEl("crs-semester").value;
  const seats    = parseInt(getEl("crs-seats").value);
 
  if (!name) {
    showToast("Course name is required", "error");
    return;
  }
 
  const newCourse = { name, credits, dept, semester, seats };
 
  try {
    const response = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCourse)
    });
 
    if (response.ok) {
      showToast(`Course '${name}' added to catalog`);
      await addActivity(`Course '${name}' added to catalog`, "#10B981");
      closeModal("modal-course");
      await initApp();
    }
  } catch (error) {
    showToast("Error saving to database", "error");
  }
}
 
function removeCourse(id, name) {
  openConfirm(
    "Remove Course",
    `Remove '${name}' from the course catalog? Enrolled students will be affected.`,
    async () => {
      try {
        const response = await fetch(`${API_URL}/courses/${id}`, { method: 'DELETE' });
        if (response.ok) {
          showToast(`'${name}' removed from catalog`, "error");
          await addActivity(`Course '${name}' removed`, "#EF4444");
          await initApp();
        }
      } catch (error) {
        showToast("Error deleting record", "error");
      }
    }
  );
}

function removeStudent(id, name) {
  openConfirm(
    "Remove Student",
    `Remove ${name}'s record from the system? All their data will be lost.`,
    async () => {
      try {
        const response = await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
        if (response.ok) {
          showToast(`${name}'s record removed`, "error");
          await addActivity(`Student record for ${name} removed`, "#EF4444");
          await initApp();
        }
      } catch (error) {
        showToast("Error deleting record", "error");
      }
    }
  );
}

/* ---------- RENDERING ENGINE ---------- */
function renderAll() {
  renderDashboard();
  renderFaculty();
  renderCourses();
  renderStudents();
}
 
function renderDashboard() {
  getEl("stat-faculty").textContent  = DB.faculty.length;
  getEl("stat-courses").textContent  = DB.courses.length;
  getEl("stat-students").textContent = DB.students.length;
 
  let activityHTML = "";
  DB.activity.forEach(a => {
    activityHTML += `
      <div class="activity-item">
        <div class="activity-dot" style="background-color:${a.color}"></div>
        <div>
          <div class="activity-text">${a.text}</div>
          <div class="activity-time">${a.time}</div>
        </div>
      </div>`;
  });
  getEl("dash-activity").innerHTML = activityHTML;
}
 
function renderFaculty() {
  const tbody = getEl("faculty-body");
  if (DB.faculty.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><p>No faculty records found</p></div></td></tr>`;
    return;
  }
  
  let html = "";
  DB.faculty.forEach(f => {
    const safeName = f.name.replace(/'/g, "\\'");
    html += `
      <tr>
        <td><strong>${f.name}</strong></td>
        <td style="color:#64748B">${f.email}</td>
        <td><span class="badge badge-blue">${f.dept}</span></td>
        <td>${f.contact}</td>
        <td><span class="badge badge-green">Active</span></td>
        <td><button class="btn btn-danger btn-sm" onclick="removeFaculty('${f.id}', '${safeName}')">Remove</button></td>
      </tr>`;
  });
  tbody.innerHTML = html;
}
 
function renderCourses() {
  const tbody = getEl("courses-body");
  if (DB.courses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><p>No courses in catalog</p></div></td></tr>`;
    return;
  }

  let html = "";
  DB.courses.forEach(c => {
    const safeName = c.name.replace(/'/g, "\\'");
    html += `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td>${c.credits} cr</td>
        <td><span class="badge badge-blue">${c.dept}</span></td>
        <td><span class="badge badge-amber">${c.semester}</span></td>
        <td>${c.seats}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeCourse('${c.id}', '${safeName}')">Remove</button></td>
      </tr>`;
  });
  tbody.innerHTML = html;
}
 
function renderStudents() {
  const tbody = getEl("students-body");
  if (DB.students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><p>No student records found</p></div></td></tr>`;
    return;
  }

  let html = "";
  DB.students.forEach(s => {
    const safeName = s.name.replace(/'/g, "\\'");
    html += `
      <tr>
        <td><strong>${s.name}</strong></td>
        <td style="color:#64748B">${s.email}</td>
        <td><span class="badge badge-blue">${s.dept}</span></td>
        <td>${s.year || 'N/A'}</td>
        <td>${s.contact || 'N/A'}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeStudent('${s.id}', '${safeName}')">Remove</button></td>
      </tr>`;
  });
  tbody.innerHTML = html;
}
 
/* ---------- FILTER FUNCTIONS ---------- */
function filterTable(tbodyId, query, cols) {
  const rows = getEl(tbodyId).getElementsByTagName("tr");
  const q = query.toLowerCase();
 
  Array.from(rows).forEach(row => {
    if (row.cells.length === 1) return; // Skip empty state
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
    if (row.cells.length === 1) return; // Skip empty state
    const text = row.cells[col] ? row.cells[col].textContent : "";
    row.style.display = (!val || text.indexOf(val) !== -1) ? "" : "none";
  });
}