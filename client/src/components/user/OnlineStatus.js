import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { Header, Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
// import { updateOnlineStatus } from './../../actions/user';

import UserOptions from "../options/UserOptions";

class OnlineStatus extends React.Component {
	state = {
		activeItem: this.props.user.status,
		onlineStatus: [
			{ name: "Show", color: "teal" },
			{ name: "Away", color: "yellow" },
			{ name: "Busy", color: "red", desc: "Do NOT Disturb" },
			{ name: "Hide", color: "grey", desc: "You ARE Invisible" }
		]
	};

	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name });
		// this.props.updateOnlineStatus({ status: name });
	};

	render() {
		const { activeItem, onlineStatus } = this.state;
		const { collapsed, openSettings } = this.props;

		const t = msg => (
			<FormattedMessage
				id={`user.OnlineStatus.${msg.toLowerCase()}`}
				defaultMessage={msg}
			/>
		);

		const t2 = (id, msg) => (
			<FormattedMessage
				id={`user.OnlineStatus.${id.toLowerCase()}`}
				defaultMessage={msg}
			/>
		);

		return (
			<Menu vertical className="online-status">
				{onlineStatus.map(status => (
					<Menu.Item
						name={status.name}
						active={activeItem === status.name}
						onClick={this.handleItemClick}
						key={status.name}
					>
						<Header as="h5">
							<Icon name="circle" color={status.color} />
							<Header.Content>{t(status.name)}</Header.Content>
						</Header>
						{status.desc && (
							<p>{t2(`${status.name}Desc`, status.desc)}</p>
						)}
					</Menu.Item>
				))}
				{collapsed && (
					<Menu.Item className="user-options">
						<UserOptions />
					</Menu.Item>
				)}
				{collapsed && (
					<Menu.Item onClick={openSettings}>
						<Icon name="setting" /> {t("Settings")}
					</Menu.Item>
				)}
			</Menu>
		);
	}
}

OnlineStatus.propTypes = {
	// updateOnlineStatus: PropTypes.func.isRequired,
	user: PropTypes.shape({
		status: PropTypes.string.isRequired
	}).isRequired
};

function mapStateToProps(state) {
	return {
		user: state.user
	};
}

export default connect(mapStateToProps, {})(OnlineStatus);
