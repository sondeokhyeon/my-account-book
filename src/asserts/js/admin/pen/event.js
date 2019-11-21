import handlebars from 'handlebars';

export const EventHandler = {
    majorInsertModalInit : (data) => {
        let majorModalTemplate = handlebars.compile(document.getElementById('pen-major__modal-container-template').innerHTML);
        document.getElementById('pen-major__modal-container-wrap').innerHTML = majorModalTemplate(data);
        document.getElementById('pen-major__add-form').setAttribute('action', '/af/pen-major-add') // action setup
        document.getElementById('pen-major__modal-container').style.display = 'flex'               // display:show
        document.getElementById('modal-close').addEventListener('click', () => {                   // display:none
            document.getElementById('pen-major__modal-container-wrap').innerHTML = '';
        })
        document.getElementById('pen-major__add-btn').addEventListener('click', () => {            // submit
            if(confirm('등록하시렵니까?') === true) {
                document.getElementById('pen-major__add-form').submit();
                return;
            } 
            return false;
        })
    },
    minorInsertModalInit : () => {
        Array.from(document.getElementsByClassName('minor-item__add')).map(item => {
            item.addEventListener('click', (e) => {
                document.getElementById('minor-modal_major').value = '지출';
                document.getElementById('minor-modal_minor').value = e.target.getAttribute('item-name');
                document.getElementById('minor-modal').style.display = 'flex'
                document.getElementById('minor-modal-close').addEventListener('click', minorModalEventHandler.close);
                minorModalEventHandler.submit();
            })
        })
    },
    itemModify : () => {
        Array.from(document.getElementsByClassName('item-modify')).map(item => {
            item.addEventListener('click', (e) => {
                minorModalEventHandler.modify(item)
            })
        })
    },
    itemDelete : () => {
        Array.from(document.getElementsByClassName('item-delete')).map(item => {
            item.addEventListener('click', (e) => {
                console.log(e.target)
            })
        })
    },
}

const minorModalEventHandler = {
    close : function() {
        document.getElementById('minor-modal-close').removeEventListener('click', this.submit);
        document.getElementById('minor-modal').style.display = 'none'
    },
    submit : function() {
        document.getElementById('sub_minor_submit').addEventListener('click', this.submitExecutor);
    },  
    submitExecutor : function (event) {
        if(confirm('등록하시겠소?') === true ) {
            document.getElementById('minor-item-modal-form').setAttribute('action', '/af/pen-spend-mnsub-add');
            document.getElementById('minor-item-modal-form').submit();
        } else {
          return false;  
        }
        document.getElementById('sub_minor_submit').removeEventListener('click', this.submit)
    }, 
    modify : function(param) {
        let MINOR_NAME;
        let MAJOR_NAME;
        let ITEM_NO = param.getAttribute('item-id')
        let type = param.getAttribute('item-type')
        
        if(param.getAttribute('item-type') === 'S') {
            MINOR_NAME = param.getAttribute('mn-name');
        } else {
            MINOR_NAME = param.getAttribute('sb-name');
        }

        switch(location.hash) {
            case "#income" :
                MAJOR_NAME = '수입'
                break;
            case "#transfer" :
                MAJOR_NAME = '이체'
                break;
            case "#spending" :
                MAJOR_NAME = '지출'
                break;
        }

        let item = { title : '수정하기', type: param.getAttribute('item-type'), MAJOR_NAME, MINOR_NAME, ITEM_NO, type}
        this.modifyExecutor(item)

    },
    modifyExecutor : function (item) {
        let majorModalTemplate = handlebars.compile(document.getElementById('pen-major__modal-container-template').innerHTML);
        document.getElementById('pen-major__modal-container-wrap').innerHTML = majorModalTemplate(item);
        document.getElementById('pen-major__add-form').setAttribute('action', '/af/pen-major-modify') // action setup
        document.getElementById('pen-major__modal-container').style.display = 'flex'                  // display:show
        document.getElementById('modal-close').addEventListener('click', () => {                      // display:none
            document.getElementById('pen-major__modal-container-wrap').innerHTML = '';
        })
        document.getElementById('pen-major__add-btn').addEventListener('click', () => {               // submit
            if(confirm('수정하시렵니까?') === true) {
                document.getElementById('pen-major__add-form').submit();
                return;
            } 
            return false;
        })
    }
}

