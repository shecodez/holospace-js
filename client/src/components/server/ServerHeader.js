import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
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

	openServerInvitation = () => {
		this.setState({
			inviteToServer: true
		});
	};

	submit = data => {
		this.props.updateServer(data).then(this.toggleModal());
	};

	render() {
		const { open, inviteToServer } = this.state;
		const { server, owner } = this.props;

		return (
			<div className="c2t server-header">
				<span className="no-display text">{server.name}</span>
				<span className="no-display menu">
					<Popup
						on="click"
						style={{ padding: 0 }}
						trigger={<Icon name="chevron down" />}
						content={
							<ServerOptions
								isOwner={owner}
								toggleEditModal={this.toggleModal}
								serverName={server.name}
								inviteToServer={this.openServerInvitation}
							/>
						}
					/>
				</span>

				{inviteToServer && (
					<ServerInvitation
						serverName={server.name}
						serverId={server._id}
					/>
				)}

				<Modal size={"small"} open={open} onClose={this.toggleModal}>
					<Modal.Header>Update Server</Modal.Header>
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
