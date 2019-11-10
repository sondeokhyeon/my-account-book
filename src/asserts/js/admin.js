import handlebars from "handlebars"
import axios from "axios";
import VanillaTree from "vanillatree";
import { format } from "path";

const {pathname} = location

if(pathname.split('/')[1] === 'admin') {
    if(pathname.split('/')[2] === 'src') {
        const modalBtn  =  document.getElementById('modal-btn')
        const modal = {
            open : async () => {
                let modalTemplate = document.getElementById('src-main__modal').innerHTML
                    modalTemplate = handlebars.compile(modalTemplate);
                let subForm = document.getElementById('modal-add__partial').innerHTML;
                let data = {'modalTitle' : '추가하기'}
                    handlebars.registerPartial('subForm', subForm);
                    document.getElementById('modal-container').innerHTML = modalTemplate(data)
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
                    modal.util()
                    document.getElementById('src-form').setAttribute('action', '../af/src-add');
                    document.getElementById('source-modals').style.display = 'flex';
                })
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
            },

            modifyOpen : (data) => {
                let modalTemplate = document.getElementById('src-main__modal').innerHTML
                    modalTemplate = handlebars.compile(modalTemplate);
                let modalData = {'modalTitle' : '수정하기'}
                    modalData.info = data
                let subForm = document.getElementById('modal-modify__partial').innerHTML;
                    handlebars.registerPartial('subForm', subForm);
                document.getElementById('modal-container').innerHTML = modalTemplate(modalData)
                modal.util()
                document.getElementById('src-form').setAttribute('action', '../af/src-modify');
                document.getElementById('source-modals').style.display = 'flex'
            }, 

            util : () => {
                document.getElementById('modal-footer').innerHTML += "<span class='modal-footer__btn' id='regi-submit'>등록하기</span>"
                document.getElementById('modal-footer').innerHTML += "<span class='modal-footer__btn' id='regi-cancle'>취소하기</span>"
                document.getElementById('regi-submit').addEventListener('click', modal.regiSubmit)
                document.getElementById('regi-cancle').addEventListener('click', modal.regiCancle)
                document.getElementById('modal-close').addEventListener('click', modal.close)
            }
        }

        const insertModalInit = () => {
            modalBtn.addEventListener('click', modal.open)
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
            if (location.search) {
                if(location.search.split('=')[1] === 'success') {
                    alert('수정되었시유')
                    location.search = ''
                } else {
                    alert('실패네유? 왜그런지 물어볼 것!')
                    location.search = ''
                }
            }
            let item
            const { origin } = location
            await axios.get(origin + '/af/src-getdata')
            .then(result => {
                item = result.data
            })
            let template = document.getElementById('src-main__body').innerHTML
            template = handlebars.compile(template);
            document.getElementById('main__body').innerHTML = template(item)
        }

        const dataDelete = () => {
            Array.from(document.getElementsByClassName('data-delete')).map((item) => {
                item.addEventListener('click', () => {
                    if(confirm ('이 항목은 가계부 상세 내역이 없어야 지울 수 있습니다.\n계속하시겠습니까?') === true) {
                        alert('상세내역이 있을경우 이 항목은 숨김처리됩니다.')
                        console.log(item.getAttribute('data-no'))
                    }
                })
            })
        }

        const dataModify =  () => {
            Array.from(document.getElementsByClassName('data-modify')).map((item) => {
                item.addEventListener('click', async () => {
                    let data;
                    const {origin} = location
                    await axios.get(origin + '/af/src-modify', {
                        params : {
                            'srcNo' : item.getAttribute('data-no')
                        }
                    })
                    .then(result => {
                        data = result.data
                    })
                    console.log(data)
                    modal.modifyOpen(data)
                })
            })
        }

        const init = async () => {
            await dataInit()
            await dataDelete()
            await dataModify()
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


