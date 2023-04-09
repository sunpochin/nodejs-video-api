const express = require('express');

const youtube = require('youtube-api');

const uuid = require('uuid');

const cors = require('cors');

const open = require('open');
// import open, { openApp, apps } from 'open';

const multer = require('multer');

// const credentials = require('./credentials.json');

const app = express();

app.use(express.json());

app.use(cors());

const PORT = 3000 | process.env.PORT;

app.listen(PORT, () => {
  console.log('app listening on port ' + PORT);
})



