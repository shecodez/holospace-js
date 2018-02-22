import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { updateUser } from './../../actions/users';
import { updateMember } from './../../actions/memberships';

// conponents
import Grid from './../layouts/Grid';
import Nested from './../layouts/Nested';
import Section from './../layouts/Section';
import FlexSection from './../layouts/FlexSection';

import ConfirmEmailReminder from './../alerts/ConfirmEmailReminder';
import CurrentServer from './../servers/CurrentServer';
import ChatRoom from './../chat/ChatRoom';
import CurrentUser from './../users/CurrentUser';
import Members from './../members/Members';
import CurrentChannel from './../channels/CurrentChannel';
import PlayCanvas from './../playcanvas/PlayCanvas';

class VRPage extends React.Component {
	state = {
		socket: null,
		holospace: { width: 0, height: 0 }
	};

	componentWillMount() {
		this.initSocket();
	}

	componentDidMount() {
		this.state.socket.on('user:update', this.updateUser);
		this.onWindowResize();
		window.addEventListener('resize', this.onWindowResize);
	}

	componentWillUnmount() {
		this.setState({ socket: null });
		window.removeEventListener('resize', this.onWindowResize);
	}

	initSocket = () => {
		const { user } = this.props;

		const socket = io(); // url : ~/vr/channels/
		this.setState({ socket });

		socket.emit('user:init', {
			iconURL: user.avatar,
			userTag: `${user.username}#${user.pin}`
		});
	};

	updateUser = data => {
		if (this.props.user.email === data.user.email) {
			this.props.updateUser(data.user);
			this.props.updateMember(data.user);
		} else {
			this.props.updateMember(data.user);
		}
		// console.log(data.user);
	};

	onWindowResize = () => {
		this.setState({
			holospace: {
				width: this.holospace.clientWidth,
				height: this.holospace.clientHeight
			}
		});
	};

	render() {
		const { socket, holospace } = this.state;

		return (
      <div className="site-grid-r1 vr-page">
        <div className="one-r">
          {!this.props.user.confirmed && <ConfirmEmailReminder />}
          <Grid className="vr grid-3c-vr">
            <Nested>
              <Section className="c2t"><CurrentServer /></Section>
              <FlexSection className="c2m"><ChatRoom socket={socket} /></FlexSection>
              <Section className="c2b">
                <CurrentUser vr />
              </Section>
            </Nested>
            <Nested>
              <Section className="c3t"><CurrentChannel /></Section>
              <div className="c3m stretch section"
                ref={element => {
                  this.holospace = element;
                }}
              >
                <PlayCanvas
                  width={holospace.width}
                  height={holospace.height}
                  socket={socket} />
              </div>
            </Nested>
            <Section className="c4"><Members /></Section>
          </Grid>
        </div>
      </div>
    );
	}
};

VRPage.propTypes = {
	user: PropTypes.shape({
		email: PropTypes.string.isRequired,
		confirmed: PropTypes.bool.isRequired
	}).isRequired,
	updateUser: PropTypes.func.isRequired,
	updateMember: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return {
		user: state.user
	};
}

export default connect(mapStateToProps, { updateUser, updateMember })(VRPage);
