import React from "react";
import PropTypes from "prop-types";
import { Header, Button, Modal, Popup } from "semantic-ui-react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { FormattedMessage } from "react-intl";
import { updateServer, fetchServer } from "./../../actions/servers";

// components
import ServerForm from "./../forms/ServerForm";
import ServerOptions from "./../options/ServerOptions";
import ServerInvitation from "../server/ServerInvitation";

class CurrentServer extends React.Component {
	state = {
		isOpen: false,
		inviteToServer: false
	};

	componentDidMount() {
		if (this.props.server.name === "" && this.props.match.params.serverId) {
			this.props.fetchServer(this.props.match.params.serverId);
		}
	}

	submit = data => {
		this.props.updateServer(data).then(this.toggleModal());
	};

	toggleModal = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	openServerInvitation = () => {
		this.setState({
			inviteToServer: true
		});
	};

	render() {
		const { isOpen, inviteToServer } = this.state;
		const { user, server } = this.props;

		let serverOwner = false;
		if (
			user.username === server.owner_id.username &&
			user.pin === server.owner_id.pin
		)
			serverOwner = true;

		return (
			<div className="current-server">
				{server && (
					<Header as="h3" inverted>
						{server.name}
					</Header>
				)}
				<Popup
					trigger={<Button icon="content" />}
					style={{ padding: 0 }}
					content={
						<ServerOptions
							isOwner={serverOwner}
							toggleEditModal={this.toggleModal}
							serverName={server.name}
							inviteToServer={this.openServerInvitation}
						/>
					}
					on="click"
				/>
				{inviteToServer && (
					<ServerInvitation
						serverName={server.name}
						serverId={server._id}
					/>
				)}

				<Modal size={"small"} open={isOpen} onClose={this.toggleModal}>
					<Modal.Header>
						<FormattedMessage
							id="servers.CurrentServer.updateServer"
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

CurrentServer.defaultProps = {
	server: { name: "", owner_id: { username: "", pin: 0 } }
};

CurrentServer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			serverId: PropTypes.string.isRequired
		})
	}).isRequired,
	user: PropTypes.shape({
		username: PropTypes.string.isRequired,
		pin: PropTypes.number.isRequired
	}).isRequired,
	server: PropTypes.shape({
		name: PropTypes.string
	}),
	fetchServer: PropTypes.func.isRequired,
	updateServer: PropTypes.func.isRequired
};

function mapStateToProps(state, props) {
	return {
		user: state.user,
		server: state.servers.find(
			server => server._id === props.match.params.serverId
		)
	};
}

export default withRouter(
	connect(mapStateToProps, { updateServer, fetchServer })(CurrentServer)
);
