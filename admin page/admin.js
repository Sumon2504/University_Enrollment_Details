var DB = {
  faculty: [
    { id: 1, name: "Dr. Ramesh Kumar",   email: "ramesh@uni.edu",  dept: "Computer Science", contact: "+91 98001 11111" },
    { id: 2, name: "Prof. Sunita Rao",   email: "sunita@uni.edu",  dept: "Mathematics",      contact: "+91 98001 22222" },
    { id: 3, name: "Dr. Anil Verma",     email: "anil@uni.edu",    dept: "Physics",          contact: "+91 98001 33333" },
    { id: 4, name: "Prof. Kavitha Nair", email: "kavitha@uni.edu", dept: "Business",         contact: "+91 98001 44444" },
    { id: 5, name: "Dr. Suresh Pillai",  email: "suresh@uni.edu",  dept: "Engineering",      contact: "+91 98001 55555" }
  ],
  courses: [
    { id: 1, name: "Data Structures & Algorithms", credits: 4, dept: "Computer Science", semester: "Fall 2024",   seats: 40 },
    { id: 2, name: "Calculus II",                  credits: 3, dept: "Mathematics",      semester: "Spring 2025", seats: 35 },
    { id: 3, name: "Quantum Mechanics",            credits: 4, dept: "Physics",          semester: "Fall 2024",   seats: 25 },
    { id: 4, name: "Thermodynamics",               credits: 3, dept: "Engineering",      semester: "Spring 2025", seats: 30 },
    { id: 5, name: "Business Analytics",           credits: 3, dept: "Business",         semester: "Summer 2025", seats: 45 },
    { id: 6, name: "Operating Systems",            credits: 4, dept: "Computer Science", semester: "Spring 2025", seats: 38 }
  ],
  students: [
    { id: 1, name: "Aisha Khan",   email: "aisha@uni.edu",  dept: "Computer Science", year: 2022, contact: "+91 98000 11111" },
    { id: 2, name: "Rohan Desai",  email: "rohan@uni.edu",  dept: "Mathematics",      year: 2023, contact: "+91 98000 22222" },
    { id: 3, name: "Priya Nair",   email: "priya@uni.edu",  dept: "Physics",          year: 2021, contact: "+91 98000 33333" },
    { id: 4, name: "Arjun Sharma", email: "arjun@uni.edu",  dept: "Engineering",      year: 2022, contact: "+91 98000 44444" },
    { id: 5, name: "Meera Iyer",   email: "meera@uni.edu",  dept: "Business",         year: 2024, contact: "+91 98000 55555" }
  ],
  activity: [
    { text: "Dr. Ramesh Kumar added as faculty",          time: "2 min ago",  color: "#2563EB" },
    { text: "Course 'Operating Systems' added to catalog", time: "1 hr ago",   color: "#10B981" },
    { text: "Student record for Priya Nair removed",      time: "3 hr ago",   color: "#EF4444" },
    { text: "Prof. Kavitha Nair added as faculty",        time: "Yesterday",  color: "#2563EB" },
    { text: "Course 'Business Analytics' added",          time: "2 days ago", color: "#10B981" }
  ],
  nextFacultyId: 6,
  nextCourseId: 7
};
 
var pendingAction = null;
 

function getEl(id) {
  return document.getElementById(id);
}
 

function navigate(view, el) {
  var views = document.querySelectorAll(".view");
  var navItems = document.querySelectorAll(".nav-item");
 
  for (var i = 0; i < views.length; i++) {
    views[i].classList.remove("active");
  }
  for (var j = 0; j < navItems.length; j++) {
    navItems[j].classList.remove("active");
  }
 
  getEl("view-" + view).classList.add("active");
  if (el) {
    el.classList.add("active");
  }
 
  var titles = {
    dashboard: "Dashboard",
    faculty:   "Faculty Management",
    courses:   "Course Catalog",
    students:  "Student Records"
  };
 
  getEl("page-title").textContent = titles[view];
  getEl("page-bc").textContent = "UniAMS Admin / " + titles[view];
 
  renderAll();
}
 

function openModal(id) {
  getEl(id).classList.add("open");
}
 
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
 

var overlays = document.querySelectorAll(".modal-overlay");
for (var i = 0; i < overlays.length; i++) {
  overlays[i].addEventListener("click", function(e) {
    if (e.target === this) {
      closeModal(this.id);
    }
  });
}
 

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
  if (pendingAction) {
    pendingAction();
  }
  closeConfirm();
}
 

