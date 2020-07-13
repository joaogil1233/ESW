var mongoose = require('mongoose');

var RolesSchema = new mongoose.Schema({
  //_id:{type:String},
  _NRole:{type:Number},
  _Name:{type:String}
}, {timestamps: true});

module.exports = mongoose.model('roles', RolesSchema, 'roles');