console.log('article.js');
function loadCommentForm () {
    var CommentFormHtml = `
        <h5>Submit a comment</h5>
        <textarea id="comment_text" rows="5" cols="100" placeholder="Enter your comments here..."></textarea>
       
        <br/>
       <input type="submit" id="register_btn" value="Register" />
        <br/>
        `;
        
    document.getElementById('comment_form').innerHTML =  CommentFormHtml;
    
    
}