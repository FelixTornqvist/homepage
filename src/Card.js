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
						lastTick : time + 16,
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
							aShadow : 0.5,
						}
					};

					state.curr.xVel = state.curr.x > state.goal.x? 2 : -2;
					state.goal.x -= state.goal.w / 2;

					card.style.position = "fixed";
					card.style.left = 0;
					card.style.right = 0;
					card.style.bottom = 0;
					card.style.transform = "none";
					card.style.transition = "none";
				}

				let elapsedTime = time - state.start;
				let timeDiff = (time - state.lastTick);
				state.lastTick = time;

				let accelPow = 0.01;
				let fric = 0.066;

				let currDistX = state.goal.x - state.curr.x;
				let currDistY = state.goal.y - state.curr.y;
				let currDist = Math.sqrt(currDistX * currDistX + currDistY * currDistY); 
				let xDir = currDistX / currDist;
				let yDir = currDistY / currDist;

				currDistX = Math.abs(currDistX);
				currDistY = Math.abs(currDistY);

				state.curr.xAcc = xDir * accelPow;
				state.curr.yAcc = yDir * accelPow;

//				console.log("timediff" + timeDiff);
//				//console.log("fricc" + fric * timeDiff);
//				console.log("addXvel" + state.curr.xAcc * timeDiff);
//				console.log("x" + state.curr.xVel);
				state.curr.xVel += state.curr.xAcc * timeDiff;
				state.curr.xVel /= fric * timeDiff;
				state.curr.yVel += state.curr.yAcc * timeDiff;
				state.curr.yVel /= fric * timeDiff;

				state.curr.x += state.curr.xVel * timeDiff;
				state.curr.y += state.curr.yVel * timeDiff;

				card.style.marginLeft = state.curr.x + "px";
				card.style.marginBottom = state.curr.y + "px";

				let growtime = 700;
				if (elapsedTime <= growtime) {
					state.curr.h = ((elapsedTime / growtime) * (state.goal.h - state.init.h)) + state.init.h;
					state.curr.w = ((elapsedTime / growtime) * (state.goal.w - state.init.w)) + state.init.w;
					state.curr.yShadow = (elapsedTime / growtime * state.goal.yShadow);
					state.curr.rShadow = (elapsedTime / growtime * state.goal.rShadow);
					state.curr.aShadow = (elapsedTime / growtime * state.goal.aShadow);
				}

				card.style.height = state.curr.h + "px";
				card.style.width = state.curr.w + "px";
				card.style.boxShadow = "0 " + state.curr.yShadow + "px " + state.curr.rShadow 
					+ "px rgba(0,0,0," + state.curr.aShadow + ")";

				if (elapsedTime > 3000) {
					this.setState({expanded: true});
					card.style = null;
				} else if (currDistX > 10 || currDistY > 10 || state.curr.xVel > 10 || state.curr.yVel > 10)
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
