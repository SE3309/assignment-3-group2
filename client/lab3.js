const createCourse = document.getElementById('createcoursebutton');
const courseList = document.getElementById('courselist');
const addMembersCourseList = document.getElementById('courselistmember');
const memberSheet = document.getElementById('addmembers');
const editCourse = document.getElementById('courseedit');
const editcourse = document.getElementById('editcourse');
const addSheet = document.getElementById('addsheet');
const courseCodeSelect = document.getElementById('sheetcoursecode');
const editSheet = document.getElementById('editsheetname');
const editSheets = document.getElementById('editsheet');
const deleteSheetButton = document.getElementById('deletesheetbutton');
let cTitle = document.getElementById('coursetitle');
let cCode = document.getElementById('coursecode');
let cSection = document.getElementById('coursesection');

// COURSE MANAGEMENT
function addCourse() {
    const codeRegex = /^(?:[1-9]|[1-9][0-9]|[1-9][0-9]{2}|[1-9][0-9]{3})$/;
    const titleRegex = /^.{0,100}$/;
    const sectionRegex = /^([1-9]|[1-9][0-9])$/;
    if (cTitle.value == "" || cCode.value == "") return;
    if (!titleRegex.test(cTitle.value)) {
        alert("Must be 100 characters or less.");
        return;
    } else if (!codeRegex.test(cCode.value)) {
        alert("Must be a number from 1-9999.");
        return;
    } else if (!sectionRegex.test(cSection.value)) {
        alert("Must be a number from 1-99.");
        return;
    }

    let courseInfo = {
        courseTitle: cTitle.value,
        courseCode: cCode.value,
        courseSection: cSection.value,
        members: [],
    };

    fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseInfo),
    });

    cTitle.value = "";
    cCode.value = "";
    cSection.value = "";

    fetchCourses();
}

async function fetchCourses() {
    try {
        const res = await fetch('/api/courses');
        const courses = await res.json();
        courseList.innerHTML = "";
        addMembersCourseList.innerHTML = "";

        courseList.appendChild(document.createElement('option'));
        addMembersCourseList.appendChild(document.createElement('option'));
        courseCodeSelect.appendChild(document.createElement('option'));

        courses.forEach(course => {
            const options = () => {
                const option = document.createElement('option');
                    option.textContent = course.courseTitle;
                return option;
            }

            const codes = () => {
                const option2 = document.createElement('option');
                    option2.textContent = course.courseCode;
                return option2;
            }
            courseList.appendChild(options());
            addMembersCourseList.appendChild(options());
            courseCodeSelect.appendChild(codes());
        });
    } catch (err) {
        console.log("Error (Loading Courses in Dropdown): " + err);
    }
}

function selectCourse() {
    editCourse.hidden = (courseList.value === "");      
}

async function editSelected() {
    const res = await fetch('/api/courses');
    const courses = await res.json();
    let selectedCourse = courseList.value;
    let course;

    for (const c of courses) {
        if (c.courseTitle === selectedCourse) {
            course = c;
            break;
        }
    }

    const br = document.createElement('br');
    const panel = document.createElement('div');
        panel.id = 'editPanel';

    const courseTit = document.createElement("input");
        courseTit.id = "editcoursetitle";
        courseTit.placeholder = course.courseTitle;
        courseTit.hidden = false;
    const courseCo = document.createElement("input");
        courseCo.id = "editcoursecode";
        courseCo.placeholder = course.courseCode;
        courseCo.hidden = false;
    const courseSec = document.createElement("input");
        courseSec.id = "editcoursesection";
        courseSec.placeholder = course.courseSection;
        courseSec.hidden = false;
    const save = document.createElement('button');
        save.id = "saveedit";
        save.textContent = "Save";
        save.hidden = false;
        save.addEventListener('click', saveCourseEdit);
    const del = document.createElement('button');
        del.id = "deletecourse";
        del.textContent = "Delete";
        del.hidden = false;
        del.addEventListener('click', deleteEditedCourse);

    panel.append(courseTit, courseCo, courseSec, br, save, del);
    editcourse.appendChild(panel);
}

