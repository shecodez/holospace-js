import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createMessage } from "./../../actions/messages";

import MessageForm from "../forms/MessageForm";
import IsTypingList from "./IsTypingList";

class ChatInput extends React.Component {
	state = {
		typingList: []
	};

	/* componentDidMount() {
		const { socket } = this.props;

		if (socket) {
			socket.on('user:typing', this.renderWhosTyping);
			socket.on('stop:typing', this.updateWhosTyping);
		}
	} */

	submit = data => {
		// const { socket } = this.props;
		this.props.createMessage(this.addChannelIdToMessage(data) /*, socket*/);
	};

	addChannelIdToMessage = data => {
		const message = {
			body: data.body,
			channel_id: this.props.channel._id
		};
		return message;
	};

	/* 
	sendTyping = (typing) => {
		const { user, socket, channel } = this.props;

		if (typing) {
			socket.emit('user:typing', {
	      channel: channel._id,
	      holoTag: `${user.username}#${user.pin}`
	    });
		}

		if (!typing) {
			socket.emit('stop:typing', {
	      channel: channel._id,
	      holoTag: `${user.username}#${user.pin}`
	    });
		}
	};
	*/
	renderWhosTyping = data => {
		const typers = this.state.typingList;

		if (!typers.some(typer => typer === data.holoTag)) {
			// const username = data.holoTag.slice(0, -5);
			this.setState({ typingList: [...typers, data.holoTag] });
		}
		// console.log(`render typing: ${this.state.typingList}`);
	};

	updateWhosTyping = data => {
		const typers = this.state.typingList;

		const i = typers.indexOf(data.holoTag);
		if (i >= 0) {
			typers.splice(i, 1);
			this.setState({ typingList: typers });
		}
		// console.log(`update typing: ${this.state.typingList}`);
	};

	render() {
		const { channel } = this.props;
		const { typingList } = this.state;

		return (
			<div className="chat-input">
				<MessageForm
					submit={this.submit}
					sendTyping={this.sendTyping}
					channelId={channel._id}
					placeholder={
						channel.direct
							? `Direct Message ${
									channel.type === "Text" ? "# " : ""
								}${channel.name}`
							: `Message ${channel.type === "Text" ? "# " : ""}${
									channel.name
								}`
					}
				/>
				{typingList.length === 0 ? null : (
					<IsTypingList typers={typingList} />
				)}
			</div>
		);
	}
}

ChatInput.propTypes = {
	createMessage: PropTypes.func.isRequired,
	channel: PropTypes.shape({
		_id: PropTypes.string,
		name: PropTypes.string,
		type: PropTypes.string
	}).isRequired,
	/*socket: PropTypes.shape({
		on: PropTypes.func,
		emit: PropTypes.func
	}).isRequired,*/
	user: PropTypes.shape({
		username: PropTypes.string.isRequired,
		pin: PropTypes.number.isRequired
	}).isRequired
};

function mapStateToProps(state) {
	return {
		user: state.user
		// socket: state.socket
	};
}

export default connect(mapStateToProps, { createMessage })(ChatInput);
