export const EventHandler = {
    majorInsertModalInit : () => {
        document.getElementById('pen-major__modal-container').style.display = 'flex'
        document.getElementById('modal-close').addEventListener('click', () => {
            document.getElementById('pen-major__modal-container').style.display = 'none';
        })
        document.getElementById('pen-major__add-btn').addEventListener('click', () => {
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
                modifyExecutor(e.target)
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
        document.getElementById('minor-modal-close').removeEventListener('click', this.minorSubmit);
        document.getElementById('minor-modal').style.display = 'none'
    },
    submit : function() {
        document.getElementById('sub_minor_submit').addEventListener('click', this.executor);
    },  
    executor : function (event) {
        if(confirm('등록하시겠소?') === true ) {
            document.getElementById('minor-item-modal-form').setAttribute('action', '/af/pen-spend-mnsub-add');
            document.getElementById('minor-item-modal-form').submit();
        } else {
          return false;  
        }
        document.getElementById('sub_minor_submit').removeEventListener('click', this.submit)
    }
}

const modifyExecutor = (item) => {
    console.log(item)
}
