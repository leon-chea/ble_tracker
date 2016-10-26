var OBSTACLE_COLOR = "#888888"

// Constructor for Obstacle objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.
function Obstacle(state, x, y, w, h) {
	"use strict";

	this.state = state;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = OBSTACLE_COLOR;

}


// Draws this shape to a given context
Obstacle.prototype.draw = function(ctx) {
	"use strict";

	ctx.fillStyle = this.color;
	ctx.fillRect(this.x,this.y,this.w,this.h);		
};

// Change color of shape
Obstacle.prototype.setColor = function(color) {
	this.color = color;
};

// Restore original color of shape
Obstacle.prototype.restoreColor = function() {
	this.color = OBSTACLE_COLOR;
};

// Determine if a point is inside the bounds of the rectangle
Obstacle.prototype.contains = function(mx, my) {
	"use strict";

	return  (this.x <= mx) && (this.x + this.w >= mx) && (this.y <= my) && (this.y + this.h >= my);
};

Obstacle.prototype.toArray = function() {
	"use strict"

	return [this.x,this.y,this.w,this.h];
};

Obstacle.prototype.toString = function() {
	"use strict"

	return this.x.toString() + " "  + this.y.toString() + " " + this.w.toString() + " " + this.h.toString();
};