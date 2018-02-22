import React from 'react';
import PropTypes from 'prop-types';
import { Comment, Icon, Modal, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { updateMessage } from './../../actions/messages';

// components
import MessageForm from '../forms/MessageForm';

class ChatMessage extends React.Component {
	state = {
		isOpen: false,
		msgBlock: null
	};

	submit = data => {
		const { socket } = this.props;
		this.props.updateMessage(data, socket).then(() => this.toggleModal());
	};

	sendTyping = typing => {
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

	toggleModal = (msgBlock) => {
		this.setState({ msgBlock }, () => {
			this.setState({
				isOpen: !this.state.isOpen
			})
		});
	};

	render() {
		const { isOpen } = this.state;
		const { message, user, prevDate } = this.props;

		let msgAuthor = false;
		if (
			user.username === message.author_id.username &&
			user.pin === message.author_id.pin
		) {
			msgAuthor = true;
		}

		return (
			<div>
				{moment(prevDate).calendar() !==
					moment(message.createdAt).calendar() && (
					<Divider horizontal inverted>
						{moment(message.createdAt).calendar()}
					</Divider>
				)}
				<Comment>
					{<Comment.Avatar src={message.author_id.avatar} />}
					<Comment.Content>
						<Comment.Author as="a">{message.author_id.username}</Comment.Author>
						<Comment.Metadata>
							<div>{moment(message.createdAt).calendar()}</div>
						</Comment.Metadata>
						<div className='msg-blocks'>
						{message.blocks.map(block => (

							<Comment.Text key={block._id} className='msg-block'>
								{block.body}{' '}
								{block.createdAt !== block.updatedAt && (
									<i className="edited">
										<FormattedMessage
											id="chat.ChatMessage.edited"
											defaultMessage="edited"
										/>
									</i>
								)}
								{ msgAuthor && <Icon className='actions' inverted fitted name="setting" onClick={ () => this.toggleModal(block)} />}
							</Comment.Text>
						))}
						</div>
					</Comment.Content>
				</Comment>
				{false && (
					<Divider horizontal inverted>
						New Message
					</Divider>
				)}

				<Modal size={'small'} open={isOpen} onClose={this.toggleModal} basic>
					<Modal.Content>
						<MessageForm
							message={this.state.msgBlock}
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
			</div>
		);
	}
}

ChatMessage.defaultProps = {
	channelId: ''
};

ChatMessage.propTypes = {
	message: PropTypes.shape({
		author_id: PropTypes.shape({
			avatar: PropTypes.string.isRequired,
			username: PropTypes.string.isRequired
		}).isRequired,
		blocks: PropTypes.arrayOf(PropTypes.shape({
			body: PropTypes.string.isRequired
		})).isRequired,
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
	channelId: PropTypes.string,
	prevDate: PropTypes.string.isRequired
};

function mapStateToProps(state) {
	return {
		user: state.user
	};
}

export default connect(mapStateToProps, { updateMessage })(ChatMessage);
