var mongoose = require('mongoose');

var UserGroupsSchema = new mongoose.Schema({
  //_id:{type:String},
  _NUser:{type:Number},
  _NGroup:{type:Number},
  _Accepted:{type:Boolean},
  _JoinDate:{type:String},
  _LeaveDate:{type:String}
}, {timestamps: true});

module.exports = mongoose.model('userGroups', UserGroupsSchema, 'userGroups');