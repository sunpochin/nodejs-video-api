// ref:
// 1. https://auth0.com/blog/node-js-and-typescript-tutorial-build-a-crud-api/

import * as dotenv from 'dotenv';
import express from 'express';
// import helmet from 'helmet';
import { itemsRouter } from './router/items.router';
import session from "express-session";
import auth from "./router/auth.router";
import cors from 'cors';
var cookies = require('cookie-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./passport');

dotenv.config();

const app = express();
// https://juejin.cn/post/7117208351234064414
// use cors has to be before use router?
export const UI_ROOT_URI = 'http://localhost:5173';
//app.use(cookies());
// app.use(
// 	cookieSession({
// 		name: 'google-auth-session',
// 		keys: ['key1', 'key2'],
// 	})
// );
// Authentication configuration
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'bla bla bla'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
		// Sets Access-Control-Allow-Origin to the UI URI
		origin: [
			UI_ROOT_URI,
			'https://localhost:5173',
			'https://localhost:8000',
			'http://localhost:8000',
		],
		// Sets Access-Control-Allow-Credentials to true
		credentials: true,
	})
);

// app.use(helmet());
app.use(express.json());
app.use('/items', itemsRouter);
app.use('/', auth);

// app.get('/failed', (req, res) => {
// 	res.send('Failed');
// });
// app.get('/success', (req, res) => {
// 		console.log('req.user: ', req.user);
// 	res.send(`Welcome ${req.user.displayName}`);
// });

// app.get(
// 	'/google',
// 	passport.authenticate('google', {
// 		scope: ['email', 'profile'],
// 	})
// );

// app.get(
// 	'/auth/google/callback',
// 	passport.authenticate('google', {
// 		failureRedirect: '/failed',
// 	}),
// 	function (req, res) {
// 		res.redirect('/success');
// 	}
// );

// app.get('/', function (req, res) {
// 	res.json('nodejs video');
// });

// 取得所有 todo
let todos: string[] = ['todo 1', 'todo 2'];
app.get('/todos', (req, res) => {
	res.json(todos);
});

// 啟動服務器
const port = 8000;
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;
