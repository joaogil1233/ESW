var mongoose = require('mongoose');

var StatusSchema = new mongoose.Schema({
  //_id:{type:String},
  _NStatus:{type:Number},
  _Name:{type:String}
}, {timestamps: true});

module.exports = mongoose.model('status', StatusSchema, 'status');