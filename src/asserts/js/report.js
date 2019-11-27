import handlebars from 'handlebars';
const {pathname} = location

if(pathname.split('/')[1] === 'report') {
    
    const ModalHandler = {
        init : () => {
            ModalHandler.show();
        },
        show : () => {
            document.getElementById('report-add__btn').addEventListener('click', () => {
                let template = handlebars.compile(document.getElementById('report-modal__template').innerHTML);
                    document.getElementById('report-modal__territory').innerHTML = template()
                    document.getElementById('report-modal__territory').style.display = 'flex'
                    ModalHandler.close();
            }) 
        }, 
        close : () => {
            document.getElementById('report-modal__close').addEventListener('click', () => {
                document.getElementById('report-modal__territory').style.display = 'none';
            })
        }
    }

    const init = () => {
        ModalHandler.init()
    }
    init()
}