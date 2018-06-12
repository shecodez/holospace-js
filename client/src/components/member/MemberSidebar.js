import React from "react";
import { Icon } from "semantic-ui-react";
// import { members } from "../../utils/mock";

import MemberList from "./MemberList";
import UserHeader from "../user/UserHeader";

class MemberSidebar extends React.Component {
	toggle = () => {
		this.props.toggle();
	};

	render() {
		const { header, users, current, owner } = this.props;

		return (
			<div className="col c4t member-sidebar">
				<div className="header">
					<Icon
						className="trigger"
						name="outdent"
						onClick={this.toggle}
						flipped={
							this.props.collapsed ? undefined : "horizontally"
						}
					/>
					<span className="no-display">{header}</span>
				</div>

				<MemberList members={users} owner={owner} />

				<UserHeader user={current} />
			</div>
		);
	}
}

export default MemberSidebar;
