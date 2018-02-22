import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { createMembership } from './../../actions/memberships';

class InvitePage extends React.Component {
	state = {
		loading: true,
		errors: {},
		success: false
	};

	componentDidMount() {
		this.props
			.createMembership(this.props.match.params.invitation)
			.then(membership => {
        this.setState({ loading: false, success: true })
				const server = membership.server_id;
        this.props.history.push(`/channels/${server._id}/${server.default_id}`);
			})
      .catch(err =>
				this.setState({
					loading: false,
					errors: err.response.data.errors,
					success: false
				})
			);
	}

	render() {
		const { errors, loading, success } = this.state;

		return (
			<div>
				{loading && (
					<Message icon>
						<Icon name="circle notched" loading />
						<Message.Header>
							<FormattedMessage
								id="pages.ConfirmationPage.validating..."
								defaultMessage="Validating..."
							/>
						</Message.Header>
					</Message>
				)}

				{!loading &&
					success && (
						<Message success icon>
							<Icon name="checkmark" />
						</Message>
					)}

				{!loading &&
					!success && (
						<Message negative icon>
							<Icon name="warning sign" />
							<Message.Content>
								<Message.Header>{errors.global}</Message.Header>
								<Link to="/">
									<FormattedMessage
										id="pages.NotFoundPage.home"
										defaultMessage="Home"
									/>
								</Link>
							</Message.Content>
						</Message>
					)}
			</div>
		);
	}
}

InvitePage.propTypes = {
	createMembership: PropTypes.func.isRequired,
	match: PropTypes.shape({
		params: PropTypes.shape({
			invitation: PropTypes.string.isRequired
		}).isRequired
	}).isRequired,
	history: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired
};

export default connect(null, { createMembership })(InvitePage);
