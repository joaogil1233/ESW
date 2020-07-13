var mongoose = require('mongoose');

var SubtasksSchema = new mongoose.Schema({
  //_id:{type:String},
  _NTask:{type:Number},
  _NSubtask:{type:Number},
  _Name:{type:String},
  _Desc:{type:String},
  _NCreatorUser:{type:Number},
  _NAssignedUser:{type:Number},
  _NStatus:{type:Number},
  _NPriority:{type:Number},
  _CreatedAt:{type:String}
}, {timestamps: true});

module.exports = mongoose.model('subtasks', SubtasksSchema, 'subtasks');