function showToast(msg, type) {
  if (!type) {
    type = "success";
  }
 
  var container = getEl("toast-container");
  var toast = document.createElement("div");
  toast.className = "toast " + type;
 
  var icon = "";
  if (type === "success") {
    icon = '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>';
  } else {
    icon = '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
  }
 
  toast.innerHTML = icon + msg;
  container.appendChild(toast);
 
  setTimeout(function() {
    toast.classList.add("show");
  }, 10);
 
  setTimeout(function() {
    toast.classList.remove("show");
    setTimeout(function() {
      toast.remove();
    }, 300);
  }, 3000);
}
 

function addActivity(text, color) {
  DB.activity.unshift({ text: text, time: "just now", color: color });
  if (DB.activity.length > 8) {
    DB.activity.pop();
  }
}
 

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
 
  var activityHTML = "";
  for (var i = 0; i < DB.activity.length; i++) {
    var a = DB.activity[i];
    activityHTML +=
      '<div class="activity-item">' +
        '<div class="activity-dot" style="background-color:' + a.color + '"></div>' +
        '<div>' +
          '<div class="activity-text">' + a.text + '</div>' +
          '<div class="activity-time">' + a.time + '</div>' +
        '</div>' +
      '</div>';
  }
  getEl("dash-activity").innerHTML = activityHTML;
}
 

function renderFaculty(data) {
  var list = data || DB.faculty;
  var html = "";
 
  if (list.length === 0) {
    html =
      '<tr><td colspan="6">' +
        '<div class="empty-state">' +
          '<svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' +
          '<p>No faculty records found</p>' +
        '</div>' +
      '</td></tr>';
  } else {
    for (var i = 0; i < list.length; i++) {
      var f = list[i];
      html +=
        '<tr>' +
          '<td><strong>' + f.name + '</strong></td>' +
          '<td style="color:#64748B">' + f.email + '</td>' +
          '<td><span class="badge badge-blue">' + f.dept + '</span></td>' +
          '<td>' + f.contact + '</td>' +
          '<td><span class="badge badge-green">Active</span></td>' +
          '<td>' +
            '<button class="btn btn-danger btn-sm" onclick="removeFaculty(' + f.id + ')">' +
              '<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/></svg>' +
              ' Remove' +
            '</button>' +
          '</td>' +
        '</tr>';
    }
  }
 
  getEl("faculty-body").innerHTML = html;
}
 

function renderCourses(data) {
  var list = data || DB.courses;
  var html = "";
 
  if (list.length === 0) {
    html =
      '<tr><td colspan="6">' +
        '<div class="empty-state">' +
          '<svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M4 19V7a2 2 0 012-2h12a2 2 0 012 2v12"/></svg>' +
          '<p>No courses in catalog</p>' +
        '</div>' +
      '</td></tr>';
  } else {
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      html +=
        '<tr>' +
          '<td><strong>' + c.name + '</strong></td>' +
          '<td>' + c.credits + ' cr</td>' +
          '<td><span class="badge badge-blue">' + c.dept + '</span></td>' +
          '<td><span class="badge badge-amber">' + c.semester + '</span></td>' +
          '<td>' + c.seats + '</td>' +
          '<td>' +
            '<button class="btn btn-danger btn-sm" onclick="removeCourse(' + c.id + ')">' +
              '<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/></svg>' +
              ' Remove' +
            '</button>' +
          '</td>' +
        '</tr>';
    }
  }
 
  getEl("courses-body").innerHTML = html;
}
 

function renderStudents(data) {
  var list = data || DB.students;
  var html = "";
 
  if (list.length === 0) {
    html =
      '<tr><td colspan="6">' +
        '<div class="empty-state">' +
          '<svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>' +
          '<p>No student records found</p>' +
        '</div>' +
      '</td></tr>';
  } else {
    for (var i = 0; i < list.length; i++) {
      var s = list[i];
      html +=
        '<tr>' +
          '<td><strong>' + s.name + '</strong></td>' +
          '<td style="color:#64748B">' + s.email + '</td>' +
          '<td><span class="badge badge-blue">' + s.dept + '</span></td>' +
          '<td>' + s.year + '</td>' +
          '<td>' + s.contact + '</td>' +
          '<td>' +
            '<button class="btn btn-danger btn-sm" onclick="removeStudent(' + s.id + ')">' +
              '<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/></svg>' +
              ' Remove' +
            '</button>' +
          '</td>' +
        '</tr>';
    }
  }
 
  getEl("students-body").innerHTML = html;
}
 

