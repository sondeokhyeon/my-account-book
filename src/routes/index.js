import express from 'express';
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', { name: 'Here123123123' });
});

module.exports = router;