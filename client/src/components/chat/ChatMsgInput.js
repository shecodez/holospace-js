import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { createMessage } from "./../../actions/messages";

// components
import MessageForm from "../forms/MessageForm";
import IsTypingList from "../chat2/IsTypingList";

class ChatMsgInput extends React.Component {
	state = {
		typing: []
	};

	componentDidMount() {
		const { socket } = this.props;

		if (socket) {
			socket.on("user:typing", this.renderWhoTyping);
			socket.on("stop:typing", this.updateWhoTyping);
		}
	}

	submit = data => {
		const { socket } = this.props;
		this.props.createMessage(this.addChannelIdToMessage(data), socket);
	};

	addChannelIdToMessage = data => {
		const message = {
			body: data.body,
			channel_id: this.props.match.params.channelId
		};
		return message;
	};

	sendTyping = typing => {
		const { user, socket } = this.props;

		if (typing) {
			socket.emit("user:typing", {
				channel: this.props.match.params.channelId,
				userTag: `${user.username}#${user.pin}`
			});
		}

		if (!typing) {
			socket.emit("stop:typing", {
				channel: this.props.match.params.channelId,
				userTag: `${user.username}#${user.pin}`
			});
		}
	};

	renderWhoTyping = data => {
		const typers = this.state.typing;

		if (!typers.some(typer => typer === data.userTag)) {
			// const username = data.userTag.slice(0, -5);
			this.setState({ typing: [...typers, data.userTag] });
		}
		// console.log(`render typing: ${this.state.typing}`);
	};

	updateWhoTyping = data => {
		const typers = this.state.typing;

		const i = typers.indexOf(data.userTag);
		if (i >= 0) {
			typers.splice(i, 1);
			this.setState({ typing: typers });
		}
		// console.log(`update typing: ${this.state.typing}`);
	};

	render() {
		const { channel } = this.props;

		return (
			<div className="chat-msg-input">
				{channel && (
					<MessageForm
						submit={this.submit}
						sendTyping={this.sendTyping}
						channelId={channel._id}
						message_label={
							channel.direct
								? `Direct Message ${
										channel.type === "Text" ? "# " : ""
									}${channel.name}`
								: `Message ${
										channel.type === "Text" ? "# " : ""
									}${channel.name}`
						}
					/>
				)}
				{this.state.typing.length === 0 ? null : (
					<IsTypingList typers={this.state.typing} />
				)}
			</div>
		);
	}
}

ChatMsgInput.defaultProps = {
	channel: null,
	socket: null
};

ChatMsgInput.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			channelId: PropTypes.string
		})
	}).isRequired,
	createMessage: PropTypes.func.isRequired,
	channel: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired
	}),
	socket: PropTypes.shape({}),
	user: PropTypes.shape({
		username: PropTypes.string.isRequired,
		pin: PropTypes.number.isRequired
	}).isRequired
};

function mapStateToProps(state, props) {
	return {
		channel: state.channels.find(
			channel => channel._id === props.match.params.channelId
		),
		user: state.user
	};
}

export default withRouter(
	connect(mapStateToProps, { createMessage })(ChatMsgInput)
);
