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
    password: 'ijnad825&luvJSY98%',
    database: 'project_2',
    dateStrings: "date"
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

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
        console.log(memos);
        var body = `
        <h3>
            <input type="button" id="button" value="+ new memo"
            style="border:none; background:none;font-size:20px;"
            onmouseover="this.style.color='blue'"
            onmouseout="this.style.color='black'">
        </h3>
        <article id="choicetypes"></article>
        <script>
        document.getElementById("button").addEventListener("click", function () {
                var choicetypes = document.getElementById("choicetypes");
                
                if (choicetypes.innerHTML.trim() === "") {
                    fetch('/selectType.html')
                        .then(response => response.text())
                        .then(text => {
                            choicetypes.innerHTML = text;
                        });
                } else {
                    choicetypes.innerHTML = "";
                }
            });
        </script>
        `;
        var list = '<ul>';
        var i = 0;
        while (i < memos.length) {
            list = list + `<li style="list-style:none">
                <form action="/memo/edit" method="post">
                    <input type="hidden" name="id" value="${memos[i].id}">
                    <input type="hidden" name="type" value="${memos[i].type}">
                    <input type="hidden" name="tag" value="${memos[i].tag}">
                    <input type="hidden" name="title" value="${memos[i].title}">
                    <input type="hidden" name="text" value="${memos[i].text}">
                    <button type="submit" style="border: none; background: none; padding: 0; text-align: left; cursor: pointer;">
                        <h3>${memos[i].title}</h3>
                        <h4 style="display:inline">${memos[i].type}</h4>
                        <h5 style="display:inline">: ${memos[i].tag}</h5>
                        <p>${memos[i].text}</p>
                        <p>${memos[i].date}</p>
                    </button>
                </form>
            </li>`;
            i = i + 1;
        }
        list = list + '</ul>';
        var body = body + list + '<br><br>';
        response.send(tem.html(body));
    });
})
app.post('/memo/edit', (request, response) => {
    var id = request.body.id;
    var tag = request.body.tag;
    var title = request.body.title;
    var text = request.body.text;
    db.query("SELECT * FROM tag", (err2, tags) => {
        if (err2) {
            throw (err2);
        }
        var i = 0;
        var list = `<select name='tag'>`;
        while (i < tags.length) {
            if (tags[i].name === tag) {
                list = list + `<option value=${tags[i].name} selected>${tags[i].name}</option>`;
            }
            else {
                list = list + `<option value=${tags[i].name}>${tags[i].name}</option>`;
            }
            i = i + 1;
        }
        list = list + '</select>';

        var body = `
            <form action="/memo/edit_update" method ="post">
                <input type="hidden" name="id" value="${id}">
                ${list}
                <input name="title" placeholder="write title here..." style="display:block" value="${title}">
                <textarea name="text" style="display:block">${text}</textarea>
                <input type="submit" value="Done">
            </form>
            <form action="/memo/edit_delete" method ="post">
                <input type="hidden" name="id" value="${id}">
                <input type="submit" value="Delete">
            </form>
            `;
        response.send(tem.html(body));
    })

})
app.post('/memo/edit_update', (request, response) => {
    var id = request.body.id;
    var tag = request.body.tag;
    var title = request.body.title;
    var text = request.body.text;
    db.query(`UPDATE memo SET tag=?,title=?,text=? WHERE id =?`, [tag, title, text, id], (err, results) => {
        if (err) {
            throw err;
        }
        response.redirect('/memo');
    })
})
app.post('/memo/edit_delete', (request, response) => {
    var id = request.body.id;
    db.query(`DELETE FROM memo WHERE id =?`, [id], (err, results) => {
        if (err) {
            throw err;
        }
        response.redirect('/memo');
    })
})
app.post('/memo/create', (request, response) => {
    db.query('SELECT * FROM tag', (err, tags) => {
        var type = request.body.id;
        var body = '';
        if (type === 'learning') {
            body += '<h2>Today I learned...</h2>';
        } else if (type === 'idea') {
            body += '<h2>I have a new idea!</h2>'
        } else {
            body += `<h2>Today I'm thankful for...</h2>`
        }

        var i = 0;
        var list = `<select name='tag'>`;
        while (i < tags.length) {
            list = list + `<option value=${tags[i].name}>${tags[i].name}</option>`;
            i = i + 1;
        }
        list = list + '</select>';
        if (list === '<select></select>') {
            list = `<p>you don't have any tags</p>`;
        }
        body += `
        <form action="/memo/create_process" method ="post">
            <input type="hidden" name="type" value="${type}">
            ${list}
            <input name="title" placeholder="write title here..." style="display:block">
            <textarea name="text" style="display:block"></textarea>
            <input type="submit" value="Done">
        </form>`;
        response.send(tem.html(body));
    })
})
app.post('/memo/create_process', (request, response) => {
    var body = request.body;
    db.query('INSERT INTO memo (type, tag, title, text, date) VALUES (?,?,?,?,NOW())',
        [body.type, body.tag, body.title, body.text], (err, result) => {
            response.redirect('/memo');
        })
})
app.get('/tag', (request, response) => {
    db.query(`SELECT * FROM tag`, (err, tags) => {
        if (err) {
            throw err;
        }
        var list = '<ul>';
        var i = 0;
        while (i < tags.length) {
            list = list + `<li>
            <form action="/tag/edit" method="post">
                <input type='hidden' name='id' value='${tags[i].name}'>
                <input type='submit' value='${tags[i].name}' 
                style='text-align:left; width:150px; background:none; border:none;'
                onmouseover="this.style.color='blue'"
                onmouseout="this.style.color='black'">
            </form>
            </li>`;
            i = i + 1;
        }
        list = list + '</ul>';
        var body = `
        <form action="/tag/create" method="post">
            <input type="text" name="name" placeholder="Add new tag here">
            <input type="submit" value="+">
        </form>
        <p>Click to edit</p>
        ${list}
    `;
        response.send(tem.html(body));
    });
})
app.post('/tag/edit', (request, response) => {
    db.query(`SELECT * FROM tag`, (err, tags) => {
        if (err) {
            throw err;
        }
        var list = '<ul>';
        var i = 0;
        while (i < tags.length) {
            if (tags[i].name === request.body.id) {
                list = list + `<li>
                <form action="/tag/edit_update" method="post" style="display:inline">
                    <input type="hidden" name="id" value="${tags[i].name}">
                    <input type="text" name="name" value="${tags[i].name}"><input type="submit" value="OK">
                </form>
                <form action="/tag/edit_delete" method="post" style="display:inline">
                <input type="hidden" name="id" value="${tags[i].name}">
                <input type="submit" value="X">
                </form>
                </li>`;
            }
            else {
                list = list + `<li>
                <form action="/tag/edit" method="post">
                    <input type='hidden' name='id' value='${tags[i].name}'>
                    <input type='submit' value='${tags[i].name}' 
                    style='text-align:left; width:150px; background:none; border:none;'
                    onmouseover="this.style.color='blue'"
                    onmouseout="this.style.color='black'">
                    </form>
                </li>`;
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
app.post('/tag/edit_update', (request, response) => {
    var id = request.body.id;
    var name = request.body.name;
    db.query(`UPDATE tag SET name=? WHERE name =?`, [name, id], (err1, results1) => {
        if (err1) {
            throw err1;
        }
        response.redirect('/tag');
    })
})
app.post('/tag/edit_delete', (request, response) => {
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