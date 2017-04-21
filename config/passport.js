//config/passport.js

var LocalStrategy = require('passport-local').Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

module.exports = function (passport) {

    //serialize

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    //deserialize

    passport.deserializeUser(function (id, done) {
        connection.query("SELECT * FROM users WHERE id= ? ", [id], function (err, rows) {
            done(err, rows[0]);
        });
    });

    //******************************LOGIN-UP******************************

    passport.use(
        'local-signup',
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
            function (req, email, password, done) {
                connection.query("select * from users where email=?", [email], function (err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'El usuario ya existe'));
                    } else {
                        var newUserMysql = {
                            email: email,
                            password: bcrypt.hashSync(password, null, null)
                        };
                        var insertQuery = "insert into users(email, password) values(?,?)";

                        connection.query(insertQuery, [newUserMysql.email, newUserMysql.password], function (err, rows) {
                            newUserMysql.id = rows.insertId;

                            return done(null, newUserMysql);
                        });
                    }
                });
            })
    );



    //*******************************LOGIN-IN*****************************

    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
            function (req, email, password, done) {
                connection.query("select * from users where email=?", [email], function (err, rows) {
                    if (err)
                        return done(err);
                    if (!rows.length) {
                        return done(null, false, req.flash('loginMessage', 'No se encuentra el usuario.'));
                    }

                    if (!bcrypt.compareSync(password, rows[0].password))
                        return done(null, false, req.flash('loginMessage', 'Mal password'));

                    return done(null, rows[0]);

                });

            })
    );

};