function saveFaculty() {
  var name    = getEl("fac-name").value.trim();
  var email   = getEl("fac-email").value.trim();
  var dept    = getEl("fac-dept").value;
  var contact = getEl("fac-contact").value.trim();
 
  if (!name || !email) {
    showToast("Name and email are required", "error");
    return;
  }
 
  var newFaculty = {
    id:      DB.nextFacultyId,
    name:    name,
    email:   email,
    dept:    dept,
    contact: contact
  };
 
  DB.faculty.push(newFaculty);
  DB.nextFacultyId = DB.nextFacultyId + 1;
 
  showToast(name + " added as faculty");
  addActivity(name + " added as faculty", "#2563EB");
 
  closeModal("modal-faculty");
  renderAll();
}
 
function removeFaculty(id) {
  var faculty = null;
  for (var i = 0; i < DB.faculty.length; i++) {
    if (DB.faculty[i].id === id) {
      faculty = DB.faculty[i];
      break;
    }
  }
 
  openConfirm(
    "Remove Faculty",
    "Remove " + faculty.name + " from the system? Their course assignments may be affected.",
    function() {
      var updated = [];
      for (var i = 0; i < DB.faculty.length; i++) {
        if (DB.faculty[i].id !== id) {
          updated.push(DB.faculty[i]);
        }
      }
      DB.faculty = updated;
      showToast(faculty.name + " removed", "error");
      addActivity(faculty.name + " removed from faculty", "#EF4444");
      renderAll();
    }
  );
}
 

function saveCourse() {
  var name     = getEl("crs-name").value.trim();
  var credits  = parseInt(getEl("crs-credits").value);
  var dept     = getEl("crs-dept").value;
  var semester = getEl("crs-semester").value;
  var seats    = parseInt(getEl("crs-seats").value);
 
  if (!name) {
    showToast("Course name is required", "error");
    return;
  }
 
  var newCourse = {
    id:       DB.nextCourseId,
    name:     name,
    credits:  credits,
    dept:     dept,
    semester: semester,
    seats:    seats
  };
 
  DB.courses.push(newCourse);
  DB.nextCourseId = DB.nextCourseId + 1;
 
  showToast("Course '" + name + "' added to catalog");
  addActivity("Course '" + name + "' added to catalog", "#10B981");
 
  closeModal("modal-course");
  renderAll();
}
 
function removeCourse(id) {
  var course = null;
  for (var i = 0; i < DB.courses.length; i++) {
    if (DB.courses[i].id === id) {
      course = DB.courses[i];
      break;
    }
  }
 
  openConfirm(
    "Remove Course",
    "Remove '" + course.name + "' from the course catalog? Enrolled students will be affected.",
    function() {
      var updated = [];
      for (var i = 0; i < DB.courses.length; i++) {
        if (DB.courses[i].id !== id) {
          updated.push(DB.courses[i]);
        }
      }
      DB.courses = updated;
      showToast("'" + course.name + "' removed from catalog", "error");
      addActivity("Course '" + course.name + "' removed", "#EF4444");
      renderAll();
    }
  );
}
 

function removeStudent(id) {
  var student = null;
  for (var i = 0; i < DB.students.length; i++) {
    if (DB.students[i].id === id) {
      student = DB.students[i];
      break;
    }
  }
 
  openConfirm(
    "Remove Student",
    "Remove " + student.name + "'s record from the system? All their enrollment and grade data will be lost.",
    function() {
      var updated = [];
      for (var i = 0; i < DB.students.length; i++) {
        if (DB.students[i].id !== id) {
          updated.push(DB.students[i]);
        }
      }
      DB.students = updated;
      showToast(student.name + "'s record removed", "error");
      addActivity("Student record for " + student.name + " removed", "#EF4444");
      renderAll();
    }
  );
}
 

function filterTable(tbodyId, query, cols) {
  var tbody = getEl(tbodyId);
  var rows  = tbody.getElementsByTagName("tr");
  var q     = query.toLowerCase();
 
  for (var i = 0; i < rows.length; i++) {
    var text = "";
    for (var j = 0; j < cols.length; j++) {
      var cell = rows[i].cells[cols[j]];
      if (cell) {
        text += cell.textContent + " ";
      }
    }
    if (text.toLowerCase().indexOf(q) !== -1) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
}
 
function filterTableByCol(tbodyId, val, col) {
  var tbody = getEl(tbodyId);
  var rows  = tbody.getElementsByTagName("tr");
 
  for (var i = 0; i < rows.length; i++) {
    var cell = rows[i].cells[col];
    var text = cell ? cell.textContent : "";
    if (!val || text.indexOf(val) !== -1) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
}
 

renderAll();