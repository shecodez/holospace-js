import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import {
	fetchMemberServers,
	fetchServerMembers
} from "./../../actions/memberships";
import {
	fetchServerChannels,
	fetchDirectChannels
} from "./../../actions/channels";

import ConfirmEmailReminder from "../alerts/ConfirmEmailReminder";
import ChannelSidebar from "../channel/ChannelSidebar";
import ChannelHeader from "../channel/ChannelHeader";
import MemberSidebar from "../member/MemberSidebar";
import ServerSidebar from "../server/ServerSidebar";

class MainLayout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			c2collapsed: false,
			serverId: this.props.match.params.serverId,
			c4collapsed: false
		};
	}

	componentDidMount() {
		this.props.fetchMemberServers();
		if (this.props.match.params.serverId) {
			this.props.fetchServerChannels(this.props.match.params.serverId);
			this.props.fetchServerMembers(this.props.match.params.serverId);
		} else {
			this.props.fetchDirectChannels();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.serverId !== this.state.serverId) {
			this.props.fetchServerChannels(nextProps.match.params.serverId);
			this.props.fetchServerMembers(nextProps.match.params.serverId);
		}

		this.setState({ serverId: nextProps.match.params.serverId });
	}

	toggle = () => {
		this.setState({
			c2collapsed: !this.state.c2collapsed
		});
	};

	setC2collapsed = c2collapsed => {
		this.setState({ c2collapsed });
	};

	setGrid = page => {
		switch (page) {
			case "profile":
				//this.setState({ c2collapsed: true, c4collapsed: false });
				return "grid-row c2-collapsed";

			case "holospace":
				//this.setState({ c2collapsed: true, c4collapsed: true });
				return "grid-row c2-collapsed c4-collapsed";

			case "direct":
				//this.setState({ c2collapsed: false, c4collapsed: true });
				return "grid-row c4-collapsed";

			default:
				//this.setState({ c2collapsed: false, c4collapsed: false });
				return "grid-row full";
		}
	};

	render() {
		const {
			user,
			servers,
			channels,
			channel,
			server,
			members,
			page
		} = this.props;

		let isOwner = false;
		if (
			user.username === server.owner_id.username &&
			user.pin === server.owner_id.pin
		)
			isOwner = true;

		return (
			<div className="main-layout background">
				<ServerSidebar
					servers={servers}
					current={server._id}
					direct={page === "direct" ? true : false}
				/>

				<div className="row">
					{!user.confirmed && <ConfirmEmailReminder />}

					<div className={this.setGrid(page)}>
						<ChannelSidebar
							channels={channels}
							current={channel._id}
							server={server}
							collapsed={this.state.c2collapsed}
							setCollapsed={this.setC2collapsed}
							owner={isOwner}
							direct={page === "direct" ? true : false}
						/>

						<div className="col c3">
							<ChannelHeader
								channel={channel}
								toggle={this.toggle}
								collapsed={this.state.c2collapsed}
								page={page}
							/>
							{this.props.children}
						</div>

						<MemberSidebar
							header={page === "profile" ? "Friends" : "Members"}
							current={user}
							users={members}
							owner={server.owner_id}
							channel={channel}
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
