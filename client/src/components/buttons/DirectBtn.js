import React from "react";
import { Button, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const DirectBtn = () => (
	<div>
		<Popup
			inverted
			position="right center"
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
			content={
				<FormattedMessage
					id="buttons.DirectBtn.directMessage"
					defaultMessage="Direct Message"
				/>
			}
		/>
	</div>
);

export default DirectBtn;
