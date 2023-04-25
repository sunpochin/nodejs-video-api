const auth = require('./auth.router-2');
import express, { Request, Response } from 'express';
export const vimeoRouter = express.Router();

const multer = require('multer');
const uuid = require('uuid');
// const credentials = require('../../credentials.json');
// const open = require('open');
const fs = require('fs');

const Vimeo = require('vimeo').Vimeo;

const CLIENT_ID = '6ae2aef0e381d6eb06d0a2e2b2e9b47b50452ae4';
const CLIENT_SECRET =
	'+HyK0t+nNFj5oRUFsoKvKr6bxVacEgYjYFMU10l+xT7zoCgj8wLPacrHMDE0mHWc2EKvjBhj182Pooa1hHfVst0VJsWOErZXHZhAF6oj2xdC4cYtTaGx6bSxonUrKuLd';
const ACCESS_TOKEN = '1ecd37d4819e70afff197bd8ade19121';

let client = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);

vimeoRouter.get('/', async (req, res) => {
	console.log('vimeo router');
	try {
		res.send('vimeo router');
	} catch (err) {
		console.log('courses err: ', err);
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

// const oAuth = youtube.authenticate({
// 	type: 'oauth',
// 	client_id: credentials.web.client_id,
// 	client_secret: credentials.web.client_secret,
// 	redirect_url: credentials.web.redirect_uris[0],
// });

vimeoRouter.post('/upload', uploadVideoFile, (req: any, res: any) => {
	if (req.file) {
		console.log('req: ', req);
		console.log('req.file: ', req.file);
		const filename = req.file.filename;
    let fullpath = './uploads/' + filename;

		const title = req.body.title;
		const description = req.body.description;
		client.upload(
			fullpath,
			{
				description: description,
				name: title,
			},
			function (uri) {
				console.log('Your video URI is: ' + uri);
        res.redirect('https://4ihr74.csb.app/success');
			},
			function (bytes_uploaded, bytes_total) {
				var percentage = ((bytes_uploaded / bytes_total) * 100).toFixed(2);
				console.log(bytes_uploaded, bytes_total, percentage + '%');
			},
			function (error) {
				console.log('Failed because: ' + error);
			}
		);
	}
});

vimeoRouter.get('/oauth2callback', (req: any, res: any) => {
	res.redirect('https://4ihr74.csb.app/success');
	const { filename, title, description } = JSON.parse(req.query.state);
	//  let fullpath = __dirname + '/../../uploads/' + filename;
	let fullpath = './uploads/' + filename;
	const code = req.query.code;
	// oAuth.getToken(code, (err: any, tokens: any) => {
	// 	if (err) {
	// 		console.log('err: ', err);
	// 		return;
	// 	}

	// 	oAuth.setCredentials(tokens);
	// 	const req = youtube.videos.insert(
	// 		{
	// 			resource: {
	// 				snippet: { title, description },
	// 				status: {
	// 					privacyStatus: 'unlisted',
	// 				},
	// 			},
	// 			part: 'snippet, status',
	// 			media: {
	// 				body: fs.createReadStream(fullpath),
	// 			},
	// 		},
	// 		(err: any, data: any) => {
	// 			console.log('err: ', err);
	// 			console.log('done');
	// 			// process.exit();
	// 		}
	// 	);
	// });
});
