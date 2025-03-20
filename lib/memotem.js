module.exports = {
    frame : function(body){
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>LIT</title>
            </head>
            <body>
                <h1>
                    <a href = '/'>LIT</a>
                </h1>
                ${body}
            </html>
            `;
    },
    html : function(sortDate, sortType, sortTag){
        return `
            <h3>
                <input type="button" id="button" value="+ new memo"
                style="border:none; background:none;font-size:20px;"
                onmouseover="this.style.color='blue'"
                onmouseout="this.style.color='black'">
            </h3>
            <article id="choicetypes"></article>
        
            <select id="order" onchange = "sortMemo();">
                    <option value="date">Latest</option>
                    <option value="type">type</option>
                    <option value="tag">tag</option>
            </select>
            
            <div id="list">${sortDate}</div>
        
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
        
                let sortDate = ${JSON.stringify(sortDate)};
                let sortType = ${JSON.stringify(sortType)};
                let sortTag = ${JSON.stringify(sortTag)};

                function sortMemo() {
                    let order = document.getElementById('order').value;
                    let memolist = document.getElementById('list');
                    if(order === 'date'){
                        memolist.innerHTML = sortDate;
                    }
                    else if(order === 'type'){
                        memolist.innerHTML = sortType;
                    }
                        else if(order === 'tag'){
                        memolist.innerHTML = sortTag;
                    }
                }
            </script>
            `;
    },
    listHtml: function (memo) {
        return `
            <li style="list-style:none">
                <form action="/memo/${memo.uuid}" method="post">
                    <input type="hidden" name="id" value="${memo.id}">
                    <button type="submit" style="border: none; background: none; padding: 0; text-align: left; cursor: pointer;">
                        <h2>${memo.title}</h2>
                        <p>${memo.date_only}</p>
                    </button>
                </form>
            </li>`
    },
    pageHtml : function(id, title, type, tag, text, date){
        return `
            <a href="/memo">memo</a>
            <form action="/memo/edit" method="post">
                <input type="hidden" name="id" value="${id}">
                <button type="submit" style="border: none; background: none; padding: 0; text-align: left; cursor: pointer;">
                    <h2>${title}</h2>
                    <h4 style="display:inline">&lt;${type} : ${tag}&gt;</h4>
                    <p>${text}</p>
                    <p>${date}</p>
                </button>
            </form>
            `;
    },
    editHtml: function (id, uuid, list, title, text) {
        return `
            <form action="/memo/edit_update" method ="post">
                <input type="hidden" name="id" value="${id}">
                <input type="hidden" name="uuid" value="${uuid}">
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
    },
    createHtml : function(type, selectTag){
        return `
            <form action="/memo/create_process" method ="post">
                <input type="hidden" name="type" value="${type}">
                ${selectTag}
                <input name="title" placeholder="write title here..." style="display:block">
                <textarea name="text" style="display:block"></textarea>
                <input type="submit" value="Done">
            </form>`;
    },

}