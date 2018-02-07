import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { fetchServerChannels } from './../../actions/channels';

// components
import ChannelList from './ChannelList';
import AccordionChannelList from './AccordionChannelList';
import AddChannel from './AddChannel';
import VoIPActionBar from './VoIPActionBar';
// import Tabs from './../layouts/Tabs';
// import Pane from './../layouts/Pane';

class Channels extends React.Component {
	state = {
		serverId: this.props.match.params.serverId,
		useMic: false // this.props.permissions.useMic
	};

	componentDidMount() {
		this.props.fetchServerChannels(this.state.serverId);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.serverId !== this.state.serverId)
			this.props.fetchServerChannels(nextProps.match.params.serverId);

		this.setState({ serverId: nextProps.match.params.serverId });
	}

	render() {
		const { channels, socket } = this.props;

		const textChannels = [];
		const voiceChannels = [];
		const vrChannels = [];

		if (channels) {
			channels.forEach(channel => {
				switch (channel.type) {
					case 'Voice':
						voiceChannels.push(channel);
						break;

					case 'VR':
						vrChannels.push(channel);
						break;

					default:
						textChannels.push(channel);
				}
			});
		}

		const { useMic } = this.state;

		return (
			<div className="channels">
        <div className="channels-list">
  				<AddChannel type="Text" />
  				<ChannelList channels={textChannels} socket={socket} />

  				<AddChannel type="Voice" />
  				<AccordionChannelList channels={voiceChannels} socket={socket} />

  				<AddChannel type="VR" />
  				<AccordionChannelList channels={vrChannels} socket={socket} />
        </div>
				{ useMic && <VoIPActionBar socket={socket} /> }
			</div>
		);
	}
}

Channels.defaultProps = {
	currentChannelId: '',
	currentServerId: ''
};

Channels.propTypes = {
	channels: PropTypes.arrayOf(
		PropTypes.shape({
			channel: PropTypes.object
		})
	).isRequired,
	fetchServerChannels: PropTypes.func.isRequired,
	match: PropTypes.shape({
		params: PropTypes.shape({
			serverId: PropTypes.string.isRequired
		})
	}).isRequired,
	socket: PropTypes.shape({
    on: PropTypes.func,
    emit: PropTypes.func
  }).isRequired
};

function mapStateToProps(state, props) {
	return {
		channels: state.channels,
		currentChannelId: props.match.params.channelId,
		currentServerId: props.match.params.serverId
	};
}

export default withRouter(
	connect(mapStateToProps, { fetchServerChannels })(Channels)
);
