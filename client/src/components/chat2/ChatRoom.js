import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Dimmer, Loader } from "semantic-ui-react";
import { fetchChannelMessages } from "./../../actions/messages";
// import { messages } from "../../utils/mock";

import ChatHistory from "./ChatHistory";
import ChatInut from "./ChatInput";

class ChatRoom extends React.Component {
	state = {
		loading: false,
		channelId: this.props.match.params.channelId
	};

	componentDidMount() {
		this.fetchChatHistory(this.state.channelId);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.channelId !== this.state.channelId)
			this.fetchChatHistory(nextProps.match.params.channelId);

		this.setState({ channelId: nextProps.match.params.channelId });
	}

	fetchChatHistory = channelId => {
		if (channelId) {
			this.setState({ loading: true });
			this.props
				.fetchChannelMessages(channelId)
				.then(() => this.setState({ loading: false }));
		}
	};

	render() {
		const { messages, channel } = this.props;

		return (
			<div className="c3m chat-room">
				<Dimmer active={this.state.loading}>
					<Loader content="Loading..." />
				</Dimmer>

				<ChatHistory messages={messages} channel={channel} />
				{channel && <ChatInut channel={channel} />}
			</div>
		);
	}
}

ChatRoom.defaultProps = {
	channel: { name: "" }
};

ChatRoom.propTypes = {
	fetchChannelMessages: PropTypes.func.isRequired,
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
	})
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
	connect(mapStateToProps, { fetchChannelMessages })(ChatRoom)
);
