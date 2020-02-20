import handlebars from "handlebars"
import axios from "axios";
import { getId, formSerialize } from "../../cmm";
const modalBtn = document.getElementById('modal-btn')

export const insertModalInit = () => {
    modalBtn.addEventListener('click', modal.open)
}

const modal = {
    open: async () => {
        let modalTemplate = getId('src-main__modal').innerHTML
        modalTemplate = handlebars.compile(modalTemplate);
        let subForm = getId('modal-major-add__partial').innerHTML;
        let data = { 'modalTitle': '추가하기' }
        handlebars.registerPartial('subForm', subForm);
        getId('modal-container').innerHTML = modalTemplate(data)
        getNames();
        modal.util()
        getId('source-modals').style.display = 'flex';
        getId('regi-submit').addEventListener('click', () => {
            submitHandler('등록할껀가요?', '/af/src-add')
        })
    },

    minorOpen: () => {
        let modalTemplate = document.getElementById('src-main__modal').innerHTML
    },

    close: () => {
        document.getElementById('source-modals').style.display = 'none'
    },

    regiCancle: () => {
        document.getElementById('src-form').reset();
        document.getElementById('source-modals').style.display = 'none'
    },

    modifyOpen: (data) => {
        let modalTemplate = document.getElementById('src-main__modal').innerHTML
        modalTemplate = handlebars.compile(modalTemplate);
        let modalData = { 'modalTitle': '수정하기' }
        modalData.info = data
        let subForm = document.getElementById('modal-major-add__partial').innerHTML;
        handlebars.registerPartial('subForm', subForm);
        document.getElementById('modal-container').innerHTML = modalTemplate(modalData)
        getNames();
        modal.util();
        categorySelect(data.SRC_CATEGORY);
        document.getElementById('source-modals').style.display = 'flex'
        document.getElementById('regi-submit').addEventListener('click', () => {
            submitHandler('수정할껀가요?', '/af/src-modify')
        })
    },

    util: () => {
        document.getElementById('modal-footer').innerHTML += "<span class='modal-footer__btn' id='regi-submit'>등록하기</span>"
        document.getElementById('modal-footer').innerHTML += "<span class='modal-footer__btn' id='regi-cancle'>취소하기</span>"
        document.getElementById('regi-cancle').addEventListener('click', modal.regiCancle)
        document.getElementById('modal-close').addEventListener('click', modal.close)
        document.getElementById('category_two').addEventListener('focus', function () {
            document.getElementById('bank-name__container').innerHTML += `<label class="body-label">은행 이름<input type="text" required="required" name="bank" value='' id="src_bank"/></label>`
        })
        document.getElementById('category_one').addEventListener('focus', function () {
            document.getElementById('bank-name__container').innerHTML = '';
        })
    }
}

handlebars.registerHelper('categoryChk', (val1) => {
    if (val1 === null) {
        return "";
    } else if (val1 === 'o') {
        return "현금"
    } else {
        return "계좌"
    }
})

handlebars.registerHelper('creditChk', (val1) => {
    if (val1 === null) {
        return "";
    } else if (val1 === 1) {
        return "신용카드"
    } else {
        return "체크카드"
    }
})

export const dataInit = async () => {
    let item
    await axios.get('/af/src-getdata')
        .then(result => {
            item = result.data
        })
    let template = document.getElementById('src-main__body').innerHTML
    template = handlebars.compile(template);
    document.getElementById('main__body').innerHTML = template(item)
}

export const dataDelete = () => {
    Array.from(document.getElementsByClassName('data-delete')).map((item) => {
        item.addEventListener('click', () => {
            if (confirm('이 항목은 가계부 상세 내역이 없어야 지울 수 있습니다.\n계속하시겠습니까?') === true) {
                alert('상세내역이 있을경우 이 항목은 숨김처리됩니다.')
                console.log(item.getAttribute('data-no'))
            }
        })
    })
}

export const dataModify = () => {
    Array.from(document.getElementsByClassName('data-modify')).map((item) => {
        item.addEventListener('click', async () => {
            let data;
            const { origin } = location
            await axios.get(origin + '/af/src-modify', {
                params: {
                    'srcNo': item.getAttribute('data-no')
                }
            }).then(result => {
                data = result.data
            })
            modal.modifyOpen(data)
        })
    })
}

const getNames = async () => {
    await fetch('/af/src-add', {
        method: 'get'
    }).then(result => {
        return result.text();
    }).then(text => {
        const select = document.getElementById('user_no');
        select.innerHTML = '';
        const names = JSON.parse(text);
        for (let index in names) {
            select.innerHTML += `<option value=${names[index].USER_NO}> ${names[index].USER_NM} </option>`
        }
        return select;
    })
}

const categorySelect = (flag) => {
    if (flag === 'c') {
        getId('category_two').checked = true;
    } else {
        getId('category_one').checked = true;
    }
}

const submitHandler = async (msg, src) => {
    if (confirm(msg) === true) {
        await axios.post(src, formSerialize(document.getElementById('src-form')))
            .then(result => {
                if (result.data === true) {
                    alert('저장되었시유')
                    location.reload();
                    return false;
                }
                alert('헐 에러발생...이거보면 연락줘유')
                return false;
            })
        return false;
    }
}