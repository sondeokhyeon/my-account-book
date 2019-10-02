import express from 'express';
import path from 'path';
//import db from "./cmm/db";
import models, { sequelize } from '../models';

const routes = require('./routes/index');
const dbControl = require('./routes/db_control')

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

app.use('/', routes);
app.use('/db', dbControl);

//app.get('/', require('.routes').index);

app.get('/it', (req, res)=>{
    // insert sample
    models.ISMJ.create({mjnm:'수입'})
    .then(result => {
        res.send('insert success')
    })
    .catch(err => {
        console.log(err)
    })
})

app.get('/ut', (req, res)=>{
    // insert sample
    models.ISMJ.update({mjnm:'수입'}, {
        where: {mjnm : '수입1'}
    } )
    .then(result => {
        res.send('update success')
    })
    .catch(err => {
        console.log(err)
    })
})

app.get('/st', (req, res)=>{
    // select sample
    //models.User.findAll()
    models.ISMJ.findAll()
    // models.ISMJ.findAll({
    //     attributes: [
    //         'mjnm',
    //         [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y-%m-%d %h-%m-%s'), 'createdAt'],
    //         'updatedAt'
    //     ]
    // })
    .then(result => {
        res.send(result)
    })
    .catch(err => {
        console.log(err)
    })
})

export default app;
