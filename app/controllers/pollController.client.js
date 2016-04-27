'use strict';

(function() {

  var allPolls = document.querySelector('#allPolls');
  var apiUrl = appUrl + '/api/:id/clicks';

 function displayAllPolls(data) {
console.log(data);
//var pollsObject = data['polls'];
 //var pollsObject = data;
 var pollsObject = JSON.parse(data);
    
  // pollsObject = JSON.stringify(pollsObject);
    var output = "";
  
    for (var i = 0; i < pollsObject.length; i++){
        
       var pollName = pollsObject[i]['pollName'];
       var pollUrl = "polls/" + pollsObject[i]['pollId'];
       console.log("I " + pollsObject[i]);
       //console.log(pollName);
       var pollNameSnippet = "<div class='pollName'><a href=" + pollUrl + ">" + pollName + "</a></div>";
       output += pollNameSnippet;
       
    }
    //    if(pollsObject.hasOwnProperty('error')){
    //        console.log('yeah bruh');
    //return;
    //} else {
   console.log("co " + JSON.stringify(pollsObject));
    allPolls.innerHTML = output;
    //}
  }

  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, displayAllPolls));

  addButton.addEventListener('click', function() {

    ajaxFunctions.ajaxRequest('POST', apiUrl, function() {
      ajaxFunctions.ajaxRequest('GET', apiUrl, displayAllPolls);
    });

  }, false);

  deleteButton.addEventListener('click', function() {

    ajaxFunctions.ajaxRequest('DELETE', apiUrl, function() {
      ajaxFunctions.ajaxRequest('GET', apiUrl, displayAllPolls);
    });

  }, false);

})();