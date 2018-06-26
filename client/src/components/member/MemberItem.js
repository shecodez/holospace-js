import React from "react";
import PropTypes from "prop-types";
import { Icon, Popup } from "semantic-ui-react";

import UserCard from "./../user/UserCard";
import Avatar from "../layouts/Avatar";

// TODO: change member.avatar to member.icon
const MemberItem = ({ member, owner }) => {
	return (
		<div className="member">
			<Popup
				on="click"
				position="left center"
				wide="very"
				style={{ padding: 0 }}
				trigger={
					<div className="user">
						<Avatar icon={member.icon} name={member.username} />
						<span
							className={`status online--${member.online} ${
								member.status
							}`}
						/>
					</div>
				}
				content={
					<UserCard
						member={member}
						joined={member.joined}
						owner={owner}
					/>
				}
			/>

			<span className="no-display text">{member.username}</span>
			{member.username === owner.username &&
				member.pin === owner.pin && (
					<Icon size="small" color="yellow" name="sun" />
				)}
		</div>
	);
};

MemberItem.defaultProps = {
	owner: { username: " ", pin: 0 }
};

MemberItem.propTypes = {
	member: PropTypes.shape({
		avatar: PropTypes.string,
		username: PropTypes.string,
		online: PropTypes.bool
	}).isRequired,
	owner: PropTypes.shape({
		username: PropTypes.string,
		pin: PropTypes.number
	})
};

export default MemberItem;
