import React, { Component } from 'react';

class Card extends Component {
	constructor(props) {
		super(props);
		this.state = {
			image: props.image,
			text: props.text,
		};
	}

	render() {
		var imageStyle = {
			backgroundImage: "url(" + this.state.image + ")",
		};

		return (
			<div className="card">
				<div style={imageStyle} className="card-image">
				</div>
				<div className="card-text">
					<b>{this.state.image}</b>
					<br/>
					{this.state.text}
				</div>
			</div>
		);
	}
}

export default Card;
