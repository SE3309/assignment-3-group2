const express = require('express');
const app = express();
const port = 3000;

const parts = [
    {id: 100, name: "Belt", colour: "Brown"},
    {id: 100, name: "Clip", colour: "Silver"},
    {id: 100, name: "Hat", colour: "Black"},
    {id: 100, name: "Belt", colour: "Brown"},
]

app.use('/', express.static('index'));

app.get('/api/parts', (req, res) => {
    console.log(`GET request for ${req.url}`);
    res.send(parts);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});