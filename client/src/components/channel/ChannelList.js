import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Accordion } from "semantic-ui-react";
// import { channels, presence } from "../../utils/mock";

import AddChannel from "./AddChannel";
import ChannelItem from "./ChannelItem";

class ChannelList extends React.Component {
	state = {
		presence: {}
	};

	componentDidMount() {
		this.componentIsMounted = true;
		this.props.socket.on("clients:update", this.updatePresence);
	}

	componentWillUnmount() {
		this.componentIsMounted = false;
	}

	updatePresence = data => {
		if (this.componentIsMounted) this.setState({ presence: data });
	};

	render() {
		const { presence } = this.state;
		const { channels, current, direct } = this.props;

		const textChannels = [];
		const voipChannels = [];
		const holoChannels = [];

		if (channels) {
			channels.forEach(channel => {
				switch (channel.type) {
					case "Voice":
						voipChannels.push(
							<ChannelItem
								key={channel._id}
								channel={channel}
								current={current}
								presence={presence[channel._id]}
								accordion
							/>
						);

						break;

					case "VR":
						holoChannels.push(
							<ChannelItem
								key={channel._id}
								channel={channel}
								current={current}
								presence={presence[channel._id]}
								accordion
							/>
						);

						break;

					default:
						textChannels.push(
							<ChannelItem
								key={channel._id}
								channel={channel}
								current={current}
							/>
						);
				}
			});
		}

		const panels = [
			{
				title: {
					key: "t0",
					content: <AddChannel type="Text" direct={direct} />
				},
				content: { key: "c0", content: textChannels }
			},
			{
				title: {
					key: "t1",
					content: <AddChannel type="VoIP" direct={direct} />
				},
				content: { key: "c1", content: voipChannels }
			},
			{
				title: {
					key: "t2",
					content: <AddChannel type="Holo" direct={direct} />
				},
				content: { key: "c2", content: holoChannels }
			}
		];

		return (
			<div className="c2m stretch channel-list">
				<Accordion
					defaultActiveIndex={[0, 1, 2]}
					panels={panels}
					exclusive={false}
				/>
			</div>
		);
	}
}

ChannelList.defaultProps = {
	direct: false
};

ChannelList.propTypes = {
	channels: PropTypes.arrayOf(
		PropTypes.shape({
			channel: PropTypes.object
		})
	).isRequired,
	current: PropTypes.string.isRequired,
	direct: PropTypes.bool,
	socket: PropTypes.shape({
		on: PropTypes.func
	}).isRequired
};

function mapStateToProps(state) {
	return {
		socket: state.socket
	};
}

export default connect(mapStateToProps, {})(ChannelList);
