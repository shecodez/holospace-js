import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { List, Button, Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { updateChannel } from './../../actions/channels';

// components
import ChannelForm from './../forms/ChannelForm';

class Channel extends React.Component {
	state = {
		isOpen: false
	};

	submit = data => {
		this.props.updateChannel(data).then(() => this.toggleModal());
	};

	toggleModal = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	render() {
		const { isOpen } = this.state;
		const { channel, currentServerId, currentChannelId } = this.props;

		return (
			<List.Item
				className={`channel ${
					currentChannelId === channel._id ? 'is-current-channel' : ''
				}`}
				key={channel._id}
			>
				<Link
					to={`/channels/${currentServerId}/${channel._id}`}
					className="channel-link"
				>
					{channel.type === 'Text' && <span className="prepend">#</span>}
					{channel.name}
				</Link>

				<Button icon="setting" onClick={this.toggleModal} />

				<Modal size={'small'} open={isOpen} onClose={this.toggleModal}>
					<Modal.Header>Update Channel</Modal.Header>
					<Modal.Content>
						<ChannelForm
							channel={channel}
							submit={this.submit}
							type={channel.type}
						/>
					</Modal.Content>
				</Modal>
			</List.Item>
		);
	}
}

Channel.defaultProps = {
	currentServerId: '',
	currentChannelId: ''
};

Channel.propTypes = {
	channel: PropTypes.shape({}).isRequired,
	currentServerId: PropTypes.string,
	currentChannelId: PropTypes.string,
	updateChannel: PropTypes.func.isRequired
};

function mapStateToProps(state, props) {
	return {
		currentServerId: props.match.params.serverId,
		currentChannelId: props.match.params.channelId
	};
}

export default withRouter(connect(mapStateToProps, { updateChannel })(Channel));
