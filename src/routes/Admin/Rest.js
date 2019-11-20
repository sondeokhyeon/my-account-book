
import express from 'express';
import { db } from '../../middleware'
import { sequelize } from '../../../database/models';

const adminRestRouter = express.Router();



adminRestRouter.get('/src-getdata', async (req, res) => {
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
    res.json(srcs);
})


adminRestRouter.get('/src-add',  async (req, res) => {
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

adminRestRouter.post('/src-add',  async (req, res) => {
    const { body: {name, 
                    bank, 
                    category,
                    money,
                    is_credit,
                    user_no, 
                    comment} 
            } = req;
            
    try {
        await db.DT_SRC.create({
            SRC_NAME : name,
            SRC_BANK : bank,
            SRC_CATEGORY : category,
            SRC_MONEY : money,
            USER_NO: user_no,
            IS_CREDIT : is_credit,
            COMMENT : comment
        })
    } catch (err) {
        console.log(err)
    }
   res.redirect('/admin/src')
})


adminRestRouter.get('/src-modify', async (req, res) => {
    const {query : { srcNo }} = req;
    let data;
    try {
        data = await db.DT_SRC.findOne({
            where: { SRC_NO : srcNo },
            include : { 
                model : db.SDT_USER,
                attributes: ['USER_NM'],
                replacements : 'USER_NM'
            }
        })
        
    } catch (err) {
        console.log(err)
    }
    res.json(data)
})

adminRestRouter.post('/src-modify', async (req, res) => {
    const { body : {name, bank, money, srcNo, comment} } = req;
    try {
        await db.DT_SRC.update({
            SRC_NAME: name,
            SRC_BANK: bank,
            SRC_MONEY: money,
            COMMNET: comment
        }, {
            where: {SRC_NO : srcNo}
        })
    } catch (err) {
        console.log(err)
        res.redirect('/admin/src?msg=fail')
    }
    res.redirect('/admin/src?msg=success')
})

adminRestRouter.get('/pen-major-select', async(req, res) => {
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

adminRestRouter.post('/pen-major-add', async(req, res) => {
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

adminRestRouter.get('/pen-spend-mnsub-get', async(req,res) => {
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

adminRestRouter.post('/pen-spend-mnsub-add', async(req,res) => {
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
    res.redirect('/admin/pen#spending');
}) 

export default adminRestRouter;