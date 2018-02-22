import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchChannel } from '../../actions/channels';

// components
import MainOptions from './../options/MainOptions';

class CurrentChannel extends React.Component {
	state = {
		channel: {
			name: `Hey, there ${this.props.username}!`,
			topic: 'Let\'s get this convo started'
		}
	};
	componentDidMount() {
		if (this.props.channel.name === '' && this.props.match.params.channelId) {
			this.props.fetchChannel(this.props.match.params.channelId)
		}
	}

	listChannelSubscribers = () => {
		const { subscribers } = this.props.channel;
		if (subscribers) {
			const usernames = subscribers.map(subscriber => subscriber.username);

			const text = usernames.join(', ').slice(0, 37);
			return usernames.join(', ').length < 38 ? text : `${text}...`;
		}
		return null; // ¯\_(ツ)_/¯
	};

	render() {
		const { channel } = (this.props.match.params.channelId) ? this.props : this.state;

		return (
			<div className="current-channel">
				<div className="name-topic">
					{channel && (
						<Header as="h3" inverted>
							<span>{channel.type === 'Text' ? '#' : ''}</span>{' '}
							{channel.name === 'direct'
								? this.listChannelSubscribers()
								: channel.name}
						</Header>
					)}
					{channel &&
						channel.topic && <span className="topic">{channel.topic}</span>}
				</div>
				<MainOptions />
			</div>
		);
	}
}

CurrentChannel.defaultProps = {
	channelId: '',
	channel: { name: '', topic: '', type: '' }
};

CurrentChannel.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			channelId: PropTypes.string
		})
	}).isRequired,
	username: PropTypes.string.isRequired,
	channel: PropTypes.shape({
		name: PropTypes.string,
		topic: PropTypes.string,
		type: PropTypes.string,
		direct: PropTypes.bool,
		subscribers: PropTypes.arrayOf(PropTypes.shape({}))
	}),
	fetchChannel: PropTypes.func.isRequired
};

function mapStateToProps(state, props) {
	return {
		username: state.user.username,
		channel: state.channels.find(
			channel => channel._id === props.match.params.channelId
		)
	};
}

export default withRouter(
	connect(mapStateToProps, { fetchChannel })(CurrentChannel)
);
