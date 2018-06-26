import React from "react";
import { FormattedMessage } from "react-intl";
import { Icon } from "semantic-ui-react";
// import { members } from "../../utils/mock";

import MemberList from "./MemberList";
import UserHeader from "../user/UserHeader";

class MemberSidebar extends React.Component {
	toggle = () => {
		this.props.toggle();
	};

	// TODO: make VoIP Header slide left when hovered over if menu is collapsed.
	render() {
		const { header, users, current, owner, collapsed } = this.props;

		const t = msg => (
			<FormattedMessage
				id={`member.MemberSidebar.${msg.toLowerCase()}`}
				defaultMessage={msg}
			/>
		);

		return (
			<div className="col c4t member-sidebar">
				<div className="header">
					<Icon
						className="trigger"
						name="outdent"
						onClick={this.toggle}
						flipped={collapsed ? undefined : "horizontally"}
					/>
					<span className="no-display">{t(header)}</span>
				</div>

				<MemberList members={users} owner={owner} />

				<UserHeader user={current} collapsed={collapsed} />
			</div>
		);
	}
}

export default MemberSidebar;
