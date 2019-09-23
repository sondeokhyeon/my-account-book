import express from 'express';
//import db from "./cmm/db";
import models from '../models';

// 동기화
// models.sequelize.sync({force:false})
//     .then(() => {
//         console.log('DB Connection')
//     })
//     .catch(() => {
//         console.log('DB Connection Error')
//         process.exit();
//     });  

const app = express();
app.get('/it', (req, res)=>{
    // insert sample
    models.User.create({firstName:'son1'})
    .then(result => {
        res.send('insert success')
    })
    .catch(err => {
        console.log(err)
    })
})

app.get('/st', (req, res)=>{
    // select sample
    models.User.findAll()
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
