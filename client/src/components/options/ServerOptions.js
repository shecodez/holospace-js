import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { Menu, Icon, Confirm } from "semantic-ui-react";
// import { connect } from 'react-redux';

const clickOpts = {
	GENERATE_INVITE_LINK: "Generate Invite Link",
	SERVER_SETTINGS: "Server Settings",
	LEAVE_SERVER: "Leave Server"
};

class ServerOptions extends React.Component {
	state = {
		activeItem: -1,
		serverOptions: [
			{
				icon: "add user",
				name: clickOpts.GENERATE_INVITE_LINK,
				disabled: !this.props.isOwner
			},
			{
				icon: "setting",
				name: clickOpts.SERVER_SETTINGS,
				disabled: !this.props.isOwner
			},
			{
				icon: "x",
				name: clickOpts.LEAVE_SERVER,
				disabled: this.props.isOwner
			}
		],
		openConfirm: false
	};

	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name });
		switch (name) {
			case clickOpts.GENERATE_INVITE_LINK:
				this.props.inviteToServer();
				break;
			case clickOpts.SERVER_SETTINGS:
				this.props.toggleEditModal();
				break;
			case clickOpts.LEAVE_SERVER:
				this.setState({ openConfirm: true });
				break;
			default:
				break;
		}
	};

	handleConfirm = () => {
		// this.props.deleteMembership(serverId)
		this.setState({ openConfirm: false });
	};
	handleCancel = () => this.setState({ openConfirm: false });

	render() {
		const { activeItem, serverOptions } = this.state;
		const { serverName } = this.props;

		const t = msg => (
			<FormattedMessage
				id={`options.ServerOptions.${msg
					.charAt(0)
					.toLowerCase()}${msg.replace(/\s/g, "").slice(1)}`}
				defaultMessage={msg}
			/>
		);

		return (
			<Menu vertical className="server-options">
				{serverOptions.map(option => (
					<Menu.Item
						disabled={option.disabled}
						name={option.name}
						active={activeItem === option.name}
						onClick={this.handleItemClick}
						key={option.name}
					>
						<Icon name={option.icon} />
						{t(option.name)}
					</Menu.Item>
				))}

				<Confirm
					open={this.state.openConfirm}
					header={`Delete membership to ${serverName}`}
					onCancel={this.handleCancel}
					onConfirm={this.handleConfirm}
				/>
			</Menu>
		);
	}
}

ServerOptions.propTypes = {
	isOwner: PropTypes.bool.isRequired,
	toggleEditModal: PropTypes.func.isRequired,
	serverName: PropTypes.string.isRequired,
	inviteToServer: PropTypes.func.isRequired
};

export default ServerOptions;
