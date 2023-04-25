const auth = require('./auth.router-2');
import express, { Request, Response } from 'express';
const multer = require('multer');
const uuid = require('uuid');
const youtube = require('youtube-api');
const credentials = require('../../credentials.json');
const open = require('open');
const fs = require('fs');
const router = express.Router();

router.get('/', async (req, res) => {
  console.log('courses router');
  try {
		let ret = auth.vali(req, res);
    console.log('ret: ', ret)
    if (null == ret) {
      res.send("請先登入！")
    }
		// res.send(ret);
		res.send(ret.email + ' 的課程列表：貓咪餵食、貓砂選擇、貓咪玩耍')
	} catch(err) {
    console.log('courses err: ', err)
  }
});



const storage = multer.diskStorage({
	destination: './uploads',
	filename: (req: any, file: any, cb: any) => {
		const newFilename = `${uuid.v4()}-${file.originalname}`;
		cb(null, newFilename);
	},
});

const uploadVideoFile = multer({
	storage: storage,
}).single('videoFile');

const oAuth = youtube.authenticate({
	type: 'oauth',
	client_id: credentials.web.client_id,
	client_secret: credentials.web.client_secret,
	redirect_url: credentials.web.redirect_uris[0],
});


router.post('/upload', uploadVideoFile, (req: any, res: any) => {
	if (req.file) {
		console.log('req.file: ', req.file);
		const filename = req.file.filename;
		const title = req.body.title;
		const description = req.body.description;
		let url = oAuth.generateAuthUrl({
			access_type: 'offline',
			scope: ['https://www.googleapis.com/auth/youtube.upload'],
			state: JSON.stringify({
				filename,
				title,
				description,
			}),
		});
		console.log('url: ', url);
		open(url);
	}
});


router.get('/oauth2callback', (req: any, res: any) => {
	res.redirect('https://4ihr74.csb.app/success');
	const { filename, title, description } = JSON.parse(req.query.state);
//  let fullpath = __dirname + '/../../uploads/' + filename;
  let fullpath = './uploads/' + filename;
	const code = req.query.code;
	oAuth.getToken(code, (err: any, tokens: any) => {
		if (err) {
			console.log('err: ', err);
			return;
		}

		oAuth.setCredentials(tokens);
		const req = youtube.videos.insert(
			{
				resource: {
					snippet: { title, description },
					status: {
						privacyStatus: 'unlisted',
					},
				},
				part: 'snippet, status',
				media: {
					body: fs.createReadStream(fullpath),
				},
			},
			(err: any, data: any) => {
				console.log('err: ', err);
				console.log('done');
				// process.exit();
			}
		);
	});
});


module.exports = router;
