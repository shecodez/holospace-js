import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Button, Modal } from 'semantic-ui-react';
import { createChannel } from './../../actions/channels';

// components
import ChannelForm from './../forms/ChannelForm';

class AddChannel extends React.Component {
	state = {
		isOpen: false
	};

	submit = data => {
		this.props
			.createChannel(this.addServerIdToChannel(data))
			.then(() => this.toggleModal());
	};

	addServerIdToChannel = data => {
		const channel = {
			name: data.name,
			topic: data.topic,
			type: data.type
			// server_id: this.props.match.params.serverId || null
		};
		return channel;
	};

	toggleModal = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	render() {
		const { isOpen } = this.state;

		return (
			<div className="add-channel">
				<Header as="h4" inverted>{`${this.props.type} channels`}</Header>
				<Button icon="plus" onClick={this.toggleModal} />

				<Modal size={'small'} open={isOpen} onClose={this.toggleModal}>
					<Modal.Header>{`Create new ${this.props.type} channel`}</Modal.Header>
					<Modal.Content>
						<ChannelForm submit={this.submit} type={this.props.type} />
					</Modal.Content>
				</Modal>
			</div>
		);
	}
}

AddChannel.propTypes = {
	createChannel: PropTypes.func.isRequired,
	type: PropTypes.string.isRequired
};

export default connect(null, { createChannel })(AddChannel);
