// ref:
// 1. https://auth0.com/blog/node-js-and-typescript-tutorial-build-a-crud-api/

import * as dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { itemsRouter } from './router/items.router';
import router from "./router/auth.router";
import cors from 'cors';
var cookies = require('cookie-parser');
// const session = require('express-session');
// const passport = require('passport');

// // 設定 Passport 身分驗證套件
// passport.serializeUser(function (user, done) {
// 	done(null, user);
// });

// passport.deserializeUser(function (user, done) {
// 	done(null, user);
// });

dotenv.config();

const app = express();
// https://juejin.cn/post/7117208351234064414
// use cors has to be before use router?
export const UI_ROOT_URI = 'http://localhost:8080';

app.use(cookies());
app.use(
	cors({
		// Sets Access-Control-Allow-Origin to the UI URI
		origin: UI_ROOT_URI,
		// Sets Access-Control-Allow-Credentials to true
		credentials: true,
	})
);


app.use(helmet());
app.use(express.json());
app.use('/items', itemsRouter);
app.use('/', router);

// app.get('/', function (req, res) {
// 	res.json('nodejs video');
// });

// 取得所有 todo
let todos: string[] = ['todo 1', 'todo 2'];
app.get('/todos', (req, res) => {
	res.json(todos);
});
// app.post('/add', (req, res) => {
// 	console.log('req.body: ', req.body);
// 	res.json(req.body);
// });

// // const express = require('express');
// const { OAuth2Client } = require('google-auth-library');
// const { google } = require('googleapis');

// const CLIENT_ID =
// 	'266847528060-86qmub9fgtbtavdkvicc98h5qmot8iub.apps.googleusercontent.com';
// const CLIENT_SECRET = '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';
// const REDIRECT_URI = 'http://localhost:8000/auth/google/callback';
// const COOKIE_NAME = 'cookie';
// const JWT_SECRET = 'secret';
// const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);


// 啟動服務器
const port = 8000;
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;
