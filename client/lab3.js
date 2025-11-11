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
const editSlot = document.getElementById('editslotname');
const editSlotSection = document.getElementById('editslot');
const deleteSlotButton = document.getElementById('deleteslotbutton');
const signupSheet = document.getElementById('signupsheet');
const signupSlotNumber = document.getElementById('signupslotnumber');
const signupMemberId = document.getElementById('signupmemberid');
const signupButton = document.getElementById('signupbutton');
const cancelSignupSheet = document.getElementById('cancelsignupsheet');
const cancelSignupMemberId = document.getElementById('cancelsignupmemberid');
const cancelSignupButton = document.getElementById('cancelsignupbutton');
const slotIdInput = document.getElementById('slotidinput');
const getSlotMembersButton = document.getElementById('getslotmembers');
const slotMembersOut = document.getElementById('slotmembersout');
const gradeSheet = document.getElementById('gradesheet');
const gradeMember = document.getElementById('grademember');
const gradeValue = document.getElementById('gradevalue');
const gradeComment = document.getElementById('gradecomment');
const submitGradeButton = document.getElementById('submitgrade');
const gradeOut = document.getElementById('gradeout');
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
        courseCodeSelect.innerHTML = "";

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

    const oldPanel = document.getElementById('editPanel');
    if (oldPanel) oldPanel.remove();

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

    const codeRegex = /^(?:[1-9]|[1-9][0-9]|[1-9][0-9]{2}|[1-9][0-9]{3})$/;
    const titleRegex = /^.{0,100}$/;
    const sectionRegex = /^([1-9]|[1-9][0-9])$/;
    if (cTitle.value == "" || newCode.value == "") return;
    if (!titleRegex.test(newTitle.value)) {
        alert("Must be 100 characters or less.");
        return;
    } else if (!codeRegex.test(newCode.value)) {
        alert("Must be a number from 1-9999.");
        return;
    } else if (!sectionRegex.test(newSection.value)) {
        alert("Must be a number from 1-99.");
        return;
    }

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
    const oldPanel = document.getElementById('memberspanel');
    if (oldPanel) oldPanel.remove();


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
    const roleSelect = document.createElement('select');
        roleSelect.id = 'memberrole';
        roleSelect.appendChild(document.createElement('option')); // empty
        ['Student','TA','Admin'].forEach(r => {
            const o = document.createElement('option');
            o.value = r;
            o.textContent = r;
            roleSelect.appendChild(o);
        });
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
                listItem.textContent = `${m.firstName} ${m.lastName}: ${m.id} (${m.role || 'Student'})`;
            memberList.appendChild(listItem);
        });


    panel.append(memberFirstName, memberLastName, roleSelect, addMemberButton, document.createElement('br'), removeMemberDropdown, removeMemberButton,
                 document.createElement('br'), currentMembersLabel, memberList);
    memberSheet.appendChild(panel);
}

