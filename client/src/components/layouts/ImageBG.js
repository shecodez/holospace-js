import React from "react";
import PropTypes from "prop-types";
import { Image } from "semantic-ui-react";

import logo from "./../../assets/images/holospace_logo.png";

const ImageBG = ({ img }) => (
	<div className="image-bg">
		<Image src={img} />
	</div>
);

ImageBG.defaultProps = {
	img: logo
};

ImageBG.propTypes = {
	img: PropTypes.string
};

export default ImageBG;
