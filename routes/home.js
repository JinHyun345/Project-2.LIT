const express = require("express");
var router = express.Router();
const tem = require('../lib/memotem.js');

router.get('/', (request, response) => {
    var body = `
        <p>You can remember today with writing anything</p>
        <h3>
            <a href = '/memo'>memo</a>
        </h3>
        <h3>
            <a href = '/tag'>tag</a>
        </h3>
    `;
    response.send(tem.frame(body));
});

module.exports = router;