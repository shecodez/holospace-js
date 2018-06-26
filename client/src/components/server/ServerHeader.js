import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Icon, Popup, Modal } from "semantic-ui-react";
import { updateServer } from "./../../actions/servers";

import ServerForm from "../forms/ServerForm";
import ServerOptions from "../options/ServerOptions";
import ServerInvitation from "./ServerInvitation";

class ServerHeader extends React.Component {
	state = {
		open: false,
		inviteToServer: false
	};

	toggleModal = () => {
		this.setState({
			open: !this.state.open
		});
	};

	toggleServerInvite = () => {
		this.setState({
			inviteToServer: !this.state.inviteToServer
		});
	};

	submit = data => {
		this.props.updateServer(data).then(this.toggleModal());
	};

	render() {
		const { open, inviteToServer } = this.state;
		const { server, owner, direct } = this.props;

		return (
			<div className="c2t server-header">
				{direct ? (
					<div className="centered">
						<FormattedMessage
							id="server.ServerHeader.directMessages"
							defaultMessage="Direct Messages"
						/>
					</div>
				) : (
					<span className="text">{server.name}</span>
				)}
				{server._id && (
					<span className="menu">
						<Popup
							on="click"
							style={{ padding: 0 }}
							trigger={<Icon name="chevron down" />}
							content={
								<ServerOptions
									isOwner={owner}
									toggleEditModal={this.toggleModal}
									serverName={server.name}
									inviteToServer={this.toggleServerInvite}
								/>
							}
						/>
					</span>
				)}

				{inviteToServer && (
					<ServerInvitation
						open={inviteToServer}
						serverName={server.name}
						serverId={server._id}
						toggle={this.toggleServerInvite}
					/>
				)}

				<Modal size={"small"} open={open} onClose={this.toggleModal}>
					<Modal.Header>
						<FormattedMessage
							id="server.ServerHeader.updateServer"
							defaultMessage="Update Server"
						/>
					</Modal.Header>
					<Modal.Content>
						<ServerForm server={server} submit={this.submit} />
					</Modal.Content>
				</Modal>
			</div>
		);
	}
}

ServerHeader.propTypes = {
	owner: PropTypes.bool.isRequired,
	server: PropTypes.shape({
		_id: PropTypes.string,
		name: PropTypes.string
	}).isRequired,

	updateServer: PropTypes.func.isRequired
};

export default connect(null, { updateServer })(ServerHeader);
