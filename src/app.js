import express from 'express';
import path from 'path';
import bodyparser from 'body-parser'
import mogran from 'morgan';
import helmet from 'helmet'
import session from 'express-session';
import cookieparser from 'cookie-parser';
import passport from 'passport';
import mainRouter from './routes/index';
import dbRouter from './routes/db_control';
import authRouter from './routes/auth'
import flash from 'connect-flash'
const app = express();

app.use(mogran('dev'));
app.use(helmet())
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

app.use(cookieparser());
app.use(bodyparser.urlencoded({ extended:true }));
app.use(bodyparser.json());
app.use(session({
    secret:process.env.HASHKEY,
    resave:false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
import './passport'
app.use('/', mainRouter);
app.use('/db', dbRouter);
app.use('/auth', authRouter);

//app.get('/', require('.routes').index);


export default app;
