// source: https://github.com/ant-design/ant-design/blob/master/components/layout/Sider.tsx

if (typeof window !== "undefined") {
	const matchMediaPolyfill = (mediaQuery: string): MediaQueryList => {
		return {
			media: mediaQuery,
			matches: false,
			addListener() {},
			removeListener() {}
		};
	};
	window.matchMedia = window.matchMedia || matchMediaPolyfill;
}

import React from "react";
import PropTypes from "prop-types";
// import omit from "omit.js";

const dimensionMap = {
	xs: "480px",
	sm: "576px",
	md: "768px",
	lg: "992px",
	xl: "1200px",
	xxl: "1600px"
};

class Sidebar extends React.Component {
	constructor(props) {
		super(props);

		let matchMedia;
		if (typeof window !== "undefined") {
			matchMedia = window.matchMedia;
		}
		if (
			matchMedia &&
			props.breakpoint &&
			props.breakpoint in dimensionMap
		) {
			this.mql = matchMedia(
				`(max-width: ${dimensionMap[props.breakpoint]})`
			);
		}

		let collapsed;
		if ("collapsed" in props) {
			collapsed = props.collapsed;
		} else {
			collapsed = props.defaultCollapsed;
		}

		this.state = {
			collapsed,
			below: false
		};
	}

	componentWillReceiveProps(nextProps) {
		if ("collapsed" in nextProps) {
			this.setState({
				collapsed: nextProps.collapsed
			});
		}
	}

	componentDidMount() {
		if (this.mql) {
			this.mql.addListener(this.responsiveHandler);
			this.responsiveHandler(this.mql);
		}
	}

	componentWillUnmount() {
		if (this.mql) {
			this.mql.removeListener(this.responsiveHandler);
		}
	}

	responsiveHandler = (mql: MediaQueryList) => {
		this.setState({ below: mql.matches });
		if (this.state.collapsed !== mql.matches) {
			this.setCollapsed(mql.matches, "responsive");
		}
	};

	setCollapsed = collapsed => {
		if (!("collapsed" in this.props)) {
			this.setState({
				collapsed
			});
		}
		const { onCollapse } = this.props;
		if (onCollapse) {
			onCollapse(collapsed);
		}
	};

	toggle = () => {
		const collapsed = !this.state.collapsed;
		this.setCollapsed(collapsed);
	};

	render() {
		const {
			className,
			collapsible,
			style,
			width,
			collapsedWidth,
			...rest
		} = this.props;

		/* const divProps = omit(others, [
			"collapsed",
			"defaultCollapsed",
			"onCollapse",
			"breakpoint"
		]); */

		const rawWidth = this.state.collapsed ? collapsedWidth : width;

		const siderWidth =
			typeof rawWidth === "number"
				? `${rawWidth}px`
				: String(rawWidth || 0);

		const status = this.state.collapsed ? "collapsed" : "expanded";

		const divStyle = {
			...style,
			flex: `0 0 ${siderWidth}`,
			maxWidth: siderWidth,
			minWidth: siderWidth,
			width: siderWidth
		};
		return (
			<div
				className={status}
				// {...divProps}
				style={divStyle}
			>
				{this.props.children}
			</div>
		);
	}
}

Sidebar.defaultProps = {
	collapsible: false,
	defaultCollapsed: false,
	width: 240,
	collapsedWidth: 80,
	style: {}
};

Sidebar.propTypes = {};

export default Sidebar;
