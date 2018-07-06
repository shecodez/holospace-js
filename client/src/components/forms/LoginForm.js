import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Form, Message } from "semantic-ui-react";
import isEmail from "validator/lib/isEmail";
import { FormattedMessage } from "react-intl";

// components
import InlineError from "./../alerts/InlineError";

class LoginForm extends React.Component {
	state = {
		data: {
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

	onSubmitResetPasswordRequest = () => {
		const errors = {};
		if (!isEmail(this.state.data.email)) errors.email = "Invalid email";

		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.props.resetPasswordRequest(this.state.data.email);
		}
	};

	validate = data => {
		const errors = {};
		if (!isEmail(data.email)) errors.email = "Invalid email";
		if (!data.password) errors.password = "Password cannot be blank";
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
				<h1 className="form-h1">
					<FormattedMessage
						id="pages.LoginPage.welcomeBack"
						defaultMessage="Hey, Welcome back!"
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
					error={!!errors.password}
					className="form-div"
					style={{ transitionDelay: "0.4s" }}
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
					<a
						className="forgot-pw"
						onClick={this.onSubmitResetPasswordRequest}
					>
						<FormattedMessage
							id="forms.forgotPw"
							defaultMessage="Forgot your Password?"
						/>
					</a>
				</Form.Field>
				<div className="form-div" style={{ transitionDelay: "0.6s" }}>
					<button className="login-btn">
						<FormattedMessage
							id="forms.login"
							defaultMessage="Login"
						/>
					</button>

					<span className="register">
						<FormattedMessage
							id="pages.LoginPage.needAnAccount"
							defaultMessage="Need an account?"
						/>{" "}
						<Link to="/register">
							<FormattedMessage
								id="pages.LoginPage.register"
								defaultMessage="Register"
							/>
						</Link>
					</span>
				</div>
			</Form>
		);
	}
}

LoginForm.propTypes = {
	submit: PropTypes.func.isRequired,
	resetPasswordRequest: PropTypes.func.isRequired
};

export default LoginForm;
