import React from "react";
import PropTypes from "prop-types";
import { Icon, Popup } from "semantic-ui-react";

class CallOptions extends React.Component {
	state = {};

	connectionInfo = () => {};

	disconnectVoice = () => this.props.disconnect();

	render() {
		return (
			<div className="call-options">
				<div className="menu">
					<Popup
						inverted
						position="top center"
						trigger={
							<Icon name="info" onClick={this.connectionInfo} />
						}
						content="Connection Info"
					/>
					<Popup
						inverted
						position="top center"
						trigger={
							<Icon name="phone" onClick={this.disconnectVoice} />
						}
						content="Disconnect Voice"
					/>
				</div>
			</div>
		);
	}
}

CallOptions.propTypes = {
	disconnect: PropTypes.func.isRequired
};

export default CallOptions;
