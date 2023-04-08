// const upload = require('./youtube-upload.js')
const { upload } = require('youtube-videos-uploader'); //vanilla javascript
const credentials = {
	email: 'pachinkosun@gmail.com',
	pass: 'Qwer4455.',
	recoveryemail: 'sunpochin@gmail.com',
};

const onVideoUploadSuccess = (videoUrl) => {
	// ..do something..
	console.log('onVideoUploadSuccess!!');
};

const video1 = {
	path: './vid.mp4',
	title: 'title 1',
	description: 'description 1',
	onProgress: (progress) => {
		console.log('percent: ', progress);
	},
	onSuccess: onVideoUploadSuccess,
};

const video2 = {
	path: './Hello.mp4',
	title: 'title 2',
	description: 'description 2',
	thumbnail: 'thumbnail.png',
	language: 'english',
	tags: ['video', 'github'],
	playlist: 'playlist name',
	channelName: 'Channel Name',
	onSuccess: onVideoUploadSuccess,
	skipProcessingWait: true,
	onProgress: (progress) => {
		console.log('progress', progress);
	},
	uploadAsDraft: false,
	isAgeRestriction: false,
	isNotForKid: false,
	publishType: 'PUBLIC',
	isChannelMonetized: false,
};

function main() {
  console.log('main')
  // upload.uploadVideo('title', 'description', ['tag1', 'tag2'])
  upload(credentials, [video1, video2]).then(console.log);
}

main();
