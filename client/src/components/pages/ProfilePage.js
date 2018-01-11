import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// conponents
import Grid from './../layouts/Grid';
import Nested from './../layouts/Nested';
import Section from './../layouts/Section';
import FlexSection from './../layouts/FlexSection';

import ConfirmEmailReminder from './../alerts/ConfirmEmailReminder';
import DMsgButton from './../buttons/DMsgButton';

class ProfilePage extends React.Component {
	state = {};

	render() {
		const { user } = this.props;

		return (
			<div className="site-grid-r2 profile-page">
				<Section className="c1">
					<DMsgButton />
					Servers
				</Section>

				<div className="two-r">
					{!user.confirmed && <ConfirmEmailReminder />}
					<Grid className="profile grid-3c">
						<Nested>
							<Section className="c2t">Preview</Section>
							<FlexSection className="c2m">userModel</FlexSection>
							<Section className="c2b">user</Section>
						</Nested>
						<Nested>
							<Section className="c3t">Options</Section>
							<FlexSection className="c3m">UserModelCustomization</FlexSection>
						</Nested>
					</Grid>
				</div>
			</div>
		);
	}
}

ProfilePage.propTypes = {
	user: PropTypes.shape({
		// confirmed: PropTypes.bool.isRequired
	}).isRequired
};

function mapStateToProps(state) {
	return {
		user: state.user
	};
}

export default connect(mapStateToProps)(ProfilePage);
