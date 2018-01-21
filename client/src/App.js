import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchCurrentUser } from './actions/users';

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

class App extends React.Component {
	componentDidMount() {
		if (this.props.isAuthenticated)
			this.props.fetchCurrentUser();
	}

	render() {
		return (
			<div className="App">
				<Loader loaded={this.props.loaded}>
				<Switch>

					<Route path="/" exact component={HomePage} />
					<Route path="/confirmation/:token" exact component={ConfirmationPage} />

					<GuestRoute path="/login" exact component={LoginPage} />
					<GuestRoute path="/register" exact component={RegisterPage} />
					<GuestRoute path="/reset_password/:token" exact component={ResetPasswordPage} />

					<UserRoute path="/@me" exact component={ProfilePage} />
					<UserRoute path="/channels/:serverId/:channelId" exact component={MainPage} />

					<Route component={NotFoundPage} />

				</Switch>
				</Loader>
			</div>
		);
	}
}

App.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	fetchCurrentUser: PropTypes.func.isRequired,
	loaded: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
	return {
		isAuthenticated: !!state.user.email,
		loaded: state.user.loaded
	};
}

export default connect(mapStateToProps, { fetchCurrentUser })(App);