async function saveCourseEdit() {
    let newTitle = document.getElementById('editcoursetitle').value;
    let newCode = document.getElementById('editcoursecode').value;
    let newSection = document.getElementById('editcoursesection').value;

    const resList = await fetch('/api/courses');
    const courses = await resList.json();

    let oldCourse = courses.find(c => c.courseTitle === courseList.value);
    let newCourse = {
        courseTitle: newTitle,
        courseCode: newCode,
        courseSection: newSection,
    }

    const res = await fetch(`/api/courses/${encodeURIComponent(oldCourse.courseTitle)}/${encodeURIComponent(oldCourse.courseCode)}/${encodeURIComponent(oldCourse.courseSection)}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
    });

    document.getElementById('editPanel').remove();
    await fetchCourses();
}

async function deleteEditedCourse() {
    try {
        const resList = await fetch('/api/courses');
        const courses = await resList.json();
        
        const course = courses.find(c => c.courseTitle === courseList.value);

        const res = await fetch(`/api/courses/${encodeURIComponent(course.courseTitle)}/${encodeURIComponent(course.courseCode)}/${encodeURIComponent(course.courseSection)}`, {
            method: 'DELETE',
        });

        if (res.status == 204) {
            const panel = document.getElementById('editPanel');
            if (panel) { panel.remove(); }
            await fetchCourses();
        } else { console.log('Error (Delete Member): ' + res.status); }
    } catch (err) {
        console.log("Error (Deleting Course): " + err);
        alert("Couldn't Delete Course.");
    }
}

async function addMemberMenu() {
    const panel = document.createElement('div');
        panel.id = 'memberspanel';

        const resList = await fetch('/api/courses');
        const courses = await resList.json();
        const course = courses.find(c => c.courseTitle === addMembersCourseList.value);
    
    const memberFirstName = document.createElement('input');
        memberFirstName.id = 'memberfirstname';
        memberFirstName.placeholder = 'First Name'
    const memberLastName = document.createElement('input');
        memberLastName.id = 'memberlastname';
        memberLastName.placeholder = 'Last Name'
    const addMemberButton = document.createElement('button');
        addMemberButton.id = 'addmember';
        addMemberButton.textContent = 'Add'
        addMemberButton.addEventListener('click', onAddMember);
    const removeMemberButton = document.createElement('button');
        removeMemberButton.id = "removemember";
        removeMemberButton.textContent = "Remove";
        removeMemberButton.addEventListener('click', onRemoveMember);
    const removeMemberDropdown = document.createElement('select');
        removeMemberDropdown.id = "removememberdropdown";
        removeMemberDropdown.appendChild(document.createElement('option'));
        (course.members || []).forEach(m => {
            const option = document.createElement('option');
                option.value = m.id;
                option.textContent = m.id; 
                option.placeholder = "Choose member to delete";
                removeMemberDropdown.appendChild(option) ;     
        });
    const currentMembersLabel = document.createElement('h3');
        currentMembersLabel.id = "currentmemberlabel";
        currentMembersLabel.textContent = "Current Members:";
    const memberList = document.createElement('ol');
        course.members.forEach(m => {
            const listItem = document.createElement('li');
            listItem.id = "m." + m.id;
                listItem.textContent = `${m.firstName} ${m.lastName}: ${m.id}`;
            memberList.appendChild(listItem);
        });


    panel.append(memberFirstName, memberLastName, addMemberButton, document.createElement('br'), removeMemberDropdown, removeMemberButton,
                 document.createElement('br'), currentMembersLabel, memberList);
    memberSheet.appendChild(panel);
}

async function onAddMember() {
    let firstName = document.getElementById('memberfirstname').value;
    let lastName = document.getElementById('memberlastname').value;
    let role = "Student";

    const resList = await fetch('/api/courses');
    const courses = await resList.json();
    const currentCourse = courses.find(c => c.courseTitle === addMembersCourseList.value);

    if (!firstName || !lastName) {
        alert("Input First and Last Name");
        return;
    }

    const res = await fetch(`/api/courses/${encodeURIComponent(currentCourse.courseTitle)}/${encodeURIComponent(currentCourse.courseCode)}/${encodeURIComponent(currentCourse.courseSection)}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ firstName, lastName, role }),
    });

    if (!res.ok) {
    const text = await res.text();
    console.error('[AddMember] failed', res.status, text);
    alert(`Failed to add member (${res.status})`);
    return;
  }

    document.getElementById('memberspanel').remove();
    await fetchCourses(); 
}

