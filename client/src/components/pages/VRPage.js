import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// conponents
import Grid from './../layouts/Grid';
import Nested from './../layouts/Nested';
import Section from './../layouts/Section';
import FlexSection from './../layouts/FlexSection';

import ConfirmEmailReminder from './../alerts/ConfirmEmailReminder';
import CurrentServer from './../servers/CurrentServer';
import ChatRoom from './../chat/ChatRoom';
import CurrentUser from './../users/CurrentUser';
import Members from './../members/Members';
import CurrentChannel from './../channels/CurrentChannel';


class VRPage extends React.Component {
  state = {};

	render() {
		const { user } = this.props;

		return (
			<div className="site-grid-r1 vr-page">
				<div className="one-r">
					{!user.confirmed && <ConfirmEmailReminder />}
					<Grid className="grid-3c-vr">
						<Nested>
							<Section className="c2t"><CurrentServer /></Section>
							<FlexSection className="c2m"><ChatRoom /></FlexSection>
							<Section className="c2b">
								<CurrentUser user={user} vr />
							</Section>
						</Nested>
						<Nested>
							<Section className="c3t"><CurrentChannel /></Section>
							<FlexSection className="c3m">Unity 3D Chat</FlexSection>
						</Nested>
            <Section className="c4"><Members /></Section>
					</Grid>
				</div>
			</div>
		);
	}
}

VRPage.propTypes = {
	user: PropTypes.shape({}).isRequired
};

function mapStateToProps(state) {
	return {
		user: state.user
	};
}

export default connect(mapStateToProps)(VRPage);
