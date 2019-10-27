
import express from 'express';
import { db } from '../../middleware'

const adminRouter = express.Router();

adminRouter.get('/', (req, res) => {
    res.render('admin/main')
})

adminRouter.get('/src',  async (req, res) => {
    let srcs;
    let users;
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
console.log(srcs['SDT_USER.USER_NM'])
    await db.SDT_USER.findAll({
        raw:true
    })
    .then(results => {
        users = results;
    })
    .catch( e => {
        console.log(e)
    })

    res.render('admin/src', {
        srcs:srcs, 
        users:users}
    )
})

adminRouter.post('/src-add',  async (req, res) => {
    const { body: {name, 
                    bank, 
                    category,
                    money,
                    is_credit,
                    user_no, 
                    comment} 
            } = req;
   await db.DT_SRC.create({
       SRC_NAME : name,
       SRC_BANK : bank,
       SRC_CATEGORY : category,
       SRC_MONEY : money,
       USER_NO: user_no,
       IS_CREDIT : is_credit,
       COMMENT : comment
   })
   res.redirect('/admin/src')
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