import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popup, Modal, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { allowMic } from './../../actions/permissions';
import { createLocalMediaStream, removeLocalMediaStream } from './../../actions/users';

// TODO: import icons for : no sound, no mic and no VR
// [hear no evil], [speak no evil], [see no evil]

import UserSettings from './../users/UserSettings';

class UserOptions extends React.Component {
	state = {
		isOpen: false,

		mute: false,
		useVR: false,
		error: null,

		options: [
			{
				// !mute
				icon: 'headphone',
				iDont: 'deaf',
				true: 'Hear No Evil',
				false: 'Unmute'
			},
			{
				icon: 'microphone',
				iDont: 'microphone slash',
				true: 'Speak No Evil',
				false: 'Use Microphone'
			},
			{
				icon: 'gamepad',
				iDont: 'low vision',
				true: 'See No Evil',
				false: 'Use VR'
			}
		]
	};

	toggleModal = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	handleOptionClick = option => {
		switch (option) {
			case 'gamepad':
				this.selectVR();
				break;
			case 'microphone':
				this.requestMic();
				break;
			default:
				this.muteSound();
		}
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

	muteSound = () => this.setState({ mute: !this.state.mute });

	requestMic = () => {
		if (this.props.permissions.allowMic) {
			this.props.removeLocalMediaStream();
			this.props.allowMic(false);
		} else {
			this.props.createLocalMediaStream(); // then allowMic
			this.props.allowMic(true);
		}
	};

	selectVR = () => this.setState({ useVR: !this.state.useVR });

	render() {
		const { isOpen, options } = this.state;
		const permissions = [
			!this.state.mute,
			this.props.permissions.allowMic,
			this.state.useVR
		];

		return (
			<div className="user-options">
				<Button.Group>
					{!this.props.profile &&
						options.map((option, i) => (
							<Popup
								trigger={
									<Button
										icon
										onClick={() => this.handleOptionClick(option.icon)}
									>
										{!permissions[i] ? (
											<Icon color="red" name={option.iDont} />
										) : (
											<Icon name={option.icon} />
										)}
									</Button>
								}
								content={permissions[i] ? option.true : option.false}
								inverted
								position="top center"
								key={option.icon}
							/>
						))}

					<Popup
						trigger={<Button icon="setting" onClick={this.toggleModal} />}
						content="User Settings"
						inverted
						position="top center"
					/>
				</Button.Group>

				<Modal open={isOpen} onClose={this.toggleModal} basic closeIcon>
					<Modal.Header>User Settings</Modal.Header>
					<Modal.Content>
						<UserSettings />
					</Modal.Content>
				</Modal>
			</div>
		);
	}
}

UserOptions.propTypes = {
	profile: PropTypes.bool.isRequired,
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

export default connect(mapStateToProps, { allowMic, createLocalMediaStream, removeLocalMediaStream })(UserOptions);