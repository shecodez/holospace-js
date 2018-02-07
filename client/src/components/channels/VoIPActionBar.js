import React from 'react';
import PropTypes from 'prop-types';
import Peer from 'peerjs';
import { Header, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';

// components
import CallOptions from './../options/CallOptions';

class VoIPActionBar extends React.Component {
	state = {
		peers: [],
		stream: null,
		error: ''
	};

	componentDidMount() {
		// this.requestLocalMedia();
		// this.props.socket.emit('voice:init');
	}

	componentWillUnmount() {
		this.stopMediaStream();
	}

	hasGetUserMedia = () => {
		return !!(
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia ||
			navigator.oGetUserMedia
		);
	};

	requestLocalMedia = () => {
		if (this.hasGetUserMedia()) {
			navigator.mediaDevices
				.getUserMedia({ video: false, audio: true })
				.then(stream => {
					// use the stream
					this.setState({ stream });
					this.handleStream(stream);
				})
				.catch(err => {
					// handle the error
					this.handleError(err);
				});
		} else {
			const error = 'WebRTC is not supported by your browser.';
			this.setState({ error }); console.log(error);
		}
	};

	// Access to audio/video granted
	handleStream = stream => {
		const { user, socket, channel } = this.props;

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

	// Access to audio/video denied
	handleError = err => {
		const error = 'Reeeejected! Access to audio/video denied.';
		this.setState({ error }); console.log('Reeeejected!', err);
	};

	stopMediaStream = () => {
		const { stream } = this.state;

		if (stream) {
			stream.getAudioTracks().forEach(track => {
				track.stop();
			});
			stream.getVideoTracks().forEach(track => {
				track.stop();
			});
			// this.setState({ stream: null });
		}
	};

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
				<CallOptions disconnect={this.stopMediaStream} />
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
		id: PropTypes.func,
		on: PropTypes.func,
		emit: PropTypes.func
	})
};

function mapStateToProps(state, props) {
	return {
		user: state.user,
		channel: state.channels.find(
			channel => channel._id === props.match.params.channelId
		)
	};
}

export default withRouter(connect(mapStateToProps, {})(VoIPActionBar));
