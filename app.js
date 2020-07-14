var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Login
app.use('/login',indexRouter.getLogin);
app.use('/register',indexRouter.register);
app.use('/getGroups',indexRouter.getGroups);
app.use('/createGroup',indexRouter.createGroup);
app.use('/checkUserPermissionToAcessGroup',indexRouter.checkUserPermissionToAcessGroup);
app.use('/getGroup',indexRouter.getGroup);
app.use('/getUsersInGroup',indexRouter.getUsersInGroup);
app.use('/getUserRoles',indexRouter.getUserRoles);
app.use('/blockPeopleInGroup',indexRouter.blockPeopleInGroup);
app.use('/inviteUser',indexRouter.inviteUser);
app.use('/getGroupInvites',indexRouter.getGroupInvites);
app.use('/acceptGroupInvite',indexRouter.acceptGroupInvite);
app.use('/createTask',indexRouter.createTask);
app.use('/getTasks',indexRouter.getTasks);
app.use('/getTask',indexRouter.getTask);
app.use('/getSubTasks',indexRouter.getSubTasks);
app.use('/createSubtask',indexRouter.createSubtask);
app.use('/getStatus',indexRouter.getStatus);
app.use('/updateTask',indexRouter.updateTask);
app.use('/deleteTask',indexRouter.deleteTask);
app.use('/deleteSubtask',indexRouter.deleteSubtask);
app.use('/createComment',indexRouter.createComment);
app.use('/getCommentsForSubtask',indexRouter.getCommentsForSubtask);
app.use('/getCommentsForTask',indexRouter.getCommentsForTask);
app.use('/getUserInGroup',indexRouter.getUserInGroup);
app.use('/changeRoles',indexRouter.changeRoles);






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
