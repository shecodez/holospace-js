import React from "react";
import PropTypes from "prop-types";
import { Image } from "semantic-ui-react";
import { getColorHash } from "../../utils/colors";

const Avatar = ({ name, icon, ...rest }) =>
	icon ? (
		<Image avatar src={icon} {...rest} />
	) : (
		<Image
			avatar
			style={{
				backgroundColor: getColorHash(name)
			}}
			{...rest}
		>
			{name.charAt(0)}
		</Image>
	);

Avatar.defaultProps = {
	icon: null
};

Avatar.propTypes = {
	icon: PropTypes.string,
	name: PropTypes.string.isRequired
};

export default Avatar;