async function onAddMember() {
    let firstName = document.getElementById('memberfirstname').value;
    let lastName = document.getElementById('memberlastname').value;
    let roleEl = document.getElementById('memberrole');
    let role = roleEl ? roleEl.value : '';

    const resList = await fetch('/api/courses');
    const courses = await resList.json();
    const currentCourse = courses.find(c => c.courseTitle === addMembersCourseList.value);

    if (!firstName || !lastName) {
        alert("Input First and Last Name");
        return;
    }

    if (!role || !['Student','TA','Admin'].includes(role)) {
        alert('Choose a role: Student, TA, or Admin.');
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
        });

        (sheets || []).forEach(sheet => {
        (sheet.slots || []).forEach(sl => {
            const opt = document.createElement('option');
            opt.value = sl.id;
            opt.textContent = `${sheet.assignmentName || sheet.id} — #${sl.numSlot}`;
            slotIdInput.appendChild(opt);
        });
        });
        await populateSignupSheetSelects(sheets);
        populateGradeSheetSelect(sheets)
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

    const assignmentNameRegex = /^.{1,100}$/;
    if (!assignmentNameRegex.test(assnName.value)) {
        alert("Assignment name must be 1-100 characters.");
        return;
    }

    const sheet = {
        assignmentName: assnName.value,
        courseCode: courseCodeSelect.value,
        section: sect.value,
        startDate: start.value,
        endDate: end.value,
        slots: [],
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

async function selectSheet() {
    deleteSheetButton.hidden = (editSheet.value === "");

    const oldPanel = document.getElementById('sheetspanel');
    if (oldPanel) oldPanel.remove();

    if (editSheet.value === "") return;

    const resList = await fetch('/api/sheets');
    const sheets = await resList.json();
    const sheet = sheets.find(s => s.assignmentName === editSheet.value);
    const panel = document.createElement('div');
        panel.id = 'sheetspanel';

    const currentSheetLabel = document.createElement('h3');
    currentSheetLabel.id = "currentsheetlabel";
    currentSheetLabel.textContent = "Current Sheets:";
    const sheetList = document.createElement('ol');
        sheetList.id = "sheetsList";
    const sheetListName = document.createElement('li');
        sheetListName.id = "s." + sheet.id;
        sheetListName.textContent = "Assignment Name: " + sheet.assignmentName;
    const sheetListCode = document.createElement('li');
        sheetListCode.id = "s." + sheet.courseCode;
        sheetListCode.textContent = "Course Code: " + sheet.courseCode;
    const sheetListSection = document.createElement('li');
        sheetListSection.id = "s." + sheet.section;
        sheetListSection.textContent = "Section: " + sheet.section;
    const sheetListStart = document.createElement('li');
        sheetListStart.id = "s." + sheet.startDate;
        sheetListStart.textContent = "Start Date: " + sheet.startDate;
    const sheetListEnd = document.createElement('li');
        sheetListEnd.id = "s." + sheet.endDate;
        sheetListEnd.textContent = "End Date: " + sheet.endDate;

    const addSlot = document.createElement('section');
        addSlot.className = 'addslot';
        addSlot.id = 'addslot';
    const addSlotHeader = document.createElement('h3');
        addSlotHeader.id = 'addslotheader';
        addSlotHeader.textContent = 'Add Slot to Sheet';
    const addSlotStart = document.createElement('input');
        addSlotStart.type = 'date';
        addSlotStart.id = 'addslotstart';
    const addSlotLabel = document.createElement('label');
        addSlotLabel.id = 'addslotlabel';
        addSlotLabel.textContent = 'Start Date: '
        addSlotLabel.appendChild(addSlotStart);
    const slotDuration = document.createElement('input');
        slotDuration.id = 'slotduration';
        slotDuration.placeholder = '1-240';
    const slotDurationLabel = document.createElement('label');
        slotDurationLabel.id = 'slotdurationlabel';
        slotDurationLabel.textContent = 'Slot Duration: '
        slotDurationLabel.appendChild(slotDuration);
    const slotNumber = document.createElement('input');
        slotNumber.id = 'slotnumber';
        slotNumber.placeholder = '1-99';
    const slotNumberLabel = document.createElement('label');
        slotNumberLabel.id = 'slotnumberlabel';
        slotNumberLabel.textContent = 'Slot Number: '
        slotNumberLabel.appendChild(slotNumber);
    const maxMembers = document.createElement('input');
        maxMembers.id = 'maxmembers';
        maxMembers.placeholder = '1-99';
    const maxMembersLabel = document.createElement('label');
        maxMembersLabel.id = 'slotnumberlabel';
        maxMembersLabel.textContent = 'Max Members: '
        maxMembersLabel.appendChild(maxMembers);
    const createSlotButton = document.createElement('button');
        createSlotButton.id = 'createslotbutton';
        createSlotButton.textContent = 'Create Slot'
        createSlotButton.addEventListener('click', createSheetSlot);
    
    addSlot.append(addSlotHeader, addSlotLabel, document.createElement('br'), slotDurationLabel, document.createElement('br'),
                   slotNumberLabel, document.createElement('br'), maxMembersLabel, document.createElement('br'), createSlotButton);

    sheetList.append(sheetListName, sheetListCode, sheetListSection, sheetListStart, sheetListEnd);
    panel.append(currentSheetLabel, sheetList, document.createElement('br'), addSlot, document.createElement('br'));

    editSheets.appendChild(panel);
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

async function selectSlot() {
    editSlot.innerHTML = "";
    editSlot.appendChild(document.createElement('option'));
    deleteSlotButton.hidden = true;

    const oldPanel = document.getElementById('slotpanel');
    if (oldPanel) oldPanel.remove();

    if (editSheet.value === "") return;

    try {
        const res = await fetch('/api/sheets');
        const sheets = await res.json();
        const sheet = sheets.find(s => s.assignmentName === editSheet.value);
        if (!sheet) return;

        (sheet.slots || []).forEach(slot => {
            const option = document.createElement('option');
            option.value = slot.id;
            option.textContent = `${slot.start} • #${slot.numSlot} • ${slot.slotDuration}min • max ${slot.maxMembers}`;
            // show only the slot number in the dropdown
            option.textContent = `#${slot.numSlot}`;
            editSlot.appendChild(option);
        });

        editSlot.addEventListener('change', async () => {
            deleteSlotButton.hidden = (editSlot.value === "");
            const selectedSlotId = editSlot.value;
            const panelOld = document.getElementById('slotpanel');
            if (panelOld) panelOld.remove();
            if (!selectedSlotId) return;

            const selectedSlot = (sheet.slots || []).find(s => s.id === selectedSlotId);
            if (!selectedSlot) return;

            const panel = document.createElement('div');
            panel.id = 'slotpanel';

            const header = document.createElement('h3');
            header.textContent = 'Edit Slot';

            const startLabel = document.createElement('label');
            startLabel.textContent = 'Start Date: ';
            const startInput = document.createElement('input');
            startInput.type = 'date';
            startInput.id = 'editslotstart';
            startInput.value = selectedSlot.start || '';
            startLabel.appendChild(startInput);

            const durLabel = document.createElement('label');
            durLabel.textContent = 'Duration (min): ';
            const durInput = document.createElement('input');
            durInput.id = 'editslotduration';
            durInput.placeholder = '1-240';
            durInput.value = selectedSlot.slotDuration || '';
            durLabel.appendChild(durInput);

            const numLabel = document.createElement('label');
            numLabel.textContent = 'Slot Number: ';
            const numInput = document.createElement('input');
            numInput.id = 'editslotnumber';
            numInput.placeholder = '1-99';
            numInput.value = selectedSlot.numSlot || '';
            numLabel.appendChild(numInput);

            const maxLabel = document.createElement('label');
            maxLabel.textContent = 'Max Members: ';
            const maxInput = document.createElement('input');
            maxInput.id = 'editslotmax';
            maxInput.placeholder = '1-99';
            maxInput.value = selectedSlot.maxMembers || '';
            maxLabel.appendChild(maxInput);

            const saveBtn = document.createElement('button');
            saveBtn.id = 'saveslotedit';
            saveBtn.textContent = 'Save Slot';
            saveBtn.addEventListener('click', async () => {
                const sd = startInput.value;
                const dur = parseInt(durInput.value, 10);
                const num = parseInt(numInput.value, 10);
                const max = parseInt(maxInput.value, 10);

                if (!sd || Number.isNaN(dur) || Number.isNaN(num) || Number.isNaN(max)) {
                    alert('All fields must be filled correctly.');
                    return;
                }
                if (dur < 1 || dur > 240 || num < 1 || num > 99 || max < 1 || max > 99) {
                    alert('Please follow the allowed ranges.');
                    return;
                }

                const updated = {
                    start: sd,
                    slotDuration: dur,
                    numSlot: num,
                    maxMembers: max
                };

                    try {
                    const sheetIdCandidate = sheet.id || sheet.assignmentName;
                    const url = `/api/sheets/${encodeURIComponent(sheetIdCandidate)}/slots/${encodeURIComponent(selectedSlotId)}`;
                    const putRes = await fetch(url, {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(updated)
                    });
                    if (!putRes.ok) {
                        const txt = await putRes.text();
                        console.error('Failed to save slot', putRes.status, txt);
                        alert(`Failed to save slot: ${putRes.status} ${txt}`);
                        return;
                    }

                    panel.remove();
                    await fetchSheets();
                    await selectSlot();
                } catch (err) {
                    console.error('Error saving slot', err);
                    alert('Error saving slot. See console for details.');
                }
            });

            panel.append(header, startLabel, document.createElement('br'), durLabel, document.createElement('br'),
                         numLabel, document.createElement('br'), maxLabel, document.createElement('br'), saveBtn);
            editSlotSection.appendChild(panel);
        }, { once: false });

    } catch (err) {
        console.log("Error (Loading Slots): " + err);
    }
}

async function deleteSelectedSlot() {
    if (!editSheet.value || !editSlot.value) return alert('Select a sheet and slot to delete.');

    try {
        const resSheets = await fetch('/api/sheets');
        const sheets = await resSheets.json();
        const sheet = sheets.find(s => s.assignmentName === editSheet.value);
        if (!sheet) return alert('Sheet not found.');

        const res = await fetch(`/api/sheets/${encodeURIComponent(sheet.id)}/slots/${encodeURIComponent(editSlot.value)}`, {
            method: 'DELETE'
        });
        if (res.ok || res.status === 204) {
            const panel = document.getElementById('slotpanel');
            if (panel) panel.remove();
            await fetchSheets();
            await selectSlot();
        } else {
            const txt = await res.text();
            console.error('Failed to delete slot', res.status, txt);
            alert('Failed to delete slot.');
        }
    } catch (err) {
        console.error('Error deleting slot', err);
        alert('Error deleting slot.');
    }
}

async function createSheetSlot() {
    try {
        if (editSheet.value === "") return alert('Select a sheet first.');

        const resSheets = await fetch('/api/sheets');
        if (!resSheets.ok) {
            const txt = await resSheets.text();
            console.error('Failed to load sheets', resSheets.status, txt);
            return alert('Failed to load sheets.');
        }
        const sheets = await resSheets.json();
        const sheet = sheets.find(s => s.assignmentName === editSheet.value);
        if (!sheet) return alert('Sheet not found.');

        const start = document.getElementById('addslotstart').value;
        const duration = parseInt(document.getElementById('slotduration').value, 10);
        const numSlot = parseInt(document.getElementById('slotnumber').value, 10);
        const maxMembers = parseInt(document.getElementById('maxmembers').value, 10);

        if (!start || Number.isNaN(duration) || Number.isNaN(maxMembers)) {
            return alert('All slot fields must be filled correctly.');
        }
        if (duration < 1 || duration > 240 || numSlot < 1 || numSlot > 99 || maxMembers < 1 || maxMembers > 99) {
            return alert('Slot values out of allowed ranges.');
        }
        
        const newSlot = {
            start,
            slotDuration: duration,
            numSlot,
            maxMembers
        };

        const postRes = await fetch(`/api/sheets/${encodeURIComponent(sheet.id)}/slots`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSlot)
        });

        if (!postRes.ok) {
            const txt = await postRes.text();
            console.error('Failed to create slot', postRes.status, txt);
            return alert('Failed to create slot.');
        }

        document.getElementById('addslotstart').value = '';
        document.getElementById('slotduration').value = '';
        document.getElementById('slotnumber').value = '';
        document.getElementById('maxmembers').value = '';

        await fetchSheets();
        await selectSlot();
    } catch (err) {
        console.error('Error creating slot', err);
        alert('Error creating slot.');
    }
}

