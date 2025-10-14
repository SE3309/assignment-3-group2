const createCourse = document.getElementById('createcourse');
const courseList = document.getElementById('courselist');
let cTitle = document.getElementById('coursetitle');
let cCode = document.getElementById('coursecode');


function addCourse() {
    let courseInfo = {
        courseTitle: cTitle.value,
        courseCode: cCode.value,
    };

    fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseInfo),
    });
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

createCourse.addEventListener('click', addCourse);
courseList.addEventListener('mousedown', fetchCourses);