var mongoose = require('mongoose');

var UserRolesSchema = new mongoose.Schema({
  //_id:{type:String},
  _NUser:{type:Number},
  _NGroup:{type:Number},
  _NRole:{type:Number}
}, {timestamps: true});

module.exports = mongoose.model('userRoles', UserRolesSchema, 'userRoles');