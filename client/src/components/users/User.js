import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';

const User = ({ user }) => (
	<div className="user">
		<div className="avatar">
			<Image avatar src={user.avatar} />
			<div className={`online-status ${user.status}`} />
		</div>
		<span className="content">
			{user.username}
			<span className="pin">{`#${user.pin}`}</span>
		</span>
	</div>
);

User.propTypes = {
	user: PropTypes.shape({
		avatar: PropTypes.string.isRequired,
		username: PropTypes.string.isRequired,
		status: PropTypes.string.isRequired
	}).isRequired
};

export default User;
