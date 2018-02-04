import React from 'react';
import PropTypes from 'prop-types';

const IsTypingList = ({ typers }) => (
	<span className="is-typing-list">{`${typers.map(
		typer => `${typer} `
	)}is typing...`}</span>
);

IsTypingList.propTypes = {
	typers: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
};

export default IsTypingList;
