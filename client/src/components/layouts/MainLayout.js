import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import {
	fetchMemberServers,
	fetchServerMembers
	// fetchFriends
} from "./../../actions/memberships";
import {
	fetchServerChannels,
	fetchDirectChannels
} from "./../../actions/channels";

import ChannelSidebar from "../channel/ChannelSidebar";
import ChannelHeader from "../channel/ChannelHeader";
import MemberSidebar from "../member/MemberSidebar";
import ServerSidebar from "../server/ServerSidebar";
import ConfirmEmailReminder from "../alerts/ConfirmEmailReminder";

class MainLayout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			c2collapsed: props.profile || props.holospace ? true : false,
			serverId: this.props.match.params.serverId,
			c4collapsed: props.direct || props.holospace ? true : false,
			defaultc2collapsed: props.profile || props.holospace ? true : false,
			defaultc4collapsed: props.direct || props.holospace ? true : false
		};
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
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.onWindowResize);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.serverId !== this.state.serverId) {
			this.props.fetchServerChannels(nextProps.match.params.serverId);
			this.props.fetchServerMembers(nextProps.match.params.serverId);
		}

		this.setState({ serverId: nextProps.match.params.serverId });
	}

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

	setPrevC2state = defaultc2collapsed => {
		this.setState({ defaultc2collapsed });
	};

	setPrevC4state = defaultc4collapsed => {
		this.setState({ defaultc4collapsed });
	};

	onWindowResize = () => {
		const { defaultc2collapsed, defaultc4collapsed } = this.state;
		if (window.innerWidth < 768) {
			this.setState({ c2collapsed: true, c4collapsed: true });
		} else if (window.innerWidth >= 768) {
			this.setState({
				c2collapsed: defaultc2collapsed,
				c4collapsed: defaultc4collapsed
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

		const { users, profile, holospace, direct } = this.props;

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
						<ChannelSidebar
							channels={channels}
							current={channel._id}
							server={server}
							owner={serverOwner}
							direct={direct}
						/>

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
	channel: { _id: "", name: "", topic: "", type: "" }
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

	// socket: PropTypes.shape({}).isRequired,
	children: PropTypes.node.isRequired
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
		members: state.memberships
	};
}

export default withRouter(
	connect(mapStateToProps, {
		fetchMemberServers,
		fetchServerChannels,
		fetchServerMembers,
		fetchDirectChannels
	})(MainLayout)
);
