import passport from 'passport';
//import {db} from "../middleware"

export const get_index = (req, res) => {
    let item;
    if(req.user !== undefined) {
      item = req.user;
    } else {
      res.redirect('/login')
      return false;
    }
    res.render('index', {item});
}

export const get_signup = (req, res) => {
    res.render('main/signup')
}

export const post_signup = (req, res) => {
    // bcrypt.hash(pw, 10, (err, hash) => {
    //     if(err) {
    //         console.log(err)
    //     }
    //     result = hash;
    // })
    res.render('main/login')
}

export const get_login = (req, res) => {
    let errMsg = req.flash('error');
    console.log(errMsg)
    res.render('main/login', {msg: errMsg})
}

export const post_login =  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    badRequestMessage: '아이디와 비빌번호를 입력하세요',
    failureFlash : true
})
    
export const logout = (req, res) => {
    req.logout();
    res.redirect('/')
}