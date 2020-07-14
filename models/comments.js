var mongoose = require('mongoose');

var CommentsSchema = new mongoose.Schema({
  //_id:{type:String},
  _NComment:{type:Number},
  _NTask:{type:Number},
  _NSubtask:{type:Number},
  _NUser:{type:Number},
  _Message:{type:String},
  _Datetime:{type:String}
}, {timestamps: true});

module.exports = mongoose.model('comments', CommentsSchema, 'comments');