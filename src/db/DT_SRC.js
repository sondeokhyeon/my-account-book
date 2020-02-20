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

export const SRCInsert = (body) => {
    const { name,
        bank,
        category,
        money,
        user_no,
        comment } = body
    return db.DT_SRC.create({
        SRC_NAME: name,
        SRC_BANK: bank,
        SRC_CATEGORY: category,
        SRC_MONEY: money,
        USER_NO: user_no,
        COMMENT: comment
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

export const SRCModifyData = async (body) => {
    const { name,
        bank,
        category,
        money,
        user_no,
        comment,
        srcNo } = body
    return db.DT_SRC.update({
        SRC_NAME: name,
        SRC_BANK: bank,
        SRC_CATEGORY: category,
        SRC_MONEY: money,
        USER_NO: user_no,
        COMMENT: comment
    }, {
        where: { SRC_NO: srcNo }
    })
}