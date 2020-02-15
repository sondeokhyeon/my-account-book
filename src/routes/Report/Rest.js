import express from 'express'
import { sequelize, Sequelize } from '../../../database/models';
import { db, photoUploader, restLoginChk } from '../../middleware';
const ReportRestRouter = express.Router();

ReportRestRouter.get('/datas', restLoginChk, async (req, res) => {
    const { query: { refdate } } = req;
    let data = await db.DT_DETAIL.findAll({
        raw: true,
        where: Sequelize.where(Sequelize.fn("concat", Sequelize.col('DT_DETAIL.createdAt')), {
            [Sequelize.Op.startsWith]: `${refdate}`
        }),
        attributes: [
            [sequelize.fn('date_format', sequelize.col('DT_DETAIL.createdAt'), '%Y-%m-%d'), 'date'],
            [sequelize.fn('date_format', sequelize.col('DT_DETAIL.createdAt'), '%Y-%m-%d %T'), 'datetime'],
            'MONEY',
            'ISMJ_NO',
            'ISMJ_MJ_NM',
            'COMMENT',
            'CONTENTS',
            'DT_NO'
        ],
        include: [{
            model: db.DT_SRC,
            attributes: [
                'SRC_NAME',
                'SRC_CATEGORY',
                'IS_CREDIT',
                'SRC_MONEY',
                'SRC_BANK'
            ]
        }, {
            model: db.STP_ISMJ,
            attributes: [
                'ISMJ_MN_NM',
                'ISMJ_MS_NM',
                'ISMJ_TYPE'
            ]
        }, {
            model: db.DT_FILE,
            attributes: [
                'FILE_ORINM',
                'FILE_LOGNM',
                'FILE_PATH'
            ]
        }

        ],
        order: [
            [[sequelize.fn('date_format', sequelize.col('DT_DETAIL.createdAt'), '%y-%m-%d'), 'DESC']],
            ['ISMJ_MJ_NM', 'DESC']
        ]
    })
    res.json(data)
})

ReportRestRouter.get('/data-summary', async (req, res) => {
    const { query: { date } } = req;
    let spend, income, result;
    try {
        spend = await db.DT_DETAIL.sum('MONEY', {
            where: [
                {
                    [Sequelize.Op.or]: [
                        { ISMJ_MJ_NM: '지출' },
                        { ISMJ_MJ_NM: '이체' }
                    ]
                },
                Sequelize.where(Sequelize.fn("concat", Sequelize.col('DT_DETAIL.createdAt')), {
                    [Sequelize.Op.startsWith]: `${date}`
                })
            ]
        }
        )
        income = await db.DT_DETAIL.sum('MONEY', {
            where: [
                { ISMJ_MJ_NM: '수입' },
                Sequelize.where(Sequelize.fn("concat", Sequelize.col('DT_DETAIL.createdAt')), {
                    [Sequelize.Op.startsWith]: `${date}`
                })
            ]
        }
        )
        result = { income, spend }
        res.json(result);
    } catch (err) {
        console.log(err)
        res.json('err');
    }
})

ReportRestRouter.get('/sources', async (req, res) => {
    res.json(await db.DT_SRC.findAll({ raw: true }))
})

ReportRestRouter.get('/spend-first-handler', async (req, res) => {
    const { query: { sort } } = req
    let data;
    try {
        if (sort === '지출') {
            data = await db.STP_ISMJ.findAll({
                raw: true,
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('ISMJ_MN_NM')), 'ISMJ_MN_NM']
                ],
                where: {
                    'ISMJ_MJ_NM': sort
                }
            })
        } else {
            data = await db.STP_ISMJ.findAll({
                raw: true,
                attributes: [
                    'ISMJ_NO',
                    'ISMJ_MN_NM'
                ],
                where: {
                    'ISMJ_MJ_NM': sort
                }
            })
        }
        res.json(data)
    } catch (err) {
        res.json(err)
    }
})

ReportRestRouter.get('/spend-sub-handler', async (req, res) => {
    const { query: { sort } } = req
    let data;
    try {
        data = await db.STP_ISMJ.findAll({
            raw: true,
            attributes: [
                'ISMJ_NO',
                'ISMJ_MS_NM'
            ],
            where: {
                'ISMJ_MN_NM': sort,
                'ISMJ_TYPE': 'A'
            }
        })
        res.json(data)
    } catch (err) {
        res.json(err)
    }
})

