import React from "react";

import MemberItem from "./MemberItem";

class MemberList extends React.Component {
	state = {};

	render() {
		const { members, owner } = this.props;

		const online = [];
		const offline = [];

		if (members) {
			members.forEach(member => {
				switch (member.online) {
					case true:
						if (member.status === "Hide")
							offline.push(
								<MemberItem
									member={member}
									key={member.email}
									owner={owner}
								/>
							);
						else
							online.push(
								<MemberItem
									member={member}
									key={member.email}
									owner={owner}
								/>
							);
						break;

					default:
						offline.push(
							<MemberItem
								member={member}
								key={member.email}
								owner={owner}
							/>
						);
				}
			});
		}

		return (
			<div className="member-list">
				<div style={{ padding: 24 }}>
					<p>Online</p>
					{online}

					<br />
					<p>Offline</p>
					{offline}
				</div>
			</div>
		);
	}
}

export default MemberList;
