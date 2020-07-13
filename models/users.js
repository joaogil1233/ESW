var mongoose = require('mongoose');

var UsersSchema = new mongoose.Schema({
  //_id:{type:String},
  _NUser:{type:Number},
  _Name:{type:String},
  _Email:{type:String},
  _Password:{type:String},
  _Picture:{type:String}
}, {timestamps: true});

module.exports = mongoose.model('users', UsersSchema, 'users');