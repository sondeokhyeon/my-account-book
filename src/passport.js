import passport from 'passport';
import {db} from './middleware'
import bcrypt from 'bcrypt';
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField:'id',
    passwordField:'pw',
    passReqToCallback : true
    },
    async function(req, id, pw, done) {
        db.user.findOne({where:{name:id}}).then(user => {
            if(!user) { 
                return done(null, false, {message: '없는 아이디입니다 ㅎㅎ'}) 
            }
            bcrypt.compare(pw, user.dataValues.password, (err, res) => {
                if(err) {
                    console.err(err)
                    return done(null, false, {message: '에러 발생! 개발자에게 문의하세요!'})
                }
                if(res === false) {
                    return done(null, false, {message: '틀린 비밀번호네요 ㅎㅎ'})
                }
                return done(null, user.dataValues)
            })
        }).catch(err => {
            console.err(err);
            return done(null, false, {message: '에러 발생! 개발자에게 문의하세요!'});
        })
    }
))

passport.serializeUser( (user, done) =>{
    return done(null, user)
});

passport.deserializeUser ( (user, done) => {
    return done(null, user)
});
