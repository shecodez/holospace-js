import React from 'react';
import PropTypes from 'prop-types';

const Grid = props =>
	<div className={`grid ${props.className}`}>{props.children}</div>;

Grid.defaultProps = {
	className: ""
}

Grid.propTypes = {
  children: PropTypes.node.isRequired,
	className: PropTypes.string
}

export default Grid;
