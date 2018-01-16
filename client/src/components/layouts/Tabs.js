import React from 'react';
import PropTypes from 'prop-types';

class Tabs extends React.Component {
	state = {
		selected: 0
	};

	handleClick(index, e) {
		e.preventDefault();
		this.setState({
			selected: index
		});
	}

	renderTabTitles() {
		function labels(child, index) {
			const activeClass = this.state.selected === index ? 'active' : '';
			return (
				<li key={index} className={activeClass}>
					<button onClick={this.handleClick.bind(this, index)}>{child.props.label}</button>
				</li>
			);
		}
		return (
			<ul className="tab-labels">
				{this.props.children.map(labels.bind(this))}
			</ul>
		);
	}

	renderTabContent() {
		return (
			<div className="tab-content">
				{this.props.children[this.state.selected]}
			</div>
		);
	}

	render() {
		return (
			<div className="tabs">
				{this.renderTabTitles()}
				{this.renderTabContent()}
			</div>
		);
	}
}

Tabs.propTypes = {
	children: PropTypes.node.isRequired
};

export default Tabs;
