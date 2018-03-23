var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var expressValidator = require('express-validator');
//var mongoose = require('mongoose');

//console.log('1 dentro do app.js');

var mongo = require('mongodb');
//console.log('2 dentro do app.js');
var db = require('monk')('localhost/mockApiNodeJS');
//console.log('3 dentro do app.js');
//mongoose.connect('mongodb://localhost/mockApiNodeJS');

//var db = mongoose.connection;

var routes = require('./routes/index');
//console.log('Log no app.js 2');
var alunos = require('./routes/alunos');
//var categories = require('./routes/categories');

//console.log('Log no app.js 3');
var app = express();

app.locals.moment = require('moment');

app.locals.truncateText = function(text, length){
  var truncatedText = text.substring(0, length);
  return truncatedText;
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//console.log('Log no app.js 4');

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//console.log('Log no app.js 5');

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect-Flash
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

//console.log('Log no app.js 6');

app.use('/', routes);
app.use('/alunos', alunos);
//app.use('/categories', categories);

//console.log('Log no app.js 7');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  //console.log('Log no app.js 8');
  var err = new Error('Not Found');
  //console.log('Log no app.js 9');
  err.status = 404;
  //console.log('Log no app.js 10');
  next(err);
});

//console.log('Log no app.js 11');

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//console.log('Log no app.js 8');

module.exports = app;
