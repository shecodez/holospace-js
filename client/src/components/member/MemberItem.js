import React from "react";
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
						<Avatar icon={member.avatar} name={member.username} />
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

export default MemberItem;
