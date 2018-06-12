import React from "react";
import PropTypes from "prop-types";
import io from "socket.io-client";
import Loader from "react-loader";
import { IntlProvider } from "react-intl";
import { connect } from "react-redux";
import { fetchCurrentUser } from "./actions/users";
import { setSocket } from "./actions/socket";

import translations from "./translations/translations";

import Routes from "./components/routes/Routes";

class App extends React.Component {
	componentDidMount() {
		if (this.props.isAuthenticated) {
			const user = this.props.fetchCurrentUser();

			this.socket = io();
			this.socket.emit("user:init", {
				iconURL: user.avatar,
				userTag: `${user.username}#${user.pin}`
			});
			this.props.setSocket(this.socket);
		}
	}

	render() {
		const { loaded, lang } = this.props;

		return (
			<IntlProvider locale={lang} messages={translations[lang]}>
				<div className="App">
					<Loader loaded={loaded}>
						<Routes />
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
	lang: PropTypes.string.isRequired,
	setSocket: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return {
		isAuthenticated: !!state.user.email,
		loaded: state.user.loaded,
		lang: state.locale.lang
	};
}

export default connect(mapStateToProps, { fetchCurrentUser, setSocket })(App);
