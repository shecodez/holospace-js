import React from 'react';
import PropTypes from 'prop-types';

const FlexSection = props =>
	<div className={`stretch section ${props.className}`}>{props.children}</div>;

FlexSection.defaultProps = {
	className: ""
}

FlexSection.propTypes = {
  children: PropTypes.node.isRequired,
	className: PropTypes.string
}

export default FlexSection;
