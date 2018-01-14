import React from 'react';
import { Header, Button } from 'semantic-ui-react';

// components
import TopNav from '../navigation/TopNav';
// import Footer from '../navigation/Footer';

const HomePage = () => (
	<div className="home-page">
		<TopNav />

		<div className="some-stars" />
		<div className="stars" />
		<div className="moar-stars" />

		<Header as="h1" className="title" size='huge'>
	    HoloSpace
			<Header.Subheader>
	      The final chat teir
	    </Header.Subheader>
	  </Header>


		<Button.Group vertical className="social-icons">
			<Button color="facebook" icon="facebook f" />
			<Button color="instagram" icon="instagram" />
			<Button color="yellow" icon="snapchat ghost" />
			<Button color="twitter" icon="twitter" />
		</Button.Group>
	</div>
);

export default HomePage;
