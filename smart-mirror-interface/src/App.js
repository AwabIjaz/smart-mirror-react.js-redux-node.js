import React, { Component } from 'react';
import Home from './pages/HomePage.js';
import { Provider } from 'react-redux';
import store from './store';

class App extends Component {	
	render() {
		return (
			<Provider store={store}>
				<Home/>
			</Provider>			
		);
	}
}

export default App;