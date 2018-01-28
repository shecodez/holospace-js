import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { createMessage } from './../../actions/messages';

// components
import MessageForm from '../forms/MessageForm';

class ChatMsgInput extends React.Component {
	submit = data => {
		// console.log(this.addChannelIdToMessage(data));
		this.props.createMessage(this.addChannelIdToMessage(data));
	};

	addChannelIdToMessage = data => {
		const message = {
			body: data.body,
			channel_id: this.props.match.params.channelId
		};
		return message;
	};

	render() {
		const { channel } = this.props;
		
		return (
			<div className="chat-msg-input">
				{channel && (
					<MessageForm
						submit={this.submit}
						message_label={
							channel.direct
								? `Direct Message ${channel.type === 'Text' ? '# ' : ''}${
										channel.name
									}`
								: `Message ${channel.type === 'Text' ? '# ' : ''}${
										channel.name
									}`
						}
					/>
				)}
			</div>
		);
	}
}

ChatMsgInput.defaultProps = {
	channel: null
};

ChatMsgInput.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			channelId: PropTypes.string
		})
	}).isRequired,
	createMessage: PropTypes.func.isRequired,
	channel: PropTypes.shape({
		name: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired
	})
	// socket: PropTypes.shape({}).isRequired
};

function mapStateToProps(state, props) {
	return {
		channel: state.channels.find(
			channel => channel._id === props.match.params.channelId
		)
	};
}

export default withRouter(
	connect(mapStateToProps, { createMessage })(ChatMsgInput)
);
