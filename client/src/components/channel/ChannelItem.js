import React from "react";
import PropTypes from "prop-types";
import { Accordion } from "semantic-ui-react";
import ChannelPresence from "./ChannelPresence";

import Channel from "./Channel";

const ChannelItem = ({ channel, current, accordion, presence }) => {
	const panel = [
		{
			title: {
				key: `t-${channel._id}`,
				content: <Channel channel={channel} />
			},
			content: {
				key: `c-${channel._id}`,
				content: presence && <ChannelPresence presence={presence} />
			}
		}
	];

	const active = current === channel._id ? "current" : "";

	return accordion ? (
		<Accordion
			className={`channel-accordion-item ${active}`}
			inverted
			panels={panel}
		/>
	) : (
		<div className={`channel-item ${active}`}>
			<Channel channel={channel} />
		</div>
	);
};

ChannelItem.defaultProps = {
	presence: null,
	accordion: false,
	current: ""
};

ChannelItem.propTypes = {
	channel: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired
	}).isRequired,
	accordion: PropTypes.bool,
	presence: PropTypes.shape(
		PropTypes.shape({
			users: PropTypes.object
		})
	),
	current: PropTypes.string
};

export default ChannelItem;
