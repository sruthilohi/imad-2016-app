var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
    user:'sruthilohi',
    database:'sruthilohi',
    host:'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));

var articles= {
    
    'article-one': {
           title:'Article one  | sruthi', 
            heading:'Article one',
            date:'sep 1 2016',
            content: `        <p>
                          This is the content of my first article.This is the content of my first article.This is the content of my first article.This is the content of my first article.This is the content of my first article.This is the content of my first article.This is the content of my first article.
                    </p>
                    <p>
                          This is the content of my first article.This is the content of my first article.This is the content of my first article.This is the content of my first article.This is the content of my first article.This is the content of my first article.This is the content of my first article.
                    </p>`
        
                },
                
      'article-three': {
                title:'Article three  | sruthi', 
                 heading:'Article three',
                date:'sep 5 2016',
                 content: `        <p>
                            This is the content of my third article.
                     </p>
                     <p>
                            This is the content of my third article.first article.
                     </p>`

        },
        
        'article-two': {
                title:'Article two  | sruthi', 
                 heading:'Article two',
                date:'sep 2 2016',
                 content: ` <p>
                            This is the content of my second article.
                            </p>
                    `

        }
              
                
 
}; 


function createtemplate(data){
    
var title=data.title;
var date=data.date;
var heading=data.heading;
var content =data.content;
var htmltemplate= `
     <html>
  <head>
      <title>
          ${title}
          </title>
           <meta name="viewport" content="width=device-width,initial-scale=1" />
           <link href="/ui/style.css" rel="stylesheet" />
  </head> 
 
  
  <body>
             <div  class="container">
              <div>
                  
                  <a href="/">Home</a>
                  
              </div>
              <hr/>
                  <h3>
                      ${heading}
                  </h3>
                  <div>
                      
                      ${date.toDateString()}
                  </div>
                  <div>
                      
                    ${content}
                  </div>
           </div>
  </body>
</html> 
  
    
    
`;
return htmltemplate;
}

var Pool = new Pool(config);

app.get('/journeytrack' , function(req,res){
    
   //make a select request
    // return a response with result
  Pool.query=('SELECT * from test' , function(err,result){
    if(err){
        res.status(500).send(err.toString());
        
    }  else {
        res.send(JSON.stringify(result.rows));
    } 
   });
  
    
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
var counter=0;
app.get('/counter', function(req,res){
counter=counter+1;
res.send(counter.toString());
});


app.get('/:articleName', function (req, res) {
    var articleName = rec.params.articleName;
    
  res.send(createtemplate(articles[articleName]));
});

app.get('/articles/:articlename', function(req,res){
    
    //articlename==article-one
    //articles[articlename]=={} content object for article-one
 // var articlename = req.params.articlename;
  Pool.query=("select * from article where title = $1" , [req.params.articlename]  , function(err,result){
      if(err) {
          res.status(500).send(err.toString());
          
      } else {
          if(result.rows.length === 0){
              res.status(404).send('article not found');
           }else {
               var articleData = result.rows[0];
                res.send(createtemplate(articleData));
           }
      }
  });
  
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});


app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
