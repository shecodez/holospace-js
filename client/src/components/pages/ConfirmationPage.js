import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Message, Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { confirm, resendConfirmation } from './../../actions/auth';

class ConfirmationPage extends React.Component {
	state = {
		loading: true,
		errors: {},
		success: false,
		resend: false
	};

	componentDidMount() {
		this.props
			.confirm(this.props.match.params.token)
			.then(() => this.setState({ loading: false, success: true }))
			.catch(err =>
				this.setState({
					loading: false,
					errors: err.response.data.errors,
					success: false
				})
			);
	}

	resend = () => {
		this.setState({ loading: true, resend: true });
		this.props
			.resendConfirmation(this.props.email)
			.then(() => this.setState({ loading: false, success: true }));
	};

	render() {
		const { errors, loading, success, resend } = this.state;

		return (
			<div>
				{loading && (
					<Message icon>
						<Icon name="circle notched" loading />
						{resend ? (
							<Message.Header>
								<FormattedMessage
									id="pages.ConfirmationPage.resending..."
									defaultMessage="Resending..."
								/>
							</Message.Header>
						) : (
							<Message.Header>
								<FormattedMessage
									id="pages.ConfirmationPage.validating..."
									defaultMessage="Validating..."
								/>
							</Message.Header>
						)}
					</Message>
				)}

				{!loading &&
					success && (
						<Message success icon>
							<Icon name="checkmark" />
							{resend ? (
								<Message.Content>
									<Message.Header>
										<FormattedMessage
											id="pages.ConfirmationPage.successResendMsg"
											defaultMessage="Your request has been processed. Please check your inbox."
										/>
									</Message.Header>
								</Message.Content>
							) : (
								<Message.Content>
									<Message.Header>
										<FormattedMessage
											id="pages.ConfirmationPage.successValidatedMsg"
											defaultMessage="Thank you! Your email has been validated."
										/>
									</Message.Header>
									<Link to="/@me">
										<FormattedMessage
											id="pages.ConfirmationPage.openApplication"
											defaultMessage="Open Application"
										/>
									</Link>
								</Message.Content>
							)}
						</Message>
					)}

				{!loading &&
					!success && (
						<Message negative icon>
							<Icon name="warning sign" />
							<Message.Content>
								<Message.Header>{errors.global}</Message.Header>
								{errors.global === 'Invalid token' && (
									<Button onClick={this.resend}>
										<FormattedMessage
											id="pages.ConfirmationPage.resendConfirm"
											defaultMessage="Resend confirmation token"
										/>
									</Button>
								)}
							</Message.Content>
						</Message>
					)}
			</div>
		);
	}
}

ConfirmationPage.propTypes = {
	confirm: PropTypes.func.isRequired,
	match: PropTypes.shape({
		params: PropTypes.shape({
			token: PropTypes.string.isRequired
		}).isRequired
	}).isRequired,
	email: PropTypes.string.isRequired,
	resendConfirmation: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return {
		email: state.user.email
	};
}

export default connect(mapStateToProps, { confirm, resendConfirmation })(
	ConfirmationPage
);
