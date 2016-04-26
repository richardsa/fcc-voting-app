'use strict';
var Users = require('../models/users.js');
var Polls = require('../models/polls.js');

function pollHandler() {

  this.addPoll = function(req,res){
    
    var pollName1 = req['poll-name'];
		var pollOptions1 = req['poll-options'].split(',');
		console.log(pollOptions1);
    var pollOptions2 = {};
    for (var i = 0; i < pollOptions1.length; i++){
      console.log("poll options 1 i " + pollOptions1[i]);
      var x = pollOptions1[i];
      pollOptions2[x] = 0;
    }
		console.log("full object " + JSON.stringify(pollOptions2));
   /* Polls
      .save({},  {
        pollName: pollName1, pollOptions: pollOptions2, githubId: req.github.github.id
      })

      .exec(function(err, result) {
        if (err) {
          throw err;
        }
        
        var x = JSON.stringify(result);
        console.log("ird" + result.polls);
        return;
      });*/
      var newDoc = new Polls({ pollName: pollName1, pollOptions: pollOptions2, githubId: req.github.github.id });
      newDoc.save(function (err, doc) {
                        if (err) { throw err; }

                        //res.json(doc);
                        var x = JSON.stringify(doc);
                        console.log(x);
                        return;
                    })
    
  }
  
   this.getPolls = function(req, res) {
    Polls
      .find({},  {
        '_id': false
      })
      .lean().exec(function(err, result) {
        if (err) {
          throw err;
        }
        console.log("results " + JSON.stringify(result));
        res.json(result);
      });
  };


  this.getClicks = function(req, res) {
    Users
      .findOne({
        'github.id': req.user.github.id
      }, {
        '_id': false
      })
      .exec(function(err, result) {
        if (err) {
          throw err;
        }

        res.json(result.nbrClicks);
      });
  };



  this.addClick = function(req, res) {
    Users
      .findOneAndUpdate({
        'github.id': req.user.github.id
      }, {
        $inc: {
          'nbrClicks.clicks': 1
        }
      })
      .exec(function(err, result) {
        if (err) {
          throw err;
        }

        res.json(result.nbrClicks);
      });
  };

  this.resetClicks = function(req, res) {
    Users
      .findOneAndUpdate({
        'github.id': req.user.github.id
      }, {
        'nbrClicks.clicks': 0
      })
      .exec(function(err, result) {
        if (err) {
          throw err;
        }

        res.json(result.nbrClicks);
      });
  };
  
    // quick and dirty function to clear tables
  this.getDrop = function(req, res) {

    
    Users.remove(function(err, p) {
      if (err) {
        throw err;
      } else {
        res.send("Both tables Cleared");
      }
    });

  };

}


module.exports = pollHandler;
