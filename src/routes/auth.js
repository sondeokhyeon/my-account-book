import express from 'express';
import bcrypt from 'bcrypt';
import {db} from "../middleware"
import passport from 'passport';
const router = express.Router();

router.get('/signup', (req, res, next) => {
    //console.log(db)
    res.render('auth/signup')
})

router.post('/signup', (req,res) => {
    console.log(req.body);

    // bcrypt.hash(pw, 10, (err, hash) => {
    //     if(err) {
    //         console.log(err)
    //     }
    //     result = hash;
    // })

    // await bcrypt.compare(pw, '$2b$10$dkh4hGE4A3XGM9bIvKmuBuGjmw4VO0f/IBkwDbi83XuU8uxuKEujm', (err, res) => {
    //     if(err) {
    //         console.log(err)
    //     }
    //     console.log(res)
    // })

    res.render('auth/login')
})

router.get('/login', (req,res) => {

    res.render('auth/login')
})

//router.post('/login', (req,res) => {
    // const {id, pw} = req.body
    // console.log(id, pw)
    // bcrypt.hash(pw, 10, (err, hash) => {
    //     if(err) {
    //         console.log(err)
    //     }
    //     console.log(hash)
    // })
    // res.send('login!')
//})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash:true
}))

export default router;