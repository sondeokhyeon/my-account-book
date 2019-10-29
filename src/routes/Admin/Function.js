
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

adminFunctionRouter.get('/pen-major-select', async(req, res) => {
    const { query : {majorName} } = req;
    let data = '';
    try {
        data = await db.STP_ISMJ.findAll({
            raw : true,
            where : {
                ISMJ_MJ_NM : majorName
            }
        })
    } catch(e) {
        console.log(e)
    }
    res.json(data)
}) 

adminFunctionRouter.post('/pen-major-add', async(req, res) => {
  const { body : {major_name, minor_name}} = req  
  try {
      await db.STP_ISMJ.create({
          ISMJ_MJ_NM: major_name,
          ISMJ_MN_NM: minor_name
      })
  } catch(e) {
    console.log(e)
  }
  res.redirect('/admin/pen')
})

export default adminFunctionRouter;