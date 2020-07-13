var mongoose = require('mongoose');

var GroupsSchema = new mongoose.Schema({
  //_id:{type:String},
  _NGroup:{type:Number},
  _Name:{type:String}
}, {timestamps: true});

module.exports = mongoose.model('groups', GroupsSchema, 'groups');