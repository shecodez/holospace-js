import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { fetchDirectChannels } from './../../actions/channels';

// compnents
import AddChannel from './AddChannel';
import ChannelList from './ChannelList';

class DirectChannels extends React.Component {
  state = {
    channelId: this.props.match.params.channelId
  };

  componentDidMount() {
      this.props.fetchDirectChannels();
      // if (this.props.match.params.channelId)
  }

  /* componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.channelId !== this.state.channelId)
			this.props.fetchChannelDMs(nextProps.match.params.channelId);

		this.setState({ channelId: nextProps.match.params.channelId });
	} */

  render() {
    const { channels, socket } = this.props;

    return (
      <div className="direct-channels">
        {/* <InlineSearchForm submit={this.submit} /> */}
        <AddChannel type='Text' direct />
        <ChannelList channels={channels} socket={socket} direct />
      </div>
    );
  }
}

DirectChannels.defaultProps = {
  channelId: ''
}

DirectChannels.propTypes = {
	channels: PropTypes.arrayOf(
		PropTypes.shape({
			channel: PropTypes.object
		})
	).isRequired,
	fetchDirectChannels: PropTypes.func.isRequired,
	match: PropTypes.shape({
		params: PropTypes.shape({
			channelId: PropTypes.string
		})
	}).isRequired,
	socket: PropTypes.shape({
    on: PropTypes.func,
    emit: PropTypes.func
  }).isRequired
};

function mapStateToProps(state) {
	return {
		channels: state.channels
	};
}

export default withRouter(
	connect(mapStateToProps, { fetchDirectChannels })(DirectChannels)
);
