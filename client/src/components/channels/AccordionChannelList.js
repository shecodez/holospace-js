import React from 'react';
import PropTypes from 'prop-types';
import { List, Accordion, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// components
import Channel from './Channel';

class AccordionChannelList extends React.Component {
	state = {
		activeIndex: -1
	};

	handleClick = (e, titleProps) => {
		const { index } = titleProps;
		const { activeIndex } = this.state;
		const newIndex = activeIndex === index ? -1 : index;

		this.setState({ activeIndex: newIndex });
	};

	render() {
		const { activeIndex } = this.state;
		const { channels } = this.props;

		return (
			<List className="channel-list accordion-channel-list">
				{channels.map((channel, i) => (
					<Accordion inverted key={channel._id}>
						<Accordion.Title
							active={activeIndex === i}
							index={i}
							onClick={this.handleClick}
						>
							<Icon name="dropdown" />
							<Channel channel={channel} key={channel._id} />
						</Accordion.Title>
						<Accordion.Content active={activeIndex === i}>
							Online Users
						</Accordion.Content>
					</Accordion>
				))}
			</List>
		);
	}
}

AccordionChannelList.propTypes = {
	channels: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default withRouter(connect(null)(AccordionChannelList));
