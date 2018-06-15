import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import Avatar from "../layouts/Avatar";

const ChannelPresence = ({ presence }) => {
	return (
		<div className="channel-presence">
			{_.toArray(presence).map(user => (
				<div className="member" key={user.holoTag}>
					<Avatar icon={user.icon} name={user.holoTag.slice(0, -5)} />
					<span className="text">{user.holoTag.slice(0, -5)}</span>
				</div>
			))}
		</div>
	);
};

ChannelPresence.PropTypes = {
	presence: PropTypes.shape(
		PropTypes.arrayOf({
			users: PropTypes.object
		})
	).isRequired
};

export default ChannelPresence;
