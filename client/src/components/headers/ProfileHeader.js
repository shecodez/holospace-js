import React from 'react';
import { Label } from 'semantic-ui-react';

// components
import MainOptions from './../options/MainOptions';

const ProfileHeader = () => (
	<div className="profile-header">
		<Label.Group className="user-roles">
			<Label as="a" color="violet">
				Customize @me
			</Label>
			<Label as="a" basic color="violet">
				Friend List
			</Label>
		</Label.Group>

		<MainOptions />
	</div>
);

export default ProfileHeader;
