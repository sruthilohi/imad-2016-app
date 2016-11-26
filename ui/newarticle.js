function loadArticleForm () {
    var articleFormHtml = `
        <div>
                  <a href="/">Home</a>
        </div>
        <h5>Submit an Article </h5>
         <input type = "text" id="title" placeholder="Title"/>
          <input type = "text" id=heading" placeholder="Heading"/>
        <textarea id="content_text" rows="5" cols="100" placeholder="Enter your article here..."></textarea>
        <br/>
        <input type="submit" id="ArticleSubmit" value="Submit" />
        <br/>
        `;
    document.getElementById('new_article').innerHTML = articleFormHtml;
    
    /* var newArticle = document.getElementById('new_btn');
      newArticle.onclick = function () {
          
        loadArticleForm();  
      };*/
     
    var submit = document.getElementById('ArticleSubmit');
    submit.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
                // Take some action
                if (request.status === 200) {
                    
                } else {
                    alert('Error! Could not submit Article');
                }
                submit.value = 'Submit';
          }
        };
        
        // Make the request
        var title = document.getElementById('title').value;
         var heading = document.getElementById('heading').value;
          var content = document.getElementById('content_text').value;
        request.open('POST', '/submit-article', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({title:title, heading:heading, content:content  }));  
        submit.value = 'Submitting...';
        
    };
}
