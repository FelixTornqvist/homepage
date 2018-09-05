import React, { Component } from 'react';
import Header from './Header.js';
import Card from './Card.js';
import './App.css';

class App extends Component {
	render() {
		return (
			<div>
				<Header/>
				<div className="card-holder">
					<Card image="https://picsum.photos/250/150" text="hi"/>
					<Card image="https://picsum.photos/250/150" text="there"/>
					<Card image="https://picsum.photos/250/150" text="nice"/>
					<Card image="https://picsum.photos/250/150" text="to"/>
					<Card image="https://picsum.photos/250/150" text="meet"/>
					<Card image="https://picsum.photos/250/150" text="you"/>
				</div>
			</div>
		);
	}
}

export default App;
