import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { register } from "../../actions/users";

import logo from "./../../assets/images/hs_logo1.png";
import text from "./../../assets/images/holospace_logo_text.png";

// components
import RegisterForm from "./../forms/RegisterForm";

import bg1 from "./../../assets/images/space_bgs/space_bg1.jpg";
import bg2 from "./../../assets/images/space_bgs/space_bg2.png";
import bg3 from "./../../assets/images/space_bgs/space_bg3.jpg";
import bg4 from "./../../assets/images/space_bgs/space_bg4.jpg";
import bg5 from "./../../assets/images/space_bgs/space_bg5.jpg";

const bgImages = [bg1, bg2, bg3, bg4, bg5];

class Register extends React.Component {
	constructor(props) {
		super(props);

		// this.state = {};

		this.submit = this.submit.bind(this);
		this.addRandomBG = this.addRandomBG.bind(this);
		this.animateForm = this.animateForm.bind(this);
	}

	componentDidMount() {
		this.addRandomBG();
		this.animateForm();
	}

	componentWillUnmount() {
		if (this.timeoutAnimIn) {
			clearTimeout(this.timeoutAnimIn);
		}
	}

	addRandomBG() {
		const css = `.register-page, .form-container:before, .logo-container:before { background: url(${
			bgImages[Math.floor(Math.random() * bgImages.length)]
		}) center fixed }`;
		this.page = document.getElementById("register-page");
		const style = document.createElement("style");

		style.type = "text/css";
		if (style.styleSheet) {
			// This is required for IE8 and below.
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}

		this.page.appendChild(style);
	}

	animateForm() {
		const logoContainer = document.getElementsByClassName(
			"logo-container"
		)[0];
		const containerLogo = document.getElementsByClassName("logo")[0];
		const containerText = document.getElementsByClassName("text")[0];
		const formContainer = document.getElementsByClassName(
			"form-container"
		)[0];
		const formH1 = document.getElementsByClassName("form-h1")[0];
		const formDivs = document.getElementsByClassName("form-div");

		this.timeoutAnimIn = setTimeout(() => {
			// $(".logo-container").transition({ scale: 1 }, 700, "ease");
			logoContainer.classList.add("transition");
			setTimeout(() => {
				// $(".logo-container .logo").addClass("animate-in");
				containerLogo.classList.add("animate-in");
				setTimeout(() => {
					// $(".logo-container .text").addClass("animate-in");
					containerText.classList.add("animate-in");
					setTimeout(() => {
						// $(".form-container").transition({ height: "430px" });
						formContainer.classList.add("transition");
						setTimeout(() => {
							// $(".form-container").addClass("animate-in");
							formContainer.classList.add("animate-in");
							setTimeout(() => {
								// $(".form-div, form h1").addClass("animate-in");
								formH1.classList.add("animate-in");
								for (let i = 0; i < formDivs.length; i += 1) {
									formDivs[i].classList.add("animate-in");
								}
							}, 500);
						}, 500);
					}, 500);
				}, 500);
			}, 1000);
		}, 10);
	}

	submit(data) {
		this.props.register(data).then(() => this.props.history.push("/@me"));
	}

	render() {
		return (
			<div id="register-page" className="register-page">
				<div className="register-container">
					<div className="logo-container">
						<img className="logo" src={logo} alt="logo" />
						<img className="text" src={text} alt="holospace" />
					</div>
					<div className="form-container">
						<RegisterForm submit={this.submit} />
					</div>
				</div>
			</div>
		);
	}
}

Register.propTypes = {
	history: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired,
	register: PropTypes.func.isRequired
};

export default connect(null, { register })(Register);
