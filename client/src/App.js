import React from "react";
import PropTypes from "prop-types";
import Loader from "react-loader";
import { IntlProvider } from "react-intl";
import { connect } from "react-redux";
import { fetchCurrentUser } from "./actions/users";

import translations from "./i18n/translations";

import Routes from "./components/routes/Routes";

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	componentDidMount() {
		if (this.props.isAuthenticated) {
			this.props.fetchCurrentUser();
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
	lang: PropTypes.string.isRequired
};

function mapStateToProps(state) {
	return {
		user: state.user,
		isAuthenticated: !!state.user.email,
		loaded: state.user.loaded,
		lang: state.locale.lang
	};
}

export default connect(mapStateToProps, {
	fetchCurrentUser
})(App);
