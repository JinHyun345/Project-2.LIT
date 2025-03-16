const express = require('express');
const app = express();
const port = 3000;
const tem = require('./lib/tem.js');
const path = require('path');
const mysql = require('mysql2');
const url = require('url');
var bodyParser = require('body-parser')
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#%gimco682GILgodarling',
    database: 'mybox',
    dateStrings: "date"
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));

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
    db.query(`SELECT * FROM memo`, (err, memos) => {
        if (err) {
            throw err;
        }
        var body = `
        <h3>
            <a href = '/memo/create'>+ new memo</a>
        </h3>
        <p>Click title to edit memo</p>
        `;
        var list = '<ul>';
        var i = 0;
        while (i < memos.length) {
            list = list + `<li style="list-style:none">
            <h3><a href='/memo/update'${memos[i].title}</h3>
            <h4 style="display:inline">${memos[i].type}</h4>
            <h5 style="display:inline">: ${memos[i].tag}</h5>
            <p>${memos[i].text}</p>
            <p>${memos[i].date}</p>
            </li>`;
            i = i + 1;
        }
        list = list + '</ul>';
        var body = body + list + '<br><br>';
        response.send(tem.html(body));
    });
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
    db.query('SELECT * FROM tag', (err, tags) => {
        var type = request.params.type;
        var body = '';
        if (type === 'learning') {
            body += '<h2>Today I learned...</h2>';
        } else if (type === 'idea') {
            body += '<h2>I have a new idea!</h2>'
        } else {
            body += `<h2>Today I'm thankful for...</h2>`
        }
        
        var i = 0;
        var list = '';
        while (i < tags.length) {
            list = list + `<option value=${tags[i].name}>${tags[i].name}</option>`;
            i = i + 1;
        }
        list = list + '</ul>';
        var body = `
        <form action="/memo/create/${type}/process" method ="post">
            <input type="hidden" name="type" value="${type}">
            <select name="tag">
            ${list}
            </select>
            <input name="title" placeholder="write title here..." style="display:block">
            <textarea name="text" style="display:block"></textarea>
            <input type="submit" value="Done">
        </form>`;
        response.send(tem.html(body));
    })
})
app.post('/memo/create/:type/process', (request, response)=>{
    var body = request.body;
    db.query('INSERT INTO memo (type, tag, title, text, date) VALUES (?,?,?,?,NOW())',
        [body.type, body.tag, body.title, body.text], (err, result)=>{
            response.redirect('/memo');
        })
})
app.get('/tag', (request, response) => {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM tag`, (err, tags) => {
        if (err) {
            throw err;
        }
        var list = '<ul>';
        var i = 0;
        while (i < tags.length) {
            list = list + `<li><a href="/tag/edit">${tags[i].name}</a></li>`;
            i = i + 1;
        }
        list = list + '</ul>';
        var body = `
        <form action="/tag/create" method="post">
            <input type="text" name="name" placeholder="Add new tag here">
            <input type="submit" value="+">
        </form>
        <p>Click tag to edit</p>
        ${list}
    `;
        response.send(tem.html(body));
    });
})
app.get('/tag/edit', (request, response) => {
    db.query(`SELECT * FROM tag`, (err, tags) => {
        if (err) {
            throw err;
        }
        var tagname = request.params.name;
        var list = '<ul>';
        var i = 0;
        while (i < tags.length) {
            if (tags[i].name === tagname) {
                list = list + `<li>
                <form action="/tag/edit/update" method="post" style="display:inline">
                    <input type="hidden" name="id" value="${tags[i].name}">
                    <input type="text" name="name" value="${tags[i].name}"><input type="submit" value="OK">
                </form>
                <form action="/tag/edit/delete" method="post" style="display:inline">
                <input type="hidden" name="id" value="${tags[i].name}">
                <input type="submit" value="X">
                </form>
                </li>`;
            }
            else {
                list = list + `<li><a href="/tag/${tags[i].name}">${tags[i].name}</a></li>`;
            }
            i++;
        }
        list = list + '</ul>';
        var body = `
        <form action="/tag/create" method="post">
            <input type="text" name="name" placeholder="Add new tag here">
            <input type="submit" value="+">
        </form>
        <p>Click tag to edit</p>
        ${list}
    `;
        response.send(tem.html(body));
    });
})
app.post('/tag/create', (request, response) => {
    var name = request.body.name;
    db.query(`SELECT * FROM tag WHERE name=?`, [name], (err1, tag) => {
        if (err1) {
            throw err1;
        }
        if (tag.length === 0) {
            db.query(`INSERT INTO tag (name, date) VALUES (?, NOW())`, [name], (err2, result2) => {
                if (err2) {
                    throw err2;
                }
                db.query(`set @cnt = 0`, (err2, results2) => {
                    db.query(`UPDATE tag set tag.id = @cnt:=@cnt+1`, (err3, results3) => {
                        response.redirect('/tag');
                    })
                })
            })
        }
        else {
            response.send(`<script>alert('Already exist!'); window.location.href='/tag';</script>`);
        }
    })

})
app.post('/tag/edit/update', (request, response) => {
    var id = request.body.id;
    var name = request.body.name;
    db.query(`UPDATE tag SET name=? WHERE name =?`, [name, id], (err1, results1) => {
        if (err1) {
            throw err1;
        }
        response.redirect('/tag');
    })
})
app.post('/tag/edit/delete', (request, response) => {
    var id = request.body.id;
    db.query(`DELETE FROM tag WHERE name =?`, [id], (err2, results) => {
        if (err2) {
            throw err2;
        }
        db.query(`set @cnt = 0`, (err2, results2) => {
            db.query(`UPDATE tag set tag.id = @cnt:=@cnt+1`, (err3, results3) => {
                response.redirect('/tag');
            })
        })
    })

})

app.listen(port, () => { });