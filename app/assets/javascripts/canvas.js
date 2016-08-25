var ADDPOINT_SIZE = 5.0;

function Canvas(canvas) {
	"use strict";
	// **** First some setup! ****
	
	this.canvas = canvas;
	this.width = canvas.width;
	this.height = canvas.height;
	this.ctx = canvas.getContext('2d');
	// This complicates things a little but but fixes mouse co-ordinate problems
	// when there's a border or padding. See getMouse for more detail
	var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop,
			html, myState, i;
	if (document.defaultView && document.defaultView.getComputedStyle) {
		this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null).paddingLeft, 10)      || 0;
		this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null).paddingTop, 10)       || 0;
		this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null).borderLeftWidth, 10)  || 0;
		this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null).borderTopWidth, 10)   || 0;
	}
	// Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
	// They will mess up mouse coordinates and this fixes that
	html = document.body.parentNode;
	this.htmlTop = html.offsetTop;
	this.htmlLeft = html.offsetLeft;

	// **** Keep track of state! ****
	
	this.valid = false; // when set to false, the canvas will redraw everything
	
	this.shapes = [];  // the collection of things to be drawn
	this.beacons = [];
	this.obstacles = [];
	this.doors = [];
	this.target_measured = [];
	this.target_estimated = [];

	this.scale_width = 1;
	this.scale_height = 1;


	this.dragging = false; // Keep track of when we are dragging
	this.isJoint = ""; // Keep track of whether we are at corner or edge of room
	this.addPoint = []; // Position to add object
	// the current selected object. In the future we could turn this into an array for multiple selection
	this.selection = null;
	this.selectionType = null;
	this.dragoffx = 0; // See mousedown and mousemove events for explanation
	this.dragoffy = 0;
	

	// **** Then events! ****

	myState = this;
	
	//fixes a problem where double clicking causes text to get selected on the canvas
	canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

	// Up, down, and move are for dragging
	canvas.addEventListener('mousedown', function(e) {
		var mouse, mx, my, l, i, mySel;

		mouse = myState.getMouse(e);
		mx = mouse.x;
		my = mouse.y;

		// check whether beacon is selected
		l = myState.beacons.length;
		for (i = l-1; i >= 0; i -= 1) {
			if (myState.beacons[i].contains(mx, my, myState.scale_width, myState.scale_height)) {
				mySel = myState.beacons[i];
				// Keep track of where in the object we clicked
				// so we can move it smoothly (see mousemove)
				myState.dragoffx = mx - mySel.x;
				myState.dragoffy = my - mySel.y;
				myState.dragging = true;
				myState.selection = mySel;
				myState.selectionType = "beacons";
				myState.valid = false;
				return;
			}
		}

		// check whether door is selected
		l = myState.doors.length;
		for (i = l-1; i >= 0; i -= 1) {
			if (myState.doors[i].contains(mx, my, myState.scale_width, myState.scale_height)) {
				mySel = myState.doors[i];
				// Keep track of where in the object we clicked
				// so we can move it smoothly (see mousemove)
				myState.dragoffx = mx - mySel.x;
				myState.dragoffy = my - mySel.y;
				myState.dragging = true;
				myState.selection = mySel;
				myState.selectionType = "doors";
				myState.valid = false;
				return;
			}
		}

		// check whether obstacle is selected
		l = myState.obstacles.length;
		for (i = l-1; i >= 0; i -= 1) {
			if (myState.obstacles[i].contains(mx, my)) {
				mySel = myState.obstacles[i];
				// Keep track of where in the object we clicked
				// so we can move it smoothly (see mousemove)
				myState.dragoffx = mx - mySel.x;
				myState.dragoffy = my - mySel.y;
				myState.dragging = true;
				myState.selection = mySel;
				myState.selectionType = "obstacles";
				myState.valid = false;
				return;
			}
		}

		// check whether room is selected
		l = myState.shapes.length;
		for (i = l-1; i >= 0; i -= 1) {
			if (myState.shapes[i].contains(mx, my)) {
				mySel = myState.shapes[i];
				// Keep track of where in the object we clicked
				// so we can move it smoothly (see mousemove)
				myState.dragoffx = mx - mySel.x;
				myState.dragoffy = my - mySel.y;
				myState.dragging = true;
				myState.selection = mySel;
				myState.selectionType = "shapes";
				myState.valid = false;
				return;
			}
		}


		// havent returned means we have failed to select anything.
		// If there was an object selected, we deselect it
		if (myState.selection) {
			myState.selection = null;
			myState.selectionType = null;
			myState.valid = false; // Need to clear the old selection border
		}
	}, true);

	canvas.addEventListener('mousemove', function(e) {
		var mouse = myState.getMouse(e),
				mx = mouse.x,
				my = mouse.y,
				self = this,
				shapes = myState.shapes,
				oldx, oldy, i, cur;

		this.style.cursor = 'auto';

		if (myState.dragging){
			mouse = myState.getMouse(e);
			// We don't want to drag the object by its top-left corner, we want to drag it
			// from where we clicked. Thats why we saved the offset and use it here
			myState.selection.x = mouse.x - myState.dragoffx;
			myState.selection.y = mouse.y - myState.dragoffy;   
			myState.valid = false; // Something's dragging so we must redraw
		} else {
			var l = shapes.length;
			for (i = 0; i < l; i += 1) {
				// check if at corner
				myState.isJoint = shapes[i].atCorner(mx,my,myState.scale_width);
				if (myState.isJoint.length > 0) {
					// alert(myState.isJoint);
					self.style.cursor = 'crosshair';
					break;
				}

				// check if at vertical edge
				myState.isJoint = shapes[i].atVerticalEdge(mx,my,myState.scale_width);
				if (myState.isJoint.length > 0) {
					// alert(myState.isJoint);
					self.style.cursor = 'crosshair';
					break;
				}

				// check if at horizontal edge
				myState.isJoint = shapes[i].atHorizontalEdge(mx,my,myState.scale_width);
				if (myState.isJoint.length > 0) {
					// alert(myState.isJoint);
					self.style.cursor = 'crosshair';
					break;
				}
			}

		}

	}, true);

	canvas.addEventListener('mouseup', function(e) {
		myState.dragging = false;

		// //------------- boundary checks ------------
		// //-------include this if don't want rooms to be dragged outside boundary
		// // ----------this causes issues with scaling canvas down however
		// if (myState.selection.x < 0) {
		// 	myState.selection.x = 0;
		// 	myState.valid = false; 
		// }
		// if (myState.selection.y < 0) {
		// 	myState.selection.y = 0;
		// 	myState.valid = false; 
		// }
		// if (myState.selection.x + myState.selection.w > this.width) {
		// 	myState.selection.x = this.width - myState.selection.w;
		// 	myState.valid = false; 
		// }
		// if (myState.selection.y + myState.selection.h > this.height) {
		// 	myState.selection.y = this.height - myState.selection.h;
		// 	myState.valid = false; 
		// }
		// -----------------------------------------------------

	}, true);

	// // double click for making new shapes
	// canvas.addEventListener('dblclick', function(e) {
	// 	if (myState.isJoint.length > 0) {
	// 		var text = prompt("Please enter room details in form \"width,height\"","100,100");
	// 		if (text != null) {
	// 			var str = text.split(',');
	// 			myState.addRoom(new Room(myState,parseInt(myState.isJoint[0]),parseInt(myState.isJoint[1]),parseInt(str[0]),parseInt(str[1])));
	// 		}
	// 	}
	// }, true);

	// double click for making new shapes
	canvas.addEventListener('dblclick', function(e) {
		myState.addPoint = []; 
		var mouse = myState.getMouse(e);

		if (myState.isJoint.length > 0) {
			myState.jointType = myState.isJoint[0];
			myState.addPoint = myState.isJoint[1];
		} else {
			myState.jointType = "";
			myState.addPoint = [mouse.x, mouse.y];
		}

		myState.valid = false;
	}, true);

	// canvas.oncontextmenu = function() {
	// 	document.getElementById('object_dialogue').style.display = "block";
	// 	return false;
	// }
	
	// **** Options! ****
	
	this.selectionColor = '#CC0000';
	// this.selectionWidth = 2;  
	this.interval = 30;
	setInterval(function() { myState.draw(); }, myState.interval);
}

