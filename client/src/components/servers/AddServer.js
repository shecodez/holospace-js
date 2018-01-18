import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Modal } from 'semantic-ui-react';
import { createServer } from './../../actions/servers';

// components
import ServerForm from './../forms/ServerForm';

class AddServer extends React.Component {
	state = {
		isOpen: false
	};

	submit = data => {
		this.props.createServer(data).then(() => this.toggleModal());
	};

	toggleModal = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	render() {
		const { isOpen } = this.state;

		return (
			<div className="add-server">
				<Button
					inverted
					basic
					circular
					size="huge"
					icon="plus"
					onClick={this.toggleModal}
				/>

				<Modal size={'small'} open={isOpen} onClose={this.toggleModal}>
					<Modal.Header>Create New Server</Modal.Header>
					<Modal.Content>
						<ServerForm server={this.props.server} submit={this.submit} />
					</Modal.Content>
				</Modal>
			</div>
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
	})
};

export default connect(null, { createServer })(AddServer);
