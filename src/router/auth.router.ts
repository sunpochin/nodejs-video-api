import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import querystring from 'querystring';
import axios from 'axios';

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
} from "./config";

const port = 8000;

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
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: `${SERVER_ROOT_URI}/${redirectURI}`,
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

  res.redirect(UI_ROOT_URI);
});

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


module.exports = router;
