import express from 'express';
import db from "./back/model/db";


const app = express();
app.get('/', (req, res)=>{
    res.send('hello express!')
})

export default app;
