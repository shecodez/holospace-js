import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Menu, Dropdown, Header, Icon } from "semantic-ui-react";
import * as actions from "./../../../actions/locale";

const languageOptions = [
	{ key: "en", value: "en", flag: "us", text: "EN" },
	{ key: "ja", value: "ja", flag: "jp", text: "JP" }
];

const TopNavigation = ({ isUser, lang, setLocale }) => (
	<Menu secondary className="top-navigation">
		<Menu.Item as={Link} to="/">
			<div className="menu-btn icon">
				<div className="line line-outer" />
				<div className="line line-center" />
				<div className="line line-outer" />
			</div>
			<span className="menu-span text">
				<FormattedMessage
					id="headers.TopNavigation.menu"
					defaultMessage="Menu"
				/>
			</span>
		</Menu.Item>

		<Menu.Menu position="right">
			<Menu.Item>
				<span className="text">
					{isUser && (
						<Link to="/@me">
							<FormattedMessage
								id="headers.TopNavigation.openApp"
								defaultMessage="Open App"
							/>
						</Link>
					)}
					{!isUser && (
						<Link to="/login">
							<FormattedMessage
								id="headers.TopNavigation.login"
								defaultMessage="Log In"
							/>
						</Link>
					)}
				</span>
			</Menu.Item>
			<Menu.Item>
				<Header as="h4" inverted>
					<Icon name="translate" />
					<Header.Content>
						<Dropdown
							inline
							header="Languages"
							options={languageOptions}
							defaultValue={lang}
							onChange={(e, { value }) => setLocale(value)}
						/>
					</Header.Content>
				</Header>
			</Menu.Item>
		</Menu.Menu>
	</Menu>
);

TopNavigation.propTypes = {
	isUser: PropTypes.bool.isRequired,
	lang: PropTypes.string.isRequired,
	setLocale: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return {
		isUser: !!state.user.email,
		lang: state.locale.lang
	};
}

export default connect(mapStateToProps, { setLocale: actions.setLocale })(
	TopNavigation
);
