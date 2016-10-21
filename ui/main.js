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
        if(request.readystate===xmlhttprequest.done){
            //take some action
            if(request.status===200){
                 var counter=request.responsetext;
                 var span= document.getElementById('count');

                 span.innerHTML=counter.toString();
            }
            
        }
        //not done yet
    };
    //make a request
    
    request.open('get','http://sruthilohi.imad.hasura-app.io/counter',true);
    request.send(null);
    
    
    // render the variable in the correct span
   // counter=counter+1;
    
   //var span= document.getElementById('count');

//span.innerHTML=(counter.toString());
    
};

