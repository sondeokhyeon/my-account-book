import handlebars from 'handlebars';
import axios from 'axios';

const {pathname} = location

if(pathname.split('/')[1] === 'report') {
    
    const ModalHandler = {
        init : () => {
            ModalHandler.show();
        },
        show : () => {
            document.getElementById('report-add__btn').addEventListener('click', () => {
                let template = handlebars.compile(document.getElementById('report-modal__template').innerHTML);
                let data = {title: '등록하기'}
                    document.getElementById('report-modal__territory').innerHTML = template(data)
                    document.getElementById('report-modal__territory').style.display = 'flex'    
                    ModalHandler.close();
                    ModalHandler.sourceHandler();
                    ModalHandler.spendHandler();
            }) 
        }, 
        close : () => {
            document.getElementById('report-modal__close').addEventListener('click', () => {
                document.getElementById('report-modal__territory').style.display = 'none';
            })
        },
        sourceHandler : () => {
            const srcContainer = document.getElementById('source-handler');
            const { origin } = location
            axios.get(origin + '/rf/sources')
            .then(result => {
                Array.from(result.data).map(item => {
                    srcContainer.innerHTML += '<option value=' + item.SRC_NO + '>' + item.SRC_NAME + '</option>'
                })
            })
        },
        spendHandler : () => {
            let first = document.getElementById('spen-first-handler')
            let second = document.getElementById('spen-second-handler')
            let third = document.getElementById('spen-third-handler')
            const { origin } = location;

            first.addEventListener('change', (event) => {

                if(event.target.selectedOptions[0].value === '지출') { 
                    document.getElementById('spen-third-container').style.display = 'flex'

                        second.addEventListener('change', (event) => {
                            axios.get(origin + '/rf/spend-sub-handler', {
                                params : {
                                    sort : event.target.selectedOptions[0].value
                                }
                            })
                            .then( result => {                  
                                third.innerHTML = "<option selected disabled value='소스분류'>분류</option>"
                                Array.from(result.data).map( item => {                          
                                    third.innerHTML += `<option name=${item.ISMJ_MS_NM}>${item.ISMJ_MS_NM}</option>`
                                })
                            })
                        }, false);

                } else {
                    document.getElementById('spen-third-container').style.display = 'none'
                } 

                second.innerHTML = '';
                axios.get(origin + '/rf/spend-first-handler', {
                    params : {
                        sort : first.value
                    }
                })
                .then( result => {                      
                    Array.from(result.data).map( item => {                          
                        second.innerHTML += `<option name=${item.ISMJ_MN_NM}>${item.ISMJ_MN_NM}</option>`
                    })
                })

            }, false);

        }
    }

    const init = () => {
        ModalHandler.init()
    }
    init()
}