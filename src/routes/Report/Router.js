import express from 'express';

const RRroute = express.Router();

RRroute.get('/', (req, res) => {
    res.render('report/main')
});

export default RRroute;