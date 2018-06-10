import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

class Unauthorized extends React.Component {
	render() {
		return (
			<div className="error-page unauthorized">
				<div className="content">
					<h1 className="title">401</h1>
					<h2 className="desc">The request requires you to be authenticated</h2>
					<Link to="/login">
						<Button className="go-back-btn">Login</Button>
					</Link>
				</div>
			</div>
		);
	}
}

export default Unauthorized;
