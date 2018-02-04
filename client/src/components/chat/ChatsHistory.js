import React from 'react';
import PropTypes from 'prop-types';
import { Comment, Header, Dimmer, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { fetchChannelMessages } from './../../actions/messages';

// components
import ChatMessage from './ChatMessage';
import FlexImgBG from './../layouts/FlexImgBG';

// TODO: make message blocks

class ChatsHistory extends React.Component {
	state = {
		channelId: this.props.match.params.channelId,
		loading: false
	};

	componentDidMount() {
		this.fetchChatsHistory(this.state.channelId);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.channelId !== this.state.channelId)
			this.fetchChatsHistory(nextProps.match.params.channelId);

		this.setState({ channelId: nextProps.match.params.channelId });

		// Smart scrolling - when the user scrolls up we don't want auto scroll to bottom
		/* const container = this.messageContainer;
    if (container.scrollHeight - (container.scrollTop + container.offsetHeight) >= 50) {
      this.scrolled = true;
    } else {
      this.scrolled = false;
    } */
	}

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

	render() {
		const { messages, channel } = this.props;

		const history = messages.map(message => (
			<ChatMessage key={message._id} message={message} />
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
					<div style={{ width: '100%' }}>
						{messages.length === 0 ? (
							<p>No messages</p>
						) : (
							<Comment.Group size="large">
								<Header as="h3" inverted dividing>
									{`Welcome to the genesis of the '${channel.name}' channel`}
								</Header>
								{history}
							</Comment.Group>
						)}{' '}
					</div>
				)}
			</div>
		);
	}
}

ChatsHistory.defaultProps = {
	channel: { name: '' }
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
	connect(mapStateToProps, { fetchChannelMessages })(ChatsHistory)
);
