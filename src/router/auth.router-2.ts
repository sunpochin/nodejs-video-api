import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import querystring from 'querystring';
import axios from 'axios';
const { OAuth2Client } = require('google-auth-library');

require('dotenv').config();

const router = express.Router();

import {
	JWT_SECRET,
	COOKIE_NAME,
} from "./config";

const redirectURI = 'auth/google/callback';

function getTokens({
	code,
	clientId,
	clientSecret,
	redirectUri,
}: {
	code: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}): Promise<{
	access_token: string;
	expires_in: Number;
	refresh_token: string;
	scope: string;
	id_token: string;
}> {
	/*
	 * Uses the code to get tokens
	 * that can be used to fetch the user's profile
	 */
	console.log('get tokens');
	const url = 'https://oauth2.googleapis.com/token';
	const values = {
		code,
		client_id: clientId,
		client_secret: clientSecret,
		redirect_uri: redirectUri,
		grant_type: 'authorization_code',
	};

	return axios
		.post(url, querystring.stringify(values), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})
		.then((res) => res.data)
		.catch((error) => {
			console.error(`Failed to fetch auth tokens`);
			throw new Error(error.message);
		});
}

// Getting the user from Google with the code
router.get(`/${redirectURI}`, async (req, res) => {
  const code = req.query.code as string;

  const { id_token, access_token } = await getTokens({
		code,
		clientId: process.env["GOOGLE_CLIENT_ID"] as string,
		clientSecret: process.env["GOOGLE_CLIENT_SECRET"] as string,
		redirectUri: `${process.env["SERVER_ROOT_URI"]}/${redirectURI}`,
	});

  // Fetch the user's profile with the access token and bearer
  const googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch user`);
      throw new Error(error.message);
    });

  const token = jwt.sign(googleUser, JWT_SECRET);
  console.log('googleUser: ', googleUser);
  res.cookie(COOKIE_NAME, token, {
    maxAge: 900000,
    httpOnly: true,
    secure: false,
  });
	console.log('process.env["UI_ROOT_URI"]: ', process.env['UI_ROOT_URI']);
  res.redirect(process.env["UI_ROOT_URI"] as string);
});


const vali = (req: Request, res: Response) => {
	console.log('vali vali req.cookies:', req.cookies);
	console.log('vali vali req.cookies:', req.cookies[COOKIE_NAME]);
  try {
		// console.log('jwt: ', jwt);
		const decoded = jwt.verify(req.cookies[COOKIE_NAME], JWT_SECRET);
		console.log('decoded', decoded);
		return decoded
	} catch (err) {
		return null
		// console.log(err);
		// res.send(null);
	}
}

// Getting the current user
router.get("/auth/me", (req, res, next) => {
	try {
		// console.log('get me req.cookies: ', req.cookies);
		// console.log('get me req.cookies COOKIE_NAME:', req.cookies[COOKIE_NAME]);
		let ret = vali(req, res);
		res.send(ret);
		// next();
	} catch (err) {
		res.send(null);
	}
});


router.post('/auth/google', async (req: Request, res: Response) => {
	try {
		const item = req.body;
		console.log('req.body: ', req.body);
		const access_token = req.body.access_token;
		console.log('req.body accessToken: ', access_token);

		const oauth2Client = new OAuth2Client();
		oauth2Client.setCredentials({ access_token: access_token });
		const userInfo = await oauth2Client
			.request({
				url: 'https://www.googleapis.com/oauth2/v3/userinfo',
			})
			.then((response) => response.data)
			.catch(() => null);

		console.log('userInfo: ', userInfo);

		// oauth2Client.revokeCredentials()

		res.status(201).json(userInfo);
	} catch (e: any) {
		res.status(500).send(e.message);
	}
});


// router.get("/courses", (req: Request, res: Response) => {
// 	res.send("COURSES!");
// });


module.exports = {router, vali}
