import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';

class CallOptions extends React.Component {
	state = {
		options: [
			{
				icon: 'info',
				desc: 'Connection Info'
			},
			{
				icon: 'phone',
				desc: 'Disconnect Voice'
			}
		]
	};

	handleOptionClick = option => {
		switch (option) {
			case 'info':
				this.connectionInfo();
				break;
			case 'phone':
				this.disconnectVoice();
				break;
			default:
				break;
		}
	};

	connectionInfo = () => {};

	disconnectVoice = () => this.props.disconnect();

	render() {
		const { options } = this.state;

		return (
			<div className="call-options">
				<Button.Group>
					{options.map(option => (
						<Popup
							trigger={
								<Button
									icon={option.icon}
									onClick={() => this.handleOptionClick(option.icon)}
								/>
							}
							content={option.desc}
							inverted
							position="top center"
							key={option.icon}
						/>
					))}
				</Button.Group>
			</div>
		);
	}
}

CallOptions.propTypes = {
	disconnect: PropTypes.func.isRequired
};

export default CallOptions;
