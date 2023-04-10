const express = require('express');

const youtube = require('youtube-api');

const fs = require('fs');

const uuid = require('uuid');

const cors = require('cors');

const open = require('open');
// import open, { openApp, apps } from 'open';

const multer = require('multer');

const credentials = require('./credentials.json');

const app = express();

app.use(express.json());

app.use(cors());

const storage = multer.diskStorage({
  destination: '/',
  filename: (req, file, cb) => {
    const newFilename =`${uuid.v4()}-${path.extname(file.originalname)}`;
    cb(null, newFilename);
  }
});

const uploadVideoFile = multer({
  storage: storage
}).single("videoFile");

let filename = 'video.mp4';
let { title, description } = ['title', 'description'];

const oAuth = youtube.authenticate({
  type: 'oauth',
  client_id: credentials.web.client_id,
  client_secret: credentials.web.client_secret,
  redirect_url: credentials.web.redirect_uris[0],
});

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



app.post('/upload', uploadVideoFile, (req, res) => {
  if (req.file) {
    console.log('req.file: ', req.file);
    const filename = req.file.filename;
    const title = req.body.title;
    const description = req.body.description;
    open(url);
  }
});

app.get('oauth2callback', (req, res) => {
  res.redirect("https://yuwn8.csb.app/success");
  const {filename, title, description} = JSON.parse(req.query.state);
  const code = req.query.code;
  oAuth.getToken(code, (err, tokens) => {
    if (err) {
      console.log('err: ', err);
      return;
    }

    oAuth.setCredentials(tokens);
    const req = youtube.videos.insert({
      resource: {
        snippet: { title, description, },
        status: {
          privacyStatus: 'private',
        },
      },
      part: 'snippet, status',
      media: {
        body: fs.createReadStream(filename);
      }
    }, (err, data) => {
      console.log("done");
      process.exit();
      // if (err) {
      //   console.log('err: ', err);
      //   return;
      // }
      // console.log('data: ', data);
    })

  });

});


const PORT = 3000 | process.env.PORT;

app.listen(PORT, () => {
  console.log('app listening on port ' + PORT);
})



