
import {renderHandler} from "./render";

export const setupHandler = {
    incomeInit : () => {
        let viewData = {title:"수입 관리", add_btn:"income-add", MAJOR_NAME:"수입"}
        let section = 'income'
        let item = '수입'
        renderHandler.contentsBody(viewData, section, item , '/af/pen-major-select');
    },
     spendingInit : () => {
        let viewData = {title:"지출 관리", add_btn:"spending-add", MAJOR_NAME:"지출"}
        let section = 'spending'
        let item = '지출'
        renderHandler.contentsBody(viewData, section, item, '/af/pen-spend-mnsub-get');
    },
     transferInit : () => {
        let viewData = {title:"이체 관리", add_btn:"transfer-add", MAJOR_NAME:"이체" }
        let section = 'transfer'
        let item = '이체'
        renderHandler.contentsBody(viewData, section, item , '/af/pen-major-select');
    },
    hashHandler : (hashcode) => {
        let item ;
        if (hashcode) {
            item = hashcode.split('_')[0]
        } else {
            item = location.hash
        }
        switch (item) {
            case  "#income"   : { setupHandler.incomeInit();    break;  }
            case  "#spending" : { setupHandler.spendingInit();  break;  }
            case  "#transfer" : { setupHandler.transferInit();  break;  }
            default           : { location.hash = 'income'; break;  }
        }
    }, 
    historyHandler : () => {
        window.addEventListener('hashchange', (event) => {setupHandler.hashHandler(event.newURL.split('/pen')[1])})
    },
    btnEventHandler : () => {
        Array.from(document.getElementsByClassName('pen_changer')).map(item => {
            item.addEventListener('click', () => {
                location.hash = item.getAttribute('id').split('_')[0]
            })
        }) 
    },
}
