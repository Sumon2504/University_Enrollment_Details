
const courseData = {
    "CS101": { 
        name: "Introduction to Computer Science", 
        students: [
            { id: "S101", name: "Alice Johnson", grade: "", remarks: "" },
            { id: "S102", name: "Bob Smith", grade: "", remarks: "" },
            { id: "S105", name: "Edward Elric", grade: "", remarks: "" }
        ]
    },
    "CS202": { 
        name: "Data Structures & Algorithms", 
        students: [
            { id: "S103", name: "Charlie Brown", grade: "", remarks: "" },
            { id: "S104", name: "Diana Prince", grade: "", remarks: "" }
        ]
    }
};


document.addEventListener('DOMContentLoaded', () => {
    initializeSelectionListOptions();
    refreshCourseDetailsDisplay();
    syncRecordsTable();
    registerResponsiveMenuHandler();
});


function initializeSelectionListOptions() {
    const selectorMenu = document.getElementById("courseSelect");
    if (!selectorMenu) return;

    for (let courseKey in courseData) {
        let optionNode = document.createElement("option");
        optionNode.value = courseKey;
        optionNode.innerText = `${courseKey} - ${courseData[courseKey].name}`;
        selectorMenu.appendChild(optionNode);
    }
}


function switchActivePanel(panelId) {
   
    document.querySelectorAll('.dashboard-view-panel').forEach(view => view.classList.remove('active'));
    document.querySelectorAll('.nav-link-item').forEach(link => link.classList.remove('active'));
    
   
    const targetedPanel = document.getElementById(panelId);
    const targetedNavLink = document.getElementById('nav-' + panelId);
    
    if (targetedPanel) targetedPanel.classList.add('active');
    if (targetedNavLink) targetedNavLink.classList.add('active');

    
    const sideMenu = document.getElementById('sidebarMenu');
    if (sideMenu) sideMenu.classList.remove('open');
}


function refreshCourseDetailsDisplay() {
    const chosenCourseKey = document.getElementById("courseSelect").value;
    const dataNode = courseData[chosenCourseKey];
    const targetDetailsNode = document.getElementById("courseDetails");
    
    if (!dataNode || !targetDetailsNode) return;

    targetDetailsNode.innerHTML = `
        <strong>Selected Instructional Branch:</strong> ${dataNode.name} <br>
        <strong>Roster Matrix Configuration:</strong> ${dataNode.students.length} Student Profiles Ready For Manual Valuation Entry
    `;
}


function navigateToGradingWorkspace() {
    const chosenCourseKey = document.getElementById("courseSelect").value;
    const dataNode = courseData[chosenCourseKey];
    const studentTableContainer = document.getElementById("studentTable");

    if (!dataNode || !studentTableContainer) return;

    document.getElementById("activeCourseBadgeIndicator").innerText = `Course Grid: ${chosenCourseKey}`;

    let workspaceHTML = "";
    dataNode.students.forEach((student, arrayIndex) => {

        const hasExistingData = student.grade !== "";
        const buttonText = hasExistingData ? "🔄 Update Node" : "💾 Save Entry";
        const buttonClass = hasExistingData ? "btn-action-update" : "btn-action-commit";

        workspaceHTML += `
            <tr>
                <td><code>${student.id}</code></td>
                <td style="font-weight: 600;">${student.name}</td>
                <td>
                    <input type="text" class="table-editable-input" 
                           id="grade-${arrayIndex}" value="${student.grade}" placeholder="Grade (e.g. 1-10)">
                </td>
                <td>
                    <input type="text" class="table-editable-input" 
                           id="remark-${arrayIndex}" value="${student.remarks}" placeholder="Enter Remarks">
                </td>
                <td style="text-align: center;">
                    <button class="${buttonClass}" id="btn-${arrayIndex}" onclick="commitInputDataRowState('${chosenCourseKey}', ${arrayIndex})">
                        ${buttonText}
                    </button>
                </td>
            </tr>
        `;
    });
    
    studentTableContainer.innerHTML = workspaceHTML;

    switchActivePanel('grading');
}

function navigateToRecordsWorkspace() {
    
    switchActivePanel('records');
}


function commitInputDataRowState(courseKey, studentArrayIndex) {
    const manualGradeValue = document.getElementById(`grade-${studentArrayIndex}`).value.trim();
    const manualRemarkValue = document.getElementById(`remark-${studentArrayIndex}`).value.trim();
    
    const student = courseData[courseKey].students[studentArrayIndex];
    const isAnUpdate = student.grade !== "";

    student.grade = manualGradeValue || "N/A";
    student.remarks = manualRemarkValue || "No feedback logged.";
    
   
    if (isAnUpdate) {
        alert(`Records modified! Updated entry matrix log for ${student.name}.`);
    } else {
        alert(`Manual evaluation committed successfully for entry: ${student.name}`);
    }

   
    const actionButton = document.getElementById(`btn-${studentArrayIndex}`);
    if (actionButton) {
        actionButton.innerText = "🔄 Update Node";
        actionButton.className = "btn-action-update";
    }

    syncRecordsTable(); 
}

function syncRecordsTable() {
    const recordsTableContainer = document.getElementById("recordTable");
    if (!recordsTableContainer) return;

    let compiledLedgerHTML = "";
    let entriesDetected = false;

    for (let courseKey in courseData) {
        courseData[courseKey].students.forEach(student => {
            
            if (student.grade !== "") {
                entriesDetected = true;
                compiledLedgerHTML += `
                    <tr>
                        <td><code>${student.id}</code></td>
                        <td style="font-weight: 600;">${student.name}</td>
                        <td><code>${courseKey}</code> ${courseData[courseKey].name}</td>
                        <td><span class="saved-success-tag">${student.grade}</span></td>
                        <td class="text-muted">${student.remarks}</td>
                    </tr>
                `;
            }
        });
    }

    if (!entriesDetected) {
        compiledLedgerHTML = `<tr><td colspan="5" style="text-align: center; color: #64748b; padding: 1.75rem;">No manual metrics recorded yet. Archive trace sequence empty.</td></tr>`;
    }

    recordsTableContainer.innerHTML = compiledLedgerHTML;
}

function executeClientSideSearch(searchQueryString) {
    let standardQueryText = searchQueryString.toLowerCase();
    let rowsToAnalyze = document.querySelectorAll("#recordTable tr");
    
    rowsToAnalyze.forEach(rowElement => {
        let elementTextSignature = rowElement.innerText.toLowerCase();
        rowElement.style.display = elementTextSignature.includes(standardQueryText) ? "" : "none";
    });
}

function registerResponsiveMenuHandler() {
    const toggleButtonElement = document.getElementById('menuToggle');
    const sideNavigationMenuNode = document.getElementById('sidebarMenu');

    if (toggleButtonElement && sideNavigationMenuNode) {
        toggleButtonElement.addEventListener('click', () => {
            sideNavigationMenuNode.classList.toggle('open');
        });
    }
}