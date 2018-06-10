import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { fetchServerChannels } from "./../../actions/channels";

// components
import ChannelsList from "./ChannelsList";
import AccordionChannelList from "./AccordionChannelList";
import AddChannel from "../channel/AddChannel";
import VoIPActionBar from "./VoIPActionBar";
// import Tabs from './../layouts/Tabs';
// import Pane from './../layouts/Pane';

class Channels extends React.Component {
	state = {
		serverId: this.props.match.params.serverId
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
					case "Voice":
						voiceChannels.push(channel);
						break;

					case "VR":
						vrChannels.push(channel);
						break;

					default:
						textChannels.push(channel);
				}
			});
		}

		const { allowMic } = this.props.permissions;

		return (
			<div className="channels">
				<div className="channels-list">
					<AddChannel type="Text" />
					<ChannelsList channels={textChannels} socket={socket} />

					<AddChannel type="Voice" />
					<AccordionChannelList
						channels={voiceChannels}
						socket={socket}
					/>

					<AddChannel type="VR" />
					<AccordionChannelList
						channels={vrChannels}
						socket={socket}
					/>
				</div>
				{allowMic && <VoIPActionBar socket={socket} />}
			</div>
		);
	}
}

Channels.defaultProps = {
	currentChannelId: "",
	currentServerId: ""
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
	}).isRequired,
	permissions: PropTypes.shape({
		allowMic: PropTypes.bool.isRequired
	}).isRequired
};

function mapStateToProps(state, props) {
	return {
		channels: state.channels,
		currentChannelId: props.match.params.channelId,
		currentServerId: props.match.params.serverId,
		permissions: state.permissions
	};
}

export default withRouter(
	connect(mapStateToProps, { fetchServerChannels })(Channels)
);
