import React from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";

import PrivateRoute from "./PrivateRoute";
import GuestRoute from "./GuestRoute";

import HomePage from "../pages/HomePage";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ConfirmationPage from "../pages/ConfirmationPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import InvitePage from "../pages/InvitePage";

import ProfilePage from "../pages/ProfilePage";
import PublicChatPage from "../pages/PublicChatPage";
import HoloSpacePage from "../pages/HoloSpacePage";
import DirectChatPage from "../pages/DirectChatPage";
import DirectHoloPage from "../pages/DirectHoloPage";

import NotFound from "../pages/error/NotFound";

// <Switch location={props.location}></Switch>
const Routes = () => (
	<Switch>
		<Route path="/" exact component={HomePage} />
		<Route path="/confirmation/:token" exact component={ConfirmationPage} />
		<Route path="/invite/:invitation" exact component={InvitePage} />

		<GuestRoute path="/login" exact component={LoginPage} />
		<GuestRoute path="/register" exact component={RegisterPage} />
		<GuestRoute
			path="/reset_password/:token"
			exact
			component={ResetPasswordPage}
		/>

		<PrivateRoute path="/@me" exact component={ProfilePage} />
		<PrivateRoute
			path="/channels/:serverId/:channelId"
			exact
			component={PublicChatPage}
		/>
		<PrivateRoute
			path="/channels/:serverId/holo/:channelId"
			exact
			component={HoloSpacePage}
		/>
		<PrivateRoute
			path="/direct/channels"
			exact
			component={DirectChatPage}
		/>
		<PrivateRoute
			path="/direct/channels/:channelId"
			exact
			component={DirectChatPage}
		/>
		<PrivateRoute
			path="/direct/channels/holo/:channelId"
			exact
			component={DirectHoloPage}
		/>

		<Route component={NotFound} />
	</Switch>
);

export default withRouter(Routes);
