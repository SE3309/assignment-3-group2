const createCourse = document.getElementById('createcourse');
const courseList = document.getElementById('courselist');
const editCourse = document.getElementById('courseedit');
const editSheet = document.getElementById('editsheet');
let cTitle = document.getElementById('coursetitle');
let cCode = document.getElementById('coursecode');


function addCourse() {
    if (cTitle.value == "" || cCode.value == "") return;

    let courseInfo = {
        courseTitle: cTitle.value,
        courseCode: cCode.value,
    };

    fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseInfo),
    });

    cTitle.value = "";
    cCode.value = "";

    fetchCourses();
}

async function fetchCourses() {
    try {
        const res = await fetch('/api/courses');
        const courses = await res.json();
        courseList.innerHTML = "";

        // Adding an empty slot so no course default selects.
        const blank = document.createElement('option');
        blank.textContent = "";
        courseList.appendChild(blank);

        courses.forEach(course => {
            const option = document.createElement('option');
            option.textContent = course.courseTitle;
            courseList.appendChild(option);
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

    const courseTit = document.createElement("input");
        courseTit.id = "editCourseTitle";
        courseTit.placeholder = course.courseTitle;
    const courseCo = document.createElement("input");
        courseCo.id = "editCourseCode";
        courseCo.placeholder = course.courseCode;

    editSheet.appendChild(courseTit);
    editSheet.appendChild(courseCo);
}

fetchCourses();

createCourse.addEventListener('click', addCourse);
courseList.addEventListener('change', selectCourse);
editCourse.addEventListener('click', editSelected);