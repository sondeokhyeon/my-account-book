import handlebars from "handlebars"
import axios from "axios";
import VanillaTree from "vanillatree";

const {pathname} = location

if(pathname.split('/')[1] === 'admin') {
    if(pathname.split('/')[2] === 'src') {
        const modalBtn        =  document.getElementById('modal-btn')
        const modalCloseBtn   =  document.getElementById('modal-close')
        const regiSubmitBtn   =  document.getElementById('regi-submit')
        const regiCancleBtn   =  document.getElementById('regi-cancle')

        const modal = {
            open : async () => {
                const { origin } = location
                await fetch(origin + '/af/src-add', {
                    method: 'get'}
                )
                .then(result => {
                    return result.text();
                })
                .then(text => {
                    const select = document.getElementById('user_no');
                    select.innerHTML = '';
                    const names = JSON.parse(text);
                    for (let index in names) {
                        select.innerHTML += `<option value=${names[index].USER_NO}> ${names[index].USER_NM} </option>`
                    }
                })
                document.getElementById('source-modals').style.display = 'flex'
            }, 

            close : () => {
                document.getElementById('source-modals').style.display = 'none'
            },

            regiCancle : ()  => {
                document.getElementById('src-form').reset();
                document.getElementById('source-modals').style.display = 'none'
            }, 

            regiSubmit : () => {
                if(confirm('등록할꺼에유?') === true) {
                    document.getElementById('src-form').submit();
                    return;
                } 
                return false;
            }
        }

        const insertModalInit = () => {
            modalBtn.addEventListener('click', modal.open)
            modalCloseBtn.addEventListener('click', modal.close)
            regiSubmitBtn.addEventListener('click', modal.regiSubmit)
            regiCancleBtn.addEventListener('click', modal.regiCancle)
        }

        handlebars.registerHelper('categoryChk', (val1) => {
            if(val1 === null) {
                return "";
            } else if(val1 === 1) {
                return "계좌"
            } else {
                return "카드"
            }
        })

        handlebars.registerHelper('creditChk', (val1) => {
            if(val1 === null) {
                return "";
            } else if(val1 === 1) {
                return "신용카드"
            } else {
                return "체크카드"
            }
        })

        const dataInit = async() => {
            let item
            const { origin } = location
            await axios.get(origin + '/af/src-getdata')
            .then(result => {
                item = result.data
            })
            let template = document.getElementById('src-main__body').innerHTML
            template = handlebars.compile(template);
            console.log(item)
            document.getElementById('main__body').innerHTML = template(item)
        }

        const init = () => {
            dataInit()
            insertModalInit()
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

        const bodyLoader = async (viewData, section, item, reqURL) => {
            const src = document.getElementById(section === 'spending' ? 'pen-spending__body-table' : 'pen-major__body-table').innerHTML;
            let items = viewData;
            let dbData = '';
            const { origin } = location
            await axios.get(origin + reqURL, {
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
            section === 'spending' && spendRender(dbData);
        }

        const incomeInit = () => {
            let viewData = {title:"수입 관리", add_btn:"income-add", MAJOR_NAME:"수입"}
            let section = 'income'
            let item = '수입'
            bodyLoader(viewData, section, item , '/af/pen-major-select');
        }
        
        const spendingInit = () => {
            let viewData = {title:"지출 관리", add_btn:"spending-add", MAJOR_NAME:"지출"}
            let section = 'spending'
            let item = '지출'
            bodyLoader(viewData, section, item, '/af/pen-spend-mnsub-get');
        }
        
        const transferInit = () => {
            let viewData = {title:"이체 관리", add_btn:"transfer-add", MAJOR_NAME:"이체" }
            let section = 'transfer'
            let item = '이체'
            bodyLoader(viewData, section, item , '/af/pen-major-select');
        }

        const hashManager = (hashcode) => {
            let item ;
            if (hashcode) {
                item = hashcode.split('_')[0]
            } else {
                item = location.hash
            }
            switch (item) {
                case  "#income" : {
                    incomeInit();
                    break;
                }
                case  "#spending" : {
                    spendingInit();
                    break;
                }
                case  "#transfer" : {
                    transferInit();
                    break;    
                }
                default : {
                    location.hash = 'income'
                    break;
                }
            }
        } 

        const historyManager = () => {
            window.addEventListener('hashchange', (event) => {
                hashManager(event.newURL.split('/pen')[1])
            })
        }
        
        const btnEventManager = () => {
            Array.from(document.getElementsByClassName('pen_changer')).map(item => {
                item.addEventListener('click', () => {
                    location.hash = item.getAttribute('id').split('_')[0]
                })
            }) 
        }
            
        function init() {
            hashManager() 
            historyManager()
            btnEventManager()
        }
        init();
    }
} 


