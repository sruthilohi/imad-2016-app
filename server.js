var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var config = {
    user: 'sruthilohi',
    database: 'sruthilohi',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
/* var articles= {
    
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
              
                
 
}; */


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
                  <hr/>
                  <input type="text" id=comments" placeholder="comment"/>
                <input type="submit" id="submit_btn" value="submit"/>
           </div>
  </body>
</html> 
  
    
    
`;
return htmltemplate;
}

var pool = new Pool(config);

function hash(input,salt) {
   //how do we create a hash 
    var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$') ;
}
app.get('/hash/:input', function(req,res){
   var hashedstring = hash(req.params.input,'this-is-a-random-string');
   res.send(hashedstring);
});
app.post('/create-user', function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbstring = hash(password, salt); 
    pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username,dbstring] , function(err,result){
        if(err){
        res.status(500).send(err.toString());
        
    }  else {
        res.send('user sucessfully created :' + username);
    } 
        
    });
});
app.post('/login' , function(req,res){
     var username = req.body.username;
    var password = req.body.password;
   
    pool.query('SELECT * FROM "user" WHERE username = $1', [username] , function(err,result){
        if(err){
        res.status(500).send(err.toString());
        
    }  else {
        if(result.rows.length===0){
            res.send(403).send('username/password is invalid');
        } else {
            //match the password 
            var dbstring = result.rows[0].password;
           var salt =  dbstring.split('$')[2];
           var hashpassword = hash(password,salt); //creating a hash using the password submitted and the original salt
           if(hashedpassword===dbstring){
            res.send('credentials correct');   
           } else {
               res.send(403).send('username/password is invalid');
           }
            
        }
        
      } 
        
    });
    
});

app.get('/test-db', function(req,res){
    
   //make a select request
    // return a response with result
  pool.query('SELECT * from test' , function(err,result){
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


/* app.get('/:articleName', function (req, res) {
    var articleName = rec.params.articleName;
    
  res.send(createtemplate(articles[articleName]));
}); */

app.get('/articles/:articlename', function(req,res){
    
    //articlename==article-one
    //articles[articlename]=={} content object for article-one
 // var articlename = req.params.articlename;
  pool.query("select * from articles where title = $1" , [req.params.articlename]  , function(err,result){
      if(err) {
          res.status(500).send(err.toString());
          
      } else {
          if(result.rows.length === 0){
              res.status(404).send('article not found');
           }else {
               var articleData = result.rows[0];
               var articleId = result.rows[0].id;
                res.send(createtemplate(articleData));
           }
      }
  });
  
});

app.get('/journey', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'journeytrack.html'));
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

 /*pool.query('INSERT INTO comments (comment, date, article-id ) VALUES ($1, $2, $3)', [req.body.comments, new Date(), articleId ],  function(err) {
    if (err) return onError(err);

});*/
/*pool.query('INSERT INTO comments ( comment, articleid ) VALUES ($1, $2)', [req.body.comments, articleId ],  function(err) {
    if (err) return onError(err);

});*/
var names = [];
app.get('/submit-name', function(req,res){  //submit-name?name=xxx
// get the name from the request
    var name = req.query.name;
    names.push(name);
    res.send(JSON.stringify(names));
    
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
