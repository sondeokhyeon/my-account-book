import models from '../database/models';
import multer from 'multer';
export const db = models;

//const uploader = multer({dest : "uploads/photos/"});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file)
        cb(null, 'uploads/photos/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

export const loginChk = (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.redirect('/');
    }
};

export const restLoginChk = (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.json('')
    }
};

export const photoUploader = multer({ storage })
//storage.single('photo');