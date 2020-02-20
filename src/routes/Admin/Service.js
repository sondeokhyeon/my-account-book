import {
    SRCFindAll,
    SRCFindOne,
    SRCInsert,
    SRCModifyData
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

export const SRCFindAllService = () => {
    return SRCFindAll().catch(err => { console.log(err) })
}

export const SRCInsertService = (body) => {
    return sucesssChk(SRCInsert(body))
}

export const SRCFindOneService = (srcNo) => {
    return SRCFindOne(srcNo).catch(err => { console.log(err) })
}

export const SRCModifyDataService = (body) => {
    return sucesssChk(SRCModifyData(body))
}
