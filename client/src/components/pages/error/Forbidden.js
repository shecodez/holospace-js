import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

class Forbidden extends React.Component {
	render() {
		return (
			<div className="error-page forbidden">
				<div className="content">
					<h1 className="title">403</h1>
					<h2 className="desc">
						You do not have permission to make the request
					</h2>
					<Link to="/">
						<Button className="go-back-btn">Home</Button>
					</Link>
				</div>
			</div>
		);
	}
}

export default Forbidden;
