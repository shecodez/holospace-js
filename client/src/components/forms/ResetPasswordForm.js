import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Message } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

// components
import InlineError from '../alerts/InlineError';

class ResetPasswordForm extends React.Component {
	state = {
		data: {
			token: this.props.token,
			password: '',
			confirmation: ''
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

		if (!data.password) errors.password = 'Password cannot be blank';
		if (data.password.length < 6) errors.password = 'Password too Short';

		if (data.confirmation !== data.password)
			errors.confirmation = 'Passwords must match';

		return errors;
	};

	render() {
		const { data, errors, loading } = this.state;

		return (
			<Form
				className="form reset-password-form"
				onSubmit={this.onSubmit}
				loading={loading}
			>
				{errors.global && (
					<Message negative>
						<Message.Header>Oops, something went wrong!</Message.Header>
						<p>{errors.global}</p>
					</Message>
				)}

				<Form.Field error={!!errors.password}>
					<label htmlFor="password">
						<FormattedMessage
							id="forms.newPassword"
							defaultMessage="New Password"
						/>
					</label>
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

				<Form.Field error={!!errors.confirmation}>
					<label htmlFor="confirmation">
						<FormattedMessage
							id="forms.confirmation"
							defaultMessage="Confirmation"
						/>
					</label>
					<input
						type="password"
						id="confirmation"
						name="confirmation"
						placeholder=" "
						value={data.confirmation}
						onChange={this.onChange}
					/>
					{errors.confirmation && <InlineError text={errors.confirmation} />}
				</Form.Field>

				<Button fluid color="violet">
					<FormattedMessage
						id="forms.reset"
						defaultMessage="Reset"
					/>
				</Button>
			</Form>
		);
	}
}

ResetPasswordForm.propTypes = {
	token: PropTypes.string.isRequired,
	submit: PropTypes.func.isRequired
};

export default ResetPasswordForm;
