var DOOR_COLOR = "#FFFFFF"

// Constructor for Door objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.
function Door(state, x, y, w, h) {
	"use strict";

	this.state = state;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = DOOR_COLOR;

}


// Draws this shape to a given context
Door.prototype.draw = function(ctx) {
	"use strict";

	ctx.fillStyle = this.color;
	if (this.w == 0) {
		ctx.fillRect(this.x-2,this.y,6,this.h);		
	} else {
		ctx.fillRect(this.x,this.y-2,this.w,6);		
	}
};

// Change color of shape
Door.prototype.setColor = function(color) {
	this.color = color;
};

// Restore original color of shape
Door.prototype.restoreColor = function() {
	this.color = DOOR_COLOR;
};

// Determine if a point is inside the bounds of the rectangle
Door.prototype.contains = function(mx, my) {
	"use strict";
	// alert(mx + " " + this.x);
	return  (this.x <= mx) && (this.x + this.w >= mx) && (this.y <= my) && (this.y + this.h >= my);
};

Door.prototype.toArray = function() {
	"use strict"

	return [this.x,this.y,this.w,this.h];
};

Door.prototype.toString = function() {
	"use strict"

	return this.x.toString() + " "  + this.y.toString() + " " + this.w.toString() + " " + this.h.toString();
};