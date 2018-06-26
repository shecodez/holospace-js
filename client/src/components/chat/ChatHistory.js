import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import { List, Header, Divider } from "semantic-ui-react";
import { createMessageBlocks } from "../../utils/createMessageBlocks";
import { updateChatHistory } from "./../../actions/messages";
// import { messages } from "../../utils/mock";

import ChatMessage from "./ChatMessage";
import ImageBG from "../layouts/ImageBG";

class ChatHistory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		this.props.socket.on("message:recv", this.addMessage);
	}

	componentDidUpdate() {
		if (this.scrolled) return;

		const container = this.messageList;
		container.scrollTop = container.scrollHeight;
	}

	addMessage = message => {
		this.props.updateChatHistory(message);

		// Smart scrolling - when the user scrolls up we don't want auto scroll to bottom
		const container = this.messageList;
		if (
			container.scrollHeight -
				(container.scrollTop + container.offsetHeight) >=
			50
		) {
			this.scrolled = true;
		} else {
			this.scrolled = false;
		}
	};

	render() {
		const { messages, channel } = this.props;

		const history = createMessageBlocks(messages).map((msg, i) => (
			<ChatMessage
				key={msg._id}
				message={msg}
				prevDate={i === 0 ? msg.createdAt : messages[i - 1].createdAt}
			/>
		));

		const t = msg => (
			<FormattedMessage
				id={`chat.ChatHistory.${msg.toLowerCase()}`}
				defaultMessage={msg}
			/>
		);

		return (
			<div
				className="chat-history"
				ref={element => {
					this.messageList = element;
				}}
			>
				{this.props.match.params.channelId ? (
					<div>
						{messages.length === 0 ? (
							<FormattedMessage
								id="chat.ChatHistory.noMessages"
								defaultMessage="No messages"
							/>
						) : (
							<List>
								<Header inverted>
									{t("Welcome")} {channel.name}!
								</Header>
								<Divider horizontal inverted>
									{moment(messages[0].createdAt).calendar()}
								</Divider>
								{history}
							</List>
						)}
					</div>
				) : (
					<ImageBG />
				)}
			</div>
		);
	}
}

ChatHistory.defaultProps = {
	channel: { name: "" }
};

ChatHistory.propTypes = {
	messages: PropTypes.arrayOf(
		PropTypes.shape({
			message: PropTypes.object
		})
	).isRequired,
	match: PropTypes.shape({
		params: PropTypes.shape({
			channelId: PropTypes.string
		})
	}).isRequired,
	channel: PropTypes.shape({
		name: PropTypes.string.isRequired
	}),
	socket: PropTypes.shape({
		on: PropTypes.func
	}).isRequired,
	updateChatHistory: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return {
		socket: state.socket
	};
}

export default withRouter(
	connect(mapStateToProps, { updateChatHistory })(ChatHistory)
);
