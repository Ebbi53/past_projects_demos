const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http, { wsEngine: 'ws' });
const python = require('./js-modules/python')
const db = require('./js-modules/database');

db.init().then(res => {
    console.log(res)
    python(io);
})


let port = process.env.PORT;
if (port == null || port == "") {
    port = 8001;
}

app.use(express.static(path.join(__dirname, 'web-frontend')));

app.get('/overview', (req, resp) => {
    db.getOverview()
        .then(data => {
            resp.json(data);
        })
})

app.get('/zones', (req, resp) => {
    db.getZones()
        .then(data => {
            resp.json({ data });
        })
})

app.get('/available', (req, resp) => {
    db.getAvailable()
        .then(data => {
            resp.json({ data });
        })
})

app.get('/reserved', (req, resp) => {
    db.getReserved()
        .then(data => {
            resp.json({ data });
        })
})

http.listen(port, () => {
    console.log('server is running..');
})