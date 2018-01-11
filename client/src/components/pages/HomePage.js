import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header as Title, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from './../../actions/auth';

// components
// import Header from "../navigation/header";
// import Footer from "../navigation/footer";

const HomePage = ({ isAuthenticated, logout }) => (
	<div className="home-page">
		<div className="some-stars" />
		<div className="stars" />
		<div className="moar-stars" />

		<Title as="h1" className="title" size='huge'>
	    HoloSpace

			{isAuthenticated ?
				<Button onClick={() => logout()}>logout</Button>
				: <Link to="/login">Login</Link>}

			<Title.Subheader>
	      The final chat teir
	    </Title.Subheader>
	  </Title>


		<Button.Group vertical className="social-icons">
			<Button color="facebook" icon="facebook f" />
			<Button color="instagram" icon="instagram" />
			<Button color="yellow" icon="snapchat ghost" />
			<Button color="twitter" icon="twitter" />
		</Button.Group>
	</div>
);

HomePage.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	logout: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return {
		isAuthenticated: !!state.user.token
	};
}

export default connect(mapStateToProps, { logout: actions.logout })(HomePage);