async function onRemoveMember() {
    const removeMemberDropdown = document.getElementById('removememberdropdown');
    const memberID = removeMemberDropdown.value;

    const resList = await fetch('/api/courses');
    const courses = await resList.json();
    const currentCourse = courses.find(c => c.courseTitle === addMembersCourseList.value);

    const member = currentCourse.members.find(m => m.id === memberID);

    const res = await fetch(`/api/courses/${encodeURIComponent(currentCourse.courseTitle)}/${encodeURIComponent(currentCourse.courseCode)}/${encodeURIComponent(currentCourse.courseSection)}/members/${encodeURIComponent(memberID)}`, {
        method: 'DELETE',
    });

    document.getElementById('memberspanel').remove();
    await fetchCourses();
}

// SHEET MANAGEMENT
async function fetchSheets() {
    try {
        const res = await fetch('/api/sheets');
        const sheets = await res.json();
        editSheet.innerHTML = "";
        editSheet.appendChild(document.createElement('option'));

        sheets.forEach(s => {
            const options = () => {
                const option = document.createElement('option');
                    option.textContent = s.assignmentName;
                    return option;
            }
            editSheet.appendChild(options());
        })
    } catch (err) {
        console.log("Error (Loading Sheets): " + err);
    }
}
function addSheetsMenu() {
    const restOfForm = document.getElementById('aftercode');
    if (courseCodeSelect.value != "") { restOfForm.hidden = false; } 
    else { restOfForm.hidden = true; }
}

async function addSheets() {
    const assnName = document.getElementById('sheetname');
    const restOfForm = document.getElementById('aftercode');
    const sect = document.getElementById('sheetcoursesection');
    const start = document.getElementById('sheetstartdate');
    const end = document.getElementById('sheetenddate');


    const sheet = {
        assignmentName: assnName.value,
        courseCode: courseCodeSelect.value,
        section: sect.value,
        startDate: start.value,
        endDate: end.value,
    };

    if (assnName.value == "" || sect.value == "" || start.value == "" || end.value == "") return alert('All fields must be filled');

    const res = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sheet),
    });

    if (!res.ok) {
        const text = await res.text();
        console.log('[AddMember] failed', res.status, text);
    }

    [assnName, courseCodeSelect, sect, start, end].forEach(option => {
        option.value = "";
    });

    courseCodeSelect.innerHTML = "";
    await fetchCourses();
    await fetchSheets();
    restOfForm.hidden = true;
}

function selectSheet() {
    deleteSheetButton.hidden = (editSheet.value === "");
}

async function deleteSheet() {
    const resList = await fetch('/api/sheets');
    const sheets = await resList.json();
    const sheet = sheets.find(s => s.assignmentName === editSheet.value);

    const res = await fetch(`/api/sheets/${encodeURIComponent(sheet.id)}`, {
        method: 'DELETE'
    });
    deleteSheetButton.hidden = true;
    await fetchSheets();
}

fetchCourses();
fetchSheets();

createCourse.addEventListener('click', addCourse);
courseList.addEventListener('change', selectCourse);
editCourse.addEventListener('click', editSelected);
addMembersCourseList.addEventListener('change', addMemberMenu);
courseCodeSelect.addEventListener('change', addSheetsMenu);
addSheet.addEventListener('click', addSheets);
editSheet.addEventListener('change', selectSheet);
deleteSheetButton.addEventListener('click', deleteSheet);