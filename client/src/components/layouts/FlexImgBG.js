import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';

import logo from './../../assets/images/holospace_logo.png';

const FlexImgBG = ({ img }) => (
	<div className="flex-img-bg">
		<Image src={img} />
	</div>
);


FlexImgBG.defaultProps = {
  img: logo
};

FlexImgBG.propTypes = {
  img: PropTypes.string
};

export default FlexImgBG;
