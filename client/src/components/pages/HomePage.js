import React from 'react';
import { Link } from 'react-router-dom';

class HomePage extends React.Component {
	state = { cities: [] };

	async componentDidMount() {
		const response = await fetch('/cities');
		const cities = await response.json();

		this.setState({ cities: cities });
	}

	render() {
		return (
			<div>
				<h2>HomePage Cities</h2>
        <Link to='/login'>Login</Link>
				<ul>
					{this.state.cities.map(city => {
						return (
							<li key={city.name}>
								{' '}
								<b>{city.name}</b>: {city.population}
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}

export default HomePage;
