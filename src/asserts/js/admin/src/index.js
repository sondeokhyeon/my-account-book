import handlebars from "handlebars"
import axios from "axios";

const modalBtn  =  document.getElementById('modal-btn')

export const insertModalInit = () => {
    modalBtn.addEventListener('click', modal.open)
}

const modal = {
    open : async () => {
        let modalTemplate = document.getElementById('src-main__modal').innerHTML
            modalTemplate = handlebars.compile(modalTemplate);
        let subForm = document.getElementById('modal-add__partial').innerHTML;
        let data = {'modalTitle' : '추가하기'}
            handlebars.registerPartial('subForm', subForm);
            document.getElementById('modal-container').innerHTML = modalTemplate(data)
        const { origin } = location
        await fetch(origin + '/af/src-add', {
            method: 'get'}
        )
        .then(result => {
            return result.text();
        })
        .then(text => {
            const select = document.getElementById('user_no');
            select.innerHTML = '';
            const names = JSON.parse(text);
            for (let index in names) {
                select.innerHTML += `<option value=${names[index].USER_NO}> ${names[index].USER_NM} </option>`
            }
            modal.util()
            document.getElementById('src-form').setAttribute('action', '../af/src-add');
            document.getElementById('source-modals').style.display = 'flex';
        })
    }, 

    close : () => {
        document.getElementById('source-modals').style.display = 'none'
    },

    regiCancle : ()  => {
        document.getElementById('src-form').reset();
        document.getElementById('source-modals').style.display = 'none'
    }, 

    regiSubmit : () => {
        if(confirm('등록할꺼에유?') === true) {
            document.getElementById('src-form').submit();
            return;
        } 
        return false;
    },

    modifyOpen : (data) => {
        let modalTemplate = document.getElementById('src-main__modal').innerHTML
            modalTemplate = handlebars.compile(modalTemplate);
        let modalData = {'modalTitle' : '수정하기'}
            modalData.info = data
        let subForm = document.getElementById('modal-modify__partial').innerHTML;
            handlebars.registerPartial('subForm', subForm);
        document.getElementById('modal-container').innerHTML = modalTemplate(modalData)
        modal.util()
        document.getElementById('src-form').setAttribute('action', '../af/src-modify');
        document.getElementById('source-modals').style.display = 'flex'
    }, 

    util : () => {
        document.getElementById('modal-footer').innerHTML += "<span class='modal-footer__btn' id='regi-submit'>등록하기</span>"
        document.getElementById('modal-footer').innerHTML += "<span class='modal-footer__btn' id='regi-cancle'>취소하기</span>"
        document.getElementById('regi-submit').addEventListener('click', modal.regiSubmit)
        document.getElementById('regi-cancle').addEventListener('click', modal.regiCancle)
        document.getElementById('modal-close').addEventListener('click', modal.close)
    }
}



handlebars.registerHelper('categoryChk', (val1) => {
    if(val1 === null) {
        return "";
    } else if(val1 === 1) {
        return "계좌"
    } else {
        return "카드"
    }
})

handlebars.registerHelper('creditChk', (val1) => {
    if(val1 === null) {
        return "";
    } else if(val1 === 1) {
        return "신용카드"
    } else {
        return "체크카드"
    }
})

export const dataInit = async() => {
    if (location.search) {
        if(location.search.split('=')[1] === 'success') {
            alert('수정되었시유')
            location.search = ''
        } else {
            alert('실패네유? 왜그런지 물어볼 것!')
            location.search = ''
        }
    }
    let item
    const { origin } = location
    await axios.get(origin + '/af/src-getdata')
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
            if(confirm ('이 항목은 가계부 상세 내역이 없어야 지울 수 있습니다.\n계속하시겠습니까?') === true) {
                alert('상세내역이 있을경우 이 항목은 숨김처리됩니다.')
                console.log(item.getAttribute('data-no'))
            }
        })
    })
}

export const dataModify =  () => {
    Array.from(document.getElementsByClassName('data-modify')).map((item) => {
        item.addEventListener('click', async () => {
            let data;
            const {origin} = location
            await axios.get(origin + '/af/src-modify', {
                params : {
                    'srcNo' : item.getAttribute('data-no')
                }
            })
            .then(result => {
                data = result.data
            })
            console.log(data)
            modal.modifyOpen(data)
        })
    })
}