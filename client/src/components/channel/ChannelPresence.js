import React from "react";
import PropTypes from "prop-types";

import MemberItem from "../member/MemberItem";

const ChannelPresence = ({ presence }) => {
	return (
		<div className="channel-presence">
			{presence.users.map(user => (
				<MemberItem member={user} key={user.id} size="small" />
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
