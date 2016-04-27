'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({

      pollName: String,
      pollId: String,
      pollOptions: Schema.Types.Mixed,
      githubId: String,
      
   
});

module.exports = mongoose.model('Poll', Poll);
