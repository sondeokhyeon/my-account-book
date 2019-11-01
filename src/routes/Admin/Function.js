
import express from 'express';
import { db } from '../../middleware'
import { sequelize } from '../../../database/models';

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
            attributes: [
                'ISMJ_NO',
                'ISMJ_MJ_NM',
                'ISMJ_MN_NM',
                [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y-%m-%d %T'), 'createdAt'],
                [sequelize.fn('date_format', sequelize.col('updatedAt'), '%Y-%m-%d %T'), 'updatedAt'],
            ],
            where : {
                'ISMJ_MJ_NM' : majorName
            }
        })
    } catch(e) {
        console.log(e)
    }
    res.json(data)
}) 

adminFunctionRouter.post('/pen-major-add', async(req, res) => {
  const { body : {major_name, minor_name}} = req  
  let type = '';
  switch(major_name) {
     case '지출' : 
        type = 'S'
        break;
     case '이체' : 
        type = 'F'
        break;
     case '수입' : 
        type = 'I'
        break;
  } 
  try {
      await db.STP_ISMJ.create({
          ISMJ_MJ_NM: major_name,
          ISMJ_MN_NM: minor_name,
          ISMJ_TYPE: type
      })
  } catch(e) {
    console.log(e)
  }
  res.redirect('/admin/pen')
})

adminFunctionRouter.get('/pen-spend-mnsub-get', async(req,res) => {
    const { query : { majorName }} = req
    let minor = [];
    let subminor = [];

    let DBDatas = '';
    try {
        DBDatas = await db.STP_ISMJ.findAll({
            raw : true,
            attributes: [
                'ISMJ_NO',
                'ISMJ_MJ_NM',
                'ISMJ_MN_NM',
                'ISMJ_MS_NM',
                'ISMJ_TYPE',
                'ISMJ_RANK',
                [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y-%m-%d %T'), 'createdAt'],
                [sequelize.fn('date_format', sequelize.col('updatedAt'), '%Y-%m-%d %T'), 'updatedAt'],
            ],
            where : {
                'ISMJ_MJ_NM' : majorName
            }
        })

        DBDatas.map((data) => {
            if(data.ISMJ_TYPE === 'S') {
                minor.push(data)
            } else {
                subminor.push(data)
            }
        })
    } catch(e) {
        console.log(e)
    }
    res.json({minor, subminor} );
})

adminFunctionRouter.post('/pen-spend-mnsub-add', async(req,res) => {
    const { body : {major_name, minor_name, minor_sub_name}} = req  
    let type = '';
    try {
        if(minor_sub_name) {
            type = 'A'
        } else {
            throw '이름이 입력 안됨'
        }
        await db.STP_ISMJ.create({
            ISMJ_MJ_NM: major_name,
            ISMJ_MN_NM: minor_name,
            ISMJ_MS_NM: minor_sub_name,
            ISMJ_TYPE: type
        })
    } catch(e) {
      console.log(e);
    }
    res.redirect('/admin/pen');
}) 

export default adminFunctionRouter;