'use strict';

(function() {

    var pollInfo = document.querySelector('#pollInfo');
    var id = window.location.pathname.slice(7);
    console.log(id);
    var apiUrl = appUrl + '/poll/' + id;
    var deleteUrl =  appUrl + '/profile/delete';

    function deletePoll(data){
      var polls = [];
      var pollsObject = JSON.parse(data);
      var displayDelete = false;
      for (var prop in pollsObject) {
        if (prop == id){
          console.log("yeah it do " + prop);
          displayDelete = true;
          break;
        } 
      }
      if (displayDelete){
        document.querySelector("#deleteButton").innerHTML = '<a href="/delete">delete me</a>'
      }
      console.log("yeah buddy");
    }

    function displayPoll(data) {
        console.log("input " + data);
        var pollsObject = JSON.parse(data);
        var pollName = pollsObject.pollName;
        //var pollOptions = JSON.stringify(pollsObject.pollOptions);
        var pollOptions = pollsObject.pollOptions;
        var output = "";
        var rows = [];
        output += "<h3 class='pollTitle'>" + pollName + "</h3>";
        output += "<div class'row'><form action='/vote/api' method='post'>";
        output += "<input type='hidden' name='pollID' value='" + pollsObject.pollId + "'>";
        for (var prop in pollOptions) {
            output += "<div class='radio'>";
            output += "<label><input type='radio' name='optradio' value=" + prop + ">" + prop + "</label>";
            output += "</div>";
            console.log("obj." + prop + " = " + pollOptions[prop]);
            rows.push([prop,pollOptions[prop] ]);
        }
        output += "<button type='submit' class='btn btn-primary'>Submit</button></form></div>"
        console.log(rows);
 // Load the Visualization API and the corechart package.
      google.charts.load('current', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Option');
        data.addColumn('number', 'votes');
        data.addRows(rows);

        // Set chart options
        var options = {'title': pollName,
                       'width':500,
                       'height':425};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }

        pollInfo.innerHTML = output;
        

    }

    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, displayPoll));
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', deleteUrl, deletePoll));

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