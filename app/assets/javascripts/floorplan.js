// If you dont want to use <body onLoad='init()'>
// You could uncomment this init() reference and place the script reference inside the body tag
//init();
var DISPLAY_WIDTH = 300.0;
var DISPLAY_HEIGHT = 300.0;

var prevText = "0,0,100,100";


function main() {
	"use strict";

    if (!localStorage){
    	alert("ERROR: localStorage unavailable.");
    }

	document.getElementById("dummy").innerText = document.createTextNode("revision:" + 59).textContent;


	var canvas = new Canvas(document.getElementById('canvas'));

	document.getElementById('canvas').width = DISPLAY_WIDTH;
	document.getElementById('canvas').height = DISPLAY_HEIGHT;

	if ((localStorage.getItem("dimensions_width") == null) || (localStorage.getItem("dimensions_height") == null)) {
		resizeBorder(canvas);
	}
	updateCanvasSize(canvas,parseFloat(localStorage.getItem("dimensions_width")),parseFloat(localStorage.getItem("dimensions_height")));

	canvas.setShapes(JSON.parse(localStorage.getItem("shapes")));
	canvas.setBeacons(JSON.parse(localStorage.getItem("beacons")));
	canvas.setObstacles(JSON.parse(localStorage.getItem("obstacles")));
	canvas.setDoors(JSON.parse(localStorage.getItem("doors")));


	// document.getElementById("dummy").innerText = document.createTextNode(localStorage.getItem("doors")).textContent;


	// s.addRoom(new Room(s, 260, 70, 60, 65));
	// s.addRoom(new Room(s, 240, 120, 40, 40));  
	// s.addRoom(new Room(s, 5, 60, 25, 25));

	document.getElementById("resize_border").onclick = function() {
  		resizeBorder(canvas);
	};

	document.getElementById("add").onclick = function() {
		document.getElementById('object_dialogue').style.display = "block";
	};

	document.getElementById("delete").onclick = function() {
		canvas.deleteObject();
	};

	// document.getElementById("new_room").onclick = function() {
 //  		newRoom(canvas);
	// };

	// document.getElementById("new_door").onclick = function() {
 //  		newDoor(canvas);
	// };

	// document.getElementById("delete_door").onclick = function() {
 //  		deleteDoor(canvas);
	// };

	// document.getElementById("new_obstacle").onclick = function() {
 //  		newObstacle(canvas);
	// };

	// document.getElementById("delete_obstacle").onclick = function() {
 //  		deleteObstacle(canvas);
	// };

	// document.getElementById("add_beacon").onclick = function() {
 //  		addBeacon(canvas);
	// };

	// document.getElementById("delete_beacon").onclick = function() {
 //  		deleteBeacon(canvas);
	// };

	document.getElementById("save").onclick = function() {
  		save(canvas);
	};


	//----------------------ADD OBJECT DIALOGUE------------------------------//
	document.getElementById("add_object").onclick = function() {
		var form = document.getElementById("object_form");

		for (var i=0; i<4; i++) {
			if (form.elements[i].checked) {
				document.getElementById('object_dialogue').style.display = "none";
				document.getElementById(form.elements[i].value + '_dialogue').style.display = "block";
		
				// add in default values based on addPoint
				if (canvas.addPoint.length > 0) {
					var nextForm = document.getElementById(form.elements[i].value +'_form');
					nextForm.elements[0].value = parseInt(canvas.addPoint[0]);
					nextForm.elements[1].value = parseInt(canvas.addPoint[1]);
				}

			}
		}
	};

	document.getElementById("cancel_object").onclick = function() {
		document.getElementById('object_dialogue').style.display = "none";
	};
	//---------------------------------------------------------------------//



	//----------------------ADD ROOM DIALOGUE------------------------------//
	document.getElementById("add_room").onclick = function() {
		var form = document.getElementById("room_form");

		var x = parseInt(form.elements[0].value);
		var y = parseInt(form.elements[1].value);
		var w = parseInt(form.elements[2].value);
		var h = parseInt(form.elements[3].value);

		if ((x>=0) && (y>=0) && (w>0) && (h>0)) {
			canvas.addRoom(new Room(canvas,x,y,w,h));
			document.getElementById('room_dialogue').style.display = "none";
		} else {
			alert("Please fill in all fields with proper values.");
		}

	};

	document.getElementById("cancel_room").onclick = function() {
		document.getElementById('room_dialogue').style.display = "none";
	};
	//---------------------------------------------------------------------//


	//----------------------ADD DOOR DIALOGUE------------------------------//
	document.getElementById("add_door").onclick = function() {
		var form = document.getElementById("door_form");

		var x = parseInt(form.elements[0].value);
		var y = parseInt(form.elements[1].value);
		var w = parseInt(form.elements[2].value);
		var h = parseInt(form.elements[3].value);

		if ((x>=0) && (y>=0) && (w>=0) && (h>=0)) {
			canvas.addDoor(new Door(canvas,x,y,w,h));
			document.getElementById('door_dialogue').style.display = "none";
		} else {
			alert("Please fill in all fields with proper values.");
		}

	};

	document.getElementById("cancel_door").onclick = function() {
		document.getElementById('door_dialogue').style.display = "none";
	};
	//---------------------------------------------------------------------//


	//----------------------ADD OBSTACLE DIALOGUE------------------------------//
	document.getElementById("add_obstacle").onclick = function() {
		var form = document.getElementById("obstacle_form");

		var x = parseInt(form.elements[0].value);
		var y = parseInt(form.elements[1].value);
		var w = parseInt(form.elements[2].value);
		var h = parseInt(form.elements[3].value);

		if ((x>=0) && (y>=0) && (w>0) && (h>0)) {
			canvas.addObstacle(new Obstacle(canvas,x,y,w,h));
			document.getElementById('obstacle_dialogue').style.display = "none";
		} else {
			alert("Please fill in all fields with proper values.");
		}

	};

	document.getElementById("cancel_obstacle").onclick = function() {
		document.getElementById('obstacle_dialogue').style.display = "none";
	};
	//---------------------------------------------------------------------//



	//----------------------ADD BEACON DIALOGUE------------------------------//
	document.getElementById("add_beacon").onclick = function() {
		var form = document.getElementById("beacon_form");

		var x = parseInt(form.elements[0].value);
		var y = parseInt(form.elements[1].value);
		var id = parseInt(form.elements[2].value);


		if ((id>0) && (x>=0) && (y>=0)) {
			canvas.addBeacon(new Beacon(canvas,id,x,y));
			document.getElementById('beacon_dialogue').style.display = "none";
		} else {
			alert("Please fill in all fields with proper values.");
		}

	};

	document.getElementById("cancel_beacon").onclick = function() {
		document.getElementById('beacon_dialogue').style.display = "none";
	};
	//---------------------------------------------------------------------//



}

