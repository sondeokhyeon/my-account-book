import { db, sequelize } from '../cmm/db'

export const FindAll = () => {
    return db.DT_SRC.findAll({
        raw: true,
        where: { IS_USE: 1 },
        include: {
            model: db.SDT_USER,
            attributes: ['USER_NM'],
            replacements: 'USER_NM'
        }
    })
}

export const Find_Account_FindALL = () => {
    return db.DT_SRC.findAll({
        raw: true,
        where: { SRC_MJCG: 'c' }
    })
}

export const Find_CNAME_findALL = (name) => {
    return db.DT_SRC.findAll({
        raw: true,
        where: { SRC_CNAME: name }
    })
}

export const FindAllNoNm = () => {
    return db.SDT_USER.findAll({
        raw: true,
        attributes: ['USER_NO', 'USER_NM']
    })
}

export const FindOne = (srcNo) => {
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

export const MJInsert = (body) => {
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

export const MJModifyData = async (body) => {
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

export const MJDependMinorModifyData = (body, data) => {
    const { name } = body
    return db.DT_SRC.update({
        SRC_CNAME: name,
    }, {
        where: { SRC_CNAME: data.SRC_NAME }
    })
}

export const MNModifyData = (body) => {
    const {
        name,
        cname,
        is_credit,
        user_no,
        comment,
        srcNo } = body
    return db.DT_SRC.update({
        SRC_NAME: name,
        SRC_CNAME: cname,
        IS_CREDIT: is_credit,
        USER_NO: user_no,
        COMMENT: comment
    }, {
        where: { SRC_NO: srcNo }
    })
}

export const use_status_update = (srcNo) => {
    return db.DT_SRC.update({
        IS_USE: 0
    }, {
        where: { SRC_NO: srcNo }
    })
}

export const delete_Data = (srcNo) => {
    return db.DT_SRC.destroy({
        where: { SRC_NO: srcNo }
    })
}