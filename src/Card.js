import React, { Component } from 'react';

class Card extends Component {
	constructor(props) {
		super(props);
		this.state = {
			image: props.image,
			text: props.text,
			expanded: null,
		};
		this.cardDiv = React.createRef();
		this.cardDivFixedPos = {};
	}

	handleOpen(e) {
		if (!this.state.expanded) {
			var tmp = this.cardDiv.current.getBoundingClientRect();
			console.log(tmp);
			this.cardDivFixedPos = {
				position: 'fixed',
				left: '0px',
				right: '0px',
				marginLeft: tmp.x + 'px',
				bottom: (window.innerHeight - tmp.bottom) + 'px',
			}

			this.setState({expanded: true});
		}
	}

	handleClose(e) {
		if (this.state.expanded) {
			this.cardDivFixedPos = {
				position: 'static',
			};
			this.setState({expanded: false});
		}
	}

	render() {
		var imageStyle = {
			backgroundImage: "url(" + this.state.image + ")",
		};

		var cardClasses = "card";
		if (this.state.expanded != null) {
			if (this.state.expanded == true) {
				cardClasses += " card-expanded"
			} else {
				cardClasses += " card-shrunken";
				setTimeout( () => this.setState({expanded: null}), 300); 
			}
		}

		return (
			<div className={cardClasses} onClick={() => this.handleOpen()} style={this.cardDivFixedPos} ref={this.cardDiv} >
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
