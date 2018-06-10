import React from 'react';
import { Link } from 'react-router-dom';

class ServerError extends React.Component {
	render() {
		return (
			<div className="error-page server-error">
				<div className="content">
					<h1 className="title">500</h1>
					<h2 className="desc">Oops, Internal Server Error</h2>
					<Link to="/">Go Back to Home Page</Link>
				</div>
			</div>
		);
	}
}

export default ServerError;
