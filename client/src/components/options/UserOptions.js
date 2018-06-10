import React from "react";
import PropTypes from "prop-types";
import { Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { allowMic } from "./../../actions/permissions";
import {
	createLocalMediaStream,
	removeLocalMediaStream
} from "./../../actions/users";

// TODO: import icons for : no sound, no mic and no AR
// [hear no evil], [speak no evil], [see no evil]

class UserOptions extends React.Component {
	state = {
		mute: false,
		allowAR: false,
		hotMic: false
	};

	hasGetUserMedia = () => {
		return !!(
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia ||
			navigator.oGetUserMedia
		);
	};

	toggleSound = () => this.setState({ mute: !this.state.mute });

	requestMic = () => {
		if (this.props.permissions.allowMic) {
			this.props.removeLocalMediaStream();
			this.props.allowMic(false);
			this.setState({ hotMic: false });
		} else {
			this.props.createLocalMediaStream(); // then allowMic
			this.props.allowMic(true);
			this.setState({ hotMic: true });
		}
	};

	toggleAR = () => this.setState({ allowAR: !this.state.allowAR });

	render() {
		const { mute, allowAR, hotMic } = this.state;

		return (
			<div className="user-options">
				<div className="menu">
					<Icon
						name={mute ? "deaf" : "headphone"}
						onClick={this.toggleSound}
					/>
					<Icon
						name={hotMic ? "microphone" : "microphone slash"}
						onClick={this.requestMic}
					/>
					<Icon
						name={allowAR ? "video camera" : "hide"}
						onClick={this.toggleAR}
					/>
				</div>
			</div>
		);
	}
}

UserOptions.propTypes = {
	permissions: PropTypes.shape({
		allowMic: PropTypes.bool.isRequired
	}).isRequired,
	allowMic: PropTypes.func.isRequired,
	user: PropTypes.shape({
		stream: PropTypes.shape({})
	}).isRequired,
	createLocalMediaStream: PropTypes.func.isRequired,
	removeLocalMediaStream: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return {
		user: state.user,
		permissions: state.permissions
	};
}

export default connect(mapStateToProps, {
	allowMic,
	createLocalMediaStream,
	removeLocalMediaStream
})(UserOptions);
