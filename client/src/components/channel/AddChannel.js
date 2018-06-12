import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Icon, Modal } from "semantic-ui-react";
import { createChannel } from "./../../actions/channels";

// components
import ChannelForm from "./../forms/ChannelForm";
import DirectChannelForm from "./../forms/DirectChannelForm";

class AddChannel extends React.Component {
	state = {
		open: false
	};

	submit = data => {
		if (this.props.direct) {
			this.props
				.createChannel(this.cleanupChannelUsers(data))
				.then(() => this.toggleModal());
		} else {
			this.props
				.createChannel(this.addServerIdToChannel(data))
				.then(() => this.toggleModal());
		}
	};

	addServerIdToChannel = data => {
		const channel = {
			name: data.name,
			topic: data.topic,
			type: data.type,
			server_id: this.props.server._id
		};
		return channel; // { ...data, server._id }
	};

	cleanupChannelUsers = data => {
		const users = [];
		data.selectedUsers.forEach(user => {
			users.push(user.title);
		});
		const channel = {
			name: data.name,
			topic: data.topic,
			type: data.type,
			direct: data.direct,
			selectedUsers: users
		};

		return channel;
	};

	toggleModal = () => {
		this.setState({
			open: !this.state.open
		});
	};

	render() {
		const { open } = this.state;

		const { user, server, direct } = this.props;

		let canAdd = false;
		if (
			user.username === server.owner_id.username &&
			user.pin === server.owner_id.pin
		)
			canAdd = true;

		return (
			<span className="add-channel">
				<span className="text">{`${this.props.type} Channels`}</span>
				{(canAdd || direct) && (
					<span className="menu">
						<Icon name="add" onClick={this.toggleModal} />
					</span>
				)}

				<Modal size={"small"} open={open} onClose={this.toggleModal}>
					<Modal.Header>
						{`Create new ${this.props.type} Channel`}
					</Modal.Header>
					<Modal.Content>
						{direct ? (
							<DirectChannelForm
								submit={this.submit}
								type={this.props.type}
								user={user}
							/>
						) : (
							<ChannelForm
								submit={this.submit}
								type={this.props.type}
							/>
						)}
					</Modal.Content>
				</Modal>
			</span>
		);
	}
}

AddChannel.defaultProps = {
	server: { owner_id: { username: "", pin: 0 } },
	direct: false
};

AddChannel.propTypes = {
	direct: PropTypes.bool,
	type: PropTypes.string.isRequired,
	user: PropTypes.shape({
		username: PropTypes.string.isRequired,
		pin: PropTypes.number.isRequired
	}).isRequired,
	server: PropTypes.shape({
		owner_id: PropTypes.shape({
			username: PropTypes.string,
			pin: PropTypes.number
		})
	}),
	createChannel: PropTypes.func.isRequired
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
	connect(mapStateToProps, { createChannel })(AddChannel)
);
