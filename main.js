const express = require('express');
const app = express();
const port = 3000;
const tem = require('./lib/tem.js');
const path = require('path');
const mysql = require('mysql2');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#%gimco682GILgodarling',
    database: 'mybox'
});
db.connect();


app.get('/', (request, response) => {
    var body = `
        <p>You can remember today with writing anything</p>
        <h3>
            <a href = '/memo'>memo</a>
        </h3>
        <h3>
            <a href = '/tag'>tag</a>
        </h3>
    `;
    response.send(tem.html(body));
});
app.get('/memo', (request, response) => {
    var body = `
        <h3>
            <a href = '/memo/create'>+ new memo</a>
        </h3>
    `;
    response.send(tem.html(body));
})
app.get('/memo/create', (request, response) => {
    var body = `
    <h2>Choose the type of new memo</h2>
    <ul>
        <li>
            <a href="/memo/create/learning">Learning</a>
        </li>
        <li>
            <a href="/memo/create/idea">Idea</a>
        </li>
        <li>
            <a href="/memo/create/thanks">Thanks</a>
        </li>
    </ul>
    `;
    response.send(tem.html(body));
})
app.get('/memo/create/:type', (request, response) => {
    var type = request.params.type;
    var body = '';
    if (type === 'learning') {
        body += '<h2>Today I learned...</h2>';
    } else if (type === 'idea') {
        body += '<h2>I have a new idea!</h2>'
    } else {
        body += `<h2>Today I'm thankful for...</h2>`
    }
    body += `
    <form action="/memo/create/${type}/process">
        <input type="hidden" name="type" value="${type}">
        <select name="tag">
            <option value="reading">reading</option>
            <option value="coding">coding</option>
            <option value="relationship">relationship</option>
            <option value="life">life</option>
        </select>
        <input name="title" placeholder="write title here..." style="display:block">
        <textarea name="text" style="display:block"></textarea>
        <input type="submit" value="Done">
    </form>
    `;
    response.send(tem.html(body));
})
app.get('/tag', (request, response) => {
    db.query(`SELECT * FROM tag`, (err, tags) => {
        if (err) {
            throw err;
        }
        var list = '<ul>';
        var i = 0;
        while (i < tags.length) {
            list = list + `<li>${tags[i].name}</li>`;
            i = i + 1;
        }
        list = list + '</ul>';
        var body = `
        <form action="/tag/create" method="post">
            <input type="text" id="tag" placeholder="Add new tag here">
            <input type="submit" value="+">
        </form>
        ${list}
    `;
    response.send(tem.html(body));
    });
})

app.listen(port, () => { });