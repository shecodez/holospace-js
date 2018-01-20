import React from 'react';
import PropTypes from 'prop-types';

// components
import InlineError from '../alerts/InlineError';

class MessageForm extends React.Component {
	state = {
		data: {
			_id: this.props.message ? this.props.message._id : null,
			body: this.props.message ? this.props.message.body : ''
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
		/* socket.emit('user:typing', {
      channel: this.props.match.params.channelId,
      user: `${this.props.username}#${this.props.pin}`
    }); */
	};

	onSubmit = e => {
		e.preventDefault();
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.setState({ loading: true });
			this.props.submit(this.state.data);
		}
		this.setState({ data: { body: '' } });
	};

	validate = data => {
		const errors = {};
		if (!data.body) errors.body = 'Cannot be blank';
		return errors;
	};

	/* socket.on('user:typing', (payload) => {
    this.renderWhoTyping(payload);
  });

	renderWhoTyping = payload => {
		this.setState({ typing: payload.username });
	}; */

	render() {
		const { data, errors } = this.state;

		return (
			<form className="custom-form" onSubmit={this.onSubmit}>
				<div className="group">
					<input
						type="text"
						id="body"
						name="body"
						placeholder=" "
						value={data.body}
						onChange={this.onChange}
						required
					/>
					<label htmlFor="body">{this.props.message_label}</label>
					<button className="emoji-btn">EMO</button>
					{errors.topic && <InlineError text={errors.topic} />}
				</div>
			</form>
		);
	}
}

MessageForm.defaultProps = {
	message: null
};

MessageForm.propTypes = {
	submit: PropTypes.func.isRequired,
	message_label: PropTypes.string.isRequired,
	message: PropTypes.shape({
		_id: PropTypes.string,
		body: PropTypes.string
	})
};

export default MessageForm;
