import React from 'react';
import PropTypes from 'prop-types';

const Pane = ({ children }) => <div className="pane">{children}</div>;

Pane.propTypes = {
	children: PropTypes.node.isRequired
};

export default Pane;
