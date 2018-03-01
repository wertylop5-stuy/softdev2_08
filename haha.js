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
	
	clear() {
		if (this.elem !== null) {
			this.svg.removeChild(this.elem);
		}
		clearInterval(this.timer);
		this.radius = 0;
	}
	
	pulsingCircle() {
		let cx = this.svg.getAttribute("width")/2;
		let cy = this.svg.getAttribute("height")/2;
		
		this.clear();
		
		this.elem = document.createElementNS(SVG_NS, "circle");
		setAttr(this.elem, {
			cx,
			cy,
			r: 0,
			fill: "BlanchedAlmond",
			stroke: "black"
		});
		
		this.svg.appendChild(this.elem);
		let that = this;
		this.timer = setInterval(() => {
			that.elem.setAttribute("r", makePositive(that.radius++));
			
			if (that.radius > cx || that.radius > cy) {
				that.radius *= -1;
			}
		}, 10);
		
	}
	
	bouncingCircle() {
		let that = this;
		let maxX = this.svg.getAttribute("width");
		let maxY = this.svg.getAttribute("height");
		
		let radius = 50;
		let posX = randMax(maxX);
		let posY = randMax(maxY);
		let angle = randMax(2*Math.PI);
		
		this.clear();
		
		this.elem = document.createElementNS(SVG_NS, "circle");
		setAttr(this.elem, {
			cx: posX,
			cy: posY,
			r: radius,
			fill: "BlanchedAlmond",
			stroke: "black"
		});
		this.svg.appendChild(that.elem);
		
		this.timer = setInterval(() => {
			let vel = that.spd.value;
			
			if (	(posX >= maxX-radius) ||
				(posX <= 0+radius)) {
				if (angle > Math.PI) {
					angle = 3*Math.PI - angle;
				}
				else {
					angle = Math.PI - angle;
				}
			}
			else if (	(posY >= maxY-radius) ||
					(posY <= 0+radius)) { 
				angle = 2*Math.PI - angle;
			}
			
			posY += vel * Math.sin(angle);
			posX += vel * Math.cos(angle);
			
			that.elem.setAttribute("cx", posX);
			that.elem.setAttribute("cy", posY);
			
			if (posX < 0+radius) {
				posX = radius;
			}
			else if (posX > maxX-radius) {
				posX = maxX-radius;
			}
			else if (posY < 0+radius) {
				posY = radius;
			}
			else if (posY > maxY-radius) {
				posY = maxY-radius;
			}

			that.elem.setAttribute("cx", posX);
			that.elem.setAttribute("cy", posY);

			
		}, 10);
	}
	
	stopAnim() {
		if (this.timer !== null) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}
}

(() => {
	let svg = document.getElementById("boi");
	let speed = document.getElementById("speed");
	
	let anim = new Animator(svg, speed);
	let start = document.getElementById("pulse");
	let stop = document.getElementById("stop");
	
	start.addEventListener("click", () => {
		anim.pulsingCircle();
	});
	bounce.addEventListener("click", () => {
		anim.bouncingCircle();
	});
	stop.addEventListener("click", () => {
		anim.stopAnim();
	});
})()

