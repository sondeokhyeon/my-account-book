import express from 'express';
import { loginChk } from '../../middleware';

const RRroute = express.Router();

RRroute.get('/', loginChk, (req, res) => {
    res.render('report/main')
});

export default RRroute;