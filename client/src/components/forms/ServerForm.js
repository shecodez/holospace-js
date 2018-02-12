import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Message, Image as Img } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

// components
import InlineError from './../alerts/InlineError';

class ServerForm extends React.Component {
	state = {
		data: {
			_id: this.props.server ? this.props.server._id : null,
			name: this.props.server ? this.props.server.name : '',
			icon: this.props.server ? this.props.server.icon : ''
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
		if (!data.name) errors.name = 'Cannot be blank';
		if (data.name.length > 50) errors.name = 'Server name too long';

		if (data.icon !== '')
			if (!this.imageExist(data.icon)) errors.icon = 'Invalid image URL';

		return errors;
	};

	imageExist = url => {
		const img = new Image();
		img.src = url;

		if (!img.complete) {
			return false;
		} else if (img.height === 0) {
			return false;
		}

		return true;
	};

	render() {
		const { data, errors, loading } = this.state;
		const buttonText = data._id ? 'Update' : 'Create';

		return (
			<Form className="server-form" onSubmit={this.onSubmit} loading={loading}>
				{errors.global && (
					<Message negative>
						<Message.Header>Oops, something went wrong!</Message.Header>
						<p>{errors.global}</p>
					</Message>
				)}
				<Form.Field error={!!errors.name}>
					<label htmlFor="name">
						<FormattedMessage
							id="forms.name"
							defaultMessage="Name"
						/>
					</label>
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

				<Form.Field error={!!errors.icon}>
					<label htmlFor="icon">
						<FormattedMessage
							id="forms.iconURL"
							defaultMessage="Icon URL"
						/>
					</label>
					<input
						type="text"
						id="icon"
						name="icon"
						placeholder=" "
						value={data.icon}
						onChange={this.onChange}
					/>
					{errors.icon && <InlineError text={errors.icon} />}
				</Form.Field>

				<Form.Field>
					{data.icon !== '' && <Img src={data.icon} size="small" bordered />}
				</Form.Field>

				<Button primary>{buttonText}</Button>
			</Form>
		);
	}
}

ServerForm.defaultProps = {
	server: null
};

ServerForm.propTypes = {
	submit: PropTypes.func.isRequired,
	server: PropTypes.shape({
		_id: PropTypes.string,
		name: PropTypes.string,
		icon: PropTypes.string
	})
};

export default ServerForm;
