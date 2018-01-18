import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Message, Header } from 'semantic-ui-react';
import isEmail from 'validator/lib/isEmail';

// components
import InlineError from './../alerts/InlineError';

class LoginForm extends React.Component {
	state = {
		data: {
			email: '',
			password: ''
		},
		loading: false,
		errors: {}
	};

	onChange = e => {
		if (this.state.errors[e.target.name]) {
			const errors = Object.assign({}, this.state.errors);
			delete errors[e.target.name];
			this.setState({
				data: { ...this.state.data, [e.target.name]: e.target.value },
				errors
			});
		} else {
			this.setState({
				data: { ...this.state.data, [e.target.name]: e.target.value }
			});
		}
	};

	onSubmit = e => {
		e.preventDefault();
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.setState({ loading: true });
			this.props
				.submit(this.state.data)
				.catch(err =>
					this.setState({ errors: err.response.data.errors, loading: false })
				);
		}
	};

	onSubmitResetPasswordRequest = () => {
		const errors = {};
		if (!isEmail(this.state.data.email))
			errors.email = 'Invalid email';

		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.props.resetPasswordRequest(this.state.data.email);
		}
	};

	validate = data => {
		const errors = {};
		if (!isEmail(data.email)) errors.email = 'Invalid email';
		if (!data.password) errors.password = 'Password cannot be blank';
		return errors;
	};

	render() {
		const { data, errors, loading } = this.state;

		return (
			<Form
				className="form login-form"
				onSubmit={this.onSubmit}
				loading={loading}
			>
				{errors.global && (
					<Message negative>
						<Message.Header>Oops, something went wrong!</Message.Header>
						<p>{errors.global}</p>
					</Message>
				)}

				<Form.Field error={!!errors.email}>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						placeholder=" "
						value={data.email}
						onChange={this.onChange}
					/>
					{errors.email && <InlineError text={errors.email} />}
				</Form.Field>

				<Form.Field error={!!errors.password}>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						placeholder=" "
						value={data.password}
						onChange={this.onChange}
					/>
					{errors.password && <InlineError text={errors.password} />}
				</Form.Field>

        <Header className='a-link' as='h5' color='violet' onClick={this.onSubmitResetPasswordRequest}>
          Forgot Password?
        </Header>

				<Button fluid color='violet'>Login</Button>
			</Form>
		);
	}
}

LoginForm.propTypes = {
	submit: PropTypes.func.isRequired,
	resetPasswordRequest: PropTypes.func.isRequired
};

export default LoginForm;