ReportRestRouter.post('/spen', photoUploader.single('photo'), async (req, res) => {
    const { body: {
        datetime
        , src
        , major
        , minor
        , sminor
        , contents
        , money
        , comment
    }
    } = req;
    try {
        let ismjNo;
        if (sminor) {
            ismjNo = sminor;
        } else {
            ismjNo = minor;
        }
        let dataNo = '';
        const { user: { no }, file } = req;
        await db.DT_DETAIL.create(
            {
                SRC_NO: src,
                MONEY: money,
                CONTENTS: contents,
                ISMJ_NO: ismjNo,
                ISMJ_MJ_NM: major,
                USER_NO: no,
                COMMENT: comment,
                createdAt: datetime
            })
            .then(result => {
                if (file) {
                    dataNo = result.DT_NO
                    db.DT_FILE.create({
                        DT_NO: dataNo,
                        FILE_ORINM: file.originalname,
                        FILE_LOGNM: file.filename,
                        FILE_PATH: file.path
                    })
                }
            })

        res.json('success')
    } catch (err) {
        console.log(err)
        res.json('fail')
    }
})

ReportRestRouter.get('/:id/get', async (req, res) => {
    const { params: { id } } = req;
    let result = await db.DT_DETAIL.findOne({
        raw: true,
        where: {
            DT_NO: id
        },
        attributes: [
            [sequelize.fn('date_format', sequelize.col('DT_DETAIL.createdAt'), '%Y-%m-%d'), 'date'],
            [sequelize.fn('date_format', sequelize.col('DT_DETAIL.createdAt'), '%Y-%m-%d %T'), 'datetime'],
            'MONEY',
            'ISMJ_NO',
            'ISMJ_MJ_NM',
            'COMMENT',
            'CONTENTS',
            'DT_NO'
        ],
        include: [{
            model: db.DT_SRC,
            attributes: [
                'SRC_NAME',
                'SRC_CATEGORY',
                'IS_CREDIT',
                'SRC_MONEY',
                'SRC_BANK'
            ]
        }, {
            model: db.STP_ISMJ,
            attributes: [
                'ISMJ_MN_NM',
                'ISMJ_MS_NM',
                'ISMJ_TYPE'
            ],
        }, {
            model: db.DT_FILE,
            attributes: [
                'FILE_ORINM',
                'FILE_PATH',
                'FILE_NO'
            ]
        }]
    })
    res.json(result)
})

ReportRestRouter.post('/:id/update', photoUploader.single('photo'), async (req, res) => {
    try {
        const { body: {
            src
            , major
            , minor
            , sminor
            , contents
            , money
            , comment
            , dno
        } } = req;
        let ismjNo;
        if (sminor) {
            ismjNo = sminor;
        } else {
            ismjNo = minor;
        }
        const { file } = req;
        await db.DT_DETAIL.update({
            SRC_NO: src,
            MONEY: money,
            CONTENTS: contents,
            ISMJ_NO: ismjNo,
            ISMJ_MJ_NM: major,
            COMMENT: comment,
        }, {
            where: { DT_NO: dno }
        }).then(() => {
            if (file) {
                db.DT_FILE.create({
                    DT_NO: dno,
                    FILE_ORINM: file.originalname,
                    FILE_LOGNM: file.filename,
                    FILE_PATH: file.path
                })
            }
        });
        res.json('success')
    } catch (err) {
        console.log(err)
        res.json('fail')
    }
})


ReportRestRouter.delete('/:id/delete', async (req, res) => {
    const { params: { id } } = req;
    try {
        let item = await db.DT_FILE.findOne({
            raw: true,
            attributes: ['FILE_NO'],
            where: { DT_NO: id },
        })
        if (item) {
            await db.DT_FILE.destroy({
                raw: true,
                where: { FILE_NO: item.FILE_NO }
            })
        }
        await db.DT_DETAIL.destroy({
            raw: true,
            where: { DT_NO: id }
        })
        res.json('success')
    } catch (err) {
        res.json('fail')
    }
})

ReportRestRouter.get('/:no/cmtget', async (req, res) => {
    const { params: { no } } = req;
    const data = await db.DT_DETAIL.findOne({
        raw: true,
        attributes: ['COMMENT'],
        where: {
            DT_NO: no
        }
    })
    res.json(data)
});

ReportRestRouter.put('/:no/cmtput', async (req, res) => {
    const { body: { cont }, params: { no } } = req;
    try {
        await db.DT_DETAIL.update(
            { COMMENT: cont },
            { where: { DT_NO: no } }
        );
        res.json('success')
    } catch (err) {
        console.log(err)
        res.json('fail')
    }
});

ReportRestRouter.delete('/:id/photodel', async (req, res) => {
    const { params: { id } } = req;
    try {
        await db.DT_FILE.destroy({
            raw: true,
            where: { FILE_NO: id }
        })
        res.json('success')
    } catch (err) {
        res.json('fail')
    }
})


export default ReportRestRouter;