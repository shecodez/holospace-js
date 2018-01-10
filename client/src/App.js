import React from 'react';
import { Route, Switch } from 'react-router-dom';

// components
import HomePage from './components/pages/HomePage';

import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';

import ProfilePage from './components/pages/ProfilePage';

import NotFoundPage from './components/pages/NotFoundPage';

const App = () => (
	<div className="App">
		<Switch>
			<Route path="/" exact component={HomePage} />
			<Route path="/login" exact component={LoginPage} />
			<Route path="/register" exact component={RegisterPage} />

			<Route path="/@me" exact component={ProfilePage} />

			<Route component={NotFoundPage} />
		</Switch>
	</div>
);

export default App;
