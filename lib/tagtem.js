module.exports = {
    list : function(tags){
        let sortresult = '<ul>';
            tags.forEach(tag => {
                sortresult += `
                <li>
                    <form action="/tag/edit" method="post">
                        <input type='hidden' name='id' value='${tag.name}'>
                        <input type='submit' value='${tag.name}' 
                        style='text-align:left; width:150px; background:none; border:none;'
                        onmouseover="this.style.color='blue'"
                        onmouseout="this.style.color='black'">
                    </form>
                </li>`;
            });
            sortresult += '</ul>';
            return sortresult;
    },
    form : function(sortDate, sortName){
        return `
            <form action="/tag/create" method="post">
                <input type="text" name="name" placeholder="Add new tag here">
                <input type="submit" value="+">
            </form>
            <p>Click to edit</p>

            <select id="order" onchange = "sortTag();">
                <option value="date">Date Created</option>
                <option value="name">Name</option>
            </select>

            <div id="taglist">${sortDate}</div>

            <script>
                let sortDate = ${JSON.stringify(sortDate)};
                let sortName = ${JSON.stringify(sortName)};
                function sortTag() {
                    if(document.getElementById('order').value === 'date'){
                        document.getElementById('taglist').innerHTML = sortDate;
                    }
                    else if(document.getElementById('order').value === 'name'){
                        document.getElementById('taglist').innerHTML = sortName;
                    }
                }
            </script>
            `;
    },
    editForm : function(list){
        return `
            <form action="/tag/create" method="post">
                <input type="text" name="name" placeholder="Add new tag here">
                <input type="submit" value="+">
            </form>
            ${list}
            `;
    },
    editList : function(id, tags){
        var list = '<ul>';
        var i = 0;
        while (i < tags.length) {
            if (tags[i].name === id) {
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
        return list;
    }
}