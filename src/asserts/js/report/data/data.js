
import axios from 'axios';
import { library, dom } from "@fortawesome/fontawesome-svg-core"
import { faTrashAlt, faEdit, faCommentAlt, faImage } from "@fortawesome/free-solid-svg-icons"
import { getId, commaSetup } from "../../cmm";
import { dataModify, dataDelete } from './executor'
import { yearPickerInit } from "../picker"

const dataModifyHandler = () => {
    Array.from(document.getElementsByClassName('data-modify')).map(item => {
        item.addEventListener('click', () => {
            dataModify(item)
        })
    })
}

const dataDeleteHandler = () => {
    Array.from(document.getElementsByClassName('data-delete')).map(item => {
        item.addEventListener('click', () => {
            dataDelete(item.getAttribute('data-id'))
        })
    })
}

const dataManager = {
    init: async (month, year = '') => {
        if (typeof (month) === 'number') {
            month = month + 1
        }

        if (year === '') {
            const date = new Date();
            year = date.getFullYear();
        }

        const container = getId('contents-body__container')
        await axios.get('/rf/datas', {
            params: {
                refdate: `${year}-${month}`
            }
        })
            .then(result => {
                container.innerHTML = '';
                let elem = '';
                if (result.data.length === 0) {
                    elem = '<ul><li>이 달엔 데이터가 없네유..</li></ul>'
                    container.innerHTML += elem;
                    return false;
                }
                Array.from(result.data).map(item => {
                    // console.log(item)
                    elem = '<ul>'
                        + `<li class="center w100">${item['date']}</li>`
                        + `<li class="center w100">${item['DT_SRC.SRC_NAME']}</li>`
                        + `<li class="center w50">${item['ISMJ_MJ_NM']}</li>`
                        + `<li class="center w100">${item['STP_ISMJ.ISMJ_MN_NM']}</li>`
                        + `<li class="left w200">${item['CONTENTS']}</li>`

                    item['STP_ISMJ.ISMJ_TYPE'] === 'I' ? elem += '<li class="right w100" style="color:blue;">+' + commaSetup(`${item['MONEY']}`) + '</li>' : elem += '<li class="right w100" style="color:red;">-' + commaSetup(`${item['MONEY']}`) + '</li>'
                    elem += `<li class="center w100" id="comment_trigger" data-id=${item['DT_NO']}>`

                    item["COMMENT"] !== null && item["COMMENT"] !== '' && (
                        elem += `<span class="comment-trigger" comment-trigger=${item["DT_NO"]}>
                                  <i class="fas fa-comment-alt"></i>
                                  <div class="comment-container" id="comment-body-${item["DT_NO"]}">
                                    <div class="comment-back" id="comment-back-${item["DT_NO"]}"></div>
                                    <div class="comment-item">
                                    <textarea id="comment-text-${item["DT_NO"]}" style="resize:none;">${item.COMMENT}</textarea>
                                        <button id="comment-submit-${item["DT_NO"]}" type="button">수정</button>
                                    </div>
                                  </div>
                                  </span>`);
                    typeof (item["DT_FILEs.FILE_ORINM"]) === 'string' && (
                        elem += `<span class="photo-trigger" photo-trigger=${item["DT_NO"]}>
                                 <i class="fas fa-image"></i>
                                 <div class="photo-container" id="photo-body-${item["DT_NO"]}">
                                    <div class="photo-back" id="photo-back-${item["DT_NO"]}"></div>
                                    <img class="photo-item" id="photo-item-${item["DT_NO"]}" alt="photo" src=${location.origin}/${item["DT_FILEs.FILE_PATH"]}>
                                 </div>
                                 </span>`);
                    elem += `</li>`
                        + '<li class="center w100">'
                        + `<span class="data-modify" data-id=${item["DT_NO"]}><i class="btn-pointer fas fa-edit"></i></span> / `
                        + `<span class="data-delete" data-id=${item["DT_NO"]}><i class="btn-pointer fas fa-trash-alt"}></i></span></li>`
                        + '</ul>'
                    container.innerHTML += elem;
                })
            })
        photoHandler();
        commentHandler();
        dataModifyHandler()
        dataDeleteHandler()
    },
} // end

const photoHandler = () => {
    Array.from(document.getElementsByClassName('photo-trigger')).map(item => {
        item.addEventListener('click', (event) => {
            let no = (item.getAttribute('photo-trigger'))
            getId(`photo-body-${no}`).style.display = 'block';
            getId(`photo-back-${no}`).onclick = ((event) => {
                event.stopPropagation();
                getId(`photo-body-${no}`).style.display = 'none';
            });
        })
    })
}
const commentHandler = () => {
    Array.from(document.getElementsByClassName('comment-trigger')).map(item => {
        item.addEventListener('click', () => {
            let no = item.getAttribute('comment-trigger');
            getId(`comment-body-${no}`).style.display = 'block';
            axios.get(`/rf/${no}/cmtget`)
                .then(result => {
                    getId(`comment-text-${no}`).value = result.data.COMMENT
                })
            getId(`comment-submit-${no}`).onclick = (() => {
                if (confirm('수정하시겠소?') === true) {
                    let data = new Object();
                    data.cont = getId(`comment-text-${no}`).value;
                    axios.put(`/rf/${no}/cmtput`, data)
                        .then(result => {
                            if (result.data === 'success') {
                                alert('수정되었시유')
                                getId(`comment-body-${no}`).style.display = 'none';
                                return false;
                            }
                            alert('에러발새...ㅇ?')
                            console.log(result)
                            return false;
                        })
                }
            });
            getId(`comment-back-${no}`).onclick = ((event) => {
                event.stopPropagation();
                getId(`comment-body-${no}`).style.display = 'none';
            });
        })
    })
}

const reportSummary = (month, year = '') => {
    const date = new Date();
    if (typeof (month) === 'number') {
        month = month + 1
    }
    if (year === '') {
        year = date.getFullYear()
    }

    getId('month-income__title').innerText = `${month}월 수입액 `
    getId('month-spend__title').innerText = `${month}월 지출액 `

    axios.get('/rf/data-summary', {
        params: { date: year + '-' + month }
    }).then(result => {
        const { income, spend } = result.data
        getId('month-income__content').innerText = `${typeof (income) === "number" ? commaSetup(income) : 0}원`
        getId('month-spend__content').innerText = `${typeof (spend) === "number" ? commaSetup(spend) : 0}원`
    })
}

const monthHandler = () => {
    getId('ref_month').addEventListener('change', () => {
        const year = getId('refYearPicker').getAttribute('value');
        const month = getId('ref_month').value;
        reportSummary(month, year)
        dataManager.init(month, year)
    })
}

const monthInit = async () => {
    const year = getId('refYearPicker').getAttribute('value');
    const month = getId('ref_month')[new Date().getMonth()]
    month.selected = true
    dataManager.init(month.value, year)
    reportSummary(month.value, year)
    monthHandler()
}

export const reportHeaderInit = () => {
    library.add(faTrashAlt) // font-awesome
    library.add(faEdit) // font-awesome
    library.add(faCommentAlt) // font-awesome
    library.add(faImage) // font-awesome
    dom.watch() // font-awesome

    yearPickerInit() // 년도
    monthInit()      // 월
}



