import React from "react";
import PropTypes from "prop-types";
import io from "socket.io-client";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import {
	fetchMemberServers,
	fetchServerMembers,
	// fetchFriends
	updateMember
} from "./../../actions/memberships";
import {
	fetchServerChannels,
	fetchDirectChannels
} from "./../../actions/channels";
import { updateUser } from "./../../actions/users";
import { setSocket } from "../../actions/socket";

import ChannelSidebar from "../channel/ChannelSidebar";
import ChannelHeader from "../channel/ChannelHeader";
import MemberSidebar from "../member/MemberSidebar";
import ServerSidebar from "../server/ServerSidebar";
import ConfirmEmailReminder from "../alerts/ConfirmEmailReminder";
import ModelSidebar from "../user/ModelSidebar";

class MainLayout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			c2collapsed: props.profile || props.holospace ? true : false,
			serverId: this.props.match.params.serverId,
			c4collapsed: props.direct || props.holospace ? true : false,
			prevc2state: props.profile || props.holospace ? true : false,
			prevc4state: props.direct || props.holospace ? true : false
		};
		this.socket = io("http://localhost:3000");
	}

	componentWillMount() {
		const { user } = this.props;
		if (user) {
			this.initSocketUser(user);
		}
	}

	componentDidMount() {
		this.props.fetchMemberServers();
		if (this.props.match.params.serverId) {
			this.props.fetchServerChannels(this.props.match.params.serverId);
			this.props.fetchServerMembers(this.props.match.params.serverId);
		} else {
			this.props.fetchDirectChannels();
			// this.props.fetchFriends();
		}

		window.addEventListener("resize", this.onWindowResize);

		this.socket.on("user:update", this.updateOnline);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.serverId !== this.state.serverId) {
			this.props.fetchServerChannels(nextProps.match.params.serverId);
			this.props.fetchServerMembers(nextProps.match.params.serverId);
		}

		this.setState({ serverId: nextProps.match.params.serverId });
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.onWindowResize);
		// this.socket.close();
	}

	initSocketUser(user) {
		if (user) {
			this.socket.emit("user:init", {
				icon: user.avatar,
				holoTag: `${user.username}#${user.pin}`
			});
			this.props.setSocket(this.socket);
		}
	}

	updateOnline = data => {
		if (this.props.user.email === data.user.email) {
			this.props.updateUser(data.user);
			this.props.updateMember(data.user);
		} else {
			this.props.updateMember(data.user);
		}
		// console.log(data.user);
	};

	togglec2 = () => {
		this.setState(
			{
				c2collapsed: !this.state.c2collapsed
			},
			() => this.setPrevC2state(this.state.c2collapsed)
		);
	};

	togglec4 = () => {
		this.setState(
			{
				c4collapsed: !this.state.c4collapsed
			},
			() => this.setPrevC4state(this.state.c4collapsed)
		);
	};

	setPrevC2state = prevc2state => {
		this.setState({ prevc2state });
	};

	setPrevC4state = prevc4state => {
		this.setState({ prevc4state });
	};

	onWindowResize = () => {
		const { prevc2state, prevc4state } = this.state;
		if (window.innerWidth < 768) {
			this.setState({ c2collapsed: true, c4collapsed: true });
		} else if (window.innerWidth >= 768) {
			this.setState({
				c2collapsed: prevc2state,
				c4collapsed: prevc4state
			});
		}
	};

	render() {
		const {
			user,
			servers,
			channels,
			channel,
			server,
			members
		} = this.props;

		let serverOwner = false;
		if (
			user.username === server.owner_id.username &&
			user.pin === server.owner_id.pin
		)
			serverOwner = true;

		const { profile, direct } = this.props;

		const { c2collapsed, c4collapsed } = this.state;
		const _c2collapsed = c2collapsed ? " c2-collapsed" : "";
		const _c4collapsed = c4collapsed ? " c4-collapsed" : "";
		const full = !c2collapsed && !c4collapsed ? "full" : "";

		const header = profile || direct ? "Friends" : "Members";

		return (
			<div className="main-layout background">
				<ServerSidebar
					servers={servers}
					current={server._id}
					direct={direct}
				/>

				<div className="row">
					{!user.confirmed && <ConfirmEmailReminder />}

					<div
						className={`grid-row ${full}${_c2collapsed}${_c4collapsed}`}
					>
						{profile ? (
							<ModelSidebar />
						) : (
							<ChannelSidebar
								channels={channels}
								current={channel._id}
								server={server}
								owner={serverOwner}
								direct={direct}
							/>
						)}

						<div className="col c3">
							<ChannelHeader
								channel={channel}
								toggle={this.togglec2}
								collapsed={this.state.c2collapsed}
								header={
									profile
										? "Profile"
										: `${user.username}'s Private Log`
								}
							/>
							{this.props.children}
						</div>

						<MemberSidebar
							header={header}
							toggle={this.togglec4}
							current={user}
							users={members}
							owner={server.owner_id}
							collapsed={this.state.c4collapsed}
						/>
					</div>
				</div>
			</div>
		);
	}
}

MainLayout.defaultProps = {
	channelId: "",
	server: { _id: "", name: "", owner_id: { username: "", pin: 0 } },
	channel: { _id: "", name: "", topic: "", type: "" },
	socket: null
};

MainLayout.propTypes = {
	user: PropTypes.shape({
		email: PropTypes.string.isRequired,
		confirmed: PropTypes.bool.isRequired
	}).isRequired,

	fetchMemberServers: PropTypes.func.isRequired,
	servers: PropTypes.arrayOf(
		PropTypes.shape({
			server: PropTypes.object
		})
	).isRequired,
	server: PropTypes.shape({
		name: PropTypes.string
	}),

	fetchServerChannels: PropTypes.func.isRequired,
	fetchDirectChannels: PropTypes.func.isRequired,
	channels: PropTypes.arrayOf(
		PropTypes.shape({
			channel: PropTypes.object
		})
	).isRequired,
	channel: PropTypes.shape({
		name: PropTypes.string,
		topic: PropTypes.string,
		type: PropTypes.string,
		direct: PropTypes.bool,
		subscribers: PropTypes.arrayOf(PropTypes.shape({}))
	}),

	fetchServerMembers: PropTypes.func.isRequired,
	members: PropTypes.arrayOf(
		PropTypes.shape({
			member: PropTypes.object
		})
	).isRequired,
	children: PropTypes.node.isRequired,
	socket: PropTypes.shape({
		on: PropTypes.func
	}),
	updateUser: PropTypes.func.isRequired,
	updateMember: PropTypes.func.isRequired,
	setSocket: PropTypes.func.isRequired
};

function mapStateToProps(state, props) {
	return {
		user: state.user,
		servers: state.servers,
		server: state.servers.find(
			server => server._id === props.match.params.serverId
		),
		channels: state.channels,
		channel: state.channels.find(
			channel => channel._id === props.match.params.channelId
		),
		members: state.memberships,
		socket: state.socket
	};
}

export default withRouter(
	connect(mapStateToProps, {
		setSocket,
		fetchMemberServers,
		fetchServerChannels,
		fetchServerMembers,
		fetchDirectChannels,
		updateUser,
		updateMember
	})(MainLayout)
);
