import express from 'express';
import {get_signup, 
        post_signup, 
        get_login,
        post_login,
        logout}  from '../controller/authController';
const router = express.Router();

router.get('/signup', get_signup);
router.post('/signup', post_signup)
router.get('/login', get_login)
router.post('/login', post_login)
router.get('/logout', logout)

export default router;