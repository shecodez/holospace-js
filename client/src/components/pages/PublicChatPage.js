import React from "react";

import MainLayout from "../layouts/MainLayout";
import ChatRoom from "../chat/ChatRoom";

class PublicChatPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div className="public-chat-page">
				<MainLayout>
					<ChatRoom />
				</MainLayout>
			</div>
		);
	}
}

export default PublicChatPage;
