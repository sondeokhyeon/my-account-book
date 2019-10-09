
import express from 'express';
const adrouter = express.Router();

adrouter.get('/', (req, res) => {
    res.render('admin/main')
})

export default adrouter;