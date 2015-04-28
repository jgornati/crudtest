var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
//requerimos passport
var passport = exports.passport = require('passport');

var routes = require('./routes/index');
var users = require('./routes/user');
//Importa el modulo de mongoose....
var mongoose = require('mongoose');
//Importa el modulo de mongoose-fixtures...
var fixtures = require('mongoose-fixtures');

//nos conectamos a la BD
mongoose.connect('mongodb://localhost/crudtest');
//carga el fixtures/admins.js(es una lista de admins para precargar la BD)
fixtures.load('./fixtures/admins.js');
//carga el fixtures/persons.js(es una lista de personas para precargar la BD)
fixtures.load('./fixtures/persons.js');
        //agrega esto
var app = exports.app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'supersecret', saveUninitialized: true, resave: true}));
//le hacemos saber a Express que estamos usando passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//estamos requiriendo un arhivo que va a contener la defincion de la Local Strategy.
require('./auth/local-strategy.js');

app.use('/', routes);
app.use('/users', users);

//agrega las rutas del archivo main.js
require('./routes/main.js');

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
