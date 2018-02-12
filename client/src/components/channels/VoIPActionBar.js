import React from 'react';
import PropTypes from 'prop-types';
import Peer from 'peerjs';
import { Header, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { allowMic } from './../../actions/permissions';
import { removeLocalMediaStream } from './../../actions/users';


// components
import CallOptions from './../options/CallOptions';

class VoIPActionBar extends React.Component {
	state = {
		peers: []
	};

	componentDidMount() {
		this.waitForWindowLoad();
		// this.handleStream(window.stream);
		// this.props.socket.emit('voice:init');
	}

	waitForWindowLoad = () => {
		setTimeout(() => this.handleStream(window.stream), 1000);
	}

	componentWillUnmount() {
		this.props.removeLocalMediaStream();
	}

	// Access to audio/video granted
	handleStream = stream => {
		const { user, socket, channel } = this.props;
		console.log('VoIPActionBar handlestream: ', stream);
		let me;
		// const socket = io();
		socket.on('voip:init', () => {
			const options = {
				host: 'localhost',
				port: 9001,
				// path: '/api',
				config: {
					iceServers: [{ url: 'stun:stun.l.google.com:19302' }]
				},
				metadata: {
					userTag: `${user.username}#${user.pin}`,
					channel: channel._id
				}
			};
			me = new Peer(socket.id, options);

			me.on('call', incomingCall => {
				console.log('%sにcallされました', incomingCall.me);
				incomingCall.answer(stream);
			});
		});

		// peers = connections[channel_id]
		socket.on('peers', peers => {
			const index = peers.indexOf(socket.id);
			if (index > -1) {
				peers.splice(index, 1); // 自分自身を無視
			}

			peers.forEach(id => {
				const outgoingCall = me.outgoingCall(id, stream);
				if (outgoingCall === undefined) {
					console.log(`${id} なんて居ません`);
					return;
				}
				outgoingCall.on('stream', remoteStream => {
					this.setState({
						peers: [
							...this.state.peers,
							{ id, stream: window.URL.createObjectURL(remoteStream) }
						]
					});
				});
			});
		});
	};

	disconnectVoice = () => {
		this.props.removeLocalMediaStream();
		this.props.allowMic(false);
	}

	// TODO: implement speech-to-text captions for audio track src
	render() {
		const { peers } = this.state;
		const { user, channel } = this.props;

		return (
			<div className={'voip-action-bar'}>
				{peers.map(peer => (
					<audio key={peer.id} autoPlay src={peer.stream}>
						<track kind="captions" />
					</audio>
				))}

				<Header as="h5" color="teal">
					<Icon name="signal" />{' '}
					<FormattedMessage
						id="channels.VoIPActionBar.voiceConnected"
						defaultMessage="Voice Connected"
					/>
					<Header.Subheader>
						{`${channel.name}/${user.username}`}
					</Header.Subheader>
				</Header>
				<CallOptions disconnect={this.disconnectVoice} />
			</div>
		);
	}
}

VoIPActionBar.defaultProps = {
	channel: { _id: '', name: '' },
	socket: null
};

VoIPActionBar.propTypes = {
	channel: PropTypes.shape({
		_id: PropTypes.string,
		name: PropTypes.string
	}),
	user: PropTypes.shape({
		username: PropTypes.string.isRequired,
		pin: PropTypes.number.isRequired
	}).isRequired,
	socket: PropTypes.shape({
		id: PropTypes.string,
		on: PropTypes.func,
		emit: PropTypes.func
	}),
	allowMic: PropTypes.func.isRequired,
	permissions: PropTypes.shape({
		allowMic: PropTypes.bool.isRequired
	}).isRequired,
	removeLocalMediaStream: PropTypes.func.isRequired
};

function mapStateToProps(state, props) {
	return {
		user: state.user,
		channel: state.channels.find(
			channel => channel._id === props.match.params.channelId
		),
		permissions: state.permissions
	};
}

export default withRouter(connect(mapStateToProps, { allowMic, removeLocalMediaStream })(VoIPActionBar));