async function signupForSlot() {
    try {
        const sheetId = signupSheet.value;
        const slotNum = parseInt(signupSlotNumber.value, 10);
        const memberId = signupMemberId.value && signupMemberId.value.trim();
        if (!sheetId || Number.isNaN(slotNum) || !memberId) return alert('Please fill sheet, slot number and member id.');

        const url = `/api/sheets/${encodeURIComponent(sheetId)}/slots/${encodeURIComponent(slotNum)}/signup`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ memberId })
        });
        if (!res.ok) {
            const txt = await res.text();
            console.error('Signup failed', res.status, txt);
            return alert(`Sign up failed: ${res.status} ${txt}`);
        }
        alert('Signed up successfully.');
        await fetchSheets();
    } catch (err) {
        console.error('Error signing up', err);
        alert('Error signing up. See console.');
    }
}

async function cancelSignup() {
    try {
        const sheetId = cancelSignupSheet.value;
        const memberId = cancelSignupMemberId.value && cancelSignupMemberId.value.trim();
        if (!sheetId || !memberId) return alert('Please choose sheet and member id.');

        const url = `/api/sheets/${encodeURIComponent(sheetId)}/signups/${encodeURIComponent(memberId)}`;
        const res = await fetch(url, { method: 'DELETE' });
        if (!res.ok) {
            const txt = await res.text();
            console.error('Cancel signup failed', res.status, txt);
            return alert(`Cancel failed: ${res.status} ${txt}`);
        }
        const slotInfo = await res.json().catch(() => null);
        alert('Sign-up cancelled.' + (slotInfo ? ` Slot: ${JSON.stringify(slotInfo)}` : ''));
        await fetchSheets();
    } catch (err) {
        console.error('Error cancelling signup', err);
        alert('Error cancelling signup. See console.');
    }
}

