const express = require("express");
var router = express.Router();
const memotem = require('../lib/memotem');
const func = require('../lib/func');
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

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.static('public'));

router.get('/', (request, response) => {
    db.query(`SELECT *, DATE(date) AS date_only FROM memos ORDER BY date DESC`, (err1, memos1) => {
        db.query(`SELECT * FROM memos ORDER BY FIELD(type, 'Learning', 'Idea', 'Thanks')`, (err2, memos2) => {
            db.query(`SELECT * FROM memos ORDER BY FIELD(tag, 'no tag'), tag`, (err3, memos3) => {
                let sortDate = func.groupAndRender(memos1, 'date_only', func.formatListDate);
                let sortType = func.groupAndRender(memos2, 'type', (x) => x);
                let sortTag = func.groupAndRender(memos3, 'tag', (x) => x);
                var body = memotem.html(sortDate, sortType, sortTag);
                response.send(memotem.frame(body));
            });
        });
    });

})
router.post('/edit', (request, response) => {
    var id = request.body.id;
    db.query("SELECT * FROM tag", (err1, tags) => {
        if (err1) {
            throw (err1);
        }
        db.query("SELECT * FROM memos WHERE id=?", [id], (err2, memo) => {
            if (err2) {
                throw (err2);
            }
            var list = func.tagSelectEdit(memo[0].tag, tags);
            var body = memotem.editHtml(id, memo[0].uuid, list, memo[0].title, memo[0].text);
            response.send(memotem.frame(body));
        })
    })
})
router.post('/edit_update', (request, response) => {
    db.query(`UPDATE memos SET tag=?,title=?,text=? WHERE id =?`, [request.body.tag, request.body.title, request.body.text, request.body.id], (err, results) => {
        if (err) {
            throw err;
        }
        response.redirect(`/memo/${request.body.uuid}`);
    })
})
router.post('/edit_delete', (request, response) => {
    var id = request.body.id;
    db.query(`DELETE FROM memos WHERE id =?`, [id], (err, results) => {
        if (err) {
            throw err;
        }
        response.redirect('/memo');
    })
})
router.post('/create', (request, response) => {
    db.query('SELECT * FROM tag', (err, tags) => {
        var type = request.body.id;
        var body = '';
        if (type === 'Learning') {
            body += '<h2>Today I learned...</h2>';
        } else if (type === 'Idea') {
            body += '<h2>I have a new Idea!</h2>'
        } else {
            body += `<h2>Today I'm thankful for...</h2>`
        }
        var selectTag = func.tagSelectCreate(tags); 
        body += memotem.createHtml(type, selectTag);
        response.send(memotem.frame(body));
    })
})
router.post('/create_process', (request, response) => {
    var body = request.body;
    if(!body.tag){
        body.tag = 'No tag';
    }
    db.query(`INSERT INTO memos (type, tag, title, text, date, uuid) VALUES (?,?,?,?,NOW(),UUID())`,
        [body.type, body.tag, body.title, body.text], (err1, results1) => {
            db.query(`set @cnt = 0`, (err2, results2) => {
                db.query(`UPDATE memos set memos.id = @cnt:=@cnt+1`, (err3, results3) => {
                    response.redirect('/memo');
                })
            })
        })
})
router.post('/:uuid', (request, response) => {
    db.query(`SELECT * FROM memos WHERE id=?`, [request.body.id], (err, memo) => {
        if (err) {
            throw err;
        }
        var date = func.formatDetailDate(memo[0].date)
        var body = memotem.pageHtml(memo[0].id, memo[0].title, memo[0].type, memo[0].tag, memo[0].text, date);
        response.send(memotem.frame(body));
    });
})
router.get('/:uuid', (request, response) => {
    var uuid = request.params.uuid;
    db.query(`SELECT * FROM memos WHERE uuid=?`, [uuid], (err, memo) => {
        if (err) {
            throw err;
        }
        var body = memotem.pageHtml(memo[0].id, memo[0].title, memo[0].type, memo[0].tag, memo[0].text, memo[0].date);
        response.send(memotem.frame(body));
    });
})

module.exports = router;