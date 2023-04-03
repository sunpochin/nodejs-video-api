// ref:
// 1. https://auth0.com/blog/node-js-and-typescript-tutorial-build-a-crud-api/

import * as dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { itemsRouter } from './router/items.router';
// import {router} from "./router/auth.router";
const auth = require('./router/auth.router');
const course = require('./router/courses.router');
// import courses from "./router/courses.router"
import cors from 'cors';
var cookies = require('cookie-parser');
// const session = require('express-session');
// const passport = require('passport');

dotenv.config();

const app = express();
// https://juejin.cn/post/7117208351234064414
// use cors has to be before use router?

app.use(cookies());
app.use(
	cors({
		// Sets Access-Control-Allow-Origin to the UI URI
		origin: [
			'https://petknow-vue3.netlify.app',
			'http://localhost:8000',
			'https://localhost:8000',
			'http://localhost:8080',
			'https://localhost:8080',
			'http://localhost:8000/auth/me',
			'http://localhost:8000/courses',
			'http://localhost:5173',
			'https://localhost:5173',
		],
		// Sets Access-Control-Allow-Credentials to true
		credentials: true,
	})
);


app.use(helmet());
app.use(express.json());
app.use('/items', itemsRouter);
app.use('/', auth.router);
app.use('/courses', course);

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
