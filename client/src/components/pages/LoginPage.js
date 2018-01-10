import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Image, Header, Segment, Modal } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';

import logo from './../../assets/images/hs_logo1.png';

// components
import LoginForm from './../forms/LoginForm';

class LoginPage extends React.Component {
	state = {
		isOpen: false,
		email: ''
	};

	submit = data =>
		this.props.login(data).then(() => this.props.history.push('/@me'));

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
						<Grid.Column className="logo-col" mobile={16} tablet={4} computer={3}>
              <Segment className="logo-seg">
							<Image src={logo} />
              <Header as="h2" color="violet" textAlign="center">
                HoloSpace
              </Header>
              </Segment>
						</Grid.Column>
						<Grid.Column className="form-col" mobile={16} tablet={8} computer={4}>
              <Segment className="form-seg">
  							<Header as="h2" color="violet" textAlign="center">
  								Hey, Welcome back!
  							</Header>
  							<LoginForm
  								submit={this.submit}
  								resetPasswordRequest={this.submitResetPasswordRequest}
  							/>
								<Header as="h5">
									{"Don't have an account? "}
									<Link to="/register">Register</Link>
				        </Header>
              </Segment>
						</Grid.Column>
					</Grid.Row>
				</Grid>

				<Modal
					size="mini"
					open={isOpen}
					onClose={this.toggleModal}
					header="Password Reset Sent"
					content={`We sent instructions to reset your password to ${email}. Please be sure to check both your inbox and spam folder.`}
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

export default connect(null, { login } )(LoginPage)
