import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { updateUser } from './../../actions/users';
import { updateMember } from './../../actions/memberships';

// conponents
import Grid from './../layouts/Grid';
import Nested from './../layouts/Nested';
import Section from './../layouts/Section';
import FlexSection from './../layouts/FlexSection';

import Servers from './../servers/Servers';
import ConfirmEmailReminder from './../alerts/ConfirmEmailReminder';
import ProfileButton from './../buttons/ProfileButton';
import CurrentUser from './../users/CurrentUser';
import CurrentChannel from '../channels/CurrentChannel';
import ChatRoom from './../chat/ChatRoom';
import DirectChannels from './../channels/DirectChannels';

class DMsgPage extends React.Component {
	state = {
		socket: null
	};

	componentWillMount() {
		this.initSocket();
	}

	componentDidMount() {
		this.state.socket.on('user:update', this.updateUser);
	}

	componentWillUnmount() {
		this.setState({ socket: null });
	}

	initSocket = () => {
		const { user } = this.props;

		const socket = io(); // url : ~/direct/channels/
		this.setState({ socket });

		socket.emit('user:init', {
			iconURL: user.avatar,
			userTag: `${user.username}#${user.pin}`
		});
	}

	updateUser = data => {
		if (this.props.user.email === data.user.email){
			this.props.updateUser(data.user);
			this.props.updateMember(data.user);
		}
		else {
			this.props.updateMember(data.user);
		}
		// console.log(data.user);
	}

	render() {
		const { socket } = this.state;

		return (
			<div className="site-grid-r2 dmsg-page">
				<Section className="c1 centered">
					<ProfileButton />
					<Servers />
				</Section>

				<div className="two-r">
					{!this.props.user.confirmed && <ConfirmEmailReminder />}
					<Grid className="dmsg grid-3c">
						<Nested>
							<Section className="c2t centered">Direct Messages</Section>
							<FlexSection className="c2m"><DirectChannels socket={socket} /></FlexSection>
							<Section className="c2b">
								<CurrentUser />
							</Section>
						</Nested>
						<Nested>
							<Section className="c3t"><CurrentChannel /></Section>
							<FlexSection className="c3m"><ChatRoom socket={socket} direct /></FlexSection>
						</Nested>
					</Grid>
				</div>
			</div>
		);
	}
}

DMsgPage.propTypes = {
	user: PropTypes.shape({
		email: PropTypes.string.isRequired,
    confirmed: PropTypes.bool.isRequired
  }).isRequired,
	updateUser: PropTypes.func.isRequired,
	updateMember: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return {
		user: state.user
	};
}

export default connect(mapStateToProps, { updateUser, updateMember })(DMsgPage);
