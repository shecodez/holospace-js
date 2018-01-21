import React from 'react';
import { Button } from 'semantic-ui-react';

const MainOptions = () => (
	<Button.Group className="main-options">
		<Button icon="bell outline" />
		<Button icon="search" />
		<Button icon="calendar plus" />
	</Button.Group>
);

export default MainOptions;
