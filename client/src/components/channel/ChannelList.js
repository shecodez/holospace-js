import React from "react";
import PropTypes from "prop-types";
import { Accordion } from "semantic-ui-react";
// import { channels, presence } from "../../utils/mock";
import { presence } from "../../utils/mock";

import AddChannel from "./AddChannel";
import ChannelItem from "./ChannelItem";

class ChannelList extends React.Component {
	state = {};

	render() {
		const { channels, current } = this.props;

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
				title: { key: "t0", content: <AddChannel type="Text" /> },
				content: { key: "c0", content: textChannels }
			},
			{
				title: { key: "t1", content: <AddChannel type="VoIP" /> },
				content: { key: "c1", content: voipChannels }
			},
			{
				title: { key: "t2", content: <AddChannel type="Holo" /> },
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

ChannelList.propTypes = {
	channels: PropTypes.arrayOf(
		PropTypes.shape({
			channel: PropTypes.object
		})
	).isRequired
};

export default ChannelList;
