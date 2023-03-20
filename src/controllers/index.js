https://www.youtube.com/watch?v=rgIyADYS9ys

const { google } = require('googleapis');
const service = google.youtube({
	version: 'v3',
	auth: '',
});

async function main(parms) {
	const res = await service.videos.list(
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
