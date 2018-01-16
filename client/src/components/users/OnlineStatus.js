import React from 'react';
import PropTypes from 'prop-types';
import { Header, Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
// import { updateOnlineStatus } from './../../actions/user';

class OnlineStatus extends React.Component {
	state = {
		activeItem: this.props.user.status,
		onlineStatus: [
			{ name: 'Show', color: 'teal' },
			{ name: 'Away', color: 'yellow' },
			{ name: 'Busy', color: 'red', desc: 'Do NOT Disturb' },
			{ name: 'Hide', color: 'grey', desc: 'You ARE Invisible' }
		]
	};

	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name });
		// this.props.updateOnlineStatus({ status: name });
	};

	render() {
		const { activeItem, onlineStatus } = this.state;

		return (
			<Menu vertical>
				{onlineStatus.map(status => (
					<Menu.Item
						name={status.name}
						active={activeItem === status.name}
						onClick={this.handleItemClick}
            key={status.name}
					>
						<Header as="h4">
							<Icon name="bullseye" color={status.color} />
							<Header.Content>{status.name}</Header.Content>
						</Header>
						{status.desc && <p>{status.desc}</p>}
					</Menu.Item>
				))}
			</Menu>
		);
	}
}

OnlineStatus.propTypes = {
	// updateOnlineStatus: PropTypes.func.isRequired,
	user: PropTypes.shape({
		status: PropTypes.string.isRequired
	}).isRequired
};

function mapStateToProps(state) {
	return {
		user: state.user
	};
}

export default connect(mapStateToProps, {})(OnlineStatus);
