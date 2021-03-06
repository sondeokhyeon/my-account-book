import express from 'express';
import path from 'path';
import mogran from 'morgan';
import helmet from 'helmet'
import session from 'express-session';
import cookieparser from 'cookie-parser';
import passport from 'passport';
import sessionFileStore from 'session-file-store'
import flash from 'connect-flash'
import mainRouter from './routes/Main/Router';
import dbRouter from './routes/DBRouter';
import AdminRouter from './routes/Admin/Router';
import AdminApi from './routes/Admin/Api';
import ReportRouter from './routes/Report/Router';
import ReportAPI from './routes/Report/Rest'

//import { authenticateJwt, jwtz } from './passport'

const app = express();
const FileStore = sessionFileStore(session)

app.use('/uploads', express.static('uploads'))
app.use('/static', express.static(__dirname + '/static'))
app.use(mogran('dev'));
app.use(helmet())
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.HASHKEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        //maxAge: null,//1000 * 10,
        httpOnly: true,
        //secure:true
        secure: false
    },
    store: new FileStore(
        {
            secret: process.env.HASHKEY,
            retries: 3,
            ttl: 3600,
        }
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
app.use('/admin', AdminRouter);
app.use('/af/', AdminApi);
app.use('/report', ReportRouter);
app.use('/rf/', ReportAPI);

export default app;
