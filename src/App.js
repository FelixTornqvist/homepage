import React, { Component } from 'react';
import Header from './Header.js';
import Card from './Card.js';
import './App.css';

class App extends Component {
	renderCard(image, text) {
		return (<div className="card-sleeve" > <Card image={image} text={text}/> </div>);
	}

	render() {
		var elements = [];

		for (var i = 0, len = 10; i < len; i++) {
			elements.push(this.renderCard("https://picsum.photos/250/150", i));
		}
		return (
			<div>
				<Header/>
				<div className="card-board">
					{elements}
				</div>
			</div>
		);
	}

}

export default App;
