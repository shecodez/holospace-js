import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Header, Icon, Modal } from "semantic-ui-react";
import { createMembership } from "./../../actions/memberships";

// components
import MembershipForm from "./../forms/MembershipForm";

class JoinServer extends React.Component {
	state = {
		isOpen: true
	};

	submit = data => {
		const inviteURL = data.invite.split("/");
		const invitation = inviteURL[inviteURL.length - 1];
		return this.props.createMembership(invitation).then(membership => {
			this.toggleModal();
			const server = membership.server_id;
			this.props.history.push(
				`/channels/${server._id}/${server.default_id}`
			);
		});
	};

	toggleModal = () => {
		this.setState(
			{
				isOpen: !this.state.isOpen
			},
			() => this.props.toggleJoin(this.state.isOpen)
		);
	};

	render() {
		const { isOpen } = this.state;

		return (
			<Modal size={"tiny"} open={isOpen} onClose={this.toggleModal}>
				<Modal.Content style={{ textAlign: "center" }}>
					<Header as="h2" icon textAlign="center">
						<Icon name="add user" circular />
						Join a Server
						<Header.Subheader>
							Enter an invite link below to become a member of an
							existing server.
						</Header.Subheader>
					</Header>
					<MembershipForm
						submit={this.submit}
						back={this.toggleModal}
					/>
				</Modal.Content>
			</Modal>
		);
	}
}

JoinServer.propTypes = {
	history: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired,
	createMembership: PropTypes.func.isRequired,
	toggleJoin: PropTypes.func.isRequired
};

export default withRouter(connect(null, { createMembership })(JoinServer));
