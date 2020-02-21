import { db, sequelize } from '../cmm/db'

export const SRCFindAll = () => {
    return db.DT_SRC.findAll({
        raw: true,
        include: {
            model: db.SDT_USER,
            attributes: ['USER_NM'],
            replacements: 'USER_NM'
        }
    })
}

export const SRCFindAllNoNm = () => {
    return db.SDT_USER.findAll({
        raw: true,
        attributes: ['USER_NO', 'USER_NM']
    })
}

export const SRCFindOne = (srcNo) => {
    return db.DT_SRC.findOne({
        raw: true,
        where: { SRC_NO: srcNo },
        include: {
            model: db.SDT_USER,
            attributes: ['USER_NM'],
            replacements: 'USER_NM'
        }
    })
}

export const SRCMJInsert = (body) => {
    let { name,
        cname,
        bank,
        mjcg,
        money,
        is_credit,
        user_no,
        comment,
    } = body
    if (!cname) {
        cname = '';
    }
    return db.DT_SRC.create({
        SRC_NAME: name,
        SRC_CNAME: cname,
        SRC_BANK: bank,
        SRC_MJCG: mjcg,
        SRC_MONEY: money,
        IS_CREDIT: is_credit,
        USER_NO: user_no,
        COMMENT: comment
    })
}

export const SRCMJModifyData = async (body) => {
    const { name,
        bank,
        mjcg,
        money,
        user_no,
        is_credit,
        comment,
        srcNo } = body
    return db.DT_SRC.update({
        SRC_NAME: name,
        SRC_BANK: bank,
        SRC_MJCG: mjcg,
        SRC_MONEY: money,
        IS_CREDIT: is_credit,
        USER_NO: user_no,
        COMMENT: comment
    }, {
        where: { SRC_NO: srcNo }
    })
}