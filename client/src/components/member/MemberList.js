import React from "react";
import { FormattedMessage } from "react-intl";

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
					{online.length > 0 && (
						<div className="online">
							<p>
								<FormattedMessage
									id="member.MemberList.online"
									defaultMessage="Online"
								/>
							</p>
							{online}
						</div>
					)}

					<br />
					{offline.length > 0 && (
						<div className="offline">
							<p>
								<FormattedMessage
									id="member.MemberList.offline"
									defaultMessage="Offline"
								/>
							</p>
							{offline}
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default MemberList;
