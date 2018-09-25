import React from "react";
import { Header, Icon } from "semantic-ui-react";

import TopNavigation from "../navigation/headers/TopNavigation";

class HomePage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			toggled: false
		};

		this.toggleSocial = this.toggleSocial.bind(this);
	}

	toggleSocial() {
		this.setState({ toggled: !this.state.toggled });
	}

	render() {
		return (
			<div className="home-page">
				<TopNavigation />

				<div className="some-stars" />
				<div className="stars" />
				<div className="moar-stars" />

				<div id="title-0001">
					<Header as="h1" size="huge">
						<div className="h1-text">HoloSpace</div>
						<Header.Subheader>The final chat teir</Header.Subheader>
					</Header>
				</div>

				<div className={`social-icons toggled--${this.state.toggled}`}>
					<button className="share-btn" onClick={this.toggleSocial}>
						<Icon name="share alternate" />
					</button>
					<div className="social-btns">
						<Icon name="behance" />
						<Icon name="facebook f" />
						<Icon name="github alternate" />
						<Icon name="google plus" />
						<Icon name="twitch" />
						<Icon name="twitter" />
						<Icon name="youtube play" />
					</div>
				</div>
			</div>
		);
	}
}

export default HomePage;
