import React from 'react';
import { Popup, Button } from 'semantic-ui-react';

const DMsgButton = () => (
	<div className="dmsg-btn">
		<Popup
			trigger={<Button primary circular size="huge" icon="envelope" />}
			inverted
			content={'Direct Message'}
			position="right center"
		/>
	</div>
);

export default DMsgButton;
