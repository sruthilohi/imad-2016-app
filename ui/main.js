//console.log('Loaded!');
 //change the text of the main text div
//var element = document.getElementById('main-text'
//);
/* element.innerhtml='new value';
var img=document.getElementById('madi');
img.onclick= function(){
 img.style.marginleft='100px';  
}; */
//counter code

var button=document.getElementById('counter');
//var counter=0;
button.onclick = function(){
    
    
   
   //create a request object
   
   var request = new XMLHttpRequest();
    
   // capture the response and store it in a variable
    request.onreadystatechange = function(){
        if(Request.readyState === XMLHttpRequest.DONE){
            //take some action
            if(request.status === 200){
                 var counter = request.responseText;
                 var span= document.getElementById('count');

                 span.innerHTML=counter.toString();
            }
            
        }
        //not done yet
    };
    //make a request
    request.open('GET', 'http://sruthilohi.imad.hasura-app.io/counter', true);
    
   // request.open('get','http://sruthilohi.imad.hasura-app.io/counter',true);
    request.send(null);
    
    
    // render the variable in the correct span
   // counter=counter+1;
    
   //var span= document.getElementById('count');

//span.innerHTML=(counter.toString());
    
};

var nameInput=document.getElementById('name');
var name = nameInput.value;
var submit=document.getElementById('submit_btn');
submit.onclick = function(){
    // make a request to the server and send the name
    
    //capture a list of names and render it as a list
  var name=['namei','name2','name3'];
  var list='';
  for(var i=0; i<name.length; i++){
      list += '<li>' + names[i] + '</li>';
  }
  var ul= document.getElementById('namelist');
  ul.innerHTM = list;
};

