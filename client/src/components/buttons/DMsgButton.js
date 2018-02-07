import React from 'react';
import { Popup, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const DMsgButton = () => (
	<div className="dmsg-btn" style={{ marginBottom: '1.5rem' }}>
		<Popup
			trigger={
				<Button
					color="violet"
					circular
					size="huge"
					icon="envelope"
					as={Link}
					to="/direct/channels"
				/>
			}
			inverted
			content={
				<FormattedMessage
					id="buttons.DMsgButton.directMessage"
					defaultMessage="Direct Message"
				/>
			}
			position="right center"
		/>
	</div>
);

export default DMsgButton;
