import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// components
import MainOptions from './../options/MainOptions';

class CurrentChannel extends React.Component {
	state = {
		channelId: this.props.match.params.channelId
	};

	/* componentDidMount() {
		if (!this.props.channel) {
			this.props.fetchChannel(this.state.channelId);
		}
	} */

	render() {
		const { channel } = this.props;

		return (
			<div className="current-channel">
				<div className="name-topic">
					{channel && (
						<Header as="h3" inverted>
							<span>{channel.type === 'Text' ? '#' : ''}</span> {channel.name}
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
	channel: null
};

CurrentChannel.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			channelId: PropTypes.string.isRequired
		})
	}).isRequired,
	channel: PropTypes.shape({
		name: PropTypes.string.isRequired
	})
	// fetchChannel: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
	return {
		channel: state.channels.find(
			channel => channel._id === props.match.params.channelId
		)
	};
}

export default withRouter(connect(mapStateToProps)(CurrentChannel));
