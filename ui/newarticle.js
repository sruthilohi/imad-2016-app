function loadArticleForm () {
    var articleFormHtml = `
        <div>
                  <a href="/">Home</a>
        </div>
        <h5>Submit an Article </h5>
         <input type = "text" id="title" placeholder="Title"/>
          <input type = "text" id="heading" placeholder="Heading"/>
        <textarea id="content_text" rows="5" cols="100" placeholder="Enter your article here..."></textarea>
        <br/>
        <input type="submit" id="submit" value="Submit" />
        <br/>
        `;
    document.getElementById('comment_form').innerHTML = commentFormHtml;
}
