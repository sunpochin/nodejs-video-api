import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import querystring from 'querystring';
import axios from 'axios';
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const router = express.Router();

import { JWT_SECRET, COOKIE_NAME } from './config';

const redirectURI = 'auth/google/callback';

router.post('/google', async (req: Request, res: Response) => {
	try {
		const item = req.body;
		console.log('req.body: ', req.body);
		const credential = req.body.credential;
		console.log('req.body credential: ', credential);

		const oauth2Client = new OAuth2Client();
		const ticket = await oauth2Client.verifyIdToken({
			idToken: credential,
		});
		const payload = ticket.getPayload();
		console.log('payload: ', payload);
		res.status(201).json(payload);
	} catch (e: any) {
		res.status(500).send(e.message);
	}
});

// router.get("/courses", (req: Request, res: Response) => {
// 	res.send("COURSES!");
// });

module.exports = { router };
