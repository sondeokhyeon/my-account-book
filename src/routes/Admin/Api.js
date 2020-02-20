
import express from 'express';
import { db, sequelize } from '../../cmm/db'
import {
    SRCFindAllService,
    SRCInsertService,
    SRCFindOneService,
    SRCModifyDataService
} from './Service'
const adminRestRouter = express.Router();

adminRestRouter.get('/src-getdata', async (req, res) => {
    res.json(await SRCFindAllService());
})

adminRestRouter.post('/src-add', async (req, res) => {
    const { body } = req;
    res.json(await SRCInsertService(body))
})

adminRestRouter.get('/src-modify', async (req, res) => {
    const { query: { srcNo } } = req;
    res.json(await SRCFindOneService(srcNo))
})

adminRestRouter.post('/src-modify', async (req, res) => {
    const { body } = req;
    res.json(await SRCModifyDataService(body))
})

adminRestRouter.get('/src-add', async (req, res) => {
    let users;
    await db.SDT_USER.findAll({
        raw: true,
        attributes: ['USER_NO', 'USER_NM']
    })
        .then(results => {
            users = results;
        })
        .catch(e => {
            console.log(e)
        })

    res.json(users)

})

adminRestRouter.get('/pen-major-select', async (req, res) => {
    const { query: { majorName } } = req;
    let data = '';
    try {
        data = await db.STP_ISMJ.findAll({
            raw: true,
            attributes: [
                'ISMJ_NO',
                'ISMJ_MJ_NM',
                'ISMJ_MN_NM',
                [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y-%m-%d %T'), 'createdAt'],
                [sequelize.fn('date_format', sequelize.col('updatedAt'), '%Y-%m-%d %T'), 'updatedAt'],
            ],
            where: {
                'ISMJ_MJ_NM': majorName
            }
        })
    } catch (e) {
        console.log(e)
    }
    res.json(data)
})

adminRestRouter.post('/pen-major-add', async (req, res) => {
    const { body: { major_name, minor_name } } = req
    let type = '';
    let flag = '';
    switch (major_name) {
        case '지출':
            type = 'S'
            flag = '#spending'
            break;
        case '이체':
            type = 'F'
            flag = '#transfer'
            break;
        case '수입':
            type = 'I'
            flag = '#income'
            break;
    }
    try {
        await db.STP_ISMJ.create({
            ISMJ_MJ_NM: major_name,
            ISMJ_MN_NM: minor_name,
            ISMJ_TYPE: type
        })
    } catch (e) {
        console.log(e)
    }
    res.redirect('/admin/pen' + flag)
})

adminRestRouter.post('/pen-major-modify', async (req, res) => {
    const { body: { major_name, minor_name, item_no, type } } = req

    let flag = '';
    switch (major_name) {
        case '지출':
            flag = '#spending'
            break;
        case '이체':
            flag = '#transfer'
            break;
        case '수입':
            flag = '#income'
            break;
    }

    try {
        if (type === 'S') {
            let oldItem = await db.STP_ISMJ.findOne({
                raw: true,
                attributes: [
                    'ISMJ_MN_NM'
                ],
                where: { 'ISMJ_NO': item_no }
            })
            await db.STP_ISMJ.update({
                ISMJ_MN_NM: minor_name,
            }, {
                where: { ISMJ_MN_NM: oldItem.ISMJ_MN_NM }
            })
        } else {
            let oldItem = await db.STP_ISMJ.findOne({
                raw: true,
                attributes: [
                    'ISMJ_MS_NM'
                ],
                where: { 'ISMJ_NO': item_no }
            })
            await db.STP_ISMJ.update({
                ISMJ_MS_NM: minor_name,
            }, {
                where: { ISMJ_MS_NM: oldItem.ISMJ_MS_NM }
            })
        }
    } catch (e) {
        console.log(e)
    }
    res.redirect('/admin/pen' + flag);
})

adminRestRouter.get('/pen-spend-mnsub-get', async (req, res) => {
    const { query: { majorName } } = req
    let minor = [];
    let subminor = [];

    let DBDatas = '';
    try {
        DBDatas = await db.STP_ISMJ.findAll({
            raw: true,
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
            where: {
                'ISMJ_MJ_NM': majorName
            }
        })

        DBDatas.map((data) => {
            if (data.ISMJ_TYPE === 'S') {
                minor.push(data)
            } else {
                subminor.push(data)
            }
        })
    } catch (e) {
        console.log(e)
    }
    res.json({ minor, subminor });
})

adminRestRouter.post('/pen-spend-mnsub-add', async (req, res) => {
    const { body: { major_name, minor_name, minor_sub_name } } = req
    let type = '';
    try {
        if (minor_sub_name) {
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
    } catch (e) {
        console.log(e);
    }
    res.redirect('/admin/pen#spending');
})

export default adminRestRouter;