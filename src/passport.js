import passport from 'passport';
var LocalStrategy = require('passport-local').Strategy;
// passport.serializeUser( (user, done) =>{

// });

// passport.deserializeUser ( (user, done) => {

// });

passport.use(new LocalStrategy({
    usernameField:'id',
    passwordField:'pw',
    passReqToCallback : true
    },
    function(req, id, pw, done) {
        console.log(id, pw)
    }
))
