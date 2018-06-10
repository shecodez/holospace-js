import React from 'react';
import PropTypes from 'prop-types';
import { Header, Icon, Modal, Input } from 'semantic-ui-react';
import api from './../../api/api';

class ServerInvitation extends React.Component {
	state = {
		isOpen: true,
		copied: false,
		invite: ''
	};

	componentDidMount() {
		this.setServerInvitation();
	}

	setServerInvitation = () => {
		const { serverId } = this.props;

		api.server.invite(serverId).then(invitation => {
			this.setState({ invite: invitation })
		});
	}

	copyToClipboard = () => {
		const copyText = document.getElementById('invite');
		copyText.select();
		document.execCommand('Copy');
		this.setState({ copied: true });
		setTimeout(() => this.setState({copied: false}), 1000);
		// TODO: Add toast 'Copied!'
	};

	toggleModal = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	render() {
		const { isOpen, copied, invite } = this.state;
		const { serverName } = this.props;

		return (
			<Modal size={'tiny'} open={isOpen} onClose={this.toggleModal}>
				<Modal.Content style={{ textAlign: 'center' }}>
					<Header as="h2" icon textAlign="center">
						<Icon name="users" circular />
						Invite folks to {serverName}
						<Header.Subheader>
							Share the link below with others to give them access to this
							server.
						</Header.Subheader>
					</Header>
					<Input
						id="invite"
						action={{
							color: copied ? 'teal':'violet',
							labelPosition: 'right',
							icon: copied ? 'check circle outline':'copy',
							content: copied ? 'Done':'Copy',
							onClick: this.copyToClipboard
						}}
						value={invite}
					/>
				</Modal.Content>
			</Modal>
		);
	}
}

ServerInvitation.propTypes = {
	serverName: PropTypes.string.isRequired,
	serverId: PropTypes.string.isRequired
};

export default ServerInvitation;
