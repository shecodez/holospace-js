import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter, Route } from 'react-router-dom';

import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import ja from 'react-intl/locale-data/ja';

import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

import { localeSet } from './actions/locale';
import { currentUserFetched, fetchCurrentUser } from './actions/users';

import setAuthorizationHeader from './utils/setAuthorizationHeader';

import App from './App';

import './assets/stylesheets/style.css';

addLocaleData(en);
addLocaleData(ja);

const store = configureStore();

if (localStorage.holospaceJWT) {
	setAuthorizationHeader(localStorage.holospaceJWT);
	store.dispatch(fetchCurrentUser());
} else {
	store.dispatch(currentUserFetched({}));
}

if (localStorage.holospaceLang) {
	store.dispatch(localeSet(localStorage.holospaceLang));
}

ReactDOM.render(
	<BrowserRouter>
		<Provider store={store}>
			<Route component={App} />
		</Provider>
	</BrowserRouter>,
	document.getElementById('root')
);
