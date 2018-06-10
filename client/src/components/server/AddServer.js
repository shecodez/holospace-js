import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { createServer } from './../../actions/servers';

// components
import ServerForm from './../forms/ServerForm';

class AddServer extends React.Component {
	state = {
		isOpen: true
	};

	submit = data => {
		this.props.createServer(data).then(() => this.toggleModal());
	};

	toggleModal = () => {
		this.setState({
			isOpen: !this.state.isOpen
		}, () => this.props.toggleAdd(this.state.isOpen));
	};

	render() {
		const { isOpen } = this.state;

		return (
			<Modal size={'small'} open={isOpen} onClose={this.toggleModal}>
				<Modal.Header>
					<FormattedMessage
						id="servers.AddServer.createServer"
						defaultMessage="Create New Server"
					/>
				</Modal.Header>
				<Modal.Content>
					<ServerForm server={this.props.server} submit={this.submit} />
				</Modal.Content>
			</Modal>
		);
	}
}

AddServer.defaultProps = {
	server: null
};

AddServer.propTypes = {
	createServer: PropTypes.func.isRequired,
	server: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		icon: PropTypes.string.isRequired
	}),
	toggleAdd: PropTypes.func.isRequired
};

export default connect(null, { createServer })(AddServer);
