import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import decode from 'jwt-decode';
import { BrowserRouter, Route } from 'react-router-dom';
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import rootReducer from './rootReducer';
import { userLoggedIn } from './actions/auth';

import App from './App';

import './assets/stylesheets/style.css';

const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk))
);

if (localStorage.holospaceJWT) {
	const payload = decode(localStorage.holospaceJWT);
	const user = {
		token: localStorage.holospaceJWT,

		avatar: payload.avatar,
		email: payload.email,
    username: payload.username,
    pin: payload.pin,
    online: payload.online,
    status: payload.status,		
		confirmed: payload.confirmed
	};
	store.dispatch(userLoggedIn(user));
}

ReactDOM.render(
	<BrowserRouter>
		<Provider store={store}>
			<Route component={App} />
		</Provider>
	</BrowserRouter>,
	document.getElementById('root')
);
