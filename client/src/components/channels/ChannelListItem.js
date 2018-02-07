import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { List, Button, Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { updateChannel } from './../../actions/channels';
import { fetchChannelSubscribers } from './../../actions/subscriptions';

// components
import ChannelForm from './../forms/ChannelForm';

class ChannelListItem extends React.Component {
	state = {
		isOpen: false
	};

	componentDidMount() {
		const { channel, socket } = this.props;

		if (this.props.currentChannelId === channel._id) {
			socket.emit('channel:join', {
				channel: channel._id
			});

			if (channel.direct) this.fetchChannelSubscribers(channel._id);
		}
	}

	fetchChannelSubscribers = channelId => {
		this.props.fetchChannelSubscribers(channelId);
	};

	componentWillUnmount() {
		const { channel, socket } = this.props;
		if (this.props.currentChannelId === channel._id) {
			socket.emit('channel:left', channel._id);
			// console.log(`socket.emit(channel:left, ${channel._id})`);
		}
	}

	setChannel = () => {
		const { channel, socket } = this.props;
		socket.emit('channel:switch', channel._id);
		// console.log(`socket.emit(channel:switch, ${channel._id})`);
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
		const {
			channel,
			currentServerId,
			currentChannelId,
			user,
			server
		} = this.props;

		let serverOwner = false;
		if (
			user.username === server.owner_id.username &&
			user.pin === server.owner_id.pin
		)
			serverOwner = true;

		let url = '';
		if (channel.direct) {
			url = `/direct/channels/${channel._id}`;
		} else {
			url = `/channels/${currentServerId}${
				channel.type === 'VR' ? '/vr/' : '/'
			}${channel._id}`;
		}

		return (
			<List.Item
				className={`channel ${
					currentChannelId === channel._id ? 'is-current-channel' : ''
				}`}
				key={channel._id}
			>
				<Link to={url} className="channel-link" onClick={this.setChannel}>
					{channel.type === 'Text' && <span className="prepend">#</span>}
					{channel.name}
				</Link>

				{serverOwner && <Button icon="setting" onClick={this.toggleModal} />}

				<Modal size={'small'} open={isOpen} onClose={this.toggleModal}>
					<Modal.Header>
						<FormattedMessage
							id="channels.ChannelListItem.updateChannel"
							defaultMessage="Update Channel"
						/>
					</Modal.Header>
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

ChannelListItem.defaultProps = {
	currentServerId: '',
	currentChannelId: '',
	server: { owner_id: { username: '', pin: 0 } }
};

ChannelListItem.propTypes = {
	channel: PropTypes.shape({}).isRequired,
	currentServerId: PropTypes.string,
	currentChannelId: PropTypes.string,
	updateChannel: PropTypes.func.isRequired,
	socket: PropTypes.shape({
		id: PropTypes.string,
		on: PropTypes.func,
		emit: PropTypes.func
	}).isRequired,
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
	fetchChannelSubscribers: PropTypes.func.isRequired
};

function mapStateToProps(state, props) {
	return {
		currentServerId: props.match.params.serverId,
		currentChannelId: props.match.params.channelId,
		user: state.user,
		server: state.servers.find(
			server => server._id === props.match.params.serverId
		),
		subscribers: props.subscriptions
	};
}

export default withRouter(
	connect(mapStateToProps, { updateChannel, fetchChannelSubscribers })(
		ChannelListItem
	)
);
