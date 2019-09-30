import express from 'express';
//import db from "./cmm/db";
import models, { sequelize } from '../models';

//동기화
// models.sequelize.sync({force:false})
//     .then(() => {
//         console.log('DB Connection')
//     })
//     .catch(err => {
//         console.log('DB Connection Error')
//         console.log(err)
//         process.exit();
//     });  

const app = express();
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

app.get('/', (req, res)=>{
    res.send('hello express!')
})

export default app;
