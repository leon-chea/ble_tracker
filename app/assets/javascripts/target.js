var TARGET_WIDTH = 10.0;
var TARGET_HEIGHT = 10.0;
// Constructor for target objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.
function Target(state, x, y, color) {
	"use strict";

	this.state = state;
	this.x = x;
	this.y = y;
	this.color = color;

}


// Draws this shape to a given context
Target.prototype.draw = function(ctx,scale_width,scale_height) {
	"use strict";

	ctx.fillStyle = this.color;
	ctx.fillRect(this.x-TARGET_WIDTH/scale_width/2, this.y-TARGET_HEIGHT/scale_height/2, TARGET_WIDTH/scale_width, TARGET_HEIGHT/scale_height);
};

// Target.prototype.toArray = function() {
// 	"use strict"

// 	return [this.x,this.y];
// };

// Target.prototype.toString = function() {
// 	"use strict"

// 	return this.x.toString() + " "  + this.y.toString();
// };