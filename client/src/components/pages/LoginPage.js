import React from 'react';
import PropTypes from 'prop-types';
import {
	Grid,
	Image,
	Header,
	Responsive,
	Segment,
	Modal
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { login, resetPasswordRequest } from './../../actions/auth';

import logo from './../../assets/images/hs_logo1.png';

// components
import LoginForm from './../forms/LoginForm';

class LoginPage extends React.Component {
	state = {
		isOpen: false,
		email: ''
	};

	submit = data =>
		this.props.login(data).then(() => {
			const { from } = this.props.location.state || {
				from: { pathname: '/@me' }
			};
			this.props.history.push(from);
		});

	submitResetPasswordRequest = email => {
		this.setState({ email });
		this.props.resetPasswordRequest(email);
		this.toggleModal();
	};

	toggleModal = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	render() {
		const { isOpen, email } = this.state;

		return (
			<div className="login-page">
				<Grid columns={2} centered>
					<Grid.Row stretched>
						<Grid.Column className="logo-col" mobile={14} tablet={6} computer={3}>
							<Responsive as={Segment} minWidth={768} className="logo-seg">
								<Image src={logo} />
								<Header as="h2" color="violet" textAlign="center">
									HoloSpace
								</Header>
							</Responsive>
						</Grid.Column>
						<Grid.Column className="form-col" mobile={14} tablet={8} computer={4}>
							<Segment className="form-seg">
								<Header as="h2" color="violet" textAlign="center">
									<FormattedMessage
										id="pages.LoginPage.welcomeBack"
										defaultMessage="Hey, Welcome back!"
									/>
								</Header>
								<LoginForm
									submit={this.submit}
									resetPasswordRequest={this.submitResetPasswordRequest}
								/>
								<Header as="h5">
									<FormattedMessage
										id="pages.LoginPage.dontHaveAccount"
										defaultMessage="Don't have an account?"
									/>{' '}
									<Link to="/register">
										<FormattedMessage
											id="pages.LoginPage.register"
											defaultMessage="Register"
										/>
									</Link>
								</Header>
							</Segment>
						</Grid.Column>
					</Grid.Row>
				</Grid>

				<Modal
					size="mini"
					open={isOpen}
					onClose={this.toggleModal}
					header={
						<FormattedMessage
							id="pages.LoginPage.pwResetSent"
							defaultMessage="Password Reset Sent"
						/>
					}
					content={
						`We sent instructions to reset your password to ${email}.
						Please be sure to check both your inbox and spam folder.`
					}
					actions={[{ key: 'ok', content: 'OK', positive: true }]}
				/>
			</div>
		);
	}
}

LoginPage.propTypes = {
	history: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired,
	login: PropTypes.func.isRequired,
	resetPasswordRequest: PropTypes.func.isRequired
};

export default connect(null, { login, resetPasswordRequest })(LoginPage);
