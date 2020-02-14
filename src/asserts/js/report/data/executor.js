import { getId, formSerialize } from '../cmm'
import axios from "axios"
import handlebars from 'handlebars';
import { ModalHandler } from '../modal'

export const dataModify = (id) => {
    axios
        .get(`/rf/${id.getAttribute('data-id')}/get`)
        .then(result => {
            console.log(result.data)
            let formTemplate = handlebars.compile(document.getElementById('report-modal__update-template').innerHTML);
            let template = handlebars.compile(getId('report-modal__template').innerHTML);
            let data = { title: '수정하기' }
            getId('report-modal__territory').innerHTML = '<div class="report-modal__background" id="report-modal__background"></div>';
            getId('report-modal__territory').innerHTML += template(data);
            getId('report-modal__body').innerHTML = formTemplate();
            getId('report-modal__territory').style.display = 'flex';

            ModalHandler.close();
            ModalHandler.sourceHandler();
            ModalHandler.spendHandler();
            ModalHandler.commentEventHandler();
            ModalHandler.imageUploadHadnler();
            dataSetup(result.data);
            dataUpdateHandler();
        })
}

const dataSetup = (res) => {
    const { datetime, MONEY, COMMENT, CONTENTS, ISMJ_MJ_NM, DT_NO } = res
    getId('spen-time-container').innerHTML = `<span class='main-title'>날짜</span><span class='main-title'>${datetime}</span>`
    getId('report_money').value = MONEY
    getId('comment').value = COMMENT
    getId('contents').value = CONTENTS
    getId('dno').value = DT_NO
    if (res['DT_FILEs.FILE_NO']) {
        getId('formPhoto-container').innerHTML = `<a href="/${res['DT_FILEs.FILE_PATH']}">${res['DT_FILEs.FILE_ORINM']}</a>
        <span id="photo-deletor-${res['DT_FILEs.FILE_NO']}" data-id="${res['DT_FILEs.FILE_NO']}">삭제</span>
        `;
        getId(`photo-deletor-${res['DT_FILEs.FILE_NO']}`).onclick = (() => {
            if (confirm('사진을 삭제하시겠소?') === true) {
                axios.delete(`/rf/${res['DT_FILEs.FILE_NO']}/photodel`)
                    .then(result => {
                        if (result.data === 'success') {
                            alert('삭제완료')
                            location.reload();
                            return false;
                        }
                        alert('에러가 발생했어유...');
                        console.log(result.data)
                        return false;
                    })
            }
        })
    }
    new Promise((resolve) => {
        for (let i = 1; i < getId('spen-first-handler').length; i++) {
            if (getId('spen-first-handler')[i].value === ISMJ_MJ_NM) {
                getId('spen-first-handler')[i].selected = true
                break;
            }
        }
        resolve(ISMJ_MJ_NM);
    }).then(async (name) => {
        await ModalHandler.secondOptionHandler(getId('spen-first-handler'), getId('spen-second-handler'))
        for (let i = 1; i < document.getElementById('spen-second-handler').length; i++) {
            const flag = name === '지출' ? 'value' : 'innerText'
            if (getId('spen-second-handler')[i][flag] === res['STP_ISMJ.ISMJ_MN_NM']) {
                getId('spen-second-handler')[i].selected = true
                break;
            }
        }
        if (name === '지출') {
            getId('spen-third-container').style.display = 'flex'
            await ModalHandler.thirdOptionHandler(res['STP_ISMJ.ISMJ_MN_NM'], getId('spen-third-handler'));
            for (let i = 1; i < document.getElementById('spen-third-handler').length; i++) {
                if (getId('spen-third-handler')[i].innerText === res['STP_ISMJ.ISMJ_MS_NM']) {
                    getId('spen-third-handler')[i].selected = true
                    break;
                }
            }
        }
    })
}

const dataUpdateHandler = () => {
    const form = getId('report-modal__form');
    getId('pen-major__add-btn').addEventListener('click', (event) => {
        if (confirm('수정하시겠소?') === true) {
            var data = formSerialize(form);
            axios.post(`/rf/${getId('dno').value}/update`, data)
                .then(result => {
                    if (result.data === 'success') {
                        alert('수정되었어요')
                        location.reload();
                        return false;
                    }
                    alert('에러가 발생했어유...');
                    console.log(result.data)
                    return false;
                })
        }
        return false;
    })
}


export const dataDelete = (id) => {
    if (confirm('지울껀가유? 지운데이터는 복구 불가능임돠') === true) {
        axios.delete(`/rf/${id}/delete`)
            .then(result => {
                if (result.data === 'success') {
                    alert('지워졌어유')
                    location.reload();
                    return false;
                }
                alert('에러났어유... 왜일까...')
                console.log(result.data)
                return false;
            })
    }
}

