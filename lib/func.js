const memotem = require('../lib/memotem');

module.exports = {
    groupBy: function (array, key) {
        return array.reduce((result, item) => {
            (result[item[key]] = result[item[key]] || []).push(item);
            return result;
        }, {});
    },
    groupAndRender : function(memos, key, titleFormatter) {
        let groupedData = this.groupBy(memos, key);
        let resultHtml = '<ul>';
    
        for (let value in groupedData) {
            resultHtml += `<li><h3>${titleFormatter(value)}</h3><ul>`;
            groupedData[value].forEach(memo => {
                resultHtml += memotem.listHtml(memo);
            });
            resultHtml += '</ul></li>';
        }
    
        resultHtml += '</ul>';
        return resultHtml;
    },
    formatListDate: function (datetime) {
        const date = new Date(datetime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    },
    formatDetailDate : function(datetime) {
        const date = new Date(datetime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        return `${year}.${month}.${day} / ${hour}:${min}`;
    },
    tagSelectCreate : function(tags){
        var i = 0;
        var list = `<select name='tag'><option selected disabled>Choose tag</option>`;
        while (i < tags.length) {
            list = list + `<option value=${tags[i].name}>${tags[i].name}</option>`;
            i = i + 1;
        }
        list = list + '</select>';
        return list;
    },
    tagSelectEdit: function (memotag, tags) {
        var i = 0;
        var list = `<select name='tag'>`;
        while (i < tags.length) {
            if (tags[i].name === memotag) {
                list = list + `<option value=${tags[i].name} selected>${tags[i].name}</option>`;
            }
            else {
                list = list + `<option value=${tags[i].name}>${tags[i].name}</option>`;
            }
            i = i + 1;
        }
        list = list + '</select>';
        return list;
    }
}