var mongoose = require('mongoose');

var PrioritiesSchema = new mongoose.Schema({
  //_id:{type:String},
  _NPriority:{type:Number},
  _Name:{type:String}
}, {timestamps: true});

module.exports = mongoose.model('priorities', PrioritiesSchema, 'priorities');