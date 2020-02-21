import handlebars from "handlebars"
import Vtree from "vanillatree";
import { modal } from "./modal";
import axios from "axios";
import { getId } from "../../cmm";

export const dataInit = async () => {
    majorInsertModalOpen()
    const tree = new Vtree('#src-tree');
    let major, minor, newArr;
    await axios.get('/af/src-getdata')
        .then(result => {
            major = result.data.major
            minor = result.data.minor
        }).then(() => {
            major.map(item => {
                tree.add({
                    label: item.SRC_NAME,
                    id: item.SRC_NAME,
                    opened: true,
                })
            })
            minor.map(item => {
                tree.add({
                    label: item.SRC_NAME,
                    parent: item.SRC_CNAME,
                    id: item.SRC_NAME
                })
            })
        }).then(() => {
            newArr = major.concat(minor);
            Array.from(document.getElementsByClassName('vtree-leaf-label')).map(domItem => {
                newArr.map((dbItem) => {
                    if (domItem.innerHTML === dbItem.SRC_NAME) {
                        domItem.innerHTML += `<div><button type="button" class="data-modify" data-no=${dbItem.SRC_NO}> 수정하기 </button>`
                        if (dbItem.SRC_MJCG === 'c') {
                            domItem.innerHTML += `<button type="button" class="data-delete" data-no=${dbItem.SRC_NO}> 삭제하기 </button>`
                            domItem.innerHTML += `<button type="button" class="minor_addBtn" data-id=${dbItem.SRC_NAME}>하위 등록</button></div>`
                        } else {
                            domItem.innerHTML += `<button type="button" class="data-delete" data-no=${dbItem.SRC_NO}> 삭제하기 </button></div>`
                        }
                    }
                })
            })
        })

    // let template = document.getElementById('src-main__body').innerHTML
    // template = handlebars.compile(template);
    // document.getElementById('main__body').innerHTML = template(item)
    dataModify()
    dataDelete()
    minorInsertModalOpen()
}

const majorInsertModalOpen = () => {
    document.getElementById('modal-btn').addEventListener('click', modal.majorOpen)
}

const minorInsertModalOpen = () => {
    Array.from(document.getElementsByClassName('minor_addBtn')).map(item => {
        item.addEventListener('click', () => {
            modal.minorOpen(item.getAttribute('data-id'))
        })
    });
}

const dataDelete = () => {
    Array.from(document.getElementsByClassName('data-delete')).map((item) => {
        item.addEventListener('click', () => {
            if (confirm('이 항목은 가계부 상세 내역이 없어야 지울 수 있습니다.\n계속하시겠습니까?') === true) {
                alert('상세내역이 있을경우 이 항목은 숨김처리됩니다.')
                console.log(item.getAttribute('data-no'))
            }
        })
    })
}

const dataModify = () => {
    Array.from(document.getElementsByClassName('data-modify')).map((item) => {
        item.addEventListener('click', async () => {
            await axios.get('/af/src-modify', {
                params: {
                    'srcNo': item.getAttribute('data-no')
                }
            }).then(result => {
                modal.majorModifyOpen(result.data)
            })
        })
    })
}

handlebars.registerHelper('cgNameChk', (val1) => {
    console.log(val1)
    if (val1 === 'o') {
        return "현금"
    } else if (val1 === 'c') {
        return "계좌"
    }
    return "카드"
})

handlebars.registerHelper('cgBtnChk', (obj) => {
    if (obj.SRC_MJCG === 'c') {
        return `<button type="button" class="minor_addBtn" data-id=${obj.SRC_NAME}>하위 등록</button>`
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

