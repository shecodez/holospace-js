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
		errors: {},
		isTyping: false
	};

	componentWillUnmount() {
		this.clearIsTypingInterval();
	}

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
		}
		this.setState({ data: { body: '' } });
	};

	sendTyping = () => {
		this.lastUpdateTime = Date.now();
		if (!this.state.isTyping) {
			this.setState({ isTyping: true });
			this.props.sendTyping(true);
			// console.log('current user typing...');
			this.startIsTypingInterval();
		}
	};

	startIsTypingInterval = () => {
		this.typingInterval = setInterval(() => {
			if (Date.now() - this.lastUpdateTime > 500) {
				this.setState({ isTyping: false });
				this.clearIsTypingInterval();
			}
		}, 500);
	};

	clearIsTypingInterval = () => {
		if (this.typingInterval) {
			clearInterval(this.typingInterval);
			this.props.sendTyping(false);
			// console.log('current user !typing.');
		}
	};

	validate = data => {
		const errors = {};
		if (!data.body) errors.body = 'Cannot be blank';
		return errors;
	};

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
						autoComplete={'off'}
						onKeyUp={e => {
							e.keyCode !== 13 && this.sendTyping();
						}}
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
	message: null,
	sendTyping: null
};

MessageForm.propTypes = {
	submit: PropTypes.func.isRequired,
	message_label: PropTypes.string.isRequired,
	message: PropTypes.shape({
		_id: PropTypes.string,
		body: PropTypes.string
	}),
	sendTyping: PropTypes.func
};

export default MessageForm;
