import handlebars from "handlebars"
import axios from "axios";
import VanillaTree from "vanillatree";

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

        const majorInsertModalOpen = () => {
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

        const spendRender = async (DBdata) => {
            const {minor, subminor} = DBdata;
            const tree = new VanillaTree('#spending-tree-container');

            let primitiveItems = [];
            let DOMItems = [];
            let resultItems = [];

            await minor.map(item  => {
                tree.add({
                    label: item.ISMJ_MN_NM,
                    id: item.ISMJ_MN_NM,
                    opened: true,
                });
                primitiveItems.push(item)

            });
            await subminor.map(item  => { 
                tree.add({
                    label: item.ISMJ_MS_NM,
                    parent: item.ISMJ_MN_NM,
                    id : item.ISMJ_MS_NM
                });
                primitiveItems.push(item)
            });
            
            Array.from(document.getElementsByClassName('vtree-leaf')).map(item => {
                DOMItems.push(item.getAttribute('data-vtree-id'));
            })

            for (let i = 0; i < DOMItems.length; i++) {
                for (let j = 0; j < DOMItems.length; j++) {
                    if(primitiveItems[j].ISMJ_MS_NM !== null) {
                        if(DOMItems[i] === primitiveItems[j].ISMJ_MS_NM) {
                            resultItems.push(primitiveItems[j])
                        }
                    } else {
                        if(DOMItems[i] === primitiveItems[j].ISMJ_MN_NM) {
                            resultItems.push(primitiveItems[j])
                        }
                    }
                }
            }

            const src = document.getElementById('pen-spending__section-body-container').innerHTML
            const template = handlebars.compile(src);
            document.getElementById('spending-section-container').innerHTML = template(resultItems);   
            
        }

        const spendingLoad = (viewData, section, item) => {
            document.getElementById(section + '_load').addEventListener('click', async ()=> {
                const src = document.getElementById('pen-spending__body-table').innerHTML;
                let items = viewData;

                let dbData = '';
                const { origin } = location
                await axios.get(origin + '/af/pen-spend-mnsub-get', {
                    params : {
                        majorName : item
                    }
                })
                .then(result => {
                   dbData = result.data;
                })

                const template = handlebars.compile(src);
                document.getElementById('pen-major__body').innerHTML = template(items)
                document.getElementById(section + '-add').addEventListener('click', majorInsertModalOpen) 
                spendRender(dbData);
            })
        }

        const incomeTransferLoad = (viewData, section, item) => {
            document.getElementById(section + '_load').addEventListener('click', async ()=> {
                const src = document.getElementById('pen-major__body-table').innerHTML;
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
                document.getElementById(section + '-add').addEventListener('click', majorInsertModalOpen) 
            })
        }

        const incomeInit = () => {
            let viewData = {title:"수입 관리", add_btn:"income-add", MAJOR_NAME:"수입"}
            let section = 'income'
            let item = '수입'
            incomeTransferLoad(viewData, section, item);
        }
        
        const spendingInit = () => {
            let viewData = {title:"지출 관리", add_btn:"spending-add", MAJOR_NAME:"지출"}
            let section = 'spending'
            let item = '지출'
            spendingLoad(viewData, section, item);
        }
        
        const transferInit = () => {
            let viewData = {title:"이체 관리", add_btn:"transfer-add", MAJOR_NAME:"이체" }
            let section = 'transfer'
            let item = '이체'
            incomeTransferLoad(viewData, section, item);
        }

        function init() {
            incomeInit()
            spendingInit()
            transferInit()
        }
        init();
    } 
}

