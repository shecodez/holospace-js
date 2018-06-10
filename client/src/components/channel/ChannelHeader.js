import React from "react";
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
		const { channel } = this.props;

		return (
			<div className="c3t channel-header">
				<Icon
					className="trigger"
					name="outdent"
					onClick={this.toggle}
					flipped={this.props.collapsed ? "horizontally" : undefined}
				/>

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

				<MainOptions />
			</div>
		);
	}
}

export default ChannelHeader;
