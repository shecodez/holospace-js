import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Comment, Header, Dimmer, Loader, Divider } from "semantic-ui-react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { FormattedMessage } from "react-intl";
import {
	fetchChannelMessages,
	updateChatHistory
} from "./../../actions/messages";

// components
import ChatMessage from "./ChatMessage";
import FlexImgBG from "./../layouts/FlexImgBG";

// TODO: make message blocks

class ChatsHistory extends React.Component {
	state = {
		history: [],
		channelId: this.props.match.params.channelId,
		loading: false
	};

	componentDidMount() {
		this.fetchChatsHistory(this.state.channelId);

		const { socket } = this.props;
		if (socket) {
			socket.on("message:recv", this.addMessage);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.channelId !== this.state.channelId)
			this.fetchChatsHistory(nextProps.match.params.channelId);

		this.setState({ channelId: nextProps.match.params.channelId });
	}

	addMessage = message => {
		this.props.updateChatHistory(message);

		// Smart scrolling - when the user scrolls up we don't want auto scroll to bottom
		const container = this.messageContainer;
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

	componentDidUpdate() {
		if (this.scrolled) {
			return;
		}
		// There is a new message in the state, scroll to bottom of list
		const container = this.messageContainer;
		container.scrollTop = container.scrollHeight;
	}

	fetchChatsHistory = channelId => {
		if (channelId) {
			this.setState({ loading: true });
			this.props
				.fetchChannelMessages(channelId)
				.then(() => this.setState({ loading: false }));
		}
	};

	createMessageBlocks = messages => {
		const msgBlocks = [];

		for (let i = 0; i < messages.length; i += 1) {
			const prevMsg = messages[i - 1];
			const message = messages[i];

			// first message
			if (i === 0) {
				const msg = {
					_id: message._id,
					author_id: message.author_id,
					createdAt: message.createdAt,
					blocks: []
				};
				msg.blocks.push(message);
				msgBlocks.push(msg);
			}

			// if the message date is NOT equal to prev prev messsage date
			if (
				i !== 0 &&
				moment(prevMsg.createdAt).calendar() !==
					moment(message.createdAt).calendar()
			) {
				const msg = {
					_id: message._id,
					author_id: message.author_id,
					createdAt: message.createdAt,
					blocks: []
				};
				msg.blocks.push(message);
				msgBlocks.push(msg);
				continue;
			}

			// not first and message author IS prev message author
			if (
				i !== 0 &&
				prevMsg.author_id.username === message.author_id.username
			) {
				const current = msgBlocks.length;
				msgBlocks[current - 1].blocks.push(message);
			}

			// not first and message author is NOT prev message author
			if (
				i !== 0 &&
				prevMsg.author_id.username !== message.author_id.username
			) {
				const msg = {
					_id: message._id,
					author_id: message.author_id,
					createdAt: message.createdAt,
					blocks: []
				};
				msg.blocks.push(message);
				msgBlocks.push(msg);
			}
		}
		return msgBlocks;
	};

	render() {
		const { messages, channel, socket } = this.props;

		const history = this.createMessageBlocks(messages).map((message, i) => (
			<ChatMessage
				key={message._id}
				message={message}
				socket={socket}
				prevDate={
					i === 0 ? message.createdAt : messages[i - 1].createdAt
				}
			/>
		));

		return (
			<div
				className="chats-history"
				ref={element => {
					this.messageContainer = element;
				}}
			>
				<Dimmer active={this.state.loading}>
					<Loader content="Loading" />
				</Dimmer>

				{!this.props.match.params.channelId ? (
					<FlexImgBG />
				) : (
					<div style={{ width: "100%" }}>
						{messages.length === 0 ? (
							<p>
								<FormattedMessage
									id="chat.ChatsHistory.noMessages"
									defaultMessage="No messages"
								/>
							</p>
						) : (
							<Comment.Group size="large">
								<Header as="h3" inverted>
									{`Welcome to the genesis of the '${
										channel.name
									}' channel`}
								</Header>
								<Divider horizontal inverted>
									{moment(messages[0].createdAt).calendar()}
								</Divider>
								{history}
							</Comment.Group>
						)}{" "}
					</div>
				)}
			</div>
		);
	}
}

ChatsHistory.defaultProps = {
	channel: { name: "" },
	socket: null
};

ChatsHistory.propTypes = {
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
	fetchChannelMessages: PropTypes.func.isRequired,
	channel: PropTypes.shape({
		name: PropTypes.string.isRequired
	}),
	socket: PropTypes.shape({
		on: PropTypes.func
	}),
	updateChatHistory: PropTypes.func.isRequired
};

function mapStateToProps(state, props) {
	return {
		channel: state.channels.find(
			channel => channel._id === props.match.params.channelId
		),
		messages: state.messages
	};
}

export default withRouter(
	connect(mapStateToProps, { fetchChannelMessages, updateChatHistory })(
		ChatsHistory
	)
);
