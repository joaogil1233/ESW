
var express = require('express');
var router = express.Router();

//File Handling
var formidable = require('formidable');
var fs = require('fs');

//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb+srv://bruno:bruno@user-e6s3o.mongodb.net/db?retryWrites=true&w=majority';

// Models
const users = require('../models/users');
const roles = require('../models/roles');
const groups = require('../models/groups');
const userGroups = require('../models/userGroups');
const userRoles = require('../models/userRoles');
const tasks = require('../models/tasks');
const status = require('../models/status');
const priorities = require('../models/priorities');
const subtasks = require('../models/subtasks');


const { query } = require('express');

const NULLDATE = "";

mongoose.connect(mongoDB, { useNewUrlParser: true });


//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


mongoose.set('useFindAndModify', false);

function getLogin(req, res) {
  email = req.body.email.toLowerCase();
  users.find({ '_Email': email, '_Password': req.body.pw }, (err, query) => {
    if (err) {
      res.json({ "Message": "SystemError" });
    } else {
      if (query.length > 0) {
        res.json({
          "Message": "Success",
          "_id": query[0]._id,
          "_NUser": query[0]._NUser,
          "_Name": query[0]._Name,
          "_Email": query[0]._Email,
          "_Password": query[0]._Password,
          "_Picture": query[0]._Picture
        });
      } else
        res.json({ "Message": "WrongCombination" });
        return;
    }
  });
}
module.exports.getLogin = getLogin;



function inviteUser(req, res) {
  _Email = req.body._Email.toLowerCase();
  _NGroup = req.body._NGroup;
  users.find({ '_Email': _Email}, (err, myUser) => {
      if (myUser.length > 0) {
        userGroups.find({ "_NUser": myUser[0]._NUser,'_NGroup': _NGroup}, (err, myUserGroup) => {
          if (myUserGroup.length == 0) {
            var newUserGroup = new userGroups({ "_NUser": myUser[0]._NUser, "_NGroup": _NGroup, "_Accepted": false, "_JoinDate": "", "_LeaveDate": ""});
            userGroups.create(newUserGroup);
            var newUserRole = new userRoles({ "_NUser": myUser[0]._NUser, "_NGroup": _NGroup, "_NRole": 0});
            userRoles.create(newUserRole);
            res.json({
              "Message": "Success"
            });
          }else{
            res.json({ "Message": "UserAlreadyInvited" });
            return;
          }
        });
      } else
        res.json({ "Message": "EmailNotFound" });
        return;
  });
}
module.exports.inviteUser = inviteUser;

function register(req, res) {
  email = req.body._Email.toLowerCase();
  users.find({"_Email":email}).exec(function (err, existAccount) {
    if(existAccount.length>=1){
      res.json({ "Message": "UserAlreadyExist" });
        return;
    }else{
      users.find({}).sort('_NUser').exec(function (err, docs) {
        if (docs.length == 0) {
          var nextNUser = 0;
        } else {
          var nextNUser = parseInt(docs[docs.length - 1]._NUser);
          nextNUser += 1;
        }
        var newUser = new users({ "_NUser": nextNUser, "_Name": req.body._Name, "_Email": email, "_Password": req.body._Password, "_Picture": "none.png"});
        users.create(newUser);
        res.json({ "Message": "Success" });
        return;
      });
    
    }
  });
}
module.exports.register = register;



function getGroups(req, res) {
  _NUser = parseInt(req.body._NUser);
  userGroups.find({"_NUser":_NUser,"_Accepted":true,"_LeaveDate":""}, (err, allUserGroups) => {
    groupIDS = allUserGroups.map(function (line) {  return line._NGroup   });
    groups.find({"_NGroup":{"$in":groupIDS}}, (err, myGroups) => {
      res.json({
        "Message": "Success",
        "groups":myGroups
      });
    });
  });
}
module.exports.getGroups = getGroups;

function getSubTasks(req, res) {
  _NTask = parseInt(req.body._NTask);
  subtasks.find({"_NTask":_NTask}, (err, allSubTasks) => {
    userIDS = allSubTasks.map(function (line) {  return line._NAssignedUser});
    priorityIDS = allSubTasks.map(function (line) {  return line._NPriority});
    statusIDS = allSubTasks.map(function (line) {  return line._NStatus});
    users.find({"_NUser":{"$in":userIDS}}, (err, allUsers) => {
      priorities.find({"_NPriority":{"$in":priorityIDS}}, (err, allPriorities) => {
        status.find({"_NStatus":{"$in":statusIDS}}, (err, allStatus) => {
          res.json({
            "Message": "Success",
            "subtasks":allSubTasks,
            "priorities":allPriorities,
            "users":allUsers,
            "status":allStatus
          });
        });
      });
    });
  });
}
module.exports.getSubTasks = getSubTasks;


