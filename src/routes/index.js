import express from 'express';
const router = express.Router();

router.get('/', (req, res, next) => {
  let item;
  if(req.user) {
    item = req.user
  } else {
    item = {name: 'ㅎㅎㅎ 실패넹'}
  }
  console.log(item)
  res.render('index', { name:item.name });
});

export default router;