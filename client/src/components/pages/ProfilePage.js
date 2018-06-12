import React from "react";

// import { friends } from "../../utils/mock";

import MainLayout from "../layouts/MainLayout";
import UserModel from "../user/UserModel";

class ProfilePage extends React.Component {
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
		window.addEventListener("resize", this.onWindowResize);
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

		const areaStyle = {
			display: "block",
			width: "100%",
			height: "100%",
			background: "#000"
		};

		return (
			<div className="profile-page">
				<MainLayout profile>
					<div
						ref={element => {
							this.canvasArea = element;
						}}
						style={areaStyle}
					>
						<UserModel
							width={canvas.width}
							height={canvas.height}
						/>
					</div>
				</MainLayout>
			</div>
		);
	}
}

export default ProfilePage;
