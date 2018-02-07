import React from 'react';
import PropTypes from 'prop-types';
import { Comment, Icon, Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { updateMessage } from './../../actions/messages';

// components
import MessageForm from '../forms/MessageForm';

class ChatMessage extends React.Component {
	state = {
		isOpen: false
	};

	submit = data => {
		const { socket } = this.props;
		this.props.updateMessage(data, socket).then(() => this.toggleModal());
	};

	sendTyping = (typing) => {
		const { user, socket } = this.props;

		if (typing) {
			socket.emit('user:typing', {
	      channel: this.props.channelId,
	      userTag: `${user.username}#${user.pin}`
	    });
		}

		if (!typing) {
			socket.emit('stop:typing', {
	      channel: this.props.channelId,
	      userTag: `${user.username}#${user.pin}`
	    });
		}
	};

	toggleModal = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	render() {
		const { isOpen } = this.state;
		const { message, user } = this.props;

		return (
			<Comment>
				<Comment.Avatar src={message.author_id.avatar} />
				<Comment.Content>
					<Comment.Author as="a">{message.author_id.username}</Comment.Author>
					<Comment.Metadata>
						<div>{moment(message.createdAt).calendar()}</div>
					</Comment.Metadata>
					<Comment.Text>
						{message.body}{' '}
						{message.createdAt !== message.updatedAt && (
							<i className="edited">
								<FormattedMessage
									id="chat.ChatMessage.edited"
									defaultMessage="edited"
								/>
							</i>
						)}
					</Comment.Text>

					{user.username === message.author_id.username &&
						user.pin === message.author_id.pin && (
							<Comment.Actions>
								<Comment.Action onClick={this.toggleModal}>
									<Icon inverted fitted name="setting" />
								</Comment.Action>
							</Comment.Actions>
						)}
				</Comment.Content>

				<Modal size={'small'} open={isOpen} onClose={this.toggleModal} basic>
					<Modal.Content>
						<MessageForm
							message={message}
							sendTyping={this.sendTyping}
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
			</Comment>
		);
	}
}

ChatMessage.defaultProps = {
	channelId: ''
}

ChatMessage.propTypes = {
	message: PropTypes.shape({
		author_id: PropTypes.shape({
			avatar: PropTypes.string.isRequired,
			username: PropTypes.string.isRequired
		}).isRequired,
		body: PropTypes.string.isRequired,
		createdAt: PropTypes.string.isRequired
	}).isRequired,
	user: PropTypes.shape({
		username: PropTypes.string.isRequired,
		pin: PropTypes.number.isRequired
	}).isRequired,
	updateMessage: PropTypes.func.isRequired,
	socket: PropTypes.shape({
		on: PropTypes.func
	}).isRequired,
	channelId: PropTypes.string
};

function mapStateToProps(state) {
	return {
		user: state.user
	};
}

export default connect(mapStateToProps, { updateMessage })(ChatMessage);
