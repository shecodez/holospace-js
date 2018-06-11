import React from "react";
//import { friends } from "../../utils/mock";

import MainLayout from "../layouts/MainLayout";
import ChatRoom from "../chat2/ChatRoom";

const DirectChatPage = () => {
	return (
		<div className="direct-chat-page">
			<MainLayout page={"direct"}>
				<ChatRoom />
			</MainLayout>
		</div>
	);
};

export default DirectChatPage;
