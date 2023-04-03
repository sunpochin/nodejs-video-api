import express, { Request, Response } from 'express';
const passport = require('passport');
import jwt from 'jsonwebtoken';
import querystring from 'querystring';
import axios from 'axios';
const { OAuth2Client } = require('google-auth-library');

// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const router = express.Router();

import {
	SERVER_ROOT_URI,
	GOOGLE_CLIENT_ID,
	JWT_SECRET,
	GOOGLE_CLIENT_SECRET,
	COOKIE_NAME,
	UI_ROOT_URI,
} from './config';

const port = 8000;

const redirectURI = 'auth/google/callback';

// Getting the user from Google with the code
router.get('/failed', (req, res) => {
	res.send('Failed');
});

router.get('/success', (req: any, res) => {
	console.log('req.user: ', req.user);
	console.log('req.user: ', req.user.emails[0]);
	res.send(`Welcome ${req.user.emails[0].value}`);
});


router.post('/auth/google',async (req: Request, res: Response) => {
	try {
		const item = req.body;
		console.log('req.body: ', req.body)
		const access_token = req.body.access_token;
    console.log('req.body accessToken: ', access_token);

		const oauth2Client = new OAuth2Client()
	  oauth2Client.setCredentials({ access_token: access_token });
		const userInfo = await oauth2Client
	    .request({
	      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
	    })
	    .then((response: any) => response.data)
	    .catch(() => null)

		console.log('userInfo: ', userInfo)

	  // oauth2Client.revokeCredentials()

		res.status(201).json(userInfo);
	} catch (e: any) {
		res.status(500).send(e.message);
	}
});


// passport.authenticate('google', {
// 	scope: ['email', 'profile'],
// })
router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['email', 'profile'],
	})
);

router.get(
	'/auth/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/failed',
	}),
	function (req: any, res: any) {
		res.data = req.user;
		const token = jwt.sign(req.user, JWT_SECRET);
		console.log('googleUser: ', req.user);
		console.log('token: ', token);

		res.cookie(COOKIE_NAME, token, {
			maxAge: 900000,
			httpOnly: false,
			secure: false,
		});

		res.redirect('http://localhost:8080');
		// res.redirect('/success');
	}
);

// Getting the current user
router.get("/auth/me", (req, res) => {
  console.log('get me req.cookies: ', req.cookies);
  try {
    const decoded = jwt.verify(req.cookies[COOKIE_NAME], JWT_SECRET);
    console.log("decoded", decoded);
    return res.send(decoded);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
});

export const authRouter = router;
