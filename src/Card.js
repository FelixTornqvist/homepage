import React, { Component } from 'react';

class Card extends Component {
	constructor(props) {
		super(props);
		this.state = {
			image: props.image,
			text: props.text,
			expanded: false,
		};
	}

	handleOpen(e) {
		if (!this.state.expanded)
			this.setState({expanded: true});
	}

	handleClose(e) {
		if (this.state.expanded)
			this.setState({expanded: false});
	}

	render() {
		var imageStyle = {
			backgroundImage: "url(" + this.state.image + ")",
		};
		var cardClasses = this.state.expanded? "card card-expanded" : "card";

		return (
			<div className={cardClasses} onClick={() => this.handleOpen()} >
				<div style={imageStyle} className="card-image">
					<button onClick={() => this.handleClose()} >X</button>
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
