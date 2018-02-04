import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Header, Button, Modal } from 'semantic-ui-react';
import { createChannel } from './../../actions/channels';

// components
import ChannelForm from './../forms/ChannelForm';
import DirectChannelForm from './../forms/DirectChannelForm';

class AddChannel extends React.Component {
	state = {
		isOpen: false
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
			server_id: this.props.currentServerId
		};
		return channel;
	};

	cleanupChannelUsers = data => {
		const users = [];
		data.selectedUsers.forEach(user => {
			users.push(user.title)
		});
		const channel = {
			name: data.name,
			topic: data.topic,
			type: data.type,
			direct: data.direct,
			selectedUsers: users
		};

		return channel;
	}

	toggleModal = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	render() {
		const { isOpen } = this.state;

		const { user, server, direct } = this.props;
		let serverOwner = false;
		if (
			user.username === server.owner_id.username &&
			user.pin === server.owner_id.pin
		)
			serverOwner = true;

		return (
			<div className="add-channel">
				<Header as="h4" inverted>{`${this.props.type} Channels`}</Header>
				{(serverOwner || direct) && (
					<Button icon="plus" onClick={this.toggleModal} />
				)}

				<Modal size={'small'} open={isOpen} onClose={this.toggleModal}>
					<Modal.Header>{`Create new ${this.props.type} Channel`}</Modal.Header>
					<Modal.Content>
						{direct ? (
							<DirectChannelForm
								submit={this.submit}
								type={this.props.type}
								user={user}
							/>
						) : (
							<ChannelForm submit={this.submit} type={this.props.type} />
						)}
					</Modal.Content>
				</Modal>
			</div>
		);
	}
}

AddChannel.defaultProps = {
	currentServerId: null,
	server: { owner_id: { username: '', pin: 0 } },
	direct: false
};

AddChannel.propTypes = {
	createChannel: PropTypes.func.isRequired,
	type: PropTypes.string.isRequired,
	currentServerId: PropTypes.string,
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
	direct: PropTypes.bool
};

function mapStateToProps(state, props) {
	return {
		currentServerId: props.match.params.serverId,
		user: state.user,
		server: state.servers.find(
			server => server._id === props.match.params.serverId
		)
	};
}

export default withRouter(
	connect(mapStateToProps, { createChannel })(AddChannel)
);
