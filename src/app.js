import express from 'express';
import path from 'path';
import bodyparser from 'body-parser'
import mogran from 'morgan';
import helmet from 'helmet'
import session from 'express-session';
import cookieparser from 'cookie-parser';
import passport from 'passport';
import sessionFileStore from 'session-file-store'
import flash from 'connect-flash'
import mainRouter from './routes/Main/Router';
import dbRouter from './routes/DBRouter';
import AdminRenderRouter from './routes/Admin/Render';
import AdminRestRouter from './routes/Admin/Rest';
import reportRouter from './routes/Report/Router';

//import { authenticateJwt, jwtz } from './passport'

const app = express();
const FileStore = sessionFileStore(session)

app.use('/upload', express.static(__dirname + '/uploads'))
app.use('/static', express.static(__dirname + '/static'))
app.use('/asserts', [
    express.static(path.resolve('./node_modules/handlebars/dist/'))
]);
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
       {
        secret: process.env.HASHKEY,
        retries : 3,
        ttl: 36000,
       }
   ),
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
import './passport'
//app.use(authenticateJwt);
//app.use(jwtz);

// 
app.use('/',        mainRouter); 
app.use('/db',      dbRouter);
app.use('/admin',   AdminRenderRouter);
app.use('/af/',     AdminRestRouter);
app.use('/report',  reportRouter);

export default app;
