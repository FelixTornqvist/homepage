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
		this.cardSleeveDiv = React.createRef();
		this.cardDivFixedPos = {};
	}

	animate(time, state) {
		if (state.start === 0) {
			state.start = time;
			state.lastTick = time + 16;
		}

		let card = this.cardDiv.current;

		let elapsedTime = time - state.start;
		let timeDiff = (time - state.lastTick);
		state.lastTick = time;

		let accelPow = 0.02 * (state.startDist / 500);
		let fric = 0.075;

		let currDistX = state.goal.x - state.curr.x;
		let currDistY = state.goal.y - state.curr.y;
		let currDist = Math.sqrt(currDistX * currDistX + currDistY * currDistY); 
		let xDir = currDistX / currDist;
		let yDir = currDistY / currDist;

		currDistX = Math.abs(currDistX);
		currDistY = Math.abs(currDistY);

		state.curr.xAcc = xDir * accelPow;
		state.curr.yAcc = yDir * accelPow;

		state.curr.xVel += state.curr.xAcc * timeDiff;
		state.curr.xVel /= fric * timeDiff;
		state.curr.yVel += state.curr.yAcc * timeDiff;
		state.curr.yVel /= fric * timeDiff;

		state.curr.x += state.curr.xVel * timeDiff;
		state.curr.y += state.curr.yVel * timeDiff;

		card.style.marginLeft = state.curr.x + "px";
		card.style.marginBottom = state.curr.y + "px";

		let distDiff = state.startDist - currDist;
		let progress = distDiff / state.startDist;
		let growCalc = function(init, goal, x) {
			return x * (goal - init) + init;
		};

		state.curr.w = growCalc(state.init.w, state.goal.w, progress);
		state.curr.h = growCalc(state.init.h, state.goal.h, progress);
		state.curr.yShadow = growCalc(state.init.yShadow, state.goal.yShadow, progress);
		state.curr.rShadow = growCalc(state.init.rShadow, state.goal.rShadow, progress);
		state.curr.aShadow = growCalc(state.init.aShadow, state.goal.aShadow, progress);

		card.style.height = state.curr.h + "px";
		card.style.width = state.curr.w + "px";
		card.style.boxShadow = "0 " + state.curr.yShadow + "px " + state.curr.rShadow 
			+ "px rgba(0,0,0," + state.curr.aShadow + ")";

		if (elapsedTime > 3000) {
			this.setState({expanded: state.expanding});
			card.style = null;
		} else if (currDistX > 10 || currDistY > 10 || state.curr.xVel > 10 || state.curr.yVel > 10) {
			window.requestAnimationFrame((time) => 
				this.animate(time, state));
		} else {
			this.setState({expanded: state.expanding});
			card.style = null;
		}
	}

	initAnimation() {
		let card = this.cardDiv.current;
		let cardSleeve = this.cardSleeveDiv.current;
		let cardRect = cardSleeve.getBoundingClientRect();
		let time = 0; // this will be updated in the first animation loop
		let state = {
			expanding : true,
			start : time,
			lastTick : time + 16,
			startDist : 0,

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
				xVel : 0,
				yVel : 0,
				xAcc : 0,
				yAcc : 0,
				yShadow : 0,
				rShadow : 150,
				aShadow : 0.5,
			}
		};

		state.goal.x -= state.goal.w / 2;

		let currDistX = state.goal.x - state.curr.x;
		let currDistY = state.goal.y - state.curr.y;
		state.startDist = Math.sqrt(currDistX * currDistX + currDistY * currDistY); 

		card.style.position = "fixed";
		card.style.left = 0;
		card.style.right = 0;
		card.style.bottom = 0;
		card.style.transform = "none";
		card.style.transition = "none";

		return state;
	}


	handleOpen(e) {
		if (!this.state.expanded) {
			let state = this.initAnimation();
			window.requestAnimationFrame((time) => this.animate(time, state));
		}
	}


	handleClose(e) {
		if (this.state.expanded) {
			let state = this.initAnimation();

			state.init = Object.assign({}, state.goal);
			let tmp = state.curr;
			state.curr = state.goal;
			state.goal = tmp;
			state.expanding = false;
			window.requestAnimationFrame((time) => this.animate(time, state));
		}
	}

	render() {
		var imageStyle = {
			backgroundImage: "url(" + this.state.image + ")",
		};

		var cardClasses = "card";
		if (this.state.expanded === true) {
			cardClasses += " card-expanded"
		}

		return (
			<div className="card-sleeve" ref={this.cardSleeveDiv} > 
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
			</div>
		);
	}
}

export default Card;
