import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';


const GuestRoute = ({ isAuthenticated, component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			!isAuthenticated ? <Component {...props} /> : <Redirect to="/@me" />
		}
	/>
);

GuestRoute.propTypes = {
	component: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
	return {
		isAuthenticated: !!state.user.email
	};
}

export default connect(mapStateToProps)(GuestRoute);
