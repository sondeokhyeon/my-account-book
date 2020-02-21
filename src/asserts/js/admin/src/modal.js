import handlebars from "handlebars"
import axios from "axios";
import { getId, formSerialize } from "../../cmm";

export const modal = {

    majorOpen: () => {
        let modalTemplate = handlebars.compile(getId('src-modal-template').innerHTML);
        let data = { 'modalTitle': '추가하기' }
        handlebars.registerPartial('subForm', getId('modal-major-add__partial').innerHTML);
        getId('modal-container').innerHTML = modalTemplate(data)
        modalUtil.majorOpenInit();
        getId('source-modals').style.display = 'flex';
        getId('regi-submit').addEventListener('click', () => {
            modalUtil.submitHandler('등록할껀가요?', '/af/src-add')
        })
    },

    majorModifyOpen: (data) => {
        let modalTemplate = handlebars.compile(getId('src-modal-template').innerHTML);
        let modalData = { 'modalTitle': '수정하기' }
        modalData.info = data
        handlebars.registerPartial('subForm', getId('modal-major-add__partial').innerHTML);
        getId('modal-container').innerHTML = modalTemplate(modalData)
        modalUtil.minorOpenInit(data);
        getId('source-modals').style.display = 'flex'
        getId('regi-submit').addEventListener('click', () => {
            modalUtil.submitHandler('수정할껀가요?', '/af/src-modify')
        })
    },

    minorOpen: (SRC_CNAME) => {
        let modalTemplate = handlebars.compile(getId('src-modal-template').innerHTML);
        handlebars.registerPartial('subForm', getId('modal-minor-add__partial').innerHTML);
        let data = { 'modalTitle': '하위등록', SRC_CNAME }
        getId('modal-container').innerHTML = modalTemplate(data)
        modalUtil.useNamesInit();
        modalUtil.closeHandler();
        getId('regi-submit').addEventListener('click', () => {
            modalUtil.submitHandler('등록할껀가요?', '/af/src-add')
        })
        getId('source-modals').style.display = 'flex';
    },
}

const modalUtil = {
    majorOpenInit: () => {
        modalUtil.useNamesInit();
        modalUtil.closeHandler();
        modalUtil.bankNameFormHandler()
    },
    minorOpenInit: (data) => {
        modalUtil.useNamesInit();
        modalUtil.closeHandler();
        modalUtil.categoryHandler(data.SRC_MJCG);
        modalUtil.bankNameFormHandler(data.SRC_BANK)
    },
    useNamesInit: async () => {
        await fetch('/af/src-add', {
            method: 'get'
        }).then(result => {
            return result.text();
        }).then(result => {
            const select = getId('user_no');
            select.innerHTML = '';
            const names = JSON.parse(result);
            for (let index in names) {
                select.innerHTML += `<option value=${names[index].USER_NO}> ${names[index].USER_NM} </option>`
            }
            return select;
        })
    },
    categoryHandler: (flag) => {
        if (flag === 'c') {
            getId('category_two').checked = true;
        } else {
            getId('category_one').checked = true;
        }
    },
    submitHandler: async (msg, src) => {
        if (confirm(msg) === true) {
            await axios.post(src, formSerialize(getId('src-form')))
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
    },
    closeHandler: () => {
        getId('modal-footer').innerHTML += "<span class='modal-footer__btn' id='regi-submit'>등록하기</span>"
        getId('modal-footer').innerHTML += "<span class='modal-footer__btn' id='regi-cancle'>취소하기</span>"
        getId('regi-cancle').addEventListener('click', () => {
            getId('source-modals').style.display = 'none'
        })
        getId('modal-close').addEventListener('click', () => {
            getId('src-form').reset();
            getId('source-modals').style.display = 'none'
        })
    },

    bankNameFormHandler: (name) => {
        if (getId('category_two').checked === true) {
            getId('bank-name__container').innerHTML += `<label class="body-label">은행 이름<input type="text" required="required" name="bank" value='${name}' id="src_bank"/></label>`
        }
        getId('category_two').addEventListener('focus', function () {
            getId('bank-name__container').innerHTML = '';
            getId('bank-name__container').innerHTML += `<label class="body-label">은행 이름<input type="text" required="required" name="bank" value='' id="src_bank"/></label>`
        })
        getId('category_one').addEventListener('focus', function () {
            getId('bank-name__container').innerHTML = '';
        })
    }
}
