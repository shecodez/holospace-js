import React from "react";
import PropTypes from "prop-types";
import { List, Button, Popup } from "semantic-ui-react";

// components
import User from "./../users/User";
import UserCard from "./../user/UserCard";

const MemberList = ({ members, server, online }) => (
	<List className={`member-list ${online}`}>
		{members.map(member => (
			<List.Item className="member" key={member.email}>
				<Popup
					trigger={
						<Button>
							<User user={member} owner={server.owner_id} />
						</Button>
					}
					content={
						<UserCard
							member={member}
							joined={member.joined}
							owner={server.owner_id}
						/>
					}
					on="click"
					offset={50}
					position="left center"
					wide="very"
					style={{ padding: 0 }}
				/>
			</List.Item>
		))}
	</List>
);

MemberList.propTypes = {
	members: PropTypes.arrayOf(PropTypes.object).isRequired,
	server: PropTypes.shape({}).isRequired,
	online: PropTypes.string.isRequired
};

export default MemberList;
