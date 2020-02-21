
import { dataInit } from './admin/src/data';
import { setupHandler } from "./admin/pen"

const { pathname } = location

if (pathname.split('/')[1] === 'admin') {
    if (pathname.split('/')[2] === 'src') {
        dataInit();
    }
    if (pathname.split('/')[2] === 'pen') {
        const init = () => {
            setupHandler.hashHandler()
            setupHandler.historyHandler()
            setupHandler.btnEventHandler()
        }
        init();
    }
}


