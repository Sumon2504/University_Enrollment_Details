document.addEventListener('DOMContentLoaded', () => {
    registerResponsiveMenuHandler();
    initializeStaticData();
});

function initializeStaticData() {
    // Populate course select menu
    const selectorMenu = document.getElementById("courseSelect");
    if (selectorMenu) {
        selectorMenu.innerHTML = `
            <option value="CS101">CS101 - Introduction to Computer Science</option>
            <option value="CS202">CS202 - Data Structures & Algorithms</option>
        `;
    }
    
    refreshCourseDetailsDisplay();
    syncRecordsTable();
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
    const targetDetailsNode = document.getElementById("courseDetails");
    if (targetDetailsNode) {
        targetDetailsNode.innerHTML = `
            <strong>Selected Instructional Branch:</strong> Introduction to Computer Science <br>
            <strong>Roster Matrix Configuration:</strong> 1 Student Profiles Ready For Manual Valuation Entry
        `;
    }
}

function navigateToGradingWorkspace() {
    const studentTableContainer = document.getElementById("studentTable");
    if (studentTableContainer) {
        document.getElementById("activeCourseBadgeIndicator").innerText = "Course Grid: CS101";
        studentTableContainer.innerHTML = `
            <tr>
                <td><code>S101</code></td>
                <td style="font-weight: 600;">Alice Johnson</td>
                <td>
                    <input type="text" class="table-editable-input" id="grade-0" value="A" placeholder="Grade">
                </td>
                <td>
                    <input type="text" class="table-editable-input" id="remark-0" value="SLIGHT IMPROVEMENT NEEDED" placeholder="Remarks">
                </td>
                <td style="text-align: center;">
                    <button class="btn-action-update" onclick="commitInputDataRowState()">
                        🔄 Update Node
                    </button>
                </td>
            </tr>
        `;
    }
    switchActivePanel('grading');
}

function navigateToRecordsWorkspace() {
    switchActivePanel('records');
}

function commitInputDataRowState() {
    alert("Demo Prototype Only");
}

function syncRecordsTable() {
    const recordsTableContainer = document.getElementById("recordTable");
    if (recordsTableContainer) {
        recordsTableContainer.innerHTML = `
            <tr>
                <td><code>S101</code></td>
                <td style="font-weight: 600;">Alice Johnson</td>
                <td><code>CS101</code> Introduction to Computer Science</td>
                <td><span class="saved-success-tag">A</span></td>
                <td class="text-muted">SLIGHT IMPROVEMENT NEEDED</td>
            </tr>
        `;
    }
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