function fillSlotSelectFromSheet(selectEl, sheet) {
    selectEl.innerHTML = '';
    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = '';
    selectEl.appendChild(empty);
    (sheet.slots || []).forEach(sl => {
        const opt = document.createElement('option');
        opt.value = String(sl.numSlot);
        opt.textContent = `#${sl.numSlot}`;
        selectEl.appendChild(opt);
    });
}

async function fillMemberSelectForSheet(selectEl, sheet) {
    selectEl.innerHTML = '';
    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = '';
    selectEl.appendChild(empty);

    try {
        const res = await fetch('/api/courses');
        if (!res.ok) return;
        const courses = await res.json();
        const course = courses.find(c => String(c.code || c.courseCode) === String(sheet.courseCode) || String(c.courseCode) === String(sheet.courseCode)) ||
                       courses.find(c => String(c.section) === String(sheet.section));
        const exact = courses.find(c => (c.courseCode === sheet.courseCode && String(c.section) === String(sheet.section)));
        const matched = exact || course;

        const members = (matched && (matched.members || matched.enrolled || matched.students)) || [];
        members.forEach(m => {
            const id = (typeof m === 'string') ? m : (m.id || m.memberId || m.studentId || m.name);
            const opt = document.createElement('option');
            opt.value = id;
            opt.textContent = id;
            selectEl.appendChild(opt);
        });
    } catch (err) {
        console.error('Error loading course members', err);
    }
}

