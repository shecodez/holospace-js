import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import * as actions from '../../actions/auth';

class UserSettings extends React.Component {
	state = {};

	render() {
		const { user, logout } = this.props;
		return (
			<div className="user-settings">
				{`${user.username}#${user.pin}`}
				<Button color="red" inverted onClick={() => logout()}>
					Logout
				</Button>
			</div>
		);
	}
}

UserSettings.propTypes = {
	user: PropTypes.shape({}).isRequired,
	logout: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return {
		user: state.user
	};
}

export default connect(mapStateToProps, { logout: actions.logout })(
	UserSettings
);
