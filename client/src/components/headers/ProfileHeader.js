import React from 'react';
import { Label } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

// components
import MainOptions from './../options/MainOptions';

const ProfileHeader = () => (
	<div className="profile-header">
		<Label.Group className="user-roles">
			<Label as="a" color="violet">
				<FormattedMessage
					id="headers.ProfileHeader.customize@me"
					defaultMessage="Customize @me"
				/>
			</Label>
			<Label as="a" basic color="violet">
				<FormattedMessage
					id="headers.ProfileHeader.friendsList"
					defaultMessage="Friends List"
				/>
			</Label>
		</Label.Group>

		<MainOptions />
	</div>
);

export default ProfileHeader;
