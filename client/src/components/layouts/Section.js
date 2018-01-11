import React from 'react';
import PropTypes from 'prop-types';

const Section = props =>
	<div className={`section ${props.className}`}>{props.children}</div>;

Section.defaultProps = {
	className: ""
}

Section.propTypes = {
  children: PropTypes.node.isRequired,
	className: PropTypes.string
}

export default Section;
