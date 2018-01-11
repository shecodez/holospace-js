import React from 'react';
import PropTypes from 'prop-types';

const Nested = props =>
	<div className={`nested ${props.className}`}>{props.children}</div>;

Nested.defaultProps = {
	className: ""
}

Nested.propTypes = {
  children: PropTypes.node.isRequired,
	className: PropTypes.string
}

export default Nested;
