var currentArticleTitle = window.location.pathname.split('/')[2];
function loadCommentForm () {
    var CommentFormHtml = `
        <h5>Submit a comment</h5>
        <textarea id="comment_text" rows="5" cols="100" placeholder="Enter your comments here..."></textarea>
       
        <br/>
       <input type="submit" id="submit" value="submit" />
        <br/>
        `;
        
    document.getElementById('comment_form').innerHTML =  CommentFormHtml;
    
    var submit = document.getElementById('submit');
    
    submit.onclick = function () {
        // Create a request object
         var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
                request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  document.getElementById('comment_text').value = '';
                    loadComments();    
              } else {
                 alert('Error! Could not submit comment');
              } 
              submit.value = 'Submit';
          }  
          // Not done yet
        };
        
        // Make the request
        var commet = document.getElementById('comment_text').value;
        
        console.log(comment);
        request.open('POST',  '/submit-comment/' + currentArticleTitle, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({comment: comment}));  
        submit.value = 'Submitting...';
        
    }; 
    
}