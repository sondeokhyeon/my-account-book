import passport from 'passport';
import {Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt';
import jwt  from 'jsonwebtoken';
import {db} from './middleware'
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local'

passport.use(new LocalStrategy({
    usernameField:'id',
    passwordField:'pw',
    passReqToCallback : true
    },
    async function(req, id, pw, done) {
        db.user.findOne({where:{name:id}}).then(user => {
            if(!user) { 
                return done(null, false, { message: '없는 아이디입니다 ㅎㅎ' }) 
            }
            bcrypt.compare(pw, user.dataValues.password, (err, res) => {
                if(err) {
                    console.log(err)
                    return done(null, false, { message: '에러 발생! 개발자에게 문의하세요!' })
                }
                if(res === false) {
                    return done(null, false, { message: '틀린 비밀번호네요 ㅎㅎ' })
                }
                //return done(null, user.dataValues)
                const {dataValues :{ id, name } } = user;
                const token = jwt.sign({id, name}, process.env.HASHKEY, {expiresIn:'1h'});
                console.log(token)
            })
        }).catch(err => {
            console.log(err);
            return done(null, false, { message: '에러 발생! 개발자에게 문의하세요!' })
        })
    }
))

// passport.serializeUser( (user, done) =>{
//     return done(null, user)
// });

// passport.deserializeUser ( (user, done) => {
//     const info = {
//         id : user.id,
//         name : user.name
//     }
//     return done(null, info)
// })


const jwtOptions = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey : process.env.HASHKEY
}

passport.use(new JWTStrategy(jwtOptions, (payload, done) => {
    db.user.findOne({where:{name:payload.id}}).then(user => {
        if(!user) { 
            return done(null, false) 
        }
        bcrypt.compare(pw, user.dataValues.password, (err, res) => {
            if(err) {
                console.err(err)
                return done(null, false)
            }
            if(res === false) {
                return done(null, false)
            }
            return done(null, user.dataValues)
        })
    })
}))

export const authenticateJwt = (req, res, next) => passport.authenticate('jwt', { sessions: false }, (_error, user) => {
    console.log(user)
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);

passport.initialize()


