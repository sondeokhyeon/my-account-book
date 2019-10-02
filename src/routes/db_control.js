import express from 'express';
const router = express.Router();
import models, { sequelize } from '../../models';

const sync = async() =>  {
    //throw new Error('error 발생함 ㅋㅋ');
    //동기화
    return  models.sequelize.sync({force:false})
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
        sync()
    } catch(err) {
        console.log(err)
    }
    res.send('hello DB');
})

module.exports = router;