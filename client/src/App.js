import React from 'react';
import { Route, Switch } from 'react-router-dom';

// components
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';

const App = () => (
	<div className="App">
		<Switch>
			<Route path="/" exact component={HomePage} />
			<Route path="/login" exact component={LoginPage} />
		</Switch>
	</div>
);

export default App;
