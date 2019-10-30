import handlebars from "handlebars"
import axios from "axios";

const {pathname} = location

if(pathname.split('/')[1] === 'admin') {
    if(pathname.split('/')[2] === 'src') {
      const modalBtn    =  document.getElementById('modal-btn')
      const modalCloseBtn  =  document.getElementById('modal-close')
      const regiSubmitBtn  =  document.getElementById('regi-submit')
      const regiCancleBtn =  document.getElementById('regi-cancle')
            async function modalOpen() {
                const { origin } = location
                await fetch(origin + '/af/src-add', {
                    method: 'get'}
                )
                .then(result => {
                    return result.text();
                })
                .then(text => {
                    const select = document.getElementById('user_no');
                    const names = JSON.parse(text);
                    for (let index in names) {
                        select.innerHTML += `<option value=${names[index].USER_NO}> ${names[index].USER_NM} </option>`
                    }
                })
                document.getElementById('modals').style.display = 'flex'
            }

            function modalClose() {
                document.getElementById('modals').style.display = 'none'
            }

            function regiCancle() {
                document.getElementById('src-form').reset();
                document.getElementById('modals').style.display = 'none'
            }
            function regiSubmit() {
                if(confirm('등록할꺼에유?') === true) {
                    document.getElementById('src-form').submit();
                    return;
                } 
                return false;
            }

            function init() {
                modalBtn.addEventListener('click', modalOpen)
                modalCloseBtn.addEventListener('click', modalClose)
                regiSubmitBtn.addEventListener('click', regiSubmit)
                regiCancleBtn.addEventListener('click', regiCancle)
            }
            init();
    } 
    if(pathname.split('/')[2] === 'pen') {

        const insertModalOpen = () => {
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
        }

        const spendAddModalOpen = () => {
            document.getElementById('speding-add__modal-container').style.display = 'flex';
            document.getElementById('speding-modal-close').addEventListener('click', () => {
                document.getElementById('speding-add__modal-container').style.display = 'none';
            })
        }

        const spendRender = () => {
            Array.from(document.getElementsByClassName('spend-select')).forEach( (item) => {
                const thisItem = item;
                thisItem.addEventListener('click', async () => {
                    Array.from(document.getElementsByClassName('active')).forEach( (item) => {
                        item.classList.remove('active')
                    })
                    if(!thisItem.classList.contains('active')) {
                        thisItem.classList.add('active')
                        const { origin } = location
                        let minor_data, sub_minor_data;
                        await axios.get(origin + '/af/pen-spend-mnsub-get', {
                            params: {
                                minor_name : thisItem.textContent
                            }
                        }).then(result => {
                            const {data: {minorData, subMinorData}} = result
                            minor_data = minorData; 
                            sub_minor_data = subMinorData;
                        })
                        
                        const infoTemplate = handlebars.compile(document.getElementById('spending__header-info-contents').innerHTML);
                        document.getElementById('speding-table__header-info').innerHTML = infoTemplate(minor_data);
                        
                        let viewData = {MAJOR_NAME:"지출", MINOR_NAME:thisItem.textContent, add_btn:"speding_sm_add"}
                        viewData.DB = sub_minor_data
                        const bodyTemplate = handlebars.compile(document.getElementById('spending__body-contents').innerHTML);
                        document.getElementById('speding-table__body').innerHTML = bodyTemplate(viewData);
                        document.getElementById('speding_sm_add').addEventListener('click',spendAddModalOpen)
                    } 
                })
            })
        }

        const incomeTransferLoad = (viewData, section, item) => {
            document.getElementById(section + '_load').addEventListener('click', async ()=> {
                let tableBody = '';
                if(section === 'spending') {
                    tableBody = 'pen-spending__body-table'
                } else {
                    tableBody = 'pen-major__body-table'
                }
                const src = document.getElementById(tableBody).innerHTML;
                let items = viewData;
                let dbData = '';
                const { origin } = location

                await axios.get(origin + '/af/pen-major-select', {
                    params : {
                        majorName : item
                    }
                })
                .then(result => {
                   dbData = result.data;
                })
                items.DB = dbData;
                const template = handlebars.compile(src);
                document.getElementById('pen-major__body').innerHTML = template(items)
                document.getElementById(section + '-add').addEventListener('click', insertModalOpen) 
                if(section === 'spending') {
                    spendRender();
                }
            })
        }

        const incomeLoad = () => {
            let viewData = {title:"수입 관리", add_btn:"income-add", MAJOR_NAME:"수입"}
            let section = 'income'
            let item = '수입'
            incomeTransferLoad(viewData, section, item);
        }
        
        const spendingLoad = () => {
            let viewData = {title:"지출 관리", add_btn:"spending-add", MAJOR_NAME:"지출"}
            let section = 'spending'
            let item = '지출'
            incomeTransferLoad(viewData, section, item);
        }
        
        const transferLoad = () => {
            let viewData = {title:"이체 관리", add_btn:"transfer-add", MAJOR_NAME:"이체" }
            let section = 'transfer'
            let item = '이체'
            incomeTransferLoad(viewData, section, item);
        }

        function init() {
            incomeLoad()
            spendingLoad()
            transferLoad()
        }
        init();
    } 
}

