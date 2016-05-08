'use strict';

(function() {

  var pollInfo = document.querySelector('#pollInfo');
  var id = window.location.pathname.slice(7);
  console.log(id);
  var apiUrl = appUrl + '/poll/' + id;
  var deleteUrl = appUrl + '/profile/delete';
  var deleteButton = document.querySelector('#deleteButton');
  // from http://stackoverflow.com/a/3977762

  function deletePollGet(data) {
    var pollsObject = JSON.parse(data);
    var displayDelete = false;
    for (var prop in pollsObject) {
      for (var pollId in pollsObject[prop]) {
        if (pollsObject[prop][pollId] == id) {

          displayDelete = true;
          break;
        }
      }
    }
    if (displayDelete) {
      document.querySelector("#deleteButton").innerHTML = '<button type="button" class="btn btn-danger btn-delete">Delete Poll</button>'

    }

  }

  function displayPoll(data) {
    console.log("input " + data);
    var pollsObject = JSON.parse(data);
    var pollName = pollsObject.pollName;
    var isChecked = 0;
    //var pollOptions = JSON.stringify(pollsObject.pollOptions);
    var pollOptions = pollsObject.pollOptions;
    var output = "";
    var rows = [];
    output += "<h3 class='pollTitle'>" + pollName + "</h3>";
    output += "<div class'row'><form action='/vote/api' method='post'>";
    output += "<input type='hidden' name='pollID' value='" + pollsObject.pollId + "'>";
    output += "<div id='pollRadio'>";
    for (var prop in pollOptions) {
      output += "<div class='radio'>";
      var propName = prop.split(" ").join("_");
      if (isChecked === 0) {
        output += "<label><input type='radio' name='optradio' checked='checked' value=" + propName + ">" + prop + "</label>";
        isChecked += 1;
      } else {
        output += "<label><input type='radio' name='optradio' value=" + propName + ">" + prop + "</label>";

      }
      output += "</div>";
      console.log("obj." + prop + " = " + pollOptions[prop]);
      rows.push([prop, pollOptions[prop]]);
    }

    output += "</div></div>";
   // output += "<button type='submit' class='btn btn-primary'>Submit</button></form></div>";
   

    // Load the Visualization API and the corechart package.
    google.charts.load('current', {
      'packages': ['corechart']
    });

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
      var options = {
        'title': pollName,
        'width': 500,
        'height': 425
      };

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }

    pollInfo.innerHTML = output;


  }

  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, displayPoll));
  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', deleteUrl, deletePollGet));

  deleteButton.addEventListener('click', function() {


    ajaxFunctions.ajaxRequest('DELETE', apiUrl, function() {

      window.location = appUrl + "/profile";
    });

    //  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('DELETE', apiUrl, deletePollDelete));

  }, false);

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