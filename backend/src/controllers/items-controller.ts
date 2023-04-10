import { Request, Response, RequestHandler } from 'express';
import { Item, Items } from '../models/items.interface';
import * as ItemService from '../models/items.service';
import * as dotenv from 'dotenv';
dotenv.config();

const redirect_URI = 'auth/google/callback';

const { google } = require('googleapis');
const service = google.youtube({
	version: 'v3',
	auth: 'AIzaSyBzRd59uff7o3OHqOY9jhOtWihZeehQFjE',
});

class ItemController {
	upload(req: Request, res: Response) {
		const { OAuth2Client } = require('google-auth-library');

		const client_id = process.env.GOOGLE_CLIENT_ID;
		const client_secret = process.env.GOOGLE_CLIENT_SECRET;
		const redirect_uri = redirect_URI;

		const oauth2Client = new OAuth2Client(
			client_id,
			client_secret,
			redirect_uri
		);
		const scopes = ['https://www.googleapis.com/auth/youtube.upload'];

		const authUrl = oauth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: scopes,
		});
		const code = 'AUTHORIZATION_CODE';
		oauth2Client.getToken(code, (err: any, token: any) => {
			if (err) {
				console.error('Error while trying to retrieve access token', err);
				return;
			}
			oauth2Client.setCredentials(token);
			const youtube = google.youtube({
				version: 'v3',
				auth: oauth2Client,
			});
			// 在此處調用上傳影片的函數
		});
		
	}

	async tube(req: Request, res: Response) {
		console.log('req.query: ', req.query);
		if ('search' != req.query.act) {
			console.log('return');
			return;
		}

		let msg: string[] = [];
		const res2 = await service.search.list(
			{
				q: req.query.q,
				part: ['snippet'],
				regionCode: 'de',
			},
			(err: any, res2: any) => {
				if (err) {
					return console.log('error: ' + err);
				}
				const videos = res2.data.items;
				if (videos.length) {
					// console.log('Videos: ', videos);
					videos.map((video: any) => {
						let msg1 = `${video.snippet.title} (https://www.youtube.com/watch?v=${video.id.videoId}) `;
						console.log(msg1);
						msg.push(msg1);
					});
				} else {
					console.log('no video found.');
				}
				res.send(msg);
			}
		);
	}

	async vime(req: Request, res: Response) {
		let Vimeo = require('vimeo').Vimeo;
		let client = new Vimeo(
			'6ae2aef0e381d6eb06d0a2e2b2e9b47b50452ae4',
			'+HyK0t+nNFj5oRUFsoKvKr6bxVacEgYjYFMU10l+xT7zoCgj8wLPacrHMDE0mHWc2EKvjBhj182Pooa1hHfVst0VJsWOErZXHZhAF6oj2xdC4cYtTaGx6bSxonUrKuLd',
			'5e767da909b9e71b721e49f8bafb023e'
		);

		client.request(
			{
				method: 'GET',
				// path: '/tutorial',
				// path: '/users/user13911393',
				// path: '/videos/807306477',
				// path: '/users/13911393/projects',
				path: '/users/13911393/projects/15430542/videos',
			},
			function (error: any, body: any, status_code: any, headers: any) {
				if (error) {
					console.log(error);
				}

				console.log(body);
				res.send(body);
			}
		);
	}

	async listItems(req: Request, res: Response) {
		try {
			const items: Item[] = await ItemService.findAll();
			res.status(200).send(items);
		} catch (e: any) {
			res.status(500).send(e.message);
		}
	}

	async getItem(req: Request, res: Response) {
		try {
			const todoId = req.params.id;
			var numId: number = +todoId;
			console.log('req.params.id: ', req.params.id, numId);

			const item: Item = await ItemService.find(numId);
			console.log('item: ', item);

			if (item) {
				return res.status(200).send(item);
			}

			res.status(404).send('item not found');
		} catch (e: any) {
			res.status(500).send(e.message);
		}
	}
}
export default ItemController;

// alternative way
// export const getItem: RequestHandler<{ id: string }> = (req, res, next) => {
// 	const todoId = req.params.id;
// 	console.log('req.params.id: ', req.params.id);
// 	const updatedText = (req.body as { text: string }).text;

//   const item: Item = items[todoId];
// 	res
// 		.status(201)
// 		.json({
// 			message: 'Item got successfully',
// 			updateTodo: item,
// 		});
// };
