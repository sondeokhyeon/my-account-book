import Vtree from "vanillatree";
import { modal } from "./modal";
import axios from "axios";
import { axiosHandler } from "../../cmm";

export const dataInit = async () => {
    const tree = new Vtree('#src-tree');
    let major, minor, newArr;
    await axios.get('/af/src-getdata')
        .then(result => {
            major = result.data.major
            minor = result.data.minor
        }).then(() => {
            major.map(item => { tree.add({ label: item.SRC_NAME, id: item.SRC_NAME, opened: true, }) })
            minor.map(item => { tree.add({ label: item.SRC_NAME, parent: item.SRC_CNAME, id: item.SRC_NAME }) })
        }).then(() => {
            newArr = major.concat(minor);
            Array.from(document.getElementsByClassName('vtree-leaf-label')).map(domItem => {
                newArr.map((dbItem) => {
                    if (domItem.innerHTML === dbItem.SRC_NAME) {
                        if (dbItem.SRC_MJCG === 'c') {
                            domItem.innerHTML += `<div>
                            <span>${dbItem.SRC_BANK}</span>
                            <span>${dbItem.SRC_MJCG === 'c' ? '계좌' : '현금'}</span>
                            <span>${dbItem.SRC_MONEY}</span>
                            <span>${dbItem.createdAt}</span>
                            <button type="button" class="mj-modify" data-no=${dbItem.SRC_NO}> 수정하기 </button>
                            <button type="button" class="data-delete" data-no=${dbItem.SRC_NO}> 삭제하기 </button>
                            <button type="button" class="mn_add" data-id=${dbItem.SRC_NAME}>하위 등록</button>
                            </div>`
                        } else if (dbItem.SRC_MJCG === 'o') {
                            domItem.innerHTML += `<div>
                            <span>${dbItem.SRC_MJCG === 'c' ? '계좌' : '현금'}</span>
                            <span>${dbItem.SRC_MONEY}</span>
                            <span>${dbItem.createdAt}</span>
                            <button type="button" class="mj-modify" data-no=${dbItem.SRC_NO}> 수정하기 </button>
                            <button type="button" class="data-delete" data-no=${dbItem.SRC_NO}> 삭제하기 </button>
                            </div>`
                        } else {
                            domItem.innerHTML += `<div>
                            <span>${dbItem.IS_CREDIT === 'r' ? '신용카드' : '체크카드'}</span>
                            <span>${dbItem.IS_CREDIT === 'r' ? dbItem.SRC_MONEY : ''}</span>
                            <span>${dbItem.createdAt}</span>
                            <button type="button" class="mn-modify" data-no=${dbItem.SRC_NO}> 수정하기 </button>
                            <button type="button" class="data-delete" data-no=${dbItem.SRC_NO}> 삭제하기 </button>
                            </div>`
                        }
                    }
                })
            })
        })

    majorInsertModalOpen()
    minorInsertModalOpen()
    dataModify()
    dataDelete()
}

const majorInsertModalOpen = () => {
    document.getElementById('modal-btn').addEventListener('click', modal.majorOpen)
}

const minorInsertModalOpen = () => {
    Array.from(document.getElementsByClassName('mn_add')).map(item => {
        item.addEventListener('click', () => { modal.minorOpen(item.getAttribute('data-id')) })
    });
}

const dataDelete = () => {
    Array.from(document.getElementsByClassName('data-delete')).map((item) => {
        item.addEventListener('click', async () => {
            if (confirm('이 항목은 가계부 상세 내역이 없어야 지울 수 있습니다.\n상세내역이 있을경우 이 항목은 숨김처리됩니다.\n계속하시겠습니까?') === true) {
                const { data } = await axiosHandler(`/af/${item.getAttribute('data-no')}/src-del`, 'delete')
                switch (data) {
                    case 1: {
                        alert('삭제성공!')
                        location.reload();
                        break;
                    }
                    case 2: {
                        alert('숨기기성공해쓔');
                        location.reload();
                        break;
                    }
                    case -1: { alert('하위항목이 있으면 삭제불가합니당'); break; }
                    case 0: { alert('헐...? 에러발생?'); break; }
                } // switch
            } // if
        }) // eventListner
    })
}

const dataModify = () => {
    Array.from(document.getElementsByClassName('mj-modify')).map((item) => {
        item.addEventListener('click', async () => {
            await axios.get('/af/src-modify', {
                params: { 'srcNo': item.getAttribute('data-no') }
            }).then(result => {
                modal.majorModifyOpen(result.data)
            })
        })
    })
    Array.from(document.getElementsByClassName('mn-modify')).map(item => {
        item.addEventListener('click', async () => {
            const { data } = await axiosHandler('/af/src-modify', 'get', { 'params': { 'srcNo': item.getAttribute('data-no') } })
            modal.minorModifyOpen(data);
        })
    })
}


