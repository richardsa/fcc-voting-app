'use strict';
var Users = require('../models/users.js');
var Polls = require('../models/polls.js');
var Counters = require('../models/counters.js');
var counterID;
var clickProjection = {
  '_id': false
};

function pollHandler() {

  this.addPoll = function(req, res) {

    Counters.collection.findOne({}, clickProjection, function(err, result) {
      if (err) {
        throw err;
      }

      if (result) {
        
        counterID = result["counterVal"];
        console.log("if result " + counterID);

      } else {

        Counters.collection.insert({
          'counterVal': 1
        }, function(err) {
          if (err) {
            throw err;
          }
          console.log(result);
counterID = result["counterVal"];
console.log(counterID);

        });
      }
    });



    var pollName1 = req['poll-name'];
    var pollOptions1 = req['poll-options'].split(',');
    console.log(pollOptions1);
    var pollOptions2 = {};
    for (var i = 0; i < pollOptions1.length; i++) {
      console.log("poll options 1 i " + pollOptions1[i]);
      var x = pollOptions1[i];
      pollOptions2[x] = 0;
    }
    console.log("full object " + JSON.stringify(pollOptions2));
    console.log("counterid " + counterID);
  
    Counters.collection.findAndModify({}, {
      '_id': 1
    }, {
      $inc: {
        'counterVal': 1
      }
    }, function(err, updatedResult) {
      if (err) {
        throw err;
      }
      counterID = updatedResult.value.counterVal;
      var newDoc = new Polls({
        pollName: pollName1,
        pollOptions: pollOptions2,
        pollId: counterID,
        githubId: req.github.github.id,
        
      });
      newDoc.save(function(err, doc) {
        if (err) {
          throw err;
        }
  
        //res.json(doc);
        var x = JSON.stringify(doc);
        console.log(x);
        return;
      })
      console.log('updated counterid ' + counterID);
    });
      
  

  }

  this.getPolls = function(req, res) {
    Polls
      .find({})
      .lean().exec(function(err, result) {
        if (err) {
          throw err;
        }
        console.log("results1 " + JSON.stringify(result));
        res.json(result);
      });
  };
 this.getProfilePolls = function(req, res) {
  console.log(req);
  Polls
    .find({'githubId': req})
    .lean().exec(function(err, result) {
      if (err) {
        throw err;
      }
     
      res.json(result);
    });
};

  this.getPoll = function(req, res) {
    
    //res.send("Both tables Cleared");
    console.log(req.params);
    var pollId = req.params.id;
    // pollId = mongoose.mongo.BSONPure.ObjectID.toHexString(pollId);
    //pollId = Polls.db.bson_serializer.ObjectID.createFromHexString(pollId);
    
    Polls
      .findOne({
        'pollId': pollId
      })
      .exec(function(err, result) {
        if (err) {
          throw err;
        }
        console.log("results " + JSON.stringify(result));
        res.json(result);
      });
  };

  this.vote = function(req, res){
    console.log(req);
    var pollId = req.pollID;
    var option = 'pollOptions.' + req.optradio;
    var voteOption = {};
    voteOption[option] = 1;
    
    console.log(pollId + " " + JSON.stringify(voteOption));
    //var query = {};
    var test = 'pollId';
   // query[name] = value;
     Polls
      .findOneAndUpdate({
        'pollId': pollId
      }, {   $inc: voteOption } ,{'new': true})
      .exec(function(err, result) {
        if (err) {
          throw err;
        }
        console.log("results " + JSON.stringify(result));
       // res.send(results.pollOptions);
      });
    
  }

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


    Polls.remove(function(err, p) {
      if (err) {
        throw err;
      } else {
        res.send("Both tables Cleared");
      }
    });
    
     Counters.collection.update({}, {
      'counterVal': 0
    }, function(err, result) {
      if (err) {
        throw err;
      }
      //res.json(result);
    });

  };

}


module.exports = pollHandler;