import React from 'react';
import PropTypes from 'prop-types';
import { Card, Grid, Icon, Label, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import moment from 'moment';

// components
import User from './../users/User';
import MessageForm from './../forms/MessageForm';

const header = (member, joined) => (
	<div>
		<User user={member} />
		Member since: {moment(joined).format('MMM YYYY')}
	</div>
);

const main = (role, isOwner) => (
	<Grid columns={2} centered>
		<Grid.Row stretched>
			<Grid.Column>
				<Header as="h5" icon="shield" content="Role" />
				<Label.Group size="mini" className="user-roles">
					<Label basic color="violet">
						{role} {role !== 'owner' && isOwner && <Icon name="delete" />}
					</Label>
					{isOwner && (
						<Label as="button">
							<Icon name="plus" style={{ margin: '0' }} />
						</Label>
					)}
				</Label.Group>
			</Grid.Column>
			<Grid.Column>
				<Header as="h5" icon="sticky note outline" content="Note" />
				<div>blah blah blah...</div>
			</Grid.Column>
		</Grid.Row>
	</Grid>
);

class UserCard extends React.Component {
	submit = data => {
		console.log(data);
		// this.props.createDirectMessage(data);
	};

	render() {
		const { member, joined, owner, user } = this.props;

		let serverOwner = false;
		if (owner.username === member.username && owner.pin === member.pin)
			serverOwner = true;

		const role = serverOwner ? 'owner' : 'member';

		let isOwner = false;
		if (user.username === owner.username && user.pin === owner.pin)
			isOwner = true;

		return (
			<Card fluid className="user-card">
				<Card.Content header={header(member, joined)} />
				<Card.Content description={main(role, isOwner)} />
				<Card.Content extra>
					{!serverOwner && (
						<MessageForm
							submit={this.submit}
							message_label={`Message @${member.username}`}
						/>
					)}
				</Card.Content>
			</Card>
		);
	}
}

UserCard.propTypes = {
	member: PropTypes.shape({
		username: PropTypes.string.isRequired
	}).isRequired,
	joined: PropTypes.string.isRequired,
	owner: PropTypes.shape({
		username: PropTypes.string.isRequired,
		pin: PropTypes.number.isRequired
	}).isRequired,
	user: PropTypes.shape({}).isRequired
};

function mapStateToProps(state) {
	return {
		user: state.user
	};
}

export default connect(mapStateToProps)(UserCard);
