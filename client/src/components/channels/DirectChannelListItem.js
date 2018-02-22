import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { List, Button, Icon, Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { updateChannel } from './../../actions/channels';
// import { fetchChannelSubscribers } from './../../actions/subscriptions';

// components
import DirectChannelForm from './../forms/DirectChannelForm';

class DirectChannelListItem extends React.Component {
	state = {
		isOpen: false
	};

	componentDidMount() {
		const { channel, socket } = this.props;

		if (this.props.currentChannelId === channel._id) {
			socket.emit('channel:join', {
				channel: channel._id
			});
		}
	}

	listChannelSubscribers = () => {
		const { subscribers } = this.props.channel;

		if (subscribers) {
			const usernames = subscribers.map(subscriber => subscriber.username);

			const text = usernames.join(', ').slice(0, 37);
			return usernames.join(', ').length < 38 ? text : `${text}...`;
		}
		return '¯\\_(ツ)_/¯';
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
			currentChannelId
			// user
		} = this.props;

		const channelOwner = false;
		/* if (
			user.username === channel.owner_id.username &&
			user.pin === channel.owner_id.pin
		)
			channelOwner = true; */

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
					<Icon circular color="violet" size="large" name="group" />
					{channel.name === 'direct'
						? this.listChannelSubscribers()
						: channel.name}
				</Link>

				{channelOwner && <Button icon="setting" onClick={this.toggleModal} />}

				<Modal size={'small'} open={isOpen} onClose={this.toggleModal}>
					<Modal.Header>
						<FormattedMessage
							id="channels.DirectChannelListItem.updateDirectChannel"
							defaultMessage="Update Direct Channel"
						/>
					</Modal.Header>
					<Modal.Content>
						<DirectChannelForm
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

DirectChannelListItem.defaultProps = {
	currentServerId: '',
	currentChannelId: ''
};

DirectChannelListItem.propTypes = {
	channel: PropTypes.shape({
		name: PropTypes.string,
		topic: PropTypes.string,
		type: PropTypes.string,
		direct: PropTypes.bool,
		subscribers: PropTypes.arrayOf(PropTypes.shape({}))
	}).isRequired,
	currentServerId: PropTypes.string,
	currentChannelId: PropTypes.string,
	updateChannel: PropTypes.func.isRequired,
	socket: PropTypes.shape({
		on: PropTypes.func,
		emit: PropTypes.func
	}).isRequired
	/* user: PropTypes.shape({
		username: PropTypes.string.isRequired,
		pin: PropTypes.number.isRequired
	}).isRequired */
	// fetchChannelSubscribers: PropTypes.func.isRequired
};

function mapStateToProps(state, props) {
	return {
		currentServerId: props.match.params.serverId,
		currentChannelId: props.match.params.channelId
		// user: state.user
		// subscribers: props.subscriptions
	};
}

export default withRouter(
	connect(mapStateToProps, { updateChannel })(DirectChannelListItem)
);
