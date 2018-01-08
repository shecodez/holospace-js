import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
/* import 'semantic-ui-css/semantic.min.css';
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk"; */

import App from './App';

import './index.css';

ReactDOM.render(
	<BrowserRouter>
		<Route component={App} />
	</BrowserRouter>,
	document.getElementById('root')
);
