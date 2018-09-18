import React, { Component } from 'react';
import Header from './Header.js';
import Card from './Card.js';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			images: []
		};
	}

	componentDidMount() {
		fetch("https://picsum.photos/list")
			.then(resp => resp.json())
			.then(list => this.setState({images: list}));
	}

	renderCard(imageData) {
		let image = "https://picsum.photos/720/480?image=" + imageData['id'];
		let title = 'Image by ' + imageData['author'];
		let link = imageData['post_url'];
		return (<Card image={image} title={title} text={link}/>);
	}

	render() {
		var elements = [];

		if (this.state.images.length > 0)
			for (var i = 0, len = 10; i < len; i++) {
				let index = Math.floor(Math.random() * this.state.images.length);
				elements.push(this.renderCard(this.state.images[index]));
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
