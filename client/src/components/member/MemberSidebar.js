import React from "react";
import { Icon } from "semantic-ui-react";
// import { members } from "../../utils/mock";

import MemberList from "./MemberList";
import UserHeader from "../user/UserHeader";
import VoipHeader from "../voip/VoipHeader";

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
		const { header, users, current, owner, channel } = this.props;

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

				{false && <VoipHeader channel={channel} />}

				<UserHeader user={current} />
			</div>
		);
	}
}

export default MemberSidebar;
