'use strict';

(function() {

    var allPolls = document.querySelector('#allPolls');
    var apiUrl = appUrl + '/profile/polls/';

    function displayAllPolls(data) {

        var pollsObject = JSON.parse(data);

        var output = "";
        output += "<table class='table table-bordered'>"
        for (var i = 0; i < pollsObject.length; i++) {

            var pollName = pollsObject[i]['pollName'];
            var pollUrl = "polls/" + pollsObject[i]['pollId'];
            var pollNameSnippet = "<tr class='pollName'><td><a href=" + pollUrl + ">" + pollName + "</a></td></tr>";
            output += pollNameSnippet;

        }
        output += "</table>"
        allPolls.innerHTML = output;
        
    }

    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, displayAllPolls));

  
})();