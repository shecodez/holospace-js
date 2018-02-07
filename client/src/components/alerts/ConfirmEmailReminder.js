import React from 'react';
import { Message } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

const ConfirmEmailReminder = () => (
	<Message info className="banner">
		<Message.Header>
			<FormattedMessage
				id="alerts.ConfirmEmailReminder.message"
				defaultMessage="Please, verify your email address."
			/>
		</Message.Header>
	</Message>
);

export default ConfirmEmailReminder;
