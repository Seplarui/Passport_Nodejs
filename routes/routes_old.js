module.exports = function (app, passport) {

    /*app.get('/', function (req, res) {
        res.render('index');
    });*/

    //****LOGIN****

    app.get('/', function (req, res) {
        res.render('index', { message: req.flash('loginMessage') });
    });

    app.get('/login', function (req, res) {

        //render el formulario de login y lo muestra

        res.render('login.jade', { message: req.flash('loginMessage') });


    })
    // de '/' a '/login'
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }),
        function (req, res) {
            console.log("Hello");

            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');//****MIRAR*****//
        });

    //formulario signup

    app.get('/signup', function (req, res) {
        res.render('signup', { message: req.flash('signupMessage') });
    });

    //proceso signup

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    //***PERFIL NO ESTÁ HECHO*****MIRAR*****

    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile', {
            user: req.user
        });
    });

    //****LOGOUT****

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};


//Route middleware to make sure

function isLoggedIn(req, res, next) {
    //si el usuario está autenticado

    if (req.isAuthenticated())
        return next();

    //si el usuario no está autenticado a index

    res.redirect('/');
}