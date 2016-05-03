'use strict';

(function() {
  var profileId = document.querySelector('#profile-id') || null;
  var profileUsername = document.querySelector('#profile-username') || null;
  var profileRepos = document.querySelector('#profile-repos') || null;
  var displayName = document.querySelector('#display-name') || null;
  var shareButton = document.querySelector('#shareButton') || null;
  var apiUrl = appUrl + '/api/:id';
 var shareUrl = appUrl + window.location.pathname;

  function updateHtmlElement(data, element, userProperty) {
    element.innerHTML = data[userProperty];
  }

  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function(data) {
    
    
    var userObject = JSON.parse(data);
    if (userObject.hasOwnProperty('error')) {
      console.log('yeah bruh');
      document.querySelector("#loginButton").innerHTML = '<a href="/login">Login</a>';
      return;
    } else {
      document.querySelector("#loginButton").innerHTML = '<a href="/logout">Logout</a>'
      document.querySelector("#profileLink").innerHTML = '<a href="/profile">Profile</a>'
      document.querySelector("#newPollLink").innerHTML = '<a href="/new-poll">Create Poll</a>'

      // var userObject = JSON.parse(data);

      
      if (shareButton !== null) {
        document.querySelector('#shareButton').innerHTML = '<a href="mailto:?subject=Check%20Out%20This%20Poll&body=Check%20Out%20This%20Poll%0A' + shareUrl + '">Share Poll!</a>'
      }
      if (displayName !== null) {
        updateHtmlElement(userObject, displayName, 'displayName');
      }

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