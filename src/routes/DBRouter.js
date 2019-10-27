import express from 'express';
const router = express.Router();
import models, { sequelize } from '../../database/models';

const sync = async() =>  {
    //throw new Error('error 발생함 ㅋㅋ');
    //동기화
    return  models.sequelize.sync({force:true})
        .then(() => {
            console.log('DB Connection')
        })
        .catch(err => {
            console.log('DB Connection Error')
            console.log(err)
            process.exit();
        }) 
}

router.get('/sync', async(req, res, next) => {
    try {
       await sync()
    } catch(err) {
        console.log(err)
    }
    res.send('hello DB');
})


router.get('/it', (req, res)=>{
    // insert sample
    models.ISMJ.create({mjnm:'수입'})
    .then(result => {
        res.send('insert success')
    })
    .catch(err => {
        console.log(err)
    })
})

router.get('/ut', (req, res)=>{
    // insert sample
    db.ISMJ.update({mjnm:'수입'}, {
        where: {mjnm : '수입1'}
    } )
    .then(result => {
        res.send('update success')
    })
    .catch(err => {
        console.log(err)
    })
})

router.get('/st', (req, res)=>{
    // select sample
    //db.User.findAll()
    db.ISMJ.findAll()
    // db.ISMJ.findAll({
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

export default router;