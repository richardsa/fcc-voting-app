'use strict';

(function() {
  var profileId = document.querySelector('#profile-id') || null;
  var profileUsername = document.querySelector('#profile-username') || null;
  var profileRepos = document.querySelector('#profile-repos') || null;
  var displayName = document.querySelector('#display-name') || null;
  var shareButton = document.querySelector('#shareButton') || null;
  var poll = document.querySelector('#pollInfo') || null;
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

if (poll !== null) {
  var output = "<div class='radio'>"
       output += "<label><input type='radio' name='optradio' id='other' > Other </label>&nbsp;"
        output+= "<input type='text' name='optradio' />"
        output += "</div>"
         $('#pollEnding').prepend(output);
      }
      
      if (shareButton !== null) {
        var shareOutput = '<a href="mailto:?subject=Check%20Out%20This%20Poll&body=Check%20Out%20This%20Poll%0A' + shareUrl + '"><i id="social-email" class="fa fa-envelope-o fa-2x" alt="Email Poll!" title="Email Poll!"></i></a>'
        shareOutput += "<a href='https://www.facebook.com/sharer.php?u=" + shareUrl + "&t=Check out this poll!'><i id='social-fb' class='fa fa-facebook fa-2x' alt='Share poll on Facebook!' title='Share poll on Facebook!'></i></a>"
        shareOutput += "<a href='https://twitter.com/share?text=Check out this poll!&url=" + shareUrl + "'><i id='social-tw' class='fa fa-twitter fa-2x' alt='Share poll on Twitter!' title='Share poll on Twitter!'></i></a>"

        
        document.querySelector('#shareButton').innerHTML = shareOutput;
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