function getTasks(req, res) {
  _NGroup = parseInt(req.body._NGroup);
  tasks.find({"_NGroup":_NGroup}, (err, allTasks) => {
    userIDS = allTasks.map(function (line) {  return line._NAssignedUser});
    priorityIDS = allTasks.map(function (line) {  return line._NPriority});
    statusIDS = allTasks.map(function (line) {  return line._NStatus});
    users.find({"_NUser":{"$in":userIDS}}, (err, allUsers) => {
      priorities.find({"_NPriority":{"$in":priorityIDS}}, (err, allPriorities) => {
        status.find({"_NStatus":{"$in":statusIDS}}, (err, allStatus) => {
          res.json({
            "Message": "Success",
            "tasks":allTasks,
            "priorities":allPriorities,
            "users":allUsers,
            "status":allStatus
          });
        });
      });
    });
  });
}
module.exports.getTasks = getTasks;


function getTask(req, res) {
  _NTask = parseInt(req.body._NTask);
  tasks.find({"_NTask":_NTask}, (err, myTask) => {
    groups.find({"_NGroup":myTask[0]._NGroup}, (err, myGroup) => {
      users.find({"_NUser":myTask[0]._NAssignedUser}, (err, assignedUser) => {
        users.find({"_NUser":myTask[0]._NCreatorUser}, (err, creatorUser) => {
          priorities.find({"_NPriority":myTask[0]._NPriority}, (err, myPriority) => {
            status.find({"_NStatus":myTask[0]._NStatus}, (err, myStatus) => {
              res.json({
                "Message": "Success",
                "task":myTask[0],
                "priority":myPriority[0],
                "creatorUser":creatorUser[0],
                "assignedUser":assignedUser[0],
                "group":myGroup[0],
                "status":myStatus[0]
              });
            });
          });
        });
      });
    });
  });
}
module.exports.getTask = getTask;



function createGroup(req, res) {
  groups.find({}).sort('_NGroup').exec(function (err, docs) {
    if (docs.length == 0) {
      var nextNGroup = 0;
    } else {
      var nextNGroup = parseInt(docs[docs.length - 1]._NGroup);
      nextNGroup += 1;
    }
    var newGroup = new groups({ "_NGroup": nextNGroup, "_Name": req.body._Name});
    groups.create(newGroup);

    var newUserGroup = new userGroups({ "_NUser": req.body._NUserCreater, "_NGroup": nextNGroup, "_Accepted": true,"_JoinDate":getDate(),"_LeaveDate":""});
    userGroups.create(newUserGroup);
    var newUserRole = new userRoles({ "_NUser": req.body._NUserCreater, "_NGroup": nextNGroup,"_NRole": 1});
    userRoles.create(newUserRole);

    res.json({ "Message": "Success" });
    return;
  });
}
module.exports.createGroup = createGroup;


function checkUserPermissionToAcessGroup(req, res) {
  _NGroup = parseInt(req.body._NGroup);
  _NUser = parseInt(req.body._NUser);
  userGroups.find({"_NUser":_NUser,"_NGroup":_NGroup,"_Accepted":true,"_LeaveDate":""}, (err, accessGranted) => {
    if(accessGranted.length==1){
      res.json({
        "Message": "Success"
      });   
    }else{
      res.json({
        "Message": "Denied"
      });
    }
  });
}
module.exports.checkUserPermissionToAcessGroup = checkUserPermissionToAcessGroup;



function getGroup(req, res) {
  _NGroup = parseInt(req.body._NGroup);
  groups.find({"_NGroup":_NGroup}, (err, myGroup) => {
    res.json({
      "Message": "Success",
      "group":myGroup[0]
    });
  });
}
module.exports.getGroup = getGroup;


function getUsersInGroup(req, res) {
  _NGroup = parseInt(req.body._NGroup);
  userGroups.find({"_NGroup":_NGroup}, (err, myUsersInGroup) => {
    userIDS = myUsersInGroup.map(function (line) {  return line._NUser   });
    users.find({"_NUser":{"$in":userIDS}}, (err, myUsers) => {
      userRoles.find({"_NUser":{"$in":userIDS},"_NGroup":_NGroup}, (err, userRoles) => {
        res.json({
          "Message": "Success",
          "users":myUsers,
          "userGroup":myUsersInGroup,
          "userRoles":userRoles
        });
      });
    });    
  });
}
module.exports.getUsersInGroup = getUsersInGroup;


