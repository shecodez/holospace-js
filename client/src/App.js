import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader';
import { IntlProvider } from 'react-intl';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchCurrentUser } from './actions/users';

import translations from "./translations/translations";

// components
import UserRoute from './components/routes/UserRoute';
import GuestRoute from './components/routes/GuestRoute';

import HomePage from './components/pages/HomePage';

import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ConfirmationPage from './components/pages/ConfirmationPage';
import ResetPasswordPage from './components/pages/ResetPasswordPage';
import InvitePage from './components/pages/InvitePage';

import ProfilePage from './components/pages/ProfilePage';
import MainPage from './components/pages/MainPage';
import VRPage from './components/pages/VRPage';
import DMsgPage from './components/pages/DMsgPage';

import NotFoundPage from './components/pages/NotFoundPage';

class App extends React.Component {
	
	componentDidMount() {
		if (this.props.isAuthenticated)
			this.props.fetchCurrentUser();
	}

	render() {
		const { loaded, lang } = this.props;

		return (
			<IntlProvider locale={lang} messages={translations[lang]}>
			<div className="App">
				<Loader loaded={loaded}>
				<Switch>

					<Route path="/" exact component={HomePage} />
					<Route path="/confirmation/:token" exact component={ConfirmationPage} />

					<GuestRoute path="/login" exact component={LoginPage} />
					<GuestRoute path="/register" exact component={RegisterPage} />
					<GuestRoute path="/reset_password/:token" exact component={ResetPasswordPage} />

					<UserRoute path="/@me" exact component={ProfilePage} />
					<Route path="/invite/:invitation" exact component={InvitePage} />
					<UserRoute path="/channels/:serverId/:channelId" exact component={MainPage} />
					<UserRoute path="/channels/:serverId/vr/:channelId" exact component={VRPage} />
					<UserRoute path="/direct/channels" exact component={DMsgPage} />
					<UserRoute path="/direct/channels/:channelId" exact component={DMsgPage} />

					<Route component={NotFoundPage} />

				</Switch>
				</Loader>
			</div>
			</IntlProvider>
		);
	}
}

App.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	fetchCurrentUser: PropTypes.func.isRequired,
	loaded: PropTypes.bool.isRequired,
	lang: PropTypes.string.isRequired
};

function mapStateToProps(state) {
	return {
		isAuthenticated: !!state.user.email,
		loaded: state.user.loaded,
		lang: state.locale.lang
	};
}

export default connect(mapStateToProps, { fetchCurrentUser })(App);
