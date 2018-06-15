import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { updateChannel } from "./../../actions/channels";
// import { fetchChannelSubscribers } from "./../../actions/subscriptions";
import { Icon, Modal } from "semantic-ui-react";

import ChannelForm from "./../forms/ChannelForm";
import DirectChannelForm from "../forms/DirectChannelForm";

class Channel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
	}

	componentDidMount() {
		const { channel, socket, match } = this.props;
		if (match.params.channelId === channel._id) {
			socket.emit('channel:join', channel._id);
		}
	}
    
    componentWillUnmount() {
		const { channel, socket, match } = this.props;
		if (match.params.channelId === channel._id) {
			socket.emit('channel:left', channel._id);
		}
        // console.log(`socket.emit(channel:left, ${channel._id})`);
    }

    setChannel = () => {
		const { channel, socket } = this.props;
		socket.emit('channel:switch', channel._id);
		// console.log(`socket.emit(channel:switch, ${channel._id})`);
	};

	submit = data => {
		this.props.updateChannel(data).then(() => this.toggleModal());
	};

	toggleModal = () => {
		this.setState({
			open: !this.state.open
		});
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
		return "¯\\_(ツ)_/¯";
	};

	render() {
		const { open } = this.state;
		const { channel, match, server, user } = this.props;

		let canEdit = false;
		if (
			user.username === server.owner_id.username &&
			user.pin === server.owner_id.pin
		)
			canEdit = true;

		let url = "";
		if (channel.direct) {
			// url = `/direct/channels/${channel._id}`;
			url = `/direct/channels${channel.type === "VR" ? "/holo/" : "/"}${
				channel._id
			}`;
		} else {
			url = `/channels/${match.params.serverId}${
				channel.type === "VR" ? "/holo/" : "/"
			}${channel._id}`;
		}

		return (
			<span className="channel-item-header">
				<span className="text">
					{channel.direct ? (
						<span>
							<Icon
								circular
								color="violet"
								size="large"
								name="group"
							/>
							<Link to={url} onClick={this.setChannel}>
								{this.listChannelSubscribers()}
							</Link>
						</span>
					) : (
						<span>
							{channel.type === "Text" && <Icon name="hashtag" />}
							<Link to={url} onClick={this.setChannel}>{channel.name}</Link>
						</span>
					)}
				</span>
				{canEdit && (
					<span className="menu">
						<Icon name="setting" onClick={this.toggleModal} />
					</span>
				)}

				<Modal size={"small"} open={open} onClose={this.toggleModal}>
					<Modal.Header>Update Channel</Modal.Header>
					<Modal.Content>
						{channel.direct ? (
							<DirectChannelForm
								channel={channel}
								submit={this.submit}
								type={channel.type}
							/>
						) : (
							<ChannelForm
								channel={channel}
								submit={this.submit}
								type={channel.type}
							/>
						)}
					</Modal.Content>
				</Modal>
			</span>
		);
	}
}

Channel.defaultProps = {
	server: { owner_id: { username: "", pin: 0 } }
};

Channel.propTypes = {
	channel: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		subscribers: PropTypes.array,
	}).isRequired,
	updateChannel: PropTypes.func.isRequired,
	match: PropTypes.shape({
		params: PropTypes.shape({
			channelId: PropTypes.string
		})
	}).isRequired,
	socket: PropTypes.shape({
		id: PropTypes.string,
		on: PropTypes.func,
		emit: PropTypes.func
	}).isRequired,
	user: PropTypes.shape({
		username: PropTypes.string.isRequired,
		pin: PropTypes.number.isRequired
	}).isRequired,
	server: PropTypes.shape({
		owner_id: PropTypes.shape({
			username: PropTypes.string,
			pin: PropTypes.number
		})
	})
};

function mapStateToProps(state, props) {
	return {
		user: state.user,
		server: state.servers.find(
			server => server._id === props.match.params.serverId
		),
		socket: state.socket
	};
}

export default withRouter(connect(mapStateToProps, { updateChannel })(Channel));
