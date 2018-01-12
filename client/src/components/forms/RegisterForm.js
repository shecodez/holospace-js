import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Message } from 'semantic-ui-react';
import isEmail from 'validator/lib/isEmail';

// components
import InlineError from './../alerts/InlineError';

class RegisterForm extends React.Component {
	state = {
		data: {
			username: '',
			email: '',
			password: ''
		},
		loading: false,
		errors: {}
	};

	onChange = e =>
		this.setState({
			data: { ...this.state.data, [e.target.name]: e.target.value }
		});

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

	validate = data => {
		const errors = {};

		if (!data.username) errors.username = 'Username cannot be blank';
		if (data.username.length < 3) errors.username = 'Username too Short';

		if (!isEmail(data.email)) errors.email = 'Invalid email';

		if (!data.password) errors.password = 'Password cannot be blank';
		if (data.password.length < 6) errors.password = 'Password too Short';

		return errors;
	};

	render() {
		const { data, errors, loading } = this.state;

		return (
			<Form
				className="form register-form"
				onSubmit={this.onSubmit}
				loading={loading}
			>
				{errors.global && (
					<Message negative>
						<Message.Header>Oops, something went wrong!</Message.Header>
						<p>{errors.global}</p>
					</Message>
				)}
				<Form.Field error={!!errors.username}>
					<label htmlFor="username">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						placeholder=" "
						value={data.username}
						onChange={this.onChange}
					/>
					{errors.username && <InlineError text={errors.username} />}
				</Form.Field>
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

				<Button fluid color='violet'>Register</Button>
			</Form>
		);
	}
}

RegisterForm.propTypes = {
	submit: PropTypes.func.isRequired
};

export default RegisterForm;
