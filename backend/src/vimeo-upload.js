const fs = require('fs');
const Vimeo = require('vimeo').Vimeo;

const CLIENT_ID = '6ae2aef0e381d6eb06d0a2e2b2e9b47b50452ae4';
const CLIENT_SECRET =
	'+HyK0t+nNFj5oRUFsoKvKr6bxVacEgYjYFMU10l+xT7zoCgj8wLPacrHMDE0mHWc2EKvjBhj182Pooa1hHfVst0VJsWOErZXHZhAF6oj2xdC4cYtTaGx6bSxonUrKuLd';
	
const ACCESS_TOKEN = '1ecd37d4819e70afff197bd8ade19121';


let client = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);

client.request(
	{
		method: 'GET',
		path: '/tutorial',
	},
	function (error, body, status_code, headers) {
		if (error) {
			console.log(error);
		}
		console.log(body);
	}
);


let file_name = '../vid.mp4';
client.upload(
	file_name,
	{
		description: 'The description goes here.',
		name: 'Untitled',
	},
	function (uri) {
		console.log('Your video URI is: ' + uri);
	},
	function (bytes_uploaded, bytes_total) {
		var percentage = ((bytes_uploaded / bytes_total) * 100).toFixed(2);
		console.log(bytes_uploaded, bytes_total, percentage + '%');
	},
	function (error) {
		console.log('Failed because: ' + error);
	}
);

