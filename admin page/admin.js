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