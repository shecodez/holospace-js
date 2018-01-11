import React from 'react';
import { Message } from 'semantic-ui-react';

const ConfirmEmailReminder = () => (
	<Message info className="banner">
		<Message.Header>Please, verify your email address.</Message.Header>
	</Message>
);

export default ConfirmEmailReminder;
