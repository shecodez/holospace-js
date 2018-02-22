import React from 'react';
import { Form, Button, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';

// components
import InlineError from '../alerts/InlineError';

class MembershipForm extends React.Component {
	state = {
		data: {
			invite: ''
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

	validate = data => {
		const errors = {};
		if (!data.invite) errors.invite = 'Cannot be blank';
		return errors;
	};

	goBack = () => {
		this.props.back();
	};

	render() {
		const { data, errors, loading } = this.state;

		return (
			<Form
				className="membership-form"
				onSubmit={this.onSubmit}
				loading={loading}
			>
				{errors.global && (
					<Message negative>
						<Message.Header>Error!</Message.Header>
						<p>{errors.global}</p>
					</Message>
				)}

				<Form.Field error={!!errors.invite}>
					<label htmlFor="invite">Invitation</label>
					<input
						type="text"
						id="invite"
						name="invite"
						placeholder=" "
						value={data.invite}
						onChange={this.onChange}
					/>
					{errors.invite && <InlineError text={errors.invite} />}
				</Form.Field>

				<Button color="teal">Join</Button>
				<Button basic onClick={this.goBack}>
					Back
				</Button>
			</Form>
		);
	}
}

MembershipForm.propTypes = {
	submit: PropTypes.func.isRequired,
	back: PropTypes.func.isRequired
};

export default MembershipForm;
