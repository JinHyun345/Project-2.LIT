const express = require('express');
const app = express();
const port = 3000;
const homeRouter = require('./routes/home');
const memoRouter = require('./routes/memo');
const tagRouter = require('./routes/tag');
const mysql = require('mysql2');
const { v4: uuidv4 } = require("uuid");
var bodyParser = require('body-parser');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ijnad825&luvJSY98%',
    database: 'project_2',
    dateStrings: "date"
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use('/', homeRouter);
app.use('/memo', memoRouter);
app.use('/tag', tagRouter);

app.listen(port, () => { });