// server.js

var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
var port = process.env.port || 8080;

var passport = require('passport');
var flash = require('connect-flash');

//Conexión a la BBDD

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.set('view engine', 'jade');

//PARA PASSPORT

app.use(session({
    secret: 'secreto',
    resave: true,
    saveUninitialized: true
})); //sesion secreta

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//rutas

require('./routes/routes.js')(app, passport);

app.listen(port);
console.log('Escuchando en el puerto ' + port);

