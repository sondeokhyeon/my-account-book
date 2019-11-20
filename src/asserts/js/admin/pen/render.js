import axios from "axios";
import handlebars from "handlebars";
import VanillaTree from "vanillatree";
import {EventHandler} from "./event"

export const renderHandler =  {

    contentsBody : async (viewData, section, item, reqURL) => {
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
        document.getElementById(section + '-add').addEventListener('click', EventHandler.majorInsertModalInit) 
        if (section === 'spending') {
            renderHandler.spend(dbData);
        } else {
            EventHandler.itemModify();
            EventHandler.itemDelete();
        }
    },

    spend : async (DBdata) => {
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

        handlebars.registerHelper('TYPECHK', (type) => {
            if(type.ISMJ_TYPE === 'S') {            
                return `<td><button class="minor-item__add" item-name=${type.ISMJ_MN_NM}>소분류 등록하기</button></td>`
            } 
        })

        const src = document.getElementById('pen-spending__section-body-container').innerHTML
        const template = handlebars.compile(src);
        document.getElementById('spending-section-container').innerHTML = template(resultItems);   

        let minorModalTemplate = handlebars.compile(document.getElementById('pen-minor_modal-container_template').innerHTML)
        document.getElementById('pen-minor__modal-container').innerHTML = minorModalTemplate();   

        EventHandler.itemModify();
        EventHandler.itemDelete();
        EventHandler.minorInsertModalInit();

    }    
}
