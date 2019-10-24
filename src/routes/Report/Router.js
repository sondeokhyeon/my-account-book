import express from 'express';

const RRroute = express.Router();

RRroute.get('/', (req, res) => {
    res.send('report')
});

export default RRroute;