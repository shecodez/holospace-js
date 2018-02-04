import React from 'react';
import { Popup, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const ProfileButton = () => (
	<div className="user-btn" style={{marginBottom: '1.5rem'}}>
		<Popup
			trigger={
				<Button
					color="violet"
					circular
					size="huge"
					icon="user circle outline"
					as={Link}
					to="/@me"
				/>
			}
			inverted
			content={'User Profile'}
			position="right center"
		/>
	</div>
);

export default ProfileButton;
