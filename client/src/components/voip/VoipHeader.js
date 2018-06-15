import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Icon } from "semantic-ui-react";
import { allowMic } from "./../../actions/permissions";
import { removeLocalMediaStream } from "./../../actions/users";
import { FormattedMessage } from "react-intl";

import CallOptions from "../options/CallOptions";

class VoipHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		this.waitForMediaStream();
		this.props.socket.on("voip:recv", this.playAudio);
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
			data.blob = new Blob(this.chuncks, {
				type: "audio/ogg; codecs=opus"
			});
			socket.emit("voip:send", data);
		};
		mediaRecorder.start();

		// stop rec after 5 sec and broadcast it to server
		setInterval(() => {
			mediaRecorder.stop();
			mediaRecorder.start();
		}, 5000);
	};

	playAudio = arrayBuffer => {
		const blob = new Blob([arrayBuffer], {
			type: "audio/ogg; codecs=opus"
		});
		this.audio = window.URL.createObjectURL(blob);
	};

	disconnect = () => {
		this.props.removeLocalMediaStream();
		this.props.allowMic(false);
	};

	render() {
		const { user, channel } = this.props;

		return (
			<div className="voip-header">
				<audio autoPlay src={this.audio}>
					<track kind="captions" />
				</audio>

				<div className="text">
					<Icon name="signal" color="teal" />
					<FormattedMessage
						id="voip.VoipHeader.voiceConnected"
						defaultMessage="Voice Connected"
					/>
					<small className="sub-text">
						{`${channel.name} / ${user.username}`}
					</small>
				</div>
				<CallOptions disconnect={this.disconnect} />
			</div>
		);
	}
}

VoipHeader.propTypes = {
	channel: PropTypes.shape({
		_id: PropTypes.string,
		name: PropTypes.string
	}).isRequired,
	user: PropTypes.shape({
		username: PropTypes.string.isRequired,
		pin: PropTypes.number.isRequired
	}).isRequired,
	socket: PropTypes.shape({
		id: PropTypes.string,
		on: PropTypes.func,
		emit: PropTypes.func
	}).isRequired,
	allowMic: PropTypes.func.isRequired,
	removeLocalMediaStream: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return {
		user: state.user,
		permissions: state.permissions,
		socket: state.socket
	};
}

export default connect(mapStateToProps, { allowMic, removeLocalMediaStream })(
	VoipHeader
);
