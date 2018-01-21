import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter, Route } from 'react-router-dom';
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import rootReducer from './reducers/rootReducer';
import { currentUserFetched, fetchCurrentUser } from './actions/users';
import setAuthorizationHeader from './utils/setAuthorizationHeader';

import App from './App';

import './assets/stylesheets/style.css';

const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk))
);

if (localStorage.holospaceJWT) {
	setAuthorizationHeader(localStorage.holospaceJWT);
	store.dispatch(fetchCurrentUser());
} else {
	store.dispatch(currentUserFetched({}));
}

ReactDOM.render(
	<BrowserRouter>
		<Provider store={store}>
			<Route component={App} />
		</Provider>
	</BrowserRouter>,
	document.getElementById('root')
);