Canvas.prototype.addRoom = function(shape) {
	"use strict";
	this.shapes.push(shape);
	this.valid = false;
};

Canvas.prototype.addBeacon = function(beacon) {
	"use strict";
	this.beacons.push(beacon);
	this.valid = false;
};

Canvas.prototype.addObstacle = function(obstacle) {
	"use strict";
	this.obstacles.push(obstacle);
	this.valid = false;
};

Canvas.prototype.addDoor = function(door) {
	"use strict";
	this.doors.push(door);
	this.valid = false;
};

Canvas.prototype.clear = function() {
	"use strict";
	this.ctx.clearRect(0, 0, this.width, this.height);
};

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
Canvas.prototype.draw = function() {
	"use strict";
	var ctx, shapes, beacons, obstacles, doors,target_measured, target_estimated, l, i, shape, addPoint;
	// if our state is invalid, redraw and validate!
	if (!this.valid) {
		ctx = this.ctx;
		shapes = this.shapes;
		beacons = this.beacons;
		obstacles = this.obstacles;
		doors = this.doors;
		target_measured = this.target_measured;
		target_estimated = this.target_estimated;
		addPoint = this.addPoint;
		this.clear();
		
		ctx.scale(this.scale_width,this.scale_height);
		// ** Add stuff you want drawn in the background all the time here **
	

		// draw selection
		// right now this is just a stroke along the edge of the selected Room
		if (this.selection !== null) {
			this.selection.setColor(this.selectionColor);
			// ctx.strokeStyle = this.selectionColor;
			// // ctx.lineWidth = this.selectionWidth;
			// ctx.lineWidth = LINE_WIDTH/this.scale_width;
			// mySel = this.selection;
			// ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);

		}


		// draw all shapes
		l = shapes.length;
		for (i = 0; i < l; i += 1) {
			shape = shapes[i];
			// We can skip the drawing of elements that have moved off the screen:
			if (shape.x <= this.width && shape.y <= this.height &&
					shape.x + shape.w >= 0 && shape.y + shape.h >= 0) {
				shapes[i].draw(ctx,this.scale_width);
			}
		}
		
	
		// ** Add stuff you want drawn on top all the time here **
		l = obstacles.length;
		for (i = 0; i < l; i += 1) {
			obstacles[i].draw(ctx);
		}

		l = doors.length;
		for (i = 0; i < l; i += 1) {
			doors[i].draw(ctx,this.scale_width,this.scale_height);
		}

		l = beacons.length;
		for (i = 0; i < l; i += 1) {
			beacons[i].draw(ctx,this.scale_width,this.scale_height);
		}

		if (target_measured.length != 0) {
			target_measured[0].draw(ctx,this.scale_width,this.scale_height);
		}

		if (target_estimated.length != 0) {
			target_estimated[0].draw(ctx,this.scale_width,this.scale_height);
		}

		// alert(addPoint.length);
		if(this.addPoint.length > 0) {
	     	ctx.fillStyle = 'green';
     		ctx.fillRect(parseInt(addPoint[0])-ADDPOINT_SIZE/this.scale_width/2, 
     			parseInt(addPoint[1])-ADDPOINT_SIZE/this.scale_height/2, 
     			ADDPOINT_SIZE/this.scale_width, ADDPOINT_SIZE/this.scale_height);

		}
		
		this.valid = true;
		ctx.scale(1.0/this.scale_width,1.0/this.scale_height);
		this.selection.restoreColor();

	}
};


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
Canvas.prototype.getMouse = function(e) {
	"use strict";
	var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
	
	// Compute the total offset
	if (element.offsetParent !== undefined) {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
			element = element.offsetParent;
		} while (element);
	}

	// Add padding and border style widths to offset
	// Also add the <html> offsets in case there's a position:fixed bar
	offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
	offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

	mx = e.pageX - offsetX;
	my = e.pageY - offsetY;
	
	//scale mx and my
	mx = mx*1.0/this.scale_width;
	my = my*1.0/this.scale_height;

	// alert(mx + " " + mx_scaled);

	// We return a simple javascript object (a hash) with x and y defined
	return {x: mx, y: my};
};

