
import { dataDelete, dataModify, dataInit, insertModalInit} from "./admin/src" 
import { setupHandler } from "./admin/pen" 

const {pathname} = location

if(pathname.split('/')[1] === 'admin') {
    if(pathname.split('/')[2] === 'src') {
        const init = async () => {
            try {
                await dataInit()
                await dataDelete()
                await dataModify()
                insertModalInit()
            } catch (error) {
                console.log(error)
            }
        }
        init();
    } 
    if(pathname.split('/')[2] === 'pen') {
        function init()  {
            setupHandler.hashHandler() 
            setupHandler.historyHandler()
            setupHandler.btnEventHandler()
        }
        init();
    }
} 


