import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { Header, Icon, Modal, Input } from "semantic-ui-react";
import api from "./../../api/api";

class ServerInvitation extends React.Component {
	state = {
		isOpen: this.props.open,
		copied: false,
		invite: ""
	};

	componentDidMount() {
		this.setServerInvitation();
	}

	setServerInvitation = () => {
		const { serverId } = this.props;

		api.server.invite(serverId).then(invitation => {
			this.setState({ invite: invitation });
		});
	};

	copyToClipboard = () => {
		const copyText = document.getElementById("invite");
		copyText.select();
		document.execCommand("Copy");
		this.setState({ copied: true });
		setTimeout(() => this.setState({ copied: false }), 1000);
		// TODO: Add toast 'Copied!'
	};

	render() {
		const { isOpen, copied, invite } = this.state;
		const { serverName, toggle } = this.props;

		const t = msg => (
			<FormattedMessage
				id={`server.ServerInvitation.${msg.toLowerCase()}`}
				defaultMessage={msg}
			/>
		);

		const t2 = (id, msg) => (
			<FormattedMessage
				id={`server.ServerInvitation.${id
					.charAt(0)
					.toLowerCase()}${id.slice(1)}`}
				defaultMessage={msg}
			/>
		);

		return (
			<Modal size={"tiny"} open={isOpen} onClose={toggle}>
				<Modal.Content style={{ textAlign: "center" }}>
					<Header as="h2" icon textAlign="center">
						<Icon name="users" circular />
						{serverName} {t("Invitation")}
						<Header.Subheader>
							{t2(
								"InviteSubheader",
								"Share the link below with others to give them access to this server."
							)}
						</Header.Subheader>
					</Header>
					<Input
						id="invite"
						action={{
							color: copied ? "teal" : "violet",
							labelPosition: "right",
							icon: copied ? "check circle outline" : "copy",
							content: copied ? t("Done") : t("Copy"),
							onClick: this.copyToClipboard
						}}
						value={invite}
					/>
				</Modal.Content>
			</Modal>
		);
	}
}

ServerInvitation.propTypes = {
	serverName: PropTypes.string.isRequired,
	serverId: PropTypes.string.isRequired
};

export default ServerInvitation;
