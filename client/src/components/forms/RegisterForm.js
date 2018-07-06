import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Form, Message } from "semantic-ui-react";
import isEmail from "validator/lib/isEmail";
import { FormattedMessage } from "react-intl";

// components
import InlineError from "./../alerts/InlineError";

class RegisterForm extends React.Component {
	state = {
		data: {
			username: "",
			email: "",
			password: ""
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
			this.props.submit(this.state.data).catch(err =>
				this.setState({
					errors: err.response.data.errors,
					loading: false
				})
			);
		}
	};

	validate = data => {
		const errors = {};

		if (!data.username) errors.username = "Username cannot be blank";
		if (data.username.length < 3) errors.username = "Username too Short";

		if (!isEmail(data.email)) errors.email = "Invalid email";

		if (!data.password) errors.password = "Password cannot be blank";
		if (data.password.length < 6) errors.password = "Password too Short";

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
				<h1 className="form-h1">
					<FormattedMessage
						id="pages.RegisterPage.createAnAccount"
						defaultMessage="Create an account"
					/>
				</h1>

				{errors.global && (
					<Message negative>
						<Message.Header>
							Oops, something went wrong!
						</Message.Header>
						<p>{errors.global}</p>
					</Message>
				)}
				<br />

				<Form.Field
					error={!!errors.email}
					className="form-div"
					style={{ transitionDelay: "0.2s" }}
				>
					<input
						type="email"
						id="email"
						name="email"
						placeholder=" "
						value={data.email}
						onChange={this.onChange}
						required
					/>
					<label htmlFor="email">
						<FormattedMessage
							id="forms.email"
							defaultMessage="Email"
						/>
					</label>
					{errors.email && <InlineError text={errors.email} />}
				</Form.Field>

				<Form.Field
					error={!!errors.username}
					className="form-div"
					style={{ transitionDelay: "0.4s" }}
				>
					<input
						type="text"
						id="username"
						name="username"
						placeholder=" "
						value={data.username}
						onChange={this.onChange}
						required
					/>
					<label htmlFor="username">
						<FormattedMessage
							id="forms.username"
							defaultMessage="Username"
						/>
					</label>
					{errors.username && <InlineError text={errors.username} />}
				</Form.Field>

				<Form.Field
					error={!!errors.password}
					className="form-div"
					style={{ transitionDelay: "0.6s" }}
				>
					<input
						type="password"
						id="password"
						name="password"
						placeholder=" "
						value={data.password}
						onChange={this.onChange}
						required
					/>
					<label htmlFor="password">
						<FormattedMessage
							id="forms.password"
							defaultMessage="Password"
						/>
					</label>
					{errors.password && <InlineError text={errors.password} />}
				</Form.Field>

				<div className="form-div" style={{ transitionDelay: "0.8s" }}>
					<button className="register-btn">
						<FormattedMessage
							id="forms.register"
							defaultMessage="Register"
						/>
					</button>
					<span className="login">
						<FormattedMessage
							id="pages.RegisterPage.haveAnAccount"
							defaultMessage="Have an account?"
						/>{" "}
						<Link to="/login">
							<FormattedMessage
								id="pages.RegisterPage.login"
								defaultMessage="Login"
							/>
						</Link>
					</span>
				</div>
			</Form>
		);
	}
}

RegisterForm.propTypes = {
	submit: PropTypes.func.isRequired
};

export default RegisterForm;
