import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// conponents
import Grid from './../layouts/Grid';
import Nested from './../layouts/Nested';
import Section from './../layouts/Section';
import FlexSection from './../layouts/FlexSection';

import Servers from './../servers/Servers';
import ConfirmEmailReminder from './../alerts/ConfirmEmailReminder';
import DMsgButton from './../buttons/DMsgButton';
import CurrentUser from './../users/CurrentUser';
import Customization from './../users/Customization';
import ProfileHeader from './../headers/ProfileHeader';

class ProfilePage extends React.Component {
	state = {};

	render() {
		const { user } = this.props;

		return (
			<div className="site-grid-r2 profile-page">
				<Section className="c1 centered">
					<DMsgButton />
					<Servers />
				</Section>

				<div className="two-r">
					{!user.confirmed && <ConfirmEmailReminder />}
					<Grid className="profile grid-3c">
						<Nested>
							<Section className="c2t centered">Preview</Section>
							<FlexSection className="c2m centered">(User 3D Model)</FlexSection>
							<Section className="c2b">
								<CurrentUser user={user} profile />
							</Section>
						</Nested>
						<Nested>
							<Section className="c3t"><ProfileHeader /></Section>
							<FlexSection className="c3m"><Customization /></FlexSection>
						</Nested>
					</Grid>
				</div>
			</div>
		);
	}
}

ProfilePage.propTypes = {
	user: PropTypes.shape({}).isRequired
};

function mapStateToProps(state) {
	return {
		user: state.user
	};
}

export default connect(mapStateToProps)(ProfilePage);
