const auth = require('./auth.router');
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
		let ret = auth.vali(req, res);
    console.log('ret: ', ret)
    if (null == ret) {
      res.send("請先登入！")
    }
		// res.send(ret);
		res.send(ret.email + ' 的課程列表：貓咪餵食、貓砂選擇、貓咪玩耍')
	} catch(err) {
  }

});

module.exports = router;
