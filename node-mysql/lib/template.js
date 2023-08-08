module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },VIEW:function(title, body,author, control){ 
    return `
    <!doctype html>
    <html>
    <head>
      <title>내용보기</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1>${title}</h1>        
      ${body}
      <p> by ${author}</p>
      ${control}
    </body>
    </html>
    `; 
  },list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },create:function(title,authors){
    var sel='';
    var i=0;
    while(i < authors.length){
      sel+=`<option value='${authors[i].id}'>${authors[i].name}</option>`;
      i++;
    } 
    return `
    <!doctype html>
     <html>
      <head>
      <title>글작성</title>
      <meta charset="utf-8">
      </head>
      <body> 
      <h3>${title}</h3>
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p><textarea name="description" placeholder="description"></textarea></p>
        <p><select name='author_id'>${sel}</select></p>
        <p><input type="submit"></p>
      </form>
      <a href="/">글목록</a>
      </body>
      </html>
      `;
  }
}
