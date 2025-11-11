const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

const courseFile = path.join(__dirname, 'data', 'courseInfo.json');
const sheetsFile = path.join(__dirname, 'data', 'sheets.json');

// Generates unique IDs so that I don't have to try syphoning through each course and sift to see if something is unique or not.
function genId() {
  return `m_${Date.now()}_${Math.random().toString(16).slice(2,5)}`;
}

function sheetId() {
  return `sheet_${Date.now()}_${Math.random().toString(16).slice(2,5)}`;
}

function slotId() {
  return `slot${Date.now()}_${Math.random().toString(16).slice(2,5)}`;
}

/* All below belong to the Course API. */
// Creates Course
app.post('/api/courses', (req, res) => {
    try {
        const { courseTitle, courseCode, courseSection, members } = req.body || {};

        if (!courseTitle || !courseCode || !courseSection) {
            return res.status(400).json({ message: 'courseTitle, courseCode and courseSection required' });
        }

        const fileData = fs.readFileSync(courseFile, 'utf-8') || '[]';
        const courses = JSON.parse(fileData);

        const exists = courses.find(c => c.courseTitle === courseTitle && String(c.courseCode) === String(courseCode) && String(c.courseSection) === String(courseSection));
        if (exists) {
            return res.status(409).json({ message: 'Course already exists' });
        }

        const newCourse = {
            courseTitle,
            courseCode,
            courseSection,
            members: [],
        };

        courses.push(newCourse);
        fs.writeFileSync(courseFile, JSON.stringify(courses, null, 2), 'utf-8');

        return res.status(201).json(newCourse);
    } catch (err) {
        console.error('Error (Create Course):', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Creates Member
app.post('/api/courses/:courseTitle/:courseCode/:courseSection/members', (req, res) => {
    try {
        const title = decodeURIComponent(req.params.courseTitle);
        const code = decodeURIComponent(req.params.courseCode);
        const section = decodeURIComponent(req.params.courseSection);
        const { firstName, lastName, role } = req.body || {};

        if (!firstName || !lastName) {
            return res.status(400).json({ message: 'firstName and lastName required' });
        }
        if (!role || !['Student','TA','Admin'].includes(role)) {
            return res.status(400).json({ message: 'role required and must be Student, TA, or Admin' });
        }

        const fileData = fs.readFileSync(courseFile, 'utf-8');
        const courses = JSON.parse(fileData || '[]');

        const course = courses.find(c => c.courseTitle === title && String(c.courseCode) === String(code) && String(c.courseSection) === String(section));
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const newMember = {
            id: genId(),
            firstName,
            lastName,
            role
        };

        course.members = course.members || [];
        course.members.push(newMember);

        fs.writeFileSync(courseFile, JSON.stringify(courses, null, 2), 'utf-8');

        return res.status(201).json(newMember);
    } catch (err) {
        console.error('Error (Create Member):', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Deletes Member
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

// Retrieves Courses
app.get('/api/courses', (req, res) => {
    try {
        const fileData = fs.readFileSync(courseFile, 'utf-8');
        const courses = JSON.parse(fileData);
        return res.json(courses);
    } catch (err) {
        console.log("Error (Retrieving Courses): " + err);
        return res.status(500).json({ message: "Failed to load Courses" });
    }
});

// Updates Course Information
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

// Deletes Course
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

/* All below use the Sheets API. */
// Creates Sign-Up Sheet
app.post('/api/sheets', (req, res) => {
    try {
        const newSheet = req.body;
            newSheet.id = sheetId();
        const fileData = fs.readFileSync(sheetsFile, 'utf-8');
        const sheets = JSON.parse(fileData || '[]');
        sheets.push(newSheet);


        fs.writeFileSync(sheetsFile, JSON.stringify(sheets, null, 2), 'utf-8');
        return res.status(201).json({ message: "New Sheet Added" });
    } catch (err) {
        console.log("Error (Create Sheet): " + err);
        return res.status(500).json({ message: "Failed to add Sheet" });
    }
});

// Deletes Sign-Up Sheet
app.delete('/api/sheets/:id', (req, res) => {
    try {
        const id = decodeURIComponent(req.params.id);
        const sheets = JSON.parse(fs.readFileSync(sheetsFile, 'utf-8') || '[]');
        const index = sheets.findIndex(s => s.id === id);
        
        if (index === -1) return res.status(404).json({ message: "Sheet not found "});
        sheets.splice(index, 1);
        fs.writeFileSync(sheetsFile, JSON.stringify(sheets, null, 2), 'utf-8');
        return res.status(204).send();
    } catch (err) {
        console.log("Error (Delete Sheet): " + err);
        return res.status(500).json({ message: "Failed to Delete Sheet" });
    }
});

// Retrieves Sheets
app.get('/api/sheets', (req, res) => {
    try {
        const fileData = fs.readFileSync(sheetsFile, 'utf-8');
        const sheets = JSON.parse(fileData);
        return res.json(sheets);
    } catch (err) {
        console.log("Error (Retrieving Sheets): " + err);
        return res.status(500).json({ message: "Failed to load Sheets" });
    }
});

// Create Slot
app.post('/api/sheets/:id/slots', (req, res) => {
    try {
        const id = req.params.id;
        const newSlot = req.body;
            newSlot.id = slotId();  
        const fileData = fs.readFileSync(sheetsFile, 'utf-8');
        const sheets = JSON.parse(fileData || '[]');
        const sheet = sheets.find(s => s.id === id);
        sheet.slots.push(newSlot);

        fs.writeFileSync(sheetsFile, JSON.stringify(sheets, null, 2), 'utf-8');
        return res.status(201).json({ message: "Slot added Successfully" });
    } catch (err) {
        console.log("Error (Create Slot): " + err);
        res.status(500).json({ message: "Failed to add Slot" });
    }
});

// Modify Slot
app.put('/api/sheets/:sheetId/slots/:slotId', (req, res) => {
    try {
        const sheetId = decodeURIComponent(req.params.sheetId);
        const slotId = decodeURIComponent(req.params.slotId);

        const fileData = fs.readFileSync(sheetsFile, 'utf-8');
        const sheets = JSON.parse(fileData || '[]');

        const sheet = sheets.find(s => s.id === sheetId || s.assignmentName === sheetId);
        if (!sheet) return res.status(404).json({ message: 'Sheet not found' });

        const slotIndex = (sheet.slots || []).findIndex(sl => sl.id === slotId);
        if (slotIndex === -1) return res.status(404).json({ message: 'Slot not found' });

        const { start, slotDuration, numSlot, maxMembers } = req.body || {};
        if (!start || isNaN(Number(slotDuration)) || isNaN(Number(numSlot)) || isNaN(Number(maxMembers))) {
            return res.status(400).json({ message: 'Invalid slot data' });
        }

        const updatedSlot = {
            ...sheet.slots[slotIndex],
            start,
            slotDuration: Number(slotDuration),
            numSlot: Number(numSlot),
            maxMembers: Number(maxMembers)
        };

        sheet.slots[slotIndex] = updatedSlot;

        fs.writeFileSync(sheetsFile, JSON.stringify(sheets, null, 2), 'utf-8');
        return res.json(updatedSlot);
    } catch (err) {
        console.error('PUT /api/sheets/:sheetId/slots/:slotId error', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Delete Slot
app.delete('/api/sheets/:sheetId/slots/:slotId', (req, res) => {
    try {
        const sheetId = decodeURIComponent(req.params.sheetId);
        const slotId = decodeURIComponent(req.params.slotId);

        const fileData = fs.readFileSync(sheetsFile, 'utf-8');
        const sheets = JSON.parse(fileData || '[]');

        const sheet = sheets.find(s => s.id === sheetId || s.assignmentName === sheetId);
        if (!sheet) return res.status(404).json({ message: 'Sheet not found' });

        const slotIndex = (sheet.slots || []).findIndex(sl => sl.id === slotId);
        if (slotIndex === -1) return res.status(404).json({ message: 'Slot not found' });

        sheet.slots.splice(slotIndex, 1);

        fs.writeFileSync(sheetsFile, JSON.stringify(sheets, null, 2), 'utf-8');
        return res.status(204).send();
    } catch (err) {
        console.error('DELETE /api/sheets/:sheetId/slots/:slotId error', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Sign Up for Slot
app.post('/api/sheets/:id/slots/:slotNumber/signup', (req, res) => {
    try {
        const id = decodeURIComponent(req.params.id);
        const slotNumber = Number(decodeURIComponent(req.params.slotNumber));
        const { memberId } = req.body || {};

        if (!memberId) return res.status(400).json({ message: 'memberId required in body' });

        const fileData = fs.readFileSync(sheetsFile, 'utf-8');
        const sheets = JSON.parse(fileData || '[]');

        const sheet = sheets.find(s => s.id === id || s.assignmentName === id);
        if (!sheet) return res.status(404).json({ message: 'Sheet not found' });

        const slots = sheet.slots || [];
        const slot = slots.find(sl => Number(sl.numSlot) === slotNumber);
        if (!slot) return res.status(404).json({ message: 'Slot not found' });

        slot.members = slot.members || [];

        const max = Number(slot.maxMembers) || 0;
        if (max > 0 && slot.members.length >= max) {
            return res.status(400).json({ message: 'Slot is full' });
        }

        const already = (slots || []).some(sl => (sl.members || []).includes(memberId));
        if (already) {
            return res.status(400).json({ message: 'Member has already signed up on this sheet' });
        }
         slot.members.push(memberId);

        fs.writeFileSync(sheetsFile, JSON.stringify(sheets, null, 2), 'utf-8');
        return res.status(201).json({ message: 'Signed up', slot });
    } catch (err) {
        console.error('Error (Sign Up):', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Delete Sign Up
app.delete('/api/sheets/:id/signups/:memberId', (req, res) => {
    try {
        const id = decodeURIComponent(req.params.id);
        const memberId = decodeURIComponent(req.params.memberId);

        const fileData = fs.readFileSync(sheetsFile, 'utf-8');
        const sheets = JSON.parse(fileData || '[]');

        const sheet = sheets.find(s => s.id === id || s.assignmentName === id);
        if (!sheet) return res.status(404).json({ message: 'Sheet not found' });

        const slots = sheet.slots || [];
        const slotIndex = slots.findIndex(sl => (sl.members || []).includes(memberId));
        if (slotIndex === -1) return res.status(404).json({ message: 'Member not signed up on this sheet' });

        const slot = slots[slotIndex];
        slot.members = slot.members || [];

        slot.members = slot.members.filter(m => m !== memberId);

        fs.writeFileSync(sheetsFile, JSON.stringify(sheets, null, 2), 'utf-8');

        return res.json(slot);
    } catch (err) {
        console.error('Error (Cancel Sign-up):', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

/* All below manage grading. */
// Fetches Members and Grades
app.get('/api/slots/:slotId/members', (req, res) => {
    try {
        const slotId = decodeURIComponent(req.params.slotId);
        const fileData = fs.readFileSync(sheetsFile, 'utf-8');
        const sheets = JSON.parse(fileData || '[]');

        let foundSlot = null;
        let parentSheet = null;
        for (let s of sheets) {
            (s.slots || []).forEach(sl => {
                if (sl.id === slotId) {
                    foundSlot = sl;
                    parentSheet = s;
                }
            });
            if (foundSlot) break;
        }
        if (!foundSlot) return res.status(404).json({ message: 'Slot not found' });

        const memberIds = foundSlot.members || [];

        const courseData = fs.readFileSync(courseFile, 'utf-8');
        const courses = JSON.parse(courseData || '[]');

        const membersOut = memberIds.map(mid => {
            for (let c of courses) {
                const mlist = c.members || c.enrolled || c.students || [];
                for (let m of mlist) {
                    const midCandidate = (typeof m === 'string') ? m : (m.id || m.memberId || m.studentId || m.name);
                    if (String(midCandidate) === String(mid)) return (typeof m === 'string') ? { id: mid } : m;
                }
            }
            return { id: mid };
        });

        return res.json(membersOut);
    } catch (err) {
        console.error('Error (Get Slot Members):', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Add Grade and Comment
app.post('/api/sheets/:sheetId/members/:memberId/grade', (req, res) => {
    try {
        const sheetId = decodeURIComponent(req.params.sheetId);
        const memberId = decodeURIComponent(req.params.memberId);
        const { grade, comment } = req.body || {};

        if (grade === undefined || comment === undefined) return res.status(400).json({ message: 'grade and comment required' });
        const gnum = Number(grade);
        if (!Number.isInteger(gnum) || gnum < 0 || gnum > 999) return res.status(400).json({ message: 'grade must be integer 0-999' });
        if (typeof comment !== 'string' || comment.length > 500) return res.status(400).json({ message: 'comment must be 0-500 characters' });

        const fileData = fs.readFileSync(sheetsFile, 'utf-8');
        const sheets = JSON.parse(fileData || '[]');

        const sheet = sheets.find(s => s.id === sheetId || s.assignmentName === sheetId);
        if (!sheet) return res.status(404).json({ message: 'Sheet not found' });

        const slots = sheet.slots || [];
        const signedUp = slots.some(sl => (sl.members || []).includes(memberId));
        if (!signedUp) return res.status(404).json({ message: 'Member not signed up on this sheet' });

        sheet.grades = sheet.grades || []; 

        let entry = sheet.grades.find(e => String(e.memberId) === String(memberId));
        const originalGrade = (entry && (entry.grade !== undefined)) ? entry.grade : null;

        if (!entry) {
            entry = { memberId, grade: gnum, comment: comment || '', updatedAt: new Date().toISOString() };
            sheet.grades.push(entry);
        } else {
            entry.comment = (entry.comment ? entry.comment + '\n' : '') + (comment || '');
            entry.grade = gnum;
            entry.updatedAt = new Date().toISOString();
        }

        fs.writeFileSync(sheetsFile, JSON.stringify(sheets, null, 2), 'utf-8');

        return res.json({ originalGrade, entry });
    } catch (err) {
        console.error('Error (Submit Grade):', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

app.use('/', express.static('client'));

app.use('/', (req, res) => {
    res.sendFile('index.html', { root: 'client' });
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});