function updateCanvasSize(state,width,height) {
	var scale_width = DISPLAY_WIDTH/width;
	var scale_height = DISPLAY_HEIGHT/height;

	// canvas_width = parseInt(width*scale_width);
	// canvas_height = parseInt(height*scale_height);
	state.setScale(scale_width,scale_height);
	state.width = width;
	state.height = height;
}

function resizeBorder(state) {
	var text = prompt("Please enter new dimensions in form \"width,height\"", localStorage.getItem("dimensions_width") + "," + localStorage.getItem("dimensions_height"));
	if (text != null) {
		var str = text.split(',');

		canvas_width = parseInt(str[0]);
		canvas_height = parseInt(str[1]);

	    localStorage.setItem("dimensions_width",canvas_width);
    	localStorage.setItem("dimensions_height",canvas_height);

		updateCanvasSize(state,parseFloat(canvas_width),parseFloat(canvas_height));
	}
	state.valid = false;
}


function save(state) {
	alert("Changes saved.");

    localStorage.setItem("shapes",JSON.stringify(state.getShapes()));
    localStorage.setItem("beacons",JSON.stringify(state.getBeacons()));
    localStorage.setItem("obstacles",JSON.stringify(state.getObstacles()));
    localStorage.setItem("doors",JSON.stringify(state.getDoors()));

    localStorage.setItem("A","[1 1 0 0 ; 0 1 0 0 ; 0 0 1 1 ; 0 0 0 1]");
    localStorage.setItem("H","[1 0 0 0 ; 0 0 1 0]");
    localStorage.setItem("Q","[1/3 1/2 0 0 ; 1/2 1 0 0  ; 0 0 4/3 4/2 ; 0 0 4/2 4 ]");
    localStorage.setItem("R","[1 0 ; 0 1]");

	$(function() {

		$.ajax({
			url:"/home/modify",
			type:"post",
			// data: {'id':102,'name':'bob'},
			data: {
				'dimensions_width': localStorage.getItem("dimensions_width"),
				'dimensions_height': localStorage.getItem("dimensions_height")
			},
			error: function() {
				alert("ERROR with AJAX");
			}
		})
	});


}


// function newRoom(state) {
// 	// var text = prompt("Please enter room details in form \"x_start,y_start,wdith,height\"",prevText);
// 	// if (text != null) {
// 	// 	prevText = text;
// 	// 	var str = text.split(',');
// 	// 	state.addRoom(new Room(state,parseInt(str[0]),parseInt(str[1]),parseInt(str[2]),parseInt(str[3])));
// 	// }
// }



// function newDoor(state) {
// 	var text = prompt("Please enter door coordinates in form \"x,y,w,h\"","0,0,0,0");
// 	if (text != null) {
// 		var str = text.split(',');
// 		state.addDoor(new Door(state,parseInt(str[0]),parseInt(str[1]),parseInt(str[2]),parseInt(str[3])));
// 	}
// }

// // function deleteDoor(state) {
// // 	state.deleteDoor();
// // }

// function newObstacle(state) {
// 	var text = prompt("Please enter obstacle coordinates in form \"x,y,w,h\"","0,0,0,0");
// 	if (text != null) {
// 		var str = text.split(',');
// 		state.addObstacle(new Obstacle(state,parseInt(str[0]),parseInt(str[1]),parseInt(str[2]),parseInt(str[3])));
// 	}
// }

// // function deleteObstacle(state) {
// // 	state.deleteObstacle();
// // }


// function addBeacon(state) {
// 	var text = prompt("Please enter beacon coordinates in form \"id,x,y\"","0,0,0");
// 	if (text != null) {
// 		var str = text.split(',');
// 		state.addBeacon(new Beacon(state,parseInt(str[0]),parseInt(str[1]),parseInt(str[2])));
// 	}
// }

// function deleteBeacon(state) {
// 	state.deleteBeacon();
// }




// function startTracking() {
// 	alert("good_");

// }



// // goes through outlines of all rooms and collates all edges
// function getAllEdges(state) {
	
// }


	// var s = new Canvas(document.getElementById('canvas1'));
	// // add a large green rectangle
	// s.addRoom(new Room(s, 260, 70, 60, 65));
	

// var canvas = document.getElementById('canvas1');
// var context = canvas.getContext('2d');

// canvas.addRoom(new Room(context, 260, 70, 60, 65));





// })();