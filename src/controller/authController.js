import passport from 'passport';
//import {db} from "../middleware"

export const get_signup = (req, res) => {
    res.render('auth/signup')
}

export const post_signup = (req, res) => {
    console.log(req.body);
    // bcrypt.hash(pw, 10, (err, hash) => {
    //     if(err) {
    //         console.log(err)
    //     }
    //     result = hash;
    // })
    res.render('auth/login')
}

export const get_login = (req, res) => {
    let errMsg = req.flash('error');
    res.render('auth/login', {msg: errMsg})
}

export const post_login = passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        badRequestMessage: '아이디와 비빌번호를 입력하세요',
        failureFlash:true
})

export const logout = (req, res) => {
    req.logout();
    res.redirect('/')
}