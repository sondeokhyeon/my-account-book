import { ModalHandler } from './report/modal'
import { reportHeaderInit } from './report/data/data'

const { pathname } = location

if (pathname.split('/')[1] === 'report') {
    reportHeaderInit()
    ModalHandler.init()
}
