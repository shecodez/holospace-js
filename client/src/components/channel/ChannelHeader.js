import React from "react";
import { withRouter } from "react-router";
import { Icon } from "semantic-ui-react";

import MainOptions from "../options/MainOptions";

class ChannelHeader extends React.Component {
	toggle = () => {
		this.props.toggle();
	};

	listChannelSubscribers = () => {
		const { subscribers } = this.props.channel;
		if (subscribers) {
			const usernames = subscribers.map(
				subscriber => subscriber.username
			);

			const text = usernames.join(", ").slice(0, 37);
			return usernames.join(", ").length < 38 ? text : `${text}...`;
		}
		return null; // ¯\_(ツ)_/¯
	};

	render() {
		const { channel, header } = this.props;

		return (
			<div className="c3t channel-header">
				<Icon
					className="trigger"
					name="outdent"
					onClick={this.toggle}
					flipped={this.props.collapsed ? "horizontally" : undefined}
				/>

				{this.props.match.params.channelId ? (
					<span className="current-channel">
						<span className="name">
							{channel.type === "Text" && <Icon name="hashtag" />}
							{channel.type === "VR" && <Icon name="rocket" />}
							{channel.direct
								? this.listChannelSubscribers()
								: channel.name}
						</span>
						{channel.topic && (
							<span className="topic">{channel.topic}</span>
						)}
					</span>
				) : (
					<span className="name">{header}</span>
				)}

				<MainOptions />
			</div>
		);
	}
}

export default withRouter(ChannelHeader);
