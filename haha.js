"use strict";

const SVG_NS = "http://www.w3.org/2000/svg";

function makePositive(num) {
	return (num < 0) ? -num : num;
}

function randMax(max) {
	return Math.random()*max;
}

function setAttr(obj, attr) {
	for (let x in attr) {
		obj.setAttribute(x, attr[x]);
	}
}

class Animator {
	constructor(v, speed) {
		this.svg = v;
		this.spd = speed;
		
		this.radius = 0;
		this.elem = null;
		this.timer = null;
	}
	
	wrap(func) {
		/*
		let that = this;
		return function(...args) {
			func.apply(that, args);
		};
		*/
		console.log(func);
		func.bind(this);
	}
	
	init() {
		for (let func in this) {
			if (typeof this[func] === "function" && func !== "wrap") {
				this[func] = this.wrap(this[func]);
			}
		}
	}
	
	clear() {
		if (this.elem !== null) {
			this.svg.removeChild(this.elem);
		}
	}
	
	pulsingCircle() {
		console.log(this);
		this.clear();
		
		this.elem = document.createElementNS(SVG_NS, "circle");
		setAttr(that.elem, {
			cx: 0,
			cy: 0,
			r: 0,
		});
		
		let that = this;
		this.timer = setInterval(() => {
			that.elem.setAttribute("r", that.radius++);
			
			if (that.radius > that.svg.clientWidth/2 ||
				that.radius > that.svg.clientHeight/2) {
				that.radius *= -1;
			}
		}, 100);
		
	}
	
	bouncingCircle() {
		let that = this;
		
		let radius = 50;
		let posX = randMax(this.cvs.width-radius);
		let posY = randMax(this.cvs.width-radius);
		let angle = randMax(2*Math.PI);
		
		this.clear();
		
		(function temp() {
			that.stopAnim();
			
			//for the trail effect
			that.ctx.beginPath();
			that.ctx.fillStyle = `rgba(255, 255, 255, .15)`;
			that.ctx.rect(0, 0, that.cvs.width, that.cvs.height);
			that.ctx.fill();
			
			that.ctx.beginPath();
			that.ctx.fillStyle = "BlanchedAlmond";
			
			let vel = that.spd.value;
			/*
			angle pairings:
			top: 3PI/4 5PI/4, PI/4 7PI/4
			right: 7PI/4 5PI/4, PI/4 3PI/4
			bottom: 5PI/4 3PI/4, 7PI/4 PI/4
			left: 5PI/4 7PI/4, 3PI/4 PI/4
			*/
			
			if (	(posX >= that.cvs.width-radius) ||
				(posX <= 0+radius)) {
				if (angle > Math.PI) {
					angle = 3*Math.PI - angle;
				}
				else {
					angle = Math.PI - angle;
				}
			}
			else if (	(posY >= that.cvs.height-radius) ||
					(posY <= 0+radius)) { 
				angle = 2*Math.PI - angle;
			}
			
			posY += vel * Math.sin(angle);
			posX += vel * Math.cos(angle);
			
			if (posX < 0+radius) posX = radius;
			else if (posX > that.cvs.width-radius) {
				posX = that.cvs.width-radius;
			}
			else if (posY < 0+radius) posY = radius;
			else if (posY > that.cvs.height-radius) {
				posY = that.cvs.height-radius;
			}
			
			that.ctx.arc(posX, posY, radius, 0, 2*Math.PI);
			that.ctx.fill();
			that.ctx.stroke();
			
			that.requestId = window.requestAnimationFrame(temp);
		})();
	}
	
	stopAnim() {
		if (this.timer !== null) {
			clearInterval(timer);
			timer = null;
		}
	}
}

(function() {
	let svg = document.getElementById("boi");
	let speed = document.getElementById("speed");
	
	let anim = new Animator(svg, speed);
	anim.wrap(anim.clear);
	anim.wrap(anim.pulsingCircle);
	anim.wrap(anim.bouncingCircle);
	anim.wrap(anim.stopAnim);
	
	let start = document.getElementById("pulse");
	let stop = document.getElementById("stop");
	
	start.addEventListener("click", anim.pulsingCircle);
	bounce.addEventListener("click", anim.bouncingCircle);
	stop.addEventListener("click", anim.stopAnim);
})()

