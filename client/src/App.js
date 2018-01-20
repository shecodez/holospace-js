import React from 'react';
import { Route, Switch } from 'react-router-dom';

// components
import UserRoute from './components/routes/UserRoute';
import GuestRoute from './components/routes/GuestRoute';

import HomePage from './components/pages/HomePage';

import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ConfirmationPage from './components/pages/ConfirmationPage';
import ResetPasswordPage from './components/pages/ResetPasswordPage';

import ProfilePage from './components/pages/ProfilePage';
import MainPage from "./components/pages/MainPage";

import NotFoundPage from './components/pages/NotFoundPage';

const App = () => (
	<div className="App">
		<Switch>
			<Route path="/" exact component={HomePage} />
			<Route path='/confirmation/:token' exact component={ConfirmationPage} />

			<GuestRoute path="/login" exact component={LoginPage} />
			<GuestRoute path="/register" exact component={RegisterPage} />
			<GuestRoute path="/reset_password/:token" exact component={ResetPasswordPage} />

			<UserRoute path="/@me" exact component={ProfilePage} />
			<UserRoute path="/channels/:serverId/:channelId" exact component={MainPage} />

			<Route component={NotFoundPage} />
		</Switch>
	</div>
);

export default App;
