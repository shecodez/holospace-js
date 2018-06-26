import React from "react";
import { FormattedMessage } from "react-intl";
import { Icon, Popup, Modal } from "semantic-ui-react";

import Avatar from "../layouts/Avatar";
import OnlineStatus from "./OnlineStatus";
import UserSettings from "./UserSettings";
import UserOptions from "../options/UserOptions";

// TODO: when memberSidebar is collapsed
// add menu and settings to onlineOptions
class UserHeader extends React.Component {
	state = {
		open: false
	};

	toggleModal = () => {
		this.setState({
			open: !this.state.open
		});
	};

	openMenu = () => {
		console.log("OpenMenu!");
	};

	render() {
		const { open } = this.state;
		const { user, collapsed } = this.props;

		return (
			<div className="c4b user-header">
				<Popup
					on="click"
					style={{ padding: 0 }}
					trigger={
						<div className="user">
							<Avatar icon={user.icon} name={user.username} />
							<span
								className={`status online--${user.online} ${
									user.status
								}`}
							/>
						</div>
					}
					content={
						<OnlineStatus
							collapsed={collapsed}
							openSettings={this.toggleModal}
						/>
					}
				/>

				<span className="no-display text">
					{user.username}
					<span className="pin">{`#${user.pin}`}</span>
				</span>

				<span className="no-display menu">
					<Popup
						on="click"
						inverted
						position="top center"
						content={<UserOptions />}
						trigger={
							<Icon name="chevron up" onClick={this.openMenu} />
						}
					/>
					<Popup
						content="User Settings"
						inverted
						trigger={
							<Icon name="setting" onClick={this.toggleModal} />
						}
					/>
				</span>

				<Modal open={open} onClose={this.toggleModal} basic closeIcon>
					<Modal.Header>
						<FormattedMessage
							id="user.UserHeader.userSettings"
							defaultMessage="User Settings"
						/>
					</Modal.Header>
					<Modal.Content>
						<UserSettings />
					</Modal.Content>
				</Modal>
			</div>
		);
	}
}

export default UserHeader;
