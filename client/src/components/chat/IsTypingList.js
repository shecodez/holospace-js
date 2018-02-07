import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const listTypers = typers => {
	const usernames = typers.map(typer => typer);

	const text = usernames.join(', ').slice(0, 37);
	return usernames.join(', ').length < 38 ? `${text}\u00A0` : `${text}...+\u00A0`;
};

const IsTypingList = ({ typers }) => (
 	<span className="is-typing-list">
		{listTypers(typers)}
		<FormattedMessage
			id="chat.IsTypingList.isTyping..."
			defaultMessage="is typing..."
		/>
	</span>
);

IsTypingList.propTypes = {
	typers: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
};

export default IsTypingList;
