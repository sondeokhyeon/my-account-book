import express from 'express'
import { sequelize } from '../../../database/models';
import { db } from '../../middleware';
const ReportRestRouter  = express.Router();


ReportRestRouter.get('/sources', async (req, res) => {
    res.json( await db.DT_SRC.findAll({raw : true}) ) 
})

ReportRestRouter.get('/spend-first-handler', async (req, res) => {
    const { query : {sort} } = req
    let data;
    try {
        if(sort === '지출') {
            data = await db.STP_ISMJ.findAll({
                raw:true,
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('ISMJ_MN_NM')), 'ISMJ_MN_NM']
                ],
                where : {
                    'ISMJ_MJ_NM' : sort
                }
            })
        } else {
            data = await db.STP_ISMJ.findAll({
                raw: true,
                attributes : [
                    'ISMJ_MN_NM'
                ],
                where : {
                    'ISMJ_MJ_NM' : sort
                }
            })
        }
        res.json(data)
    } catch (err) {
        res.json(err)
    }
})

ReportRestRouter.get('/spend-sub-handler', async (req, res) => { 
    const { query : { sort } } = req
    let data; 
    try {
        data = await db.STP_ISMJ.findAll({
            raw : true,
            attributes : [
                'ISMJ_MS_NM'
            ],
            where : {
                'ISMJ_MN_NM' : sort 
            }
        })
        res.json(data)
    } catch (err) {
        res.json(err)
    }
})

export default ReportRestRouter;