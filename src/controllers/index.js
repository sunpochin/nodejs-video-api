// https://www.youtube.com/watch?v=rgIyADYS9ys

const { google } = require('googleapis');
const service = google.youtube({
	version: 'v3',
	auth: 'AIzaSyBzRd59uff7o3OHqOY9jhOtWihZeehQFjE',
});

async function main(parms) {
  // search example, regionCode is not working I think:
	let res = await service.search.list(
		{
			q: '餵食貓咪',
			part: ['snippet'],
			regionCode: 'de',
		},
		(err, res) => {
			if (err) {
				return console.log('error: ' + err);
			}
			const videos = res.data.items;
			if (videos.length) {
				// console.log('Videos: ', videos);
				videos.map((video) => {
					console.log(
						`${video.snippet.title} (https://www.youtube.com/watch?v=${video.id.videoId}) `
					);
				});
			} else {
				console.log('no video found.');
			}
		}
	);

  // list example
	res = await service.videos.list(
		{
			part: ['snippet, contentDetails, statistics'],
			chart: 'mostPopular',
			videoCategoryId: 15, // 15: Pets & Animals
			region: 'tw',
		},
		(err, res) => {
			if (err) {
				return console.log('error: ' + err);
			}
			const videos = res.data.items;
			if (videos.length) {
				console.log('Videos: ');
				videos.map((video) => {
					console.log(
						`${video.snippet.title} (https://www.youtube.com/watch?v=${video.id}) `
					);
				});
			} else {
				console.log('no video found.');
			}
		}
	);
}

main().catch(console.error)
