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
			let animateOpen = (time, state) => {
				let card = this.cardDiv.current;

				if (state == null) {
					let cardRect = card.getBoundingClientRect();
					state = {
						start : time,
						init : {
							x : cardRect.x,
							y : window.innerHeight - cardRect.bottom,
							w : cardRect.width,
							h : cardRect.height,
						},

						curr : {
							x : cardRect.x,
							y : window.innerHeight - cardRect.bottom,
							w : cardRect.width,
							h : cardRect.height,
							xVel : 0,
							yVel : 0,
							xAcc : 0,
							yAcc : 0,
							yShadow : 10,
							rShadow : 80,
							aShadow : 0.2,
						},

						goal : {
							x : window.innerWidth / 2,
							y : 0,
							w : window.innerWidth * 0.8,
							h : window.innerHeight * 0.85,
							yShadow : 0,
							rShadow : 150,
							aShadow : 0.9,
						}
					}

					state.curr.xVel = state.curr.x > state.goal.x? 25 : -25;
					state.goal.x -= state.goal.w / 2;

					card.style.position = "fixed";
					card.style.left = 0;
					card.style.right = 0;
					card.style.bottom = 0;
					//card.style.top = 0;
					card.style.transform = "none";
				}

				let accelPow = 2;
				let fric = 0.9;

				let currDistX = state.goal.x - state.curr.x;
				let currDistY = state.goal.y - state.curr.y;
				let xDir = currDistX > 0? 1 : -1;
				let yDir = currDistY > 0? 1 : -1;

				currDistX = Math.abs(currDistX);
				currDistY = Math.abs(currDistY);

				state.curr.xAcc = xDir * accelPow;
				state.curr.yAcc = yDir * accelPow;

				state.curr.xVel += state.curr.xAcc;
				state.curr.xVel*= fric;
				state.curr.yVel += state.curr.yAcc;
				state.curr.yVel*= fric;

				state.curr.x += state.curr.xVel;
				state.curr.y += state.curr.yVel;

				card.style.marginLeft = state.curr.x + "px";
				card.style.marginBottom = state.curr.y + "px";

				let elapsedTime = time - state.start;
				if (elapsedTime <= 500) {
					state.curr.h = ((elapsedTime / 500) * (state.goal.h - state.init.h)) + state.init.h;
					state.curr.w = ((elapsedTime / 500) * (state.goal.w - state.init.w)) + state.init.w;
					//state.curr.w = (elapsedTime / 500 * state.goal.w);
					state.curr.yShadow = (elapsedTime / 500 * state.goal.yShadow);
					state.curr.rShadow = (elapsedTime / 500 * state.goal.rShadow);
					state.curr.aShadow = (elapsedTime / 500 * state.goal.aShadow);
				}

				card.style.height = state.curr.h + "px";
				card.style.width = state.curr.w + "px";
				card.style.boxShadow = "0 "+state.curr.yShadow+"px "+state.curr.rShadow+
					"px rgba(0,0,0,"+state.curr.aShadow+")";

				if (elapsedTime > 3000) {
					this.setState({expanded: true});
					card.style = null;
				} else if (currDistX > 2 || currDistY > 2 || state.curr.xVel > 10 || state.curr.yVel > 10)
					window.requestAnimationFrame((time) => 
						animateOpen(time, state));
				else {
					this.setState({expanded: true});
					card.style = null;
				}
			};

			window.requestAnimationFrame((time) => animateOpen(time, null));
/*			this.cardDivFixedPos = {
				position: 'fixed',
				left: '0px',
				right: '0px',
				marginLeft: tmp.x + 'px',
				bottom: (window.innerHeight - tmp.bottom) + 'px',
			}*/

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
			<div className={cardClasses} onClick={() => this.handleOpen()} 
			style={this.cardDivFixedPos} ref={this.cardDiv} >
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
