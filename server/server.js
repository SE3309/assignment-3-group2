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

app.use('/', express.static('client'));

app.use('/', (req, res) => {
    res.sendFile('index.html', { root: 'client' });
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});