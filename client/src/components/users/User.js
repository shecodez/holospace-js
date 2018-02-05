import React from 'react';
import PropTypes from 'prop-types';
import { Image, Icon } from 'semantic-ui-react';

const User = ({ user, owner }) => (
	<div className="user">
		<div className="avatar">
			<Image avatar src={user.avatar} />
			<div className={`online--${user.online} ${user.status}`} />
		</div>
		<span className="content">
			{user.username}{' '}
			{user.username === owner.username &&
				user.pin === owner.pin && (
					<Icon size="small" color="yellow" name="sun" />
				)}
			<span className="pin">{`#${user.pin}`}</span>
		</span>
	</div>
);
User.defaultProps = {
	owner: { username: '', pin: 0 }
};
User.propTypes = {
	user: PropTypes.shape({
		avatar: PropTypes.string.isRequired,
		username: PropTypes.string.isRequired,
		pin: PropTypes.number.isRequired,
		status: PropTypes.string.isRequired,
		online: PropTypes.bool.isRequired
	}).isRequired,
	owner: PropTypes.shape({
		username: PropTypes.string,
		pin: PropTypes.number
	})
};

export default User;
