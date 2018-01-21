import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Message } from 'semantic-ui-react';

// components
import InlineError from './../alerts/InlineError';

class ChannelForm extends React.Component {
	state = {
		data: {
			_id: this.props.channel ? this.props.channel._id : null,
			name: this.props.channel ? this.props.channel.name : '',
			topic: this.props.channel ? this.props.channel.topic : '',
			type: this.props.channel ? this.props.channel.type : this.props.type
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
			this.props.submit(this.state.data);
			/* .catch(err =>
          this.setState({ errors: err.response.data.errors, loading: false })
        ); */
		}
	};

	validate = data => {
		const errors = {};
		if (!data.name) errors.name = 'Cannot be blank';
		if (data.name.length > 50) errors.name = 'Channel name too long';
		return errors;
	};

	render() {
		const { data, errors, loading } = this.state;
		const buttonText = data._id ? 'Update' : 'Create';

		return (
			<Form className="channel-form" onSubmit={this.onSubmit} loading={loading}>
				{errors.global && (
					<Message negative>
						<Message.Header>Oops, something went wrong!</Message.Header>
						<p>{errors.global}</p>
					</Message>
				)}
				<Form.Field error={!!errors.name}>
					<label htmlFor="name">Name</label>
					<input
						type="text"
						id="name"
						name="name"
						placeholder=" "
						value={data.name}
						onChange={this.onChange}
					/>
					{errors.name && <InlineError text={errors.name} />}
				</Form.Field>

				<Form.Field error={!!errors.topic}>
					<label htmlFor="topic">Topic</label>
					<input
						type="text"
						id="topic"
						name="topic"
						placeholder=" "
						value={data.topic}
						onChange={this.onChange}
					/>
					{errors.topic && <InlineError text={errors.topic} />}
				</Form.Field>

				<Button primary>{buttonText}</Button>
			</Form>
		);
	}
}

ChannelForm.defaultProps = {
	channel: null
};

ChannelForm.propTypes = {
	submit: PropTypes.func.isRequired,
	type: PropTypes.string.isRequired,
	channel: PropTypes.shape({
		_id: PropTypes.string,
		name: PropTypes.string,
		topic: PropTypes.string,
		type: PropTypes.string
	})
};

export default ChannelForm;
