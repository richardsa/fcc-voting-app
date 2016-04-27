'use strict';

(function() {

    var pollInfo = document.querySelector('#pollInfo');
    var id = window.location.pathname.slice(6);
    console.log(id);
    var apiUrl = appUrl + '/poll' + id;

    function displayPoll(data) {
        console.log("input " + data);
        var pollsObject = JSON.parse(data);
        var pollName = pollsObject.pollName;
        //var pollOptions = JSON.stringify(pollsObject.pollOptions);
        var pollOptions = pollsObject.pollOptions;
        var output = "";
        output += "<h3 class='pollTitle'>" + pollName + "</h3>";
        output += "<div class'row'><form action='/vote/api' method='post'>";
        output += "<input type='hidden' name='pollID' value='" + pollsObject.pollId + "'>";
        for (var prop in pollOptions) {
            output += "<div class='radio'>";
            output += "<label><input type='radio' name='optradio' value=" + prop + ">" + prop + "</label>";
            output += "</div>"
            console.log("obj." + prop + " = " + pollOptions[prop]);
            output
        }
        output += "<button type='submit' class='btn btn-primary'>Submit</button></form></div>"
      
    



        pollInfo.innerHTML = output;

    }

    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, displayPoll));

    /*  addButton.addEventListener('click', function() {

        ajaxFunctions.ajaxRequest('POST', apiUrl, function() {
          ajaxFunctions.ajaxRequest('GET', apiUrl, displayAllPolls);
        });

      }, false);

      deleteButton.addEventListener('click', function() {

        ajaxFunctions.ajaxRequest('DELETE', apiUrl, function() {
          ajaxFunctions.ajaxRequest('GET', apiUrl, displayAllPolls);
        });

      }, false);*/

})();