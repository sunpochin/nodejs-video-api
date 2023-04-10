import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import App from './components/App';

const App2 = () => {
	return (
		<div>
			<h1>H1 letter</h1>
			Hello
		</div>
	);
};

const Routes = () => (
	<BrowserRouter>
		<Switch>
			<Route path='/' component={App} />
		</Switch>
	</BrowserRouter>
);


const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);

