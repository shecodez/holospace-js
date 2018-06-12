import React from "react";
import { Message } from "semantic-ui-react";

const Banner = text => (
	<Message info className="banner">
		<Message.Header>{text}</Message.Header>
	</Message>
);

export default Banner;
