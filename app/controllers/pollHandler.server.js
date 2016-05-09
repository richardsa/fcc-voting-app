'use strict';
var path = process.cwd();
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


            } else {

                Counters.collection.insert({
                    'counterVal': 1
                }, function(err) {
                    if (err) {
                        throw err;
                    }

                    counterID = result["counterVal"];


                });
            }
        });

        var pollName1 = req['poll-name'];
        var pollOptions1 = req['poll-options'].split(',');

        var pollOptions2 = {};
        for (var i = 0; i < pollOptions1.length; i++) {

            var x = pollOptions1[i];
            pollOptions2[x] = 0;
        }


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


                var x = JSON.stringify(doc);
                return;
            })

        });



    }

    // delete poll function

    this.deletePoll = function(req, res) {

        var pollId = req.params.id;
        var githubId = req.user.github.id;

        Polls.findOne({
                pollId: pollId,
                githubId: githubId
            },
            function(err, poll) {
                if (!err) {

                    poll.remove(function(err) {
                        res.send("poll deleted");
                    });
                }
            });


    }

    this.getPolls = function(req, res) {
        Polls
            .find({})
            .lean().exec(function(err, result) {
                if (err) {
                    throw err;
                }

                res.json(result);
            });
    };
    this.getProfilePolls = function(req, res) {

        Polls
            .find({
                'githubId': req
            })
            .lean().exec(function(err, result) {
                if (err) {
                    throw err;
                }

                res.json(result);
            });
    };

    this.getDelete = function(req, res) {
        var githubId = req.user.github.id
        Polls
            .find({
                'githubId': githubId
            }).select('pollId -_id')
            .exec(function(err, result) {
                if (err) {
                    throw err;
                }

                res.json(result);
            });

    }

    this.getPoll = function(req, res) {

        var pollId = req.params.id;
        Polls
            .findOne({
                'pollId': pollId
            })
            .exec(function(err, result) {
                if (err) {
                    throw err;
                }

                res.json(result);
            });
    };

    this.vote = function(req, res) {
        var pollId = req.pollID;
        var options = req.optradio

        if (typeof options === 'string') {
            var option = 'pollOptions.' + options.split('_').join(' ');
        } else if (options.length === 1 || options[1] === "") {
            var option = 'pollOptions.' + options[0].split('_').join(' ');
        } else {
            var option = 'pollOptions.' + options[1].split('_').join(' ');
        }

        var voteOption = {};
        voteOption[option] = 1;



        Polls
            .findOneAndUpdate({
                'pollId': pollId
            }, {
                $inc: voteOption
            }, {
                'new': true
            })
            .exec(function(err, result) {
                if (err) {
                    throw err;
                }

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
            
        });

    };

}


module.exports = pollHandler;