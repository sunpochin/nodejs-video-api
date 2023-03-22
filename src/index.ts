// ref: 
// 1. https://auth0.com/blog/node-js-and-typescript-tutorial-build-a-crud-api/

import * as dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { itemsRouter } from './router/items.router';
import cors from 'cors';

dotenv.config();

const app = express();
// https://juejin.cn/post/7117208351234064414
// use cors has to be before use router?
app.use(
	cors({
		origin: '*',
	})
);
app.use(helmet());
app.use(express.json());
app.use('/', itemsRouter);

// const cors = require('cors');
// app.use(function (req, res, next) {
// 	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
// 	res.setHeader(
// 		'Access-Control-Allow-Methods',
// 		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
// 	);
// 	res.setHeader(
// 		'Access-Control-Allow-Headers',
// 		'X-Requested-With,content-type'
// 	);
// 	res.setHeader('Access-Control-Allow-Credentials', 'true');
// 	next();
// });



let todos: string[] = ['todo 1', 'todo 2'];

app.get('/', function (req, res) {
	res.json('nodejs video');
});

// 取得所有 todo
app.get('/todos', (req, res) => {
	res.json(todos);
});
// app.post('/add', (req, res) => {
// 	console.log('req.body: ', req.body);
// 	res.json(req.body);
// });


app.listen(8000, () => console.log('Server started on port 8000'));

module.exports = app;