function getUserRoles(req, res) {
  _NUser = parseInt(req.body._NUser);
  _NGroup = parseInt(req.body._NGroup);
  userRoles.find({"_NUser":_NUser,"_NGroup":_NGroup}, (err, myUserRoles) => {
    roleIDS = myUserRoles.map(function (line) {  return line._NRole   });
    users.find({"_NUser":_NUser}, (err, myUsers) => {
      res.json({
        "Message": "Success",
        "roles":roleIDS
      });
    });    
  });
}
module.exports.getUserRoles = getUserRoles;

function getGroupInvites(req, res) {
  _NUser = parseInt(req.body._NUser);
  userGroups.find({"_NUser":_NUser,"_Accepted":false,"_JoinDate":NULLDATE}, (err, myUserGroups) => {
    groupIDS = myUserGroups.map(function (group) {  return group._NGroup   });
    groups.find({"_NGroup":{"$in":groupIDS}}, (err, myGroups) => {
      res.json({
        "Message": "Success",
        "groups":myGroups
      });
    });    
  });
}
module.exports.getGroupInvites = getGroupInvites;


function blockPeopleInGroup(req, res) {
  _NUser = parseInt(req.body._NUser);
  _NGroup = parseInt(req.body._NGroup);
  block = req.body.block;
  if(block==true){
    nowDate = getDate();
  }else{
    nowDate = "";
  }
  userGroups.find({"_NUser":_NUser,"_NGroup":_NGroup,"_Accepted":false,"_JoinDate":NULLDATE}, (err, invitedUser) => {
    if(invitedUser.length>0){
      userGroups.deleteOne({"_NUser":_NUser,"_NGroup":_NGroup,"_Accepted":false,"_JoinDate":NULLDATE}, function (err) {
        userRoles.deleteMany({"_NUser":_NUser,"_NGroup":_NGroup}, function (err) {
          res.json({ "Message": "Success"});
        });
      });
    }else{
      userGroups.findOneAndUpdate({"_NUser":_NUser,"_NGroup":_NGroup}, {"_LeaveDate":nowDate}, function (err, result) {
        res.json({ "Message": "Success"});
      });
    }
  });
  
}
module.exports.blockPeopleInGroup = blockPeopleInGroup;

function acceptGroupInvite(req, res) {
  _NUser = parseInt(req.body._NUser);
  _NGroup = parseInt(req.body._NGroup);
  acceptOrNot = req.body.acceptOrNot;
  if(acceptOrNot){
    userGroups.findOneAndUpdate({"_NUser":_NUser,"_NGroup":_NGroup}, {"_Accepted":true,"_JoinDate":getDate()}, function (err, result) {
      res.json({ "Message": "Success"});
    });
  }else{
    userGroups.deleteOne({"_NUser":_NUser,"_NGroup":_NGroup,"_Accepted":false,"_JoinDate":NULLDATE}, function (err) {
      userRoles.deleteMany({"_NUser":_NUser,"_NGroup":_NGroup}, function (err) {
        res.json({ "Message": "Success"});
      });
    });
  }
}
module.exports.acceptGroupInvite = acceptGroupInvite;


function createTask(req, res) {
  tasks.find({}).sort('_NTask').exec(function (err, docs) {
    if (docs.length == 0) {
      var nextNTask = 0;
    } else {
      var nextNTask = parseInt(docs[docs.length - 1]._NTask);
      nextNTask += 1;
    }
    var newTask = new tasks({ "_NTask": nextNTask, "_NGroup": req.body._NGroup, "_Name": req.body._Name,"_Desc": req.body._Desc, "_NCreatorUser": req.body._NCreatorUser, "_NAssignedUser": req.body._NAssignedUser,"_NStatus": "0","_NPriority": req.body._NPriority, "_CreatedAt": getDate(),"_UpdatedAt": ""});
    tasks.create(newTask);
    res.json({ "Message": "Success" });
    return;
  });
}
module.exports.createTask = createTask;

function createSubtask(req, res) {
  subtasks.find({}).sort('_NSubtask').exec(function (err, docs) {
    if (docs.length == 0) {
      var nextNSubtask = 0;
    } else {
      var nextNSubtask = parseInt(docs[docs.length - 1]._NSubtask);
      nextNSubtask += 1;
    }
    var newSubtask = new subtasks({ "_NTask": req.body._NTask,"_NSubtask": nextNSubtask, "_NGroup": req.body._NGroup, "_Name": req.body._Name,"_Desc": req.body._Desc, "_NCreatorUser": req.body._NCreatorUser, "_NAssignedUser": req.body._NAssignedUser,"_NStatus": "0","_NPriority": req.body._NPriority, "_CreatedAt": getDate(),"_UpdatedAt": ""});
    subtasks.create(newSubtask);
    res.json({ "Message": "Success" });
    return;
  });
}
module.exports.createSubtask = createSubtask;




function getDate(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  
  today = dd + '-' + mm + '-' + yyyy;
  return today;
}