// Canvas.prototype.deleteRoom = function() {
// 	"use strict";
// 	var self = this;
// 	if (this.selection !== null) {
// 		self.shapes.splice(self.shapes.indexOf(this.selection),1);
// 	}
// 	this.selection = null;
// 	this.selectionType = null;
// 	this.valid = false;
// }

// Canvas.prototype.deleteBeacon = function() {
// 	"use strict";
// 	this.beacons.pop();
// 	this.valid = false;
// }

// Canvas.prototype.deleteObstacle = function() {
// 	"use strict";
// 	this.obstacles.pop();
// 	this.valid = false;
// }

Canvas.prototype.deleteObject = function() {
	"use strict";
	if (this.selection !== null) {
		if (this.selectionType === "shapes") {
			this.shapes.splice(this.shapes.indexOf(this.selection),1);
		} else if (this.selectionType === "obstacles") {
			this.obstacles.splice(this.obstacles.indexOf(this.selection),1);
		} else if (this.selectionType === "doors") {
			this.doors.splice(this.doors.indexOf(this.selection),1);
		} else if (this.selectionType === "beacons") {
			this.beacons.splice(this.beacons.indexOf(this.selection),1);
		}
	}
	this.selection = null;
	this.selectionType = null;
	this.valid = false;
}

// returns an array shapes in form of [x,y,w,h]
Canvas.prototype.getShapes = function() {
	"use strict";
	var arr = [];
	this.shapes.forEach( function(entry) {
		arr.push(entry.toArray());
	});
	return arr;
};

