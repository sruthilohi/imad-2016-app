var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

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
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));


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


function createTemplate (data) {
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    
    var htmlTemplate = `
    <html>
      <head>
          <title>
              ${title}
          </title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="/ui/style.css" rel="stylesheet" />
      </head> 
      <body>
          <div class="container">
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
              <h4>Comments</h4>
              <div id="comment_form">
              </div>
              <div id="comments">
                <center>Loading comments...</center>
              </div>
         
          <script type="text/javascript" src="/ui/article.js"></script>
           </div>
      </body>
    </html>
    `;
    return htmlTemplate;
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
app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {
                
                // Set the session
                req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                
                res.send('credentials correct!');
                
              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });
});
app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
      
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});



app.get('/get-articles', function (req, res) {
    
    //query article table
    //return a response with results
    
  
       pool.query('SELECT * FROM article ORDER BY date DESC', function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(JSON.stringify(result.rows));   
           }
       });
});


app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
});


app.post('/submit-comment/:articleName', function (req, res) {
   // Check if the user is logged in
    if (req.session && req.session.auth && req.session.auth.userId) {
        // First check if the article exists and get the article-id
        pool.query('SELECT * from article where title = $1', [req.params.articleName], function (err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.rows.length === 0) {
                    res.status(400).send('Article not found');
                } else {
                    var articleId = result.rows[0].id;
                    // Now insert the right comment for this article
                    pool.query(
                        "INSERT INTO comment (comment, article_id, user_id) VALUES ($1, $2, $3)",
                        [req.body.comment, articleId, req.session.auth.userId],
                        function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!')
                            }
                        });
                }
            }
       });     
    } else {
        res.status(403).send('Only logged in users can comment');
    }
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
              // var articleId = result.rows[0].id;
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
