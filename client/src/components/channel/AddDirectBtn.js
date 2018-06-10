import React from "react";
import { Button, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";

const AddDirectBtn = () => (
	<div>
		<Popup
			inverted
			position="right center"
			content={"Direct Message"}
			trigger={
				<Button
					color="violet"
					circular
					size="large"
					icon="envelope"
					as={Link}
					to="/direct/channels"
					className="btn"
				/>
			}
		/>
	</div>
);

export default AddDirectBtn;
