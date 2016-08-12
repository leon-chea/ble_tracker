var BEACON_COLOR = "#000000"
var BEACON_WIDTH = 10.0;
var BEACON_HEIGHT = 10.0;
// Constructor for Beacon objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.
function Beacon(state, id, x, y) {
	"use strict";

	this.state = state;
	this.id = id;
	this.x = x;
	this.y = y;
	this.w = BEACON_WIDTH;
	this.h = BEACON_HEIGHT;
	this.color = BEACON_COLOR;

}


// Draws this shape to a given context
Beacon.prototype.draw = function(ctx,scale_width,scale_height) {
	"use strict";

	ctx.fillStyle = this.color;
	ctx.fillRect(this.x-BEACON_WIDTH/scale_width/2, this.y-BEACON_HEIGHT/scale_height/2, BEACON_WIDTH/scale_width, BEACON_HEIGHT/scale_height);
};

// Change color of shape
Beacon.prototype.setColor = function(color) {
	this.color = color;
};

// Restore original color of shape
Beacon.prototype.restoreColor = function() {
	this.color = ROOM_COLOR;
};

// Determine if a point is inside the bounds of the rectangle
Beacon.prototype.contains = function(mx, my, scale_width, scale_height) {
	"use strict";
	// alert(mx + " " + this.x);
	return  (this.x-BEACON_WIDTH/scale_width/2 <= mx) && (this.x-BEACON_WIDTH/scale_width/2 + BEACON_WIDTH/scale_width >= mx) && 
		(this.y-BEACON_HEIGHT/scale_height/2 <= my) && (this.y-BEACON_HEIGHT/scale_height/2 + BEACON_HEIGHT/scale_height >= my);
};

Beacon.prototype.toArray = function() {
	"use strict"

	return [this.id,this.x,this.y];
};

Beacon.prototype.toString = function() {
	"use strict"

	return this.id.toString() + " " + this.x.toString() + " "  + this.y.toString();
};