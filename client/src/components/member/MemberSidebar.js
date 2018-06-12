import React from "react";
import { Icon } from "semantic-ui-react";
// import { members } from "../../utils/mock";

import MemberList from "./MemberList";
import UserHeader from "../user/UserHeader";

class MemberSidebar extends React.Component {
	state = {
		collapsed: this.props.collapsed || false
	};

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed
		});
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
							this.state.collapsed ? undefined : "horizontally"
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
