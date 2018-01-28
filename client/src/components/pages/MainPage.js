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

import DMsgButton from './../buttons/DMsgButton';
import ConfirmEmailReminder from './../alerts/ConfirmEmailReminder';
import Servers from './../servers/Servers';
import CurrentServer from './../servers/CurrentServer';
import Channels from './../channels/Channels';
import CurrentUser from './../users/CurrentUser';
import CurrentChannel from '../channels/CurrentChannel';
import ChatRoom from './../chat/ChatRoom';
import ServerMembers from './../members/Members';

class MainPage extends React.Component {
	state = {
		socket: null
	};

	componentWillMount() {
		this.initSocket();
	}

	componentDidMount() {
		this.state.socket.on('user:update', this.updateUser);
	}

	initSocket = () => {
		const { user } = this.props;

		const socket = io();
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
			<div className="site-grid-r2 main-page">
				<Section className="c1 centered">
					<DMsgButton />
					<Servers />
				</Section>

				<div className="two-r">
					{!this.props.user.confirmed && <ConfirmEmailReminder />}
					<Grid className="main grid-4c">
						<Nested>
							<Section className="c2t"><CurrentServer /></Section>
							<FlexSection className="c2m">
								<Channels socket={socket} />
							</FlexSection>
							<Section className="c2b">
								<CurrentUser />
							</Section>
						</Nested>
						<Nested>
							<Section className="c3t"><CurrentChannel /></Section>
							<FlexSection className="c3m">
								<ChatRoom socket={socket} />
							</FlexSection>
						</Nested>
						<Section className="c4"><ServerMembers /></Section>
					</Grid>
				</div>
			</div>
		);
	}
}

MainPage.propTypes = {
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

export default connect(mapStateToProps, { updateUser, updateMember })(MainPage);
