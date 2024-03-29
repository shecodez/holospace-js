import React from "react";
import { FormattedMessage } from "react-intl";
import {
	Button,
	Modal,
	Header,
	Icon,
	Segment,
	Grid,
	Divider
} from "semantic-ui-react";

import AddServer from "./AddServer";
import JoinServer from "./JoinServer";

class AddServerBtn extends React.Component {
	state = {
		open: false,
		add: false,
		join: false
	};

	toggleModal = () => {
		this.setState({
			open: !this.state.open
		});
	};

	addServer = () => {
		this.setState({ add: true });
	};

	joinServer = () => {
		this.setState({ join: true });
	};

	toggleAddServerModal = open => {
		this.setState({ add: open });
	};

	toggleJoinServerModal = open => {
		this.setState({ join: open });
	};

	render() {
		const { open, add, join } = this.state;

		const t = msg => (
			<FormattedMessage
				id={`server.AddServerBtn.${msg.toLowerCase()}`}
				defaultMessage={msg}
			/>
		);

		const t2 = (id, msg) => (
			<FormattedMessage
				id={`server.AddServerBtn.${id
					.charAt(0)
					.toLowerCase()}${id.slice(1)}`}
				defaultMessage={msg}
			/>
		);

		const header = (action, icon, color, subheader, onClick) => (
			<Segment basic>
				<Header as="h2" icon textAlign="center">
					<Icon name={icon} circular />
					{t(action)}
					<Header.Subheader>
						{t2(`${action}Subheader`, subheader)}
					</Header.Subheader>
				</Header>
				<Button color={color} onClick={onClick}>
					{t2(`${action}Btn`, `${action} a Server`)}
				</Button>
			</Segment>
		);

		return (
			<div>
				<Button
					inverted
					basic
					circular
					size="large"
					icon="plus"
					className="btn"
					onClick={this.toggleModal}
				/>

				{add && <AddServer toggleAdd={this.toggleAddServerModal} />}
				{join && (
					<JoinServer
						toggleJoin={this.toggleJoinServerModal}
						history={this.props.history}
					/>
				)}

				<Modal size={"tiny"} open={open} onClose={this.toggleModal}>
					<Modal.Content style={{ textAlign: "center" }}>
						<Header as="h3" color="violet">
							{t2(
								"phrase",
								"What happens in HoloSpace, stays in HoloSpace"
							)}
						</Header>
						<Segment>
							<Grid columns={2} relaxed>
								<Grid.Column>
									{header(
										"Create",
										"add",
										"violet",
										"Warm up the holomatter emitters for me",
										this.addServer
									)}
								</Grid.Column>

								<Divider vertical style={{ left: "50%" }}>
									{t("Or")}
								</Divider>

								<Grid.Column>
									{header(
										"Join",
										"users",
										"teal",
										"Have an invite code? Join their programme",
										this.joinServer
									)}
								</Grid.Column>
							</Grid>
						</Segment>
					</Modal.Content>
				</Modal>
			</div>
		);
	}
}

export default AddServerBtn;
