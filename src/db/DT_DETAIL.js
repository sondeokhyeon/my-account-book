import { db, sequelize } from '../cmm/db'

export const DATA_DETAIL_WHERE_FINDALL = (no) => {
    return db.DT_DETAIL.findAll({
        raw: true,
        where: {
            'SRC_NO': no
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
        ]
    })
}