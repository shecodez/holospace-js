import React from 'react';
import { Route, Switch } from 'react-router-dom';

// components
import UserRoute from './components/routes/UserRoute';
import GuestRoute from './components/routes/GuestRoute';

import HomePage from './components/pages/HomePage';

import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ConfirmationPage from './components/pages/ConfirmationPage';

import ProfilePage from './components/pages/ProfilePage';

import NotFoundPage from './components/pages/NotFoundPage';

const App = () => (
	<div className="App">
		<Switch>
			<Route path="/" exact component={HomePage} />
			<Route path='/confirmation/:token' exact component={ConfirmationPage} />

			<GuestRoute path="/login" exact component={LoginPage} />
			<GuestRoute path="/register" exact component={RegisterPage} />

			<UserRoute path="/@me" exact component={ProfilePage} />

			<Route component={NotFoundPage} />
		</Switch>
	</div>
);

export default App;
