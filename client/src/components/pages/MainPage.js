import React from 'react';
import PropTypes from 'prop-types';
// import io from 'socket.io-client';
import { connect } from 'react-redux';

// conponents
import Grid from './../layouts/Grid';
import Nested from './../layouts/Nested';
import Section from './../layouts/Section';
import FlexSection from './../layouts/FlexSection';

import DMsgButton from './../buttons/DMsgButton';
import ConfirmEmailReminder from './../alerts/ConfirmEmailReminder';
import Servers from './../servers/Servers';
import CurrentServer from './../servers/CurrentServer';
// import Channels from './../channels/Channels';
import CurrentUser from './../users/CurrentUser';
// import CurrentChannel from '../channels/CurrentChannel';
// import Chat from './../chat/Chat';
import Members from './../members/Members';

class MainPage extends React.Component {
	state = {};

	/* componentWillMount() {
		this.socket = io();
	} */

	render() {
		const { user } = this.props;

		return (
			<div className="site-grid-r2 main-page">
				<Section className="c1 centered">
					<DMsgButton />
					<Servers />
				</Section>

				<div className="two-r">
					{!user.confirmed && <ConfirmEmailReminder />}
					<Grid className="main grid-4c">
						<Nested>
							<Section className="c2t"><CurrentServer /></Section>
							<FlexSection className="c2m">Channels</FlexSection>
							<Section className="c2b">
								<CurrentUser user={user} />
							</Section>
						</Nested>
						<Nested>
							<Section className="c3t">CurrentChannel</Section>
							<FlexSection className="c3m">Chat</FlexSection>
						</Nested>
						<Section className="c4"><Members /></Section>
					</Grid>
				</div>
			</div>
		);
	}
}

MainPage.propTypes = {
	user: PropTypes.shape({
		avatar: PropTypes.string.isRequired,
		username: PropTypes.string.isRequired,
		confirmed: PropTypes.bool.isRequired
	}).isRequired
};

function mapStateToProps(state) {
	return {
		user: state.user
	};
}

export default connect(mapStateToProps)(MainPage);
