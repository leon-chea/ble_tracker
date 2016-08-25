var ROOM_COLOR = "#0000FF"
var LINE_WIDTH = 1.0
var CLICK_SPACE = 3.0
// Constructor for Room objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.
function Room(state, x, y, w, h) {
	"use strict";
	// This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
	// "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
	// But we aren't checking anything else! We could put "Lalala" for the value of x 
	this.state = state;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = ROOM_COLOR;

}


// Draws this shape to a given context
Room.prototype.draw = function(ctx,scale_width) {
	"use strict";
	var i, cur, half;
	ctx.strokeStyle = this.color;
	ctx.lineWidth = LINE_WIDTH/scale_width;
	ctx.strokeRect(this.x, this.y, this.w, this.h);
	if (this.state.selection === this) {
		ctx.strokeStyle = this.state.selectionColor;
		// ctx.lineWidth = this.state.selectionWidth;
		ctx.strokeRect(this.x,this.y,this.w,this.h);		
	}
};

// Change color of shape
Room.prototype.setColor = function(color) {
	this.color = color;
};

// Restore original color of shape
Room.prototype.restoreColor = function() {
	this.color = ROOM_COLOR;
};

// Determine if a point is inside the bounds of the rectangle
Room.prototype.contains = function(mx, my) {
	"use strict";

	return  (this.x <= mx) && (this.x + this.w >= mx) && (this.y <= my) && (this.y + this.h >= my);
};

// Determine if cursor is at room corner
Room.prototype.atCorner = function(mx, my, scale_width) {
	"use strict";

	var click_space = CLICK_SPACE/scale_width;

	if ((this.x - click_space <= mx) && (this.x + click_space >= mx) && (this.y - click_space <= my) && (this.y + click_space >= my)) {
		return ["corner",[this.x, this.y]];
	} else if (((this.x + this.w) - click_space <= mx) && ((this.x + this.w) + click_space >= mx) && (this.y - click_space <= my) && (this.y + click_space >= my)) {
		return ["corner",[this.x + this.w, this.y]];
	} else if ((this.x - click_space <= mx) && (this.x + click_space >= mx) && ((this.y + this.h) - click_space <= my) && ((this.y + this.h) + click_space >= my)) {
		return ["corner",[this.x, this.y + this.h]];
	} else if (((this.x + this.w) - click_space <= mx) && ((this.x + this.w) + click_space >= mx) && ((this.y + this.h) - click_space <= my) && ((this.y + this.h) + click_space >= my)) {
		return ["corner",[this.x + this.w, this.y + this.h]];
	}
	return [];
};

// Determine if cursor is at vertical edge
Room.prototype.atVerticalEdge = function(mx, my, scale_width) {
	"use strict";

	var click_space = CLICK_SPACE/scale_width;

	if ((this.x - click_space <= mx) && (this.x + click_space >= mx) && (this.y <= my) && (this.y + this.h >= my)) {
		return ["vertical",[this.x, my]];
	} else if (((this.x + this.w) - click_space <= mx) && ((this.x + this.w) + click_space >= mx) && (this.y <= my) && (this.y + this.h >= my)) {
		return ["vertical",[this.x + this.w, my]];
	}
	return [];
};

// Determine if cursor is at horizontal edge
Room.prototype.atHorizontalEdge = function(mx, my, scale_width) {
	"use strict";

	var click_space = CLICK_SPACE/scale_width;

	if ((this.y - click_space <= my) && (this.y + click_space >= my) && (this.x <= mx) && (this.x + this.w >= mx)) {
		return ["horizontal",[mx, this.y]];
	} else if (((this.y + this.h) - click_space <= my) && ((this.y + this.h) + click_space >= my) && (this.x <= mx) && (this.x + this.w >= mx)) {
		return ["horizontal",[mx, this.y + this.h]];
	}
	return [];
};

Room.prototype.toArray = function() {
	return [this.x,this.y,this.w,this.h];
};

Room.prototype.toString = function() {
	"use strict"

	return this.x.toString() + " "  + this.y.toString() + " " + this.w.toString() + " " + this.h.toString();
};

// Room.prototype.getWalls = function() {
// 	return [this.x,this.x+this.w],[this];
// }