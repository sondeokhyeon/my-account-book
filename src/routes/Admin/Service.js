import * as DT_SRC from '../../db/DT_SRC'
import { DATA_DETAIL_WHERE_FINDALL } from '../../db/DT_DETAIL'

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
    await DT_SRC.FindAll().map((item) => {
        if (item.SRC_MJCG === 'a') {
            minor.push(item);
        } else {
            major.push(item);
        }
    })
    return { major, minor }
}

export const SRCFindAllNoNmService = () => {
    return DT_SRC.FindAllNoNm().catch(err => { console.log(err) })
}

export const SRCMJInsertService = (body) => {
    return sucesssChk(DT_SRC.MJInsert(body))
}

export const SRCFindOneService = (srcNo) => {
    return DT_SRC.FindOne(srcNo).catch(err => { console.log(err) })
}

export const SRCMJModifyDataService = async (body) => {
    try {
        if (!body.cname) {
            const data = await DT_SRC.FindOne(body.srcNo);
            await DT_SRC.MJModifyData(body)
            await DT_SRC.MJDependMinorModifyData(body, data);
            return true;
        } else {
            await DT_SRC.MNModifyData(body)
            return true;
        }
    } catch (err) {
        return false;
    }
}

export const SRCDeleteDataService = async (id) => {
    try {
        let result = 0;
        const { SRC_NO, SRC_MJCG, SRC_NAME } = await DT_SRC.FindOne(id)
        if (SRC_MJCG !== 'a') { //하위항목인지 체크
            const cdata = await DT_SRC.Find_CNAME_findALL(SRC_NAME);
            cdata.length > 0 ? result = -1 : ''; // 하위항목을 가지고 있으면 에러
        }
        if (result != -1) {
            const detailData = await DATA_DETAIL_WHERE_FINDALL(SRC_NO)
            if (detailData.length > 0) {
                await DT_SRC.use_status_update(SRC_NO); // Detail데이터가 있으면 상태값 변경
                result = 2;
            } else {
                await DT_SRC.delete_Data(SRC_NO); // SRC데이터 지움
                result = 1;
            }
        }
        return result;
    } catch (err) {
        console.log(err)
        return 0;   // 에러 발생시
    }
}

export const SRCAccountFindService = () => {
    return DT_SRC.Find_Account_FindALL();
}