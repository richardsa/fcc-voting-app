'use strict';

(function() {
  var profileId = document.querySelector('#profile-id') || null;
  var profileUsername = document.querySelector('#profile-username') || null;
  var profileRepos = document.querySelector('#profile-repos') || null;
  var displayName = document.querySelector('#display-name');

  var apiUrl = appUrl + '/api/:id';


  function updateHtmlElement(data, element, userProperty) {
    element.innerHTML = data[userProperty];
  }

  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function(data) {
    console.log(data.length)
    console.log(data);
    var userObject = JSON.parse(data);
    if (userObject.hasOwnProperty('error')) {
      console.log('yeah bruh');
      document.querySelector("#loginButton").innerHTML = '<a href="/login">Login</a>';
      return;
    } else {
      document.querySelector("#loginButton").innerHTML = '<a href="/logout">Logout</a>'
      document.querySelector("#profileLink").innerHTML = '<a href="/profile">Profile</a>'
      document.querySelector("#newPollParagraph").innerHTML = 'New! <a href="/new-poll">Create</a> your own poll!'

      // var userObject = JSON.parse(data);

      updateHtmlElement(userObject, displayName, 'displayName');

      if (profileId !== null) {
        updateHtmlElement(userObject, profileId, 'id');
      }

      if (profileUsername !== null) {
        updateHtmlElement(userObject, profileUsername, 'username');
      }

      if (profileRepos !== null) {
        updateHtmlElement(userObject, profileRepos, 'publicRepos');
      }
    }
  }))

})();