console.log('Loaded!');
 //change the text of the main text div
//var element = document.getElementById('main-text'
//);
/* element.innerhtml='new value';
var img=document.getElementById('madi');
img.onclick= function(){
 img.style.marginleft='100px';  
}; */
//counter code

var counter=document.getElementById('counter');
var counter=0;
button.onclick=function(){
    
    
   // make a request to the counter end point
    
   // capture the response and store it in a variable
    
    // render the variable in the correct span
    counter=counter+1;
    
   var span= document.getElementById('count');

span.innerHTML=(counter.toString());
    
};
