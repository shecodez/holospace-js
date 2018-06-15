import React from "react";
import { Header, Button } from "semantic-ui-react";

import TopNavigation from "../navigation/headers/TopNavigation";

const HomePage = () => (
	<div className="home-page">
		<TopNavigation />

		<div className="some-stars" />
		<div className="stars" />
		<div className="moar-stars" />

		<Header as="h1" className="content-title" size="huge">
			HoloSpace
			<Header.Subheader>The final chat teir</Header.Subheader>
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
