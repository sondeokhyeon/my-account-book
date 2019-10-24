import express from 'express';
const router = express.Router();
import {
  get_index,
  get_signup, 
  post_signup, 
  get_login,
  post_login,
  logout}  from '../../controller/MainController';

router.get('/signup', get_signup);
router.post('/signup', post_signup);
router.get('/login', get_login);
router.post('/login', post_login);
router.get('/logout', logout);

router.get('/', get_index);

export default router;