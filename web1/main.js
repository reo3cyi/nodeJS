var http = require('http');
var fs = require('fs');
var url = require('url')
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData=url.parse(_url,true).query;
    var title=queryData.id;
    if(_url == '/'){      
      title="Welcome";
    }
    if(_url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);
    fs.readFile(`data/${queryData.id}`,'utf-8',(err, data) => {
        //if (err) throw err;
        //console.log(data);
        var template=`
        <!doctype html>
        <html>
        <head>
          <title>{WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="index.html">WEB2</a></h1>
          <ol>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
          </ol>
          <h2>${title}</h2>
          <p>${data}</p>
        </body>
        </html>`;
        response.end(template);
    })
});
app.listen(3000);