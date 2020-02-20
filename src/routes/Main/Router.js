import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
const router = express.Router();

router.get('/signup', (req, res) => {
  res.render('main/signup')
});

router.post('/signup', (req, res) => {
  console.log('진입!')
  let pw = '1234'
  console.log(pw)
  bcrypt.hash(pw, 10, (err, hash) => {
    if (err) {
      console.log(err)
    }
    console.log('hash : ', hash)
  })
  res.render('main/login')
});

router.get('/login', (req, res) => {
  let errMsg = req.flash('error');
  console.log('errMsg : ', errMsg)
  if (req.user) {
    res.redirect('/');
    return false;
  } else {
    res.render('main/login', { msg: errMsg })
    return false;
  }
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  badRequestMessage: '아이디와 비빌번호를 입력하세요',
  failureFlash: true
}))

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

router.get('/', (req, res) => {
  let item;
  if (req.user !== undefined) {
    item = req.user;
  } else {
    res.redirect('/login')
    return false;
  }
  res.render('index', { item });
})

export default router;