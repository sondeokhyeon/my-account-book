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
                document.getElementById('minor-modal-close').addEventListener('click', minorModalOpenHandler);
            })
        })
    },
    modifyHandler : () => {
        Array.from(document.getElementsByClassName('item-modify')).map(item => {
            item.addEventListener('click', (e) => {
                modifyExecutor(e.target)
            })
        })
    },
    deleteHandler : () => {
        Array.from(document.getElementsByClassName('item-delete')).map(item => {
            item.addEventListener('click', (e) => {
                console.log(e.target)
            })
        })
    },
}

const minorModalOpenHandler = () => {
    document.getElementById('minor-modal').style.display = 'none'
    document.getElementById('minor-modal-close').removeEventListener('click', minorModalOpenHandler);
}

const modifyExecutor = (item) => {
    console.log(item)
}
