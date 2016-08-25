var DOOR_COLOR = "#FFFFFF"
var DOOR_OFFSET = 0.75
var DOOR_ALTLENGTH = 2.25

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
Door.prototype.draw = function(ctx, scale_width, scale_height) {
	"use strict";
	ctx.fillStyle = this.color;
	if (this.w == 0) {
		ctx.fillRect(this.x-DOOR_OFFSET/scale_width,this.y,DOOR_ALTLENGTH/scale_width,this.h);		
	} else {
		ctx.fillRect(this.x,this.y-DOOR_OFFSET/scale_height,this.w,DOOR_ALTLENGTH/scale_height);		
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
Door.prototype.contains = function(mx, my, scale_width, scale_height) {
	"use strict";
	if (this.w == 0) {
		return  (this.x-DOOR_OFFSET/scale_width <= mx) && (this.x-DOOR_OFFSET/scale_width + DOOR_ALTLENGTH/scale_width >= mx) && (this.y <= my) && (this.y + this.h >= my);
	} else {
		return  (this.x <= mx) && (this.x + this.w >= mx) && (this.y-DOOR_OFFSET/scale_height <= my) && (this.y-DOOR_OFFSET/scale_height + DOOR_ALTLENGTH/scale_height >= my);
	}



	// return  (this.x <= mx) && (this.x + this.w >= mx) && (this.y <= my) && (this.y + this.h >= my);

};

Door.prototype.toArray = function() {
	"use strict"

	return [this.x,this.y,this.w,this.h];
};

Door.prototype.toString = function() {
	"use strict"

	return this.x.toString() + " "  + this.y.toString() + " " + this.w.toString() + " " + this.h.toString();
};