function fillCancelMemberSelectFromSheet(selectEl, sheet) {
    selectEl.innerHTML = '';
    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = '';
    selectEl.appendChild(empty);
    const memberSet = new Set();
    (sheet.slots || []).forEach(sl => {
        (sl.members || []).forEach(m => memberSet.add(m));
    });
    Array.from(memberSet).forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        selectEl.appendChild(opt);
    });
}

async function populateSignupSheetSelects(sheets) {
    [signupSheet, cancelSignupSheet].forEach(sel => {
        sel.innerHTML = '';
        const empty = document.createElement('option');
        empty.value = '';
        empty.textContent = '';
        sel.appendChild(empty);
        (sheets || []).forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id || s.assignmentName;
            opt.textContent = s.assignmentName || s.id;
            sel.appendChild(opt);
        });
    });

    signupSheet.addEventListener('change', async () => {
        const sid = signupSheet.value;
        if (!sid) {
            signupSlotNumber.innerHTML = '';
            signupMemberId.innerHTML = '';
            return;
        }
        const sheet = (sheets || []).find(s => (s.id === sid) || (s.assignmentName === sid));
        if (!sheet) return;
        fillSlotSelectFromSheet(signupSlotNumber, sheet);
        await fillMemberSelectForSheet(signupMemberId, sheet);
    });

    cancelSignupSheet.addEventListener('change', () => {
        const sid = cancelSignupSheet.value;
        if (!sid) {
            cancelSignupMemberId.innerHTML = '';
            return;
        }
        const sheet = (sheets || []).find(s => (s.id === sid) || (s.assignmentName === sid));
        if (!sheet) return;
        fillCancelMemberSelectFromSheet(cancelSignupMemberId, sheet);
    });
}

