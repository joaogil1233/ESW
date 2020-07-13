var mongoose = require('mongoose');

var TasksSchema = new mongoose.Schema({
  //_id:{type:String},
  _NTask:{type:Number},
  _NGroup:{type:Number},
  _Name:{type:String},
  _Desc:{type:String},
  _NCreatorUser:{type:Number},
  _NAssignedUser:{type:Number},
  _NStatus:{type:Number},
  _NPriority:{type:Number},
  _CreatedAt:{type:String}
}, {timestamps: true});

module.exports = mongoose.model('tasks', TasksSchema, 'tasks');