
import express from 'express';
import { db } from '../../middleware'

const adminRouter = express.Router();

adminRouter.get('/', (req, res) => {
    res.render('admin/main')
})

adminRouter.get('/src',  async (req, res) => {
    let srcs;
    await db.DT_SRC.findAll({
        raw:true,
        include : { 
            model : db.SDT_USER,
            attributes: ['USER_NM'],
            replacements : 'USER_NM'
        }
    })
    .then(result => {
        srcs = result;
    }) 
    .catch( e => {
        console.log(e)
    })

    res.render('admin/src', {srcs}
    )
})

adminRouter.get('/pen', (req, res) => {
    db.STP_ISMN.findAll()
    .then(result => {
        console.log(result)
    }) 
    .catch( e => {
        console.log(e)
    })
    res.render('admin/pen')
})

export default adminRouter;