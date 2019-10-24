
import express from 'express';
import { db } from '../../middleware'

const ABrouter = express.Router();

ABrouter.get('/', (req, res) => {
    res.render('admin/main')
})

ABrouter.get('/account', (req, res) => {
    db.adminAccount.findAll()
    .then(result => {
        console.log(result)
    }) 
    .catch( e => {
        console.log(e)
    })
    res.render('admin/account')
})

ABrouter.get('/card', (req, res) => {
    db.adminCard.findAll()
    .then(result => {
        console.log(result)
    }) 
    .catch( e => {
        console.log(e)
    })
    res.render('admin/card')
})

export default ABrouter;