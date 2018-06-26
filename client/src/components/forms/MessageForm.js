import React from "react";
import PropTypes from "prop-types";
import {
	defineMessages,
	injectIntl,
	intlShape
	// FormattedMessage
} from "react-intl";
import { Input, Icon, Label } from "semantic-ui-react";

// components
import InlineError from "../alerts/InlineError";

const msgType = defineMessages({
	message: {
		id: "forms.message",
		defaultMessage: "Message"
	},
	direct: {
		id: "forms.direct",
		defaultMessage: "Direct"
	}
});

class MessageForm extends React.Component {
	state = {
		data: {
			_id: this.props.message ? this.props.message._id : null,
			body: this.props.message ? this.props.message.body : ""
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
		this.setState({ data: { body: "" } });
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
		if (!data.body) errors.body = "Cannot be blank";
		return errors;
	};

	render() {
		const { data, errors } = this.state;
		const { placeholder, direct } = this.props;
		const { formatMessage } = this.props.intl;

		return (
			<form className="form message-form" onSubmit={this.onSubmit}>
				{!this.props.noLabels ? (
					<Input
						fluid
						size="large"
						labelPosition="right"
						type="text"
						placeholder={`${
							direct ? formatMessage(msgType.direct) : ""
						}${formatMessage(msgType.message)} ${placeholder}`}
					>
						<Label basic>
							<Icon name="add circle" />
						</Label>

						<input
							id="body"
							name="body"
							value={data.body}
							onChange={this.onChange}
							onKeyUp={e => {
								e.keyCode !== 13 && this.sendTyping();
							}}
						/>

						<Label basic>
							<Icon name="smile" />
						</Label>
					</Input>
				) : (
					<Input
						fluid
						type="text"
						placeholder={`${formatMessage(
							msgType.message
						)} ${placeholder}`}
					/>
				)}

				{errors.topic && <InlineError text={errors.topic} />}
			</form>
		);
	}
}

MessageForm.defaultProps = {
	direct: false,
	noLabels: false,
	message: null,
	sendTyping: null,
	placeholder: "Message"
};

MessageForm.propTypes = {
	direct: PropTypes.bool,
	noLabels: PropTypes.bool,
	submit: PropTypes.func.isRequired,
	placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	message: PropTypes.shape({
		_id: PropTypes.string,
		body: PropTypes.string
	}),
	sendTyping: PropTypes.func,
	intl: intlShape.isRequired
};

export default injectIntl(MessageForm);