// updates the shape array with the_shapes
Canvas.prototype.setShapes = function(the_shapes) {
	var self = this;
	this.shapes = [];
	the_shapes.forEach( function(entry) {
		self.addRoom(new Room(this,parseInt(entry[0]),parseInt(entry[1]),parseInt(entry[2]),parseInt(entry[3])));
	});
	this.valid = false;
};

// returns shapes in string form of '[x y w h ; x2 y2 w2 h2 ; x3 y3 w3 h3; x4 y4 w4 h4 ;]'
Canvas.prototype.toStringShapes = function() {
	"use strict";
	var str = '[';
	this.shapes.forEach( function(entry) {
		str += entry.toString() + ';';
	});
	str += ']';
	return str;
};

// returns an array beacons in form of [id,x,y]
Canvas.prototype.getBeacons = function() {
	"use strict";
	var arr = [];
	this.beacons.forEach( function(entry) {
		arr.push(entry.toArray());
	});
	return arr;
};

// updates the beacon array with the_shapes
Canvas.prototype.setBeacons = function(the_beacons) {
	var self = this;
	this.beacons = [];
	the_beacons.forEach( function(entry) {
		self.addBeacon(new Beacon(this,parseInt(entry[0]),parseInt(entry[1]),parseInt(entry[2])));
	});
	this.valid = false;
};

// returns beacons in string form of '[id x y ; id2 x2 y2 ; id3 x3 y3; id4 x4 y4 ;]'
Canvas.prototype.toStringBeacons = function() {
	"use strict";
	var str = '[';
	this.beacons.forEach( function(entry) {
		str += entry.toString() + ';';
	});
	str += ']';
	return str;
};

// returns an array obstacles in form of [x,y,w,h]
Canvas.prototype.getObstacles = function() {
	"use strict";
	var arr = [];
	this.obstacles.forEach( function(entry) {
		arr.push(entry.toArray());
	});
	return arr;
};

// updates the beacon array with the_shapes
Canvas.prototype.setObstacles = function(the_obstacles) {
	var self = this;
	this.obstacles = [];
	the_obstacles.forEach( function(entry) {
		self.addObstacle(new Obstacle(this,parseInt(entry[0]),parseInt(entry[1]),parseInt(entry[2]),parseInt(entry[3])));
	});
	this.valid = false;
};

// returns obstacles in string form of '[x y w h ; x2 y2 w2 h2 ; x3 y3 w3 h3; x4 y4 w4 h4 ;]'
Canvas.prototype.toStringObstacles = function() {
	"use strict";
	var str = '[';
	this.obstacles.forEach( function(entry) {
		str += entry.toString() + ';';
	});
	str += ']';
	return str;
};

// returns an array doors in form of [x,y,w,h]
Canvas.prototype.getDoors = function() {
	"use strict";
	var arr = [];
	this.doors.forEach( function(entry) {
		arr.push(entry.toArray());
	});
	return arr;
};

// updates the beacon array with the_shapes
Canvas.prototype.setDoors = function(the_doors) {
	var self = this;
	this.doors = [];
	the_doors.forEach( function(entry) {
		self.addDoor(new Door(this,parseInt(entry[0]),parseInt(entry[1]),parseInt(entry[2]),parseInt(entry[3])));
	});
	this.valid = false;
};

// returns doors in string form of '[x y w h ; x2 y2 w2 h2 ; x3 y3 w3 h3; x4 y4 w4 h4 ;]'
Canvas.prototype.toStringDoors = function() {
	"use strict";
	var str = '[';
	this.doors.forEach( function(entry) {
		str += entry.toString() + ';';
	});
	str += ']';
	return str;
};

Canvas.prototype.setTarget = function(estimated_x,estimated_y,measured_x,measured_y) {
	"use strict";
	this.target_measured.pop();
	this.target_estimated.pop();

	this.target_estimated.push(new Target(this,estimated_x,estimated_y,"#00FF00"));
	this.target_measured.push(new Target(this,measured_x,measured_y,"#FF0000"));
	// alert(estimated_x + " " + estimated_y + " " + measured_x + " " + measured_y);
	this.valid = false;
}

Canvas.prototype.setScale = function(scale_width,scale_height) {
	this.scale_width = scale_width;
	this.scale_height = scale_height;
}

// // returns an array shapes in form of [x,y,w,h]
// Canvas.prototype.getWalls = function() {
// 	"use strict";
// 	var arr = [];
// 	this.shapes.forEach( function(entry) {
// 		arr.push(entry.toArray());
// 	});
// 	return arr;
// };