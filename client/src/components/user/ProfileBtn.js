import React from "react";
import { Popup, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const ProfileButton = () => (
	<div className="user-btn" style={{ marginBottom: "1.5rem" }}>
		<Popup
			inverted
			position="right center"
			trigger={
				<Button
					color="violet"
					circular
					size="large"
					icon="user circle outline"
					as={Link}
					to="/@me"
					className="btn"
				/>
			}
			content={
				<FormattedMessage
					id="buttons.ProfileButton.userProfile"
					defaultMessage="User Profile"
				/>
			}
		/>
	</div>
);

export default ProfileButton;