function fillMemberSelectForGrading(selectEl, sheet) {
    selectEl.innerHTML = '';
    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = '';
    selectEl.appendChild(empty);
    const memberSet = new Set();
    (sheet.slots || []).forEach(sl => (sl.members || []).forEach(m => memberSet.add(m)));
    Array.from(memberSet).forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        selectEl.appendChild(opt);
    });
}

function populateGradeSheetSelect(sheets) {
    if (!gradeSheet) return;
    gradeSheet.innerHTML = '';
    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = '';
    gradeSheet.appendChild(empty);

    (sheets || []).forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id || s.assignmentName;
        opt.textContent = s.assignmentName || s.id;
        gradeSheet.appendChild(opt);
    });

    gradeSheet.addEventListener('change', () => {
        const sid = gradeSheet.value;
        gradeMember.innerHTML = '';
        if (!sid) return;
        const sheet = (sheets || []).find(x => x.id === sid || x.assignmentName === sid);
        if (!sheet) return;
        fillMemberSelectForGrading(gradeMember, sheet);
    });
}

async function fetchSlotMembers() {
    const slotId = (slotIdInput.value || '').trim();
    if (!slotId) return alert('Enter a slot id.');
    try {
        const res = await fetch(`/api/slots/${encodeURIComponent(slotId)}/members`);
        if (!res.ok) {
            const txt = await res.text();
            slotMembersOut.textContent = `Error: ${res.status} ${txt}`;
            return;
        }
        const members = await res.json();
        slotMembersOut.textContent = JSON.stringify(members, null, 2);
    } catch (err) {
        console.error('Error fetching slot members', err);
        slotMembersOut.textContent = 'Error fetching slot members. See console.';
    }
}

async function submitGrade() {
    const sid = gradeSheet.value;
    const memberId = gradeMember.value;
    const g = gradeValue.value;
    const comment = (gradeComment.value || '').trim();

    if (!sid || !memberId) return alert('Choose sheet and member.');
    const gradeNum = Number(g);
    if (!Number.isInteger(gradeNum) || gradeNum < 0 || gradeNum > 99) return alert('Grade must be integer 0-999.');
    if (comment.length > 500) return alert('Comment must be 500 chars or less.');

    try {
        const url = `/api/sheets/${encodeURIComponent(sid)}/members/${encodeURIComponent(memberId)}/grade`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ grade: gradeNum, comment })
        });
        const txt = await res.text();
        let data;
        try { data = JSON.parse(txt); } catch(e) { data = txt; }
        if (!res.ok) {
            console.error('Grade submit failed', res.status, txt);
            gradeOut.textContent = `Failed: ${res.status} ${txt}`;
            return;
        }
        // success: server returns originalGrade and updated grade entry
        gradeOut.textContent = `Success: ${JSON.stringify(data, null, 2)}`;
        // refresh sheets UI so grade info (if shown elsewhere) is current
        await fetchSheets();
    } catch (err) {
        console.error('Error submitting grade', err);
        gradeOut.textContent = 'Error submitting grade. See console.';
    }
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
editSheet.addEventListener('change', selectSlot);
deleteSlotButton.addEventListener('click', deleteSelectedSlot);
editSheet.addEventListener('change', selectSlot);
signupButton.addEventListener('click', signupForSlot);
cancelSignupButton.addEventListener('click', cancelSignup);
getSlotMembersButton.addEventListener('click', fetchSlotMembers);
submitGradeButton.addEventListener('click', submitGrade);