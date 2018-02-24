import React from 'react';
import PropTypes from 'prop-types';
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
		audioSrc: null
	};

	componentDidMount() {
		this.waitForMediaStream();
		this.props.socket.on('voice:recv', this.playAudio);
	}

	// TODO: think of a better way to make this work
	waitForMediaStream = () => {
		setTimeout(() => this.handleStream(window.stream), 1000);
	};

	componentWillUnmount() {
		this.props.removeLocalMediaStream();
	}

	// Access to audio/video granted
	handleStream = stream => {
		const { user, socket, channel } = this.props;
		const mediaRecorder = new window.MediaRecorder(stream);

		const data = {};
		data.holoTag = `${user.username}#${user.pin}`;
		data.channel = channel._id;

		mediaRecorder.onstart = function() {
			this.chuncks = [];
		};
		mediaRecorder.ondataavailable = e => this.chuncks.push(e);
		mediaRecorder.onstop = function() {
			data.blob = new Blob(this.chuncks, { type: 'audio/ogg; codecs=opus' });
			socket.emit('voice:send', data);
		};
		mediaRecorder.start();

		// stop rec after 5 sec and broadcast it to server
		setInterval(() => {
			mediaRecorder.stop();
			mediaRecorder.start();
		}, 5000);
	};

	playAudio = arrayBuffer => {
		const blob = new Blob([arrayBuffer], { type: 'audio/ogg; codecs=opus' });
		this.setState({ audioSrc: window.URL.createObjectURL(blob) });
	};

	disconnectVoice = () => {
		this.props.removeLocalMediaStream();
		this.props.allowMic(false);
	};

	// TODO: implement speech-to-text captions for audio track src
	render() {
		const { audioSrc } = this.state;
		const { user, channel } = this.props;

		return (
			<div className={'voip-action-bar'}>
				<audio autoPlay src={audioSrc}>
					<track kind="captions" />
				</audio>

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

export default withRouter(
	connect(mapStateToProps, { allowMic, removeLocalMediaStream })(VoIPActionBar)
);
