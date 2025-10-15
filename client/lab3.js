const createCourse = document.getElementById('createcourse');
const courseList = document.getElementById('courselist');
const addMembersCourseList = document.getElementById('courselistmember');
const editCourse = document.getElementById('courseedit');
const editSheet = document.getElementById('editsheet');
const deleteCourse = document.getElementById('deletecourse');

let cTitle = document.getElementById('coursetitle');
let cCode = document.getElementById('coursecode');
let cSection = document.getElementById('coursesection');


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

        // Adding an empty slot so no course default selects.
        courseList.appendChild(document.createElement('option'));

        courses.forEach(course => {
            const option = document.createElement('option');
            option.textContent = course.courseTitle;
            courseList.appendChild(option);
        });

        addMembersCourseList.appendChild(document.createElement('option'));

        courses.forEach(course => {
            const option = document.createElement('option');
            option.textContent = course.courseTitle;
            addMembersCourseList.appendChild(option);
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
    editSheet.appendChild(panel);
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
        }
    } catch (err) {
        console.log("Error (Deleting Course): " + err);
        alert("Couldn't Delete Course.");
    }
}

fetchCourses();

createCourse.addEventListener('click', addCourse);
courseList.addEventListener('change', selectCourse);
editCourse.addEventListener('click', editSelected);