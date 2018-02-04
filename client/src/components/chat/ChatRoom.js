import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from "react-redux";

// components
import ChatsHistory from './ChatsHistory';
import ChatMsgInput from './ChatMsgInput';

class ChatRoom extends React.Component {
	state: {};

	render() {
		const { socket, direct } = this.props;

		return (
			<div className="chat-room">
				<ChatsHistory direct={direct} />
				<ChatMsgInput socket={socket} />
			</div>
		);
	}
}
ChatRoom.defaultProps = {
  direct: false
};

ChatRoom.propTypes = {
  direct: PropTypes.bool,
	socket: PropTypes.shape({}).isRequired
};

export default ChatRoom;
