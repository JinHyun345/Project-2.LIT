const express = require("express");
var router = express.Router();
const memotem = require('../lib/memotem.js');
const tagtem = require('../lib/tagtem.js');

const func = require('../lib/func.js');
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
    db.query(`SELECT * FROM tag ORDER BY date`, (err1, tags1) => {
        if (err1) throw err1;
        db.query(`SELECT * FROM tag ORDER BY name`, (err2, tags2) => {
            if (err2) throw err2;
            let sortDate = tagtem.list(tags1);
            let sortName = tagtem.list(tags2);
            let body = tagtem.form(sortDate, sortName);
            response.send(memotem.frame(body));
        });
    });
})
router.post('/edit', (request, response) => {
    db.query(`SELECT * FROM tag`, (err, tags) => {
        if (err) {
            throw err;
        }
        var list = tagtem.editList(request.body.id, tags);
        var body = tagtem.editForm(list);
        response.send(memotem.frame(body));
    });
})
router.post('/create', (request, response) => {
    var name = request.body.name.trim();
    db.query(`SELECT * FROM tag WHERE name=?`, [name], (err1, tag) => {
        if (err1) {
            throw err1;
        }
        if(!name){
            return response.send(`<script>alert('Please write name to create tag.'); window.location.href='/tag';</script>`);
        }
        else if (tag.length === 0) {
            db.query(`INSERT INTO tag (name, date) VALUES (?, NOW())`, [name], (err2, result2) => {
                if (err2) {
                    throw err2;
                }
                db.query(`set @cnt = 0`, (err2, results2) => {
                    db.query(`UPDATE tag set tag.id = @cnt:=@cnt+1`, (err3, results3) => {
                        return response.redirect('/tag');
                    })
                })
            })
        }
        else{
            return response.send(`<script>alert('Already exist!'); window.location.href='/tag';</script>`);
        }
    })

})
router.post('/edit_update', (request, response) => {
    var id = request.body.id;
    var name = request.body.name;
    db.query(`UPDATE tag SET name=? WHERE name =?`, [name, id], (err1, results1) => {
        if (err1) {
            throw err1;
        }
        response.redirect('/tag');
    })
})
router.post('/edit_delete', (request, response) => {
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

module.exports = router;