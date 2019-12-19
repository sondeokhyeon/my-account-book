
import axios from 'axios';
import { library, dom } from "@fortawesome/fontawesome-svg-core"
import { faTrashAlt, faEdit, faCommentAlt, faImage } from "@fortawesome/free-solid-svg-icons"
import { getId, commaSetup } from "./cmm";
import { yearPickerInit } from "./picker"

const dataModifyHandler = () => {
    Array.from(document.getElementsByClassName('data-modify')).map(item => {
        item.addEventListener('click', () => {
            console.log(item)
        })
    })
}

const dataDeleteHandler = () => {
    Array.from(document.getElementsByClassName('data-delete')).map(item => {
        item.addEventListener('click', () => {
            console.log(item)
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

        const container = document.getElementById('contents-body__container')
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
                    item['STP_ISMJ.ISMJ_TYPE'] === 'I' ? elem += '<li class="right w100" style="color:blue;">+' + commaSetup(`${item['MONEY']}`) + '</li>'
                        : elem += '<li class="right w100" style="color:red;">-' + commaSetup(`${item['MONEY']}`) + '</li>'
                    elem += `<li class="center w100" id="comment_trigger" data-id=${item['DT_NO']}>`

                    item["COMMENT"] !== null && item["COMMENT"] !== '' &&
                        (elem += `<span class="comment-trigger" comment-trigger=${item["DT_NO"]}>
                                        <i class="fas fa-comment-alt"></i>
                                        <div class="comment-item" id="comment-body-${item["DT_NO"]}">${item.COMMENT}</div>
                                     </span>`);
                    typeof (item["DT_FILEs.FILE_ORINM"]) === 'string' &&
                        (elem += `<span class="photo-trigger" photo-trigger=${item["DT_NO"]}>
                                        <i class="fas fa-image"></i>
                                        <img class="photo-item" id="photo-item-${item["DT_NO"]}" alt="photo" src=${location.origin}/${item["DT_FILEs.FILE_PATH"]}>
                                      </span>`);
                    elem += `</li>`
                        // + `<li class="center"><button id="change_detail" data-id=${item['DT_NO']}>수정하기</button></li>`
                        // + `<li class="center"><button id="delete_detail" data-id=${item['DT_NO']}>삭제하기</button></li>`

                        + '<li class="center w100">'
                        + `<span class="data-modify" data-id=${item["DT_NO"]}><i class="btn-pointer fas fa-edit"></i><span> / `
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
        item.addEventListener('mouseenter', (event) => {
            getId('photo-item-' + event.target.getAttribute('photo-trigger')).style.display = 'block';
        })
        item.addEventListener('mouseleave', (event) => {
            getId('photo-item-' + event.target.getAttribute('photo-trigger')).style.display = 'none';
        })

    })
}
const commentHandler = () => {
    Array.from(document.getElementsByClassName('comment-trigger')).map(item => {
        item.addEventListener('mouseenter', (event) => {
            getId('comment-body-' + event.target.getAttribute('comment-trigger')).style.display = 'block';
        })
        item.addEventListener('mouseleave', (event) => {
            getId('comment-body-' + event.target.getAttribute('comment-trigger')).style.display = 'none';
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
        params: {
            date: year + '-' + month
        }
    })
        .then(result => {
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
    const month = getId('ref_month').selectedIndex = new Date().getMonth();
    reportSummary(month)
    dataManager.init(month, year)
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



