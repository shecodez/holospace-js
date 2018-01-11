import React from 'react';
// import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

// components
// import Header from "../navigation/header";
// import Footer from "../navigation/footer";

const HomePage = () => (
	<div className="home-page">
		<div className="some-stars" />
		<div className="stars" />
		<div className="moar-stars" />

		<div className="title">
			<h1>HoloSpace</h1>
			<p>{"The final 'chat'eir"}</p>
		</div>

		<Button.Group vertical className="social-icons">
			<Button color="facebook" icon="facebook f" />
			<Button color="instagram" icon="instagram" />
			<Button color="yellow" icon="snapchat ghost" />
			<Button color="twitter" icon="twitter" />
		</Button.Group>
	</div>
);

export default HomePage;
