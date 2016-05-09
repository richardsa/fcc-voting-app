'use strict';

(function() {

    var addButton = document.querySelector('.btn-add');
    var deleteButton = document.querySelector('.btn-delete');
    var clickNbr = document.querySelector('#click-nbr');
    var allPolls = document.querySelector('#allPolls');
    var apiUrl = appUrl + '/api/:id/clicks';

    function updateClickCount(data) {

        var clicksObject = data['polls'];
        var output = "";
        for (var i = 0; i < clicksObject.length; i++) {
            var pollName = clicksObject['pollName'];
            var pollNameSnippet = "<div class='pollName'><a href='#'>" + pollName + "</a></div>";
            output += pollNameSnippet;
        }
        allPolls.innerHTML = output;
      
    }

    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount));

    addButton.addEventListener('click', function() {

        ajaxFunctions.ajaxRequest('POST', apiUrl, function() {
            ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
        });

    }, false);

    deleteButton.addEventListener('click', function() {

        ajaxFunctions.ajaxRequest('DELETE', apiUrl, function() {
            ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
        });

    }, false);

})();