//console.log('Loaded!');
 //change the text of the main text div
//var element = document.getElementById('main-text'
//);
/* element.innerhtml='new value';

var img = document.getElementById('madi');
img.onclick = function(){
 img.style.marginleft ='100px';  
}; */
//counter code

/*var button = document.getElementById('counter');
//var counter=0;
button.onclick = function(){
    
    
   
   //create a request object
   
   var request = new XMLHttpRequest();
    
   // capture the response and store it in a variable
    request.onreadystatechange = function(){
        if (request.readyState === XMLHttpRequest.DONE){
            //take some action
            if (request.status === 200){
                 var counter = request.responseText;
                 //render the variable in the correct span
                // counter=counter+1;
                 var span = document.getElementById('count');

                 span.innerHTML = counter.toString();
          }
            
       }
        //not done yet
            };
    //make a request
    
   request.open('GET','http://sruthilohi.imad.hasura-app.io/counter', true);
    
      request.send(null);
    
    
};*/

//submit username and password to login


var submit=document.getElementById('submit_btn');
submit.onclick = function(){
    
   //create a request object
   
   var request = new XMLHttpRequest();
    
   // capture the response and store it in a variable
    request.onreadystatechange = function(){
        if (request.readyState === XMLHttpRequest.DONE){
            //take some action
            if (request.status === 200){
                
                //capture a list of names and render it as a list
               consle.log('user logged in');
               alert('logged in sucessfully');
                } else if (request.status===403){
                    alert('username/password is incorrect');
                } else if (request.status===500){
                    alert('something went wrong on the server');
                }
               
               
          
            
       }
        //not done yet
 };
    //make a request
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
   request.open('POST','http://sruthilohi.imad.hasura-app.io/login', true);
    
      request.send(JSON.stringify({username: username, password:password}));
    
    
    // make a request to the server and send the name
    
    
};

