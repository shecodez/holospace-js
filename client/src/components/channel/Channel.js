import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { updateChannel } from "./../../actions/channels";
// import { fetchChannelSubscribers } from './../../actions/subscriptions';
import { Icon, Modal } from "semantic-ui-react";

import ChannelForm from "./../forms/ChannelForm";

class Channel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
	}

	/* componentDidMount() {
		const { channel, socket, match } = this.props;

		if (match.params.channelId === channel._id) {
			socket.emit('channel:join', {
				channel: channel._id
			});

			if (channel.direct) this.fetchChannelSubscribers(channel._id);
		}
    }
    
    componentWillUnmount() {
        const { channel, socket } = this.props;
        socket.emit('channel:left', channel._id);
        // console.log(`socket.emit(channel:left, ${channel._id})`);
    }

	fetchChannelSubscribers = channelId => {
		this.props.fetchChannelSubscribers(channelId);
    };

    setChannel = () => {
		const { channel, socket } = this.props;
		socket.emit('channel:switch', channel._id);
		// console.log(`socket.emit(channel:switch, ${channel._id})`);
    }; */

	submit = data => {
		this.props.updateChannel(data).then(() => this.toggleModal());
	};

	toggleModal = () => {
		this.setState({
			open: !this.state.open
		});
	};

	render() {
		const { open } = this.state;
		const { channel, match, server, user } = this.props;

		let serverOwner = false;
		if (
			user.username === server.owner_id.username &&
			user.pin === server.owner_id.pin
		)
			serverOwner = true;

		let url = "";
		if (channel.direct) {
			url = `/direct/channels/${channel._id}`;
		} else {
			url = `/channels/${match.params.serverId}${
				channel.type === "VR" ? "/holo/" : "/"
			}${channel._id}`;
		}

		return (
			<span className="channel-item-header">
				<span className="text">
					{channel.type === "Text" ? (
						<span>
							<Icon name="hashtag" />
							<Link to={url}>{channel.name}</Link>
						</span>
					) : (
						<span>
							<Link to={url}>{channel.name}</Link>
						</span>
					)}
				</span>
				{serverOwner && (
					<span className="menu">
						<Icon name="setting" onClick={this.toggleModal} />
					</span>
				)}

				<Modal size={"small"} open={open} onClose={this.toggleModal}>
					<Modal.Header>Update Channel</Modal.Header>
					<Modal.Content>
						<ChannelForm
							channel={channel}
							submit={this.submit}
							type={channel.type}
						/>
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
		type: PropTypes.string.isRequired
	}).isRequired,
	updateChannel: PropTypes.func.isRequired,
	/*socket: PropTypes.shape({
		id: PropTypes.string,
		on: PropTypes.func,
		emit: PropTypes.func
	}).isRequired,*/
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
	//fetchChannelSubscribers: PropTypes.func.isRequired
};

function mapStateToProps(state, props) {
	return {
		user: state.user,
		server: state.servers.find(
			server => server._id === props.match.params.serverId
		)
		//subscribers: props.subscriptions
	};
}

export default withRouter(connect(mapStateToProps, { updateChannel })(Channel));
