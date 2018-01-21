import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const TopNavigation = ({ isUser }) => (
	<Menu secondary className="top-nav">
		<Menu.Item as={Link} to="/">
			<div className="menu-btn icon">
				<div className="line line-outer" />
				<div className="line line-center" />
				<div className="line line-outer" />
			</div>
			<span className="menu-span text">menu</span>
		</Menu.Item>

		<Menu.Menu position="right">
			<Menu.Item>
				<div className="search-btn icon">
					<div className="circle" />
					<div className="handle" />
				</div>
			</Menu.Item>
			<Menu.Item>
				<span className="text">
					{isUser && <Link to="/@me">Open App</Link>}
					{!isUser && <Link to="/login">Log In</Link>}
				</span>
			</Menu.Item>
		</Menu.Menu>
	</Menu>
);

TopNavigation.propTypes = {
	isUser: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
	return {
		isUser: !!state.user.email
	};
}

export default connect(mapStateToProps)(TopNavigation);
