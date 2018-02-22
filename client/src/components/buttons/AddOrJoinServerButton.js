import React from 'react';
import PropTypes from 'prop-types';
import {
	Button,
	Modal,
	Header,
	Icon,
	Segment,
	Grid,
	Divider
} from 'semantic-ui-react';

// components
import AddServer from './../servers/AddServer';
import JoinServer from './../servers/JoinServer';

class AddOrJoinServerButton extends React.Component {
	state = {
		isOpen: false,
		addServer: false,
		joinServer: false
	};

	toggleModal = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	addServer = () => {
		this.setState({ addServer: true });
	};

	joinServer = () => {
		this.setState({ joinServer: true });
	};

	toggleAddServerModal = isOpen => {
		this.setState({ addServer: isOpen });
	};

	toggleJoinServerModal = isOpen => {
		this.setState({ joinServer: isOpen });
	};

	render() {
		const { isOpen, addServer, joinServer } = this.state;

		return (
			<div className="add-join-server">
				<Button
					inverted
					basic
					circular
					size="huge"
					icon="plus"
					onClick={this.toggleModal}
				/>

				{addServer && <AddServer toggleAdd={this.toggleAddServerModal} />}
				{joinServer && <JoinServer toggleJoin={this.toggleJoinServerModal} history={this.props.history} />}

				<Modal size={'tiny'} open={isOpen} onClose={this.toggleModal}>
					<Modal.Content style={{ textAlign: 'center' }}>
						<Header as="h3" color="violet">
							Make space, another server incoming
						</Header>
						<Segment>
							<Grid columns={2} relaxed>
								<Grid.Column>
									<Segment basic>
										<Header as="h2" icon textAlign="center">
											<Icon name="add" circular />
											Create
											<Header.Subheader>
												Create a space for me and my peeps
											</Header.Subheader>
										</Header>
										<Button color="violet" onClick={this.addServer}>
											Create a Server
										</Button>
									</Segment>
								</Grid.Column>
								<Divider vertical style={{ left: '50%' }}>
									Or
								</Divider>
								<Grid.Column>
									<Segment basic>
										<Header as="h2" icon textAlign="center">
											<Icon name="add user" circular />
											Join
											<Header.Subheader>
												Have an invite code? Join your peeps
											</Header.Subheader>
										</Header>
										<Button color="teal" onClick={this.joinServer}>
											Join a Server
										</Button>
									</Segment>
								</Grid.Column>
							</Grid>
						</Segment>
					</Modal.Content>
				</Modal>
			</div>
		);
	}
}

AddOrJoinServerButton.propTypes = {
	history: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired
}

export default AddOrJoinServerButton;
