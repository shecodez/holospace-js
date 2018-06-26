import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import { List, Divider, Icon, Modal } from "semantic-ui-react";
import { updateMessage } from "./../../actions/messages";

import Avatar from "../layouts/Avatar";
import MessageForm from "../forms/MessageForm";

class ChatMessage extends React.Component {
	state = {
		open: false,
		msgBlock: null
	};

	toggleModal = msgBlock => {
		this.setState({ msgBlock }, () => {
			this.setState({
				open: !this.state.open
			});
		});
	};

	submit = data => {
		this.props
			.updateMessage(data, this.props.socket)
			.then(() => this.toggleModal());
	};

	render() {
		const { open } = this.state;
		const { message, user, prevDate } = this.props;

		let canEdit = false;
		if (
			user.username === message.author_id.username &&
			user.pin === message.author_id.pin
		) {
			canEdit = true;
		}

		return (
			<div className="chat-message">
				{moment(prevDate).calendar() !==
					moment(message.createdAt).calendar() && (
					<Divider horizontal inverted>
						{moment(message.createdAt).calendar()}
					</Divider>
				)}

				<List.Item>
					<Avatar
						icon={message.author_id.icon}
						name={message.author_id.username}
					/>

					<List.Content>
						<List.Header as="a">
							{message.author_id.username}
						</List.Header>
						<small className="date">
							{moment(message.createdAt).calendar()}
						</small>

						<List.Description className="message-blocks">
							{message.blocks.map(block => (
								<div key={block._id} className="block">
									{block.body}
									{block.createdAt !== block.updatedAt && (
										<small className="edited">
											<FormattedMessage
												id="chat.ChatMessage.edited"
												defaultMessage="edited"
											/>
										</small>
									)}
									{canEdit && (
										<Icon
											className="actions"
											name="setting"
											onClick={() =>
												this.toggleModal(block)
											}
										/>
									)}
								</div>
							))}
						</List.Description>
					</List.Content>
				</List.Item>

				<Modal
					size={"small"}
					open={open}
					onClose={this.toggleModal}
					basic
				>
					<Modal.Content>
						<MessageForm
							message={this.state.msgBlock}
							submit={this.submit}
							message_label={
								<FormattedMessage
									id="chat.ChatMessage.editMessage"
									defaultMessage="Edit Message"
								/>
							}
						/>
					</Modal.Content>
				</Modal>
			</div>
		);
	}
}

// ChatMessage.defaultProps = {};

ChatMessage.propTypes = {
	prevDate: PropTypes.string.isRequired,
	message: PropTypes.shape({
		author_id: PropTypes.shape({
			icon: PropTypes.string,
			username: PropTypes.string.isRequired
		}).isRequired,
		blocks: PropTypes.arrayOf(
			PropTypes.shape({
				body: PropTypes.string.isRequired
			})
		).isRequired,
		createdAt: PropTypes.string.isRequired
	}).isRequired,
	user: PropTypes.shape({
		username: PropTypes.string.isRequired,
		pin: PropTypes.number.isRequired
	}).isRequired,
	socket: PropTypes.shape({}).isRequired,
	updateMessage: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return {
		user: state.user,
		socket: state.socket
	};
}

export default connect(mapStateToProps, { updateMessage })(ChatMessage);
