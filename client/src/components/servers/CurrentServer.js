import React from 'react';
import PropTypes from 'prop-types';
import { Header, Button, Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { updateServer } from './../../actions/servers';

// components
import ServerForm from './../forms/ServerForm';

class CurrentServer extends React.Component {
	state = {
		isOpen: false,
		serverId: this.props.match.params.serverId
	};

	/* componentDidMount() {
		if (!this.props.server) {
			this.props.fetchServer(this.state.serverId);
		}
	} */

	submit = data => {
		this.props.updateServer(data).then(this.toggleModal());
	};

	toggleModal = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	render() {
		const { isOpen } = this.state;
		const { server } = this.props;

		return (
			<div className="current-server">
				{server && (
					<Header as="h3" inverted>
						{server.name}
					</Header>
				)}
				<Button icon="content" onClick={this.toggleModal} />

				<Modal size={'small'} open={isOpen} onClose={this.toggleModal}>
					<Modal.Header>Update Server</Modal.Header>
					<Modal.Content>
						<ServerForm server={server} submit={this.submit} />
					</Modal.Content>
				</Modal>
			</div>
		);
	}
}

CurrentServer.defaultProps = {
	server: null
};

CurrentServer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			serverId: PropTypes.string.isRequired
		})
	}).isRequired,
	server: PropTypes.shape({
		owner_id: PropTypes.shape({
			username: PropTypes.string,
			pin: PropTypes.number
		})
	}),
	// fetchServer: PropTypes.func.isRequired,
	updateServer: PropTypes.func.isRequired
};

function mapStateToProps(state, props) {
	return {
		server: state.servers.find(
			server => server._id === props.match.params.serverId
		)
	};
}

export default withRouter(
	connect(mapStateToProps, { updateServer })(CurrentServer)
);
