import React from 'react';
import PropTypes from 'prop-types';
import isEmail from 'validator/lib/isEmail';
import { connect } from 'react-redux';
import { Message, Icon, Grid, Segment, Header, Form } from 'semantic-ui-react';
import { validateToken, resetPassword, resetPasswordRequest } from '../../actions/auth';

// components
import ResetPasswordForm from '../forms/ResetPasswordForm';

// TODO: combine this PasswordResetPage with ConfirmationPage?

class ResetPassword extends React.Component {
	state = {
		loading: true,
		success: false,
		errors: {},
    resend: false,
    email: ''
	};

	componentDidMount() {
		this.props
			.validateToken(this.props.match.params.token)
			.then(() => this.setState({ loading: false, success: true }))
			.catch(err =>
				this.setState({
					loading: false,
          errors: err.response.data.errors,
					success: false
				})
			);
	}

  onChange = e =>
		this.setState({ [e.target.name]: e.target.value });

  resend = e => {
		e.preventDefault();

		const errors = {};
		if (!isEmail(this.state.email))
			errors.email = 'Invalid email';

		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
	    this.setState({ loading: true, resend: true })
	    this.props
	      .resetPasswordRequest(this.state.email)
	      .then(() => this.setState({ loading: false, success: true }));
		}
  }

	submit = data =>
		this.props
			.resetPassword(data)
			.then(() => this.props.history.push('/login'));

	render() {
		const { loading, success, errors, resend, email } = this.state;
		const token = this.props.match.params.token;

		return (
			<div>
				{loading && (
          <Message icon>
						<Icon name="circle notched" loading />
            { resend ?
              <Message.Header>Resending...</Message.Header>
              :
              <Message.Header>Validating...</Message.Header>
            }
					</Message>
				)}

				{!loading &&
					success && (
            <div>
              { resend ?
                <Message success icon>
                  <Icon name="checkmark" />
                  <Message.Content>
  					        <Message.Header>
  					          Your request has been processed. Please check your inbox.
                    </Message.Header>
  				        </Message.Content>
                </Message>
                :
    						<div className="password-reset-page">
    							<Grid columns={1} centered>
    								<Grid.Column
    									className="form-col"
    									mobile={14}
    									tablet={8}
    									computer={4}
    								>
    									<Segment className="form-seg">
    										<Header as="h2" color="violet" textAlign="center">
    											Reset your Password
    										</Header>

    										<ResetPasswordForm submit={this.submit} token={token} />
    									</Segment>
    								</Grid.Column>
    							</Grid>
    						</div>
              }
            </div>
					)}

				{!loading && !success && (
          <Message negative icon>
            <Icon name="warning sign" />
            <Message.Content>
              <Message.Header>{errors.global}</Message.Header>
              {errors.global === "Invalid token" &&
                <Form onSubmit={this.resend}>
									Enter your email address below, to issue another password reset request.
                  <Form.Group>
                    <Form.Input error={!!errors.email} type="email" id="email" placeholder='Email' name='email' value={email} onChange={this.onChange} />
                    <Form.Button content='Submit' />
                  </Form.Group>
                </Form>
              }
            </Message.Content>
          </Message>
        )}
			</div>
		);
	}
}

ResetPassword.propTypes = {
	validateToken: PropTypes.func.isRequired,
	resetPassword: PropTypes.func.isRequired,
	match: PropTypes.shape({
		params: PropTypes.shape({
			token: PropTypes.string.isRequired
		}).isRequired
	}).isRequired,
	history: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired,
  resetPasswordRequest: PropTypes.func.isRequired
};

export default connect(null, { validateToken, resetPassword, resetPasswordRequest })(ResetPassword);
