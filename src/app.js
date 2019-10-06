import express from 'express';
import path from 'path';
import bodyparser from 'body-parser'
import mogran from 'morgan';
import helmet from 'helmet'
import session from 'express-session';
import cookieparser from 'cookie-parser';
import passport from 'passport';
import sessionFileStore from 'session-file-store'
//const FileStore = require('session-file-store')(session);
//import {FileStore} from 'session-file-store','session'
import flash from 'connect-flash'
import mainRouter from './routes/index';
import dbRouter from './routes/db_control';
import authRouter from './routes/auth'
//import { authenticateJwt, jwtz } from './passport'

const app = express();
const FileStore = sessionFileStore(session)

app.use('/upload', express.static('uploads'))
app.use('/static', express.static('static'))

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
    saveUninitialized: false,
    cookie: {
        //maxAge: null,//1000 * 10,
        httpOnly:true,
        //secure:true
        secure : false
    },
   store: new FileStore(
       {secret: process.env.HASHKEY}
   ),
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
import './passport'
//app.use(authenticateJwt);
//app.use(jwtz);

app.use('/', mainRouter); 
app.use('/db', dbRouter);
app.use('/auth', authRouter);

export default app;
