const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

const courseFile = path.join(__dirname, 'data', 'courseInfo.json');

app.post('/api/courses', (req, res) => {
    res.status(201).json({ ok: true });
    const newCourse = req.body;

    try {
        let courses = [];
        const fileData = fs.readFileSync(courseFile, 'utf-8');
        courses = JSON.parse(fileData || '[]');

        courses.push(newCourse);
        fs.writeFileSync(courseFile, JSON.stringify(courses, null, 2));
    } catch (err) {
        console.log("Error (Adding Course): " + err);
        return res.status(500).json({ message: "Failed to add Course"});
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
})

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

        if (index === -1) return res.status(404).json({ message: "Course not found "})

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
})

app.use('/', express.static('client'));

app.use('/', (req, res) => {
    res.sendFile('index.html', { root: 'client' });
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});