const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

const courseFile = path.join(__dirname, 'data', 'courseInfo.json');
const sheets = path.join(__dirname, 'data', 'sheets.json');

// Generates unique IDs so that I don't have to try syphoning through each course and sift to see if something is unique or not.
function genId() {
  return `m_${Date.now()}_${Math.random().toString(16).slice(2,5)}`;
}

// All below belong to the Course API.
app.post('/api/courses', (req, res) => {
    res.status(201).json({ ok: true });
    const newCourse = req.body;

    try {
        let courses = [];
        const fileData = fs.readFileSync(courseFile, 'utf-8');
        courses = JSON.parse(fileData || '[]');

        courses.push(newCourse);
        fs.writeFileSync(courseFile, JSON.stringify(courses, null, 2));

        return res.status(500).json({ message: "New Course Added" });
    } catch (err) {
        console.log("Error (Adding Course): " + err);
        return res.status(500).json({ message: "Failed to add Course"});
    }
});

app.post('/api/courses/:courseTitle/:courseCode/:courseSection/members', (req, res) => {
    try {
        const title = decodeURIComponent(req.params.courseTitle);
        const code = decodeURIComponent(req.params.courseCode);
        const section = decodeURIComponent(req.params.courseSection);
        const { firstName = "", lastName = "", role = "" } = req.body || {};

        const fileData = fs.readFileSync(courseFile, 'utf-8');
        const courses = JSON.parse(fileData || '[]');
        const index = courses.findIndex(c => 
            c.courseTitle === title && c.courseCode === code && c.courseSection === section
        );
        if (index === -1) return res.status(404).json({ message: "Course Not Found "});
        const member = {
            id: genId(),
            firstName: firstName,
            lastName: lastName,
            role: role,
        }

        courses[index].members.push(member);
        fs.writeFileSync(courseFile, JSON.stringify(courses, null, 2), 'utf-8');
        return res.status(201).json(member);
    } catch (err) {
        console.log('Error (Adding Member): ' + err);
        return res.status(500).json({ message: "Failed to Add Member"});
    }
});

app.delete('/api/courses/:courseTitle/:courseCode/:courseSection/members/:id', (req, res) => {
    try {
        const title = decodeURIComponent(req.params.courseTitle);
        const code = decodeURIComponent(req.params.courseCode);
        const section = decodeURIComponent(req.params.courseSection);
        const memberID = decodeURIComponent(req.params.id);

        const fileData = fs.readFileSync(courseFile, 'utf-8');
        const courses = JSON.parse(fileData || '[]');
        const index = courses.findIndex(c => 
            c.courseTitle === title && c.courseCode === code && c.courseSection === section
        );
        if (index === -1) return res.status(404).json({ message: "Course Not Found "});
        const members = courses[index].members || [];
        const memberIndex = members.find(m => m.id === memberID);
        
        members.splice(memberIndex, 1);
        courses[index].members = members;

        fs.writeFileSync(courseFile, JSON.stringify(courses, null, 2), 'utf-8');
        return res.status(204).send();
    } catch (err) {
        console.log("Error (Deleting Member): " + err);
        return res.status(500).json({ message: "Failed to remove Member" });
    }
});

app.get('/api/courses', (req, res) => {
    try {
        const fileData = fs.readFileSync(courseFile, 'utf-8');
        const courses = JSON.parse(fileData);
        return res.json(courses);
    } catch (err) {
        console.log("Error (Retrieving Courses): " + err);
        return res.status(500).json({ message: "Failed to load Courses"});
    }
});

app.put('/api/courses/:courseTitle/:courseCode/:courseSection', (req, res) => {
    try {
        const title = decodeURIComponent(req.params.courseTitle);
        const code = decodeURIComponent(req.params.courseCode);
        const section = decodeURIComponent(req.params.courseSection);

        const courses = JSON.parse(fs.readFileSync(courseFile, 'utf-8') || '[]');

        const index = courses.findIndex(c =>
            c.courseTitle === title &&
            c.courseCode === code &&
            c.courseSection === section
        );

        if (index === -1) return res.status(404).json({ message: "Course not found "});

        const patch = {};
        const body = req.body || {};
        if (typeof body.courseTitle === 'string' && body.courseTitle.trim() !== '')   patch.courseTitle   = body.courseTitle.trim();
        if (typeof body.courseCode === 'string' && body.courseCode.trim() !== '')     patch.courseCode    = body.courseCode.trim();
        if (typeof body.courseSection === 'string' && body.courseSection.trim() !== '') patch.courseSection = body.courseSection.trim();

        courses[index] = { ...courses[index], ...patch };
        fs.writeFileSync(courseFile, JSON.stringify(courses, null, 2));
        res.json(courses[index]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to update Course" })
    }
})

app.delete('/api/courses/:courseTitle/:courseCode/:courseSection', (req, res) => {
    try {
        const title = decodeURIComponent(req.params.courseTitle);
        const code = decodeURIComponent(req.params.courseCode);
        const section = decodeURIComponent(req.params.courseSection);

        const courses = JSON.parse(fs.readFileSync(courseFile, 'utf-8') || '[]');

        const index = courses.findIndex(c =>
            c.courseTitle === title &&
            c.courseCode === code &&
            c.courseSection === section
        );

        if (index === -1) return res.status(404).json({ message: "Course not found "});
        courses.splice(index, 1);
        fs.writeFileSync(courseFile, JSON.stringify(courses, null, 2));
        return res.status(204).send();
    } catch (err) {
        console.log("Error (Deleting Course): " + err);
        return res.status(500).json({ message: "Failed to delete Course"});
    }
});

// All below use the Sheets API.

app.use('/', express.static('client'));

app.use('/', (req, res) => {
    res.sendFile('index.html', { root: 'client' });
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});