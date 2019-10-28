
import express from 'express';
import { db } from '../../middleware'

const adminFunctionRouter = express.Router();

adminFunctionRouter.get('/src-add',  async (req, res) => {
    let users;    
    await db.SDT_USER.findAll({
        raw:true,
        attributes: ['USER_NO','USER_NM']
    })
    .then(results => {
        users = results;
    })
    .catch( e => {
        console.log(e)
    })

    res.json(users)
    
})

adminFunctionRouter.post('/src-add',  async (req, res) => {
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

export default adminFunctionRouter;