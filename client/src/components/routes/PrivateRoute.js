import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Redirect, withRouter } from "react-router-dom";

// TODO: OnComponentUnmount reset props.location

// TODO: create toast 'You must log in to view te page'
const PrivateRoute = ({ isAuthenticated, component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			isAuthenticated ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{
						pathname: "/login",
						state: { from: props.location }
					}}
				/>
			)
		}
	/>
);
PrivateRoute.defaultProps = {
	location: null
};

PrivateRoute.propTypes = {
	component: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
	location: PropTypes.shape({})
};

function mapStateToProps(state) {
	return {
		isAuthenticated: !!state.user.email
	};
}

export default withRouter(connect(mapStateToProps)(PrivateRoute));
