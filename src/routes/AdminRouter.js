
import express from 'express';
import { db } from '../middleware'

const ABrouter = express.Router();

ABrouter.get('/', (req, res) => {
    res.render('admin/main')
})

ABrouter.get('/account', (req, res) => {
    res.render('admin/account')
})

ABrouter.get('/card', (req, res) => {
    res.render('admin/card')
})

export default ABrouter;