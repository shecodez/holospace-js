import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { withRouter } from "react-router";
import { connect } from "react-redux";
//import { members } from "../../utils/mock";

import MainLayout from "../layouts/MainLayout";
import HoloSpace from "../holo/HoloSpace";

class HoloSpacePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			canvas: {
				width: 0,
				height: 0
			}
		};
	}

	componentDidMount() {
		this.onWindowResize();
		// window.addEventListener("resize", this.onWindowResize);
		window.addEventListener("resize", _.debounce(this.onWindowResize, 300));
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.onWindowResize);
	}

	onWindowResize = () => {
		this.setState({
			canvas: {
				width: this.canvasArea.clientWidth,
				height: this.canvasArea.clientHeight
			}
		});
	};

	render() {
		const { canvas } = this.state;
		const { channel, server, socket } = this.props;

		const areaStyle = {
			display: "block",
			width: "100%",
			height: "100%",
			background: "#000"
		};

		return (
			<div className="holospace-page">
				<MainLayout holospace>
					<div
						ref={element => {
							this.canvasArea = element;
						}}
						style={areaStyle}
					>
						{channel &&
							socket && (
								<HoloSpace
									width={canvas.width}
									height={canvas.height}
									channel={channel}
									owner={server.owner_id}
									socket={socket}
								/>
							)}
					</div>
				</MainLayout>
			</div>
		);
	}
}

HoloSpacePage.defaultProps = {
	server: { owner_id: { username: "", pin: 0 } }
};

HoloSpacePage.propTypes = {
	server: PropTypes.shape({
		owner_id: PropTypes.object
	}),
	channel: PropTypes.shape({
		name: PropTypes.string
	}).isRequired,
	socket: PropTypes.shape({}).isRequired
};

function mapStateToProps(state, props) {
	return {
		server: state.servers.find(
			server => server._id === props.match.params.serverId
		),
		channel: state.channels.find(
			channel => channel._id === props.match.params.channelId
		),
		socket: state.socket
	};
}

export default withRouter(connect(mapStateToProps, {})(HoloSpacePage));
