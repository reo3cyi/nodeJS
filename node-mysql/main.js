var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');
var db = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'akr5505',
  database:'study'
});
db.connect();

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        db.query(`SELECT * FROM topic`, function(error,result){
          if(error){
            throw error;          
          }
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(result);
          var html = template.HTML(title, list,`<h2>${title}</h2>${description}`,`<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      }else{
        db.query(`SELECT * FROM topic T left join author A on T.author_id=A.id where T.id=?`,[queryData.id], function(error,result){
          if(error){
            throw error;          
          }
          var title = sanitizeHtml(result[0].title);
          var description = sanitizeHtml(result[0].description);
          var author=sanitizeHtml(result[0].name);
          var html = template.VIEW(title,description,author,
             `<br><a href="/create">글작성</a>               
              <a href="/update?id=${queryData.id}">글수정</a>
              <a href="/">글목록</a>
              <br>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="삭제">
              </form>`
          );
          response.writeHead(200);
          response.end(html);
        });        
      }
    }else if(pathname === '/create'){
      db.query('select * from author',function(error,result){
        if(error){
          throw error;
        }
        var title = '글쓰기';     
        var html=template.create(title,result);
        response.writeHead(200);
        response.end(html);
      });      
    }else if(pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          db.query('insert into topic(title,description,created,author_id)values(?,?,now(),?)',[title,description,'1'],function(error,result){
            if(error){
              throw error;               
            }
            response.writeHead(302, {Location: `/?id=${result.insertId}`});
            response.end()            
          });
      });
    }else if(pathname === '/update'){       
      db.query('select * from topic where id=?',[queryData.id],function(error,result){
        if(error){
          throw error;
        }        
        var html = template.VIEW('글 수정',
          `<form action="/update_process" method="post">
            <input type="hidden" name="id" value="${result[0].id}">
            <p><input type="text" name="title" placeholder="title" value="${result[0].title}"></p>
            <p>
              <textarea name="description" placeholder="description">${result[0].description}</textarea>
            </p>
            <p>
              <input type="submit" value='수정'>
            </p>
          </form>
          `,`<a href="/">글목록</a>`
        );
        response.writeHead(200);
        response.end(html);
      });               
    }else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query('update topic set title=?,description=?,author_id=? where id=?',[post.title,post.description,'1',post.id],function(error,result){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/?id=${post.id}`});
            response.end();
          });
      });
    } else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query('delete from topic where id=?',[post.id],function(error,result){
            if(error){
              throw error;              
            }
            response.writeHead(302, {Location: `/`});
            response.end();
          })
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
