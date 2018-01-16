import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';

// components
import User from './User';
import OnlineStatus from './OnlineStatus';
import UserOptions from './UserOptions';

const CurrentUser = ({ user, profile }) => (
	<div className="current-user">
		<Popup
			trigger={
				<Button fluid style={{textAlign:'left'}}>
					<User user={user} />
				</Button>
			}
      style={{ padding: 0 }}
			content={<OnlineStatus />}
			on="click"
		/>
		<UserOptions profile={profile} />
	</div>
);

CurrentUser.defaultProps = {
  profile: false
}

CurrentUser.propTypes = {
	user: PropTypes.shape({}).isRequired,
  profile: PropTypes.bool
};

export default CurrentUser;
