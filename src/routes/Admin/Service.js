import {
    SRCFindAll,
    SRCFindAllNoNm,
    SRCFindOne,
    SRCMJInsert,
    SRCMJModifyData
} from '../../db/DT_SRC'

const sucesssChk = (func) => {
    return func
        .then(() => {
            return true;
        })
        .catch((err) => {
            console.log(err)
            return false;
        })
}

export const SRCFindAllService = async () => {
    let major = [], minor = [];
    await SRCFindAll().map((item) => {
        if (item.SRC_MJCG === 'a') {
            minor.push(item);
        } else {
            major.push(item);
        }
    })
    return { major, minor }
}

export const SRCFindAllNoNmService = () => {
    return SRCFindAllNoNm().catch(err => { console.log(err) })
}

export const SRCMJInsertService = (body) => {
    return sucesssChk(SRCMJInsert(body))
}

export const SRCFindOneService = (srcNo) => {
    return SRCFindOne(srcNo).catch(err => { console.log(err) })
}

export const SRCMJModifyDataService = (body) => {
    return sucesssChk(SRCMJModifyData(body))
}
