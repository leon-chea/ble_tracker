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

	// document.getElementById("dummy").innerText = document.createTextNode("revision:" + 59).textContent;


	var canvas = new Canvas(document.getElementById('canvas'));

	document.getElementById('canvas').width = DISPLAY_WIDTH;
	document.getElementById('canvas').height = DISPLAY_HEIGHT;

	loadData(gon.current_map);

	if ((localStorage.getItem("dimensions_width") == null) || (localStorage.getItem("dimensions_height") == null)) {
		document.getElementById('resize_dialogue').style.display = "block";
	}
	updateCanvasSize(canvas,parseFloat(localStorage.getItem("dimensions_width")),parseFloat(localStorage.getItem("dimensions_height")));


	if ((localStorage.getItem("shapes") === null) || (localStorage.getItem("shapes") == "null")) {
    	localStorage.setItem("shapes","[]");
    	localStorage.setItem("beacons","[]");
    	localStorage.setItem("obstacles","[]");
    	localStorage.setItem("doors","[]");
	}
	canvas.setShapes(JSON.parse(localStorage.getItem("shapes")));
	canvas.setBeacons(JSON.parse(localStorage.getItem("beacons")));
	canvas.setObstacles(JSON.parse(localStorage.getItem("obstacles")));
	canvas.setDoors(JSON.parse(localStorage.getItem("doors")));

	// document.getElementById("dummy").innerText = document.createTextNode(localStorage.getItem("shapes") + " " + localStorage.getItem("doors") + " " + localStorage.getItem("obstacles") + " " + localStorage.getItem("beacons")).textContent; 


	 document.getElementById('floor').src = "data:image/png;base64," + localStorage.getItem("image");

	// s.addRoom(new Room(s, 260, 70, 60, 65));
	// s.addRoom(new Room(s, 240, 120, 40, 40));  
	// s.addRoom(new Room(s, 5, 60, 25, 25));

	document.getElementById("resize_border").onclick = function() {
		document.getElementById('resize_dialogue').style.display = "block";
	};

	document.getElementById("grid").onclick = function() {
		canvas.gridToggle();
	};

	document.getElementById("add").onclick = function() {
//--------UNCOMMENT IF WANT ADD ROOM ONLY IF CURSOR AT ANOTHER CORNER
		// if (canvas.jointType=="corner") {
		// 	document.getElementById("radio_room").disabled = false;
		// } else {
		// 	document.getElementById("radio_room").disabled = true;
		// 	document.getElementById("radio_room").checked = false;
		// }
//---------------------

		if ((canvas.jointType=="vertical") || (canvas.jointType=="horizontal")) {
			document.getElementById("radio_door").disabled = false;
		} else {
			document.getElementById("radio_door").disabled = true;
			document.getElementById("radio_door").checked = false;
		}

		document.getElementById('object_dialogue').style.display = "block";
	};

	document.getElementById("delete").onclick = function() {
		canvas.deleteObject();
	};

	document.getElementById("new_map").onclick = function() {
		document.getElementById('map_dialogue').style.display = "block";
	}

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


	// change map
	gon.maps.forEach(function(map) {
		document.getElementById("change_map_"+map['name']).onclick = function() {

			$(function() {

				$.ajax({
					url:"/home/modify",
					type:"post",
					data: {
						'change_map': map['name']
					},
					error: function() {
						alert("ERROR: AJAX not working.");
					}
				})
			});

		    localStorage.setItem("dimensions_width",map['width']);
		    localStorage.setItem("dimensions_height",map['height']);
		    localStorage.setItem("shapes",map['shapes']);
		    localStorage.setItem("beacons",map['beacons']);
		    localStorage.setItem("obstacles",map['obstacles']);
		    localStorage.setItem("doors",map['doors']);

		};
	});

	// document.getElementById("change_map").onclick = function() {
 //  		alert(document.getElementById("change_map").value);
	// };


	//----------------------RESIZE MAP DIALOGUE------------------------------//
	document.getElementById("ok_resize").onclick = function() {
		var form = document.getElementById("resize_form");

		var w = parseInt(form.elements[0].value);
		var h = parseInt(form.elements[1].value);

		if ((w>0) && (h>0)) {
			document.getElementById('resize_dialogue').style.display = "none";
	    
			updateCanvasSize(canvas,parseFloat(w),parseFloat(h));

		} else {
			alert("ERROR: Invalid fields entered.");
		}

		canvas.valid = false;

	};

	document.getElementById("cancel_resize").onclick = function() {
		document.getElementById('resize_dialogue').style.display = "none";
	};
	//---------------------------------------------------------------------//


	//----------------------ADD MAP DIALOGUE------------------------------//
	document.getElementById("add_map").onclick = function() {
		var form = document.getElementById("map_form");

		var name = form.elements[0].value;
		var w = parseInt(form.elements[1].value);
		var h = parseInt(form.elements[2].value);

		if ((name.length>0) && (w>0) && (h>0)) {
			document.getElementById('map_dialogue').style.display = "none";

			$(function() {

				$.ajax({
					url:"/home/modify",
					type:"post",
					data: {
						'new_map': name,
						'width': w,
						'height': h
					},
					error: function() {
						alert("ERROR: AJAX not working.");
					}
				})
			});

		} else {
			alert("ERROR: Invalid fields entered.");
		}

	};

	document.getElementById("cancel_map").onclick = function() {
		document.getElementById('map_dialogue').style.display = "none";
	};
	//---------------------------------------------------------------------//


		
	

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


		// Modify door dialogue based on jointType
		if (canvas.jointType=="vertical") {
			document.getElementById("upwards").innerHTML = "Open Upwards";
			document.getElementById("downwards").innerHTML = "Open Downwards";
		}  else if (canvas.jointType=="horizontal") {
			document.getElementById("upwards").innerHTML = "Open Leftwards";
			document.getElementById("downwards").innerHTML = "Open Rightwards";
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
			alert("ERROR: Invalid fields entered.");
		}

	};

	document.getElementById("cancel_room").onclick = function() {
		document.getElementById('room_dialogue').style.display = "none";
	};
	//---------------------------------------------------------------------//


	//----------------------ADD DOOR DIALOGUE------------------------------//
	document.getElementById("add_door").onclick = function() {
		var form = document.getElementById("door_form");

		var x, y, w, h;

		if (canvas.jointType=="vertical") {
			if (form.elements[3].checked) {
			 	// open upwards
			 	w = 0;
			 	h = parseInt(form.elements[2].value);
			 	x = parseInt(form.elements[0].value);
			 	y = parseInt(form.elements[1].value) - h;
			} else {
				// open downwards
				w = 0;
			 	h = parseInt(form.elements[2].value);
			 	x = parseInt(form.elements[0].value);
			 	y = parseInt(form.elements[1].value);
			} 
		} else if (canvas.jointType=="horizontal") {
			if (form.elements[3].checked) {
			 	// open leftwards
			 	w = parseInt(form.elements[2].value);
			 	h = 0
			 	x = parseInt(form.elements[0].value) - w;
			 	y = parseInt(form.elements[1].value);
			} else {
				// open downwards
				w = parseInt(form.elements[2].value);
			 	h = 0
			 	x = parseInt(form.elements[0].value);
			 	y = parseInt(form.elements[1].value);
			}
		}


		if ((x>=0) && (y>=0) && (w>=0) && (h>=0)) {
			canvas.addDoor(new Door(canvas,x,y,w,h));
			document.getElementById('door_dialogue').style.display = "none";
		} else {
			alert("ERROR: Invalid fields entered.");
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
			alert("ERROR: Invalid fields entered.");
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
		var dir = parseInt(form.elements[3].value);
		var env = parseInt(form.elements[4].value);



		if ((id>0) && (x>=0) && (y>=0) && (dir>=1) && (dir<=4) && (env>=1) && (env<=3)) {
			canvas.addBeacon(new Beacon(canvas,id,x,y,dir,env));
			document.getElementById('beacon_dialogue').style.display = "none";
		} else {
			alert("ERROR: Invalid fields entered.");
		}

	};

	document.getElementById("cancel_beacon").onclick = function() {
		document.getElementById('beacon_dialogue').style.display = "none";
	};
	//---------------------------------------------------------------------//



}


// load all current_map data from database
function loadData(map) {
	localStorage.setItem("dimensions_width",map['width']);
    localStorage.setItem("dimensions_height",map['height']);
    localStorage.setItem("shapes",map['shapes']);
    localStorage.setItem("beacons",map['beacons']);
    localStorage.setItem("obstacles",map['obstacles']);
    localStorage.setItem("doors",map['doors']);
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


function save(state) {
	alert("Changes saved.");

	localStorage.setItem("dimensions_width",state.getWidth());
	localStorage.setItem("dimensions_height",state.getHeight());
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
				'update_map': true,
				'dimensions_width': state.getWidth(),
				'dimensions_height': state.getHeight(),
				'save_shapes': JSON.stringify(state.getShapes()),
				'save_beacons': JSON.stringify(state.getBeacons()),
				'save_obstacles': JSON.stringify(state.getObstacles()),
				'save_doors': JSON.stringify(state.getDoors())

			},
			error: function() {
				alert("ERROR: AJAX not working.");
			}
		})
	});


}


function loadFloor(){
   var fileReader  = new FileReader();

   var floor = document.getElementById('floor');
   var image_floor = document.getElementById('image_floor').files[0]; 

   fileReader.onloadend = function () {
   		floor.src = fileReader.result;
		localStorage.setItem("image",getBase64Image(floor))
   }

   if (image_floor) {
       fileReader.readAsDataURL(image_floor); 
   } else {
       floor.src = "";
       	localStorage.setItem("image","")
   }


}

// http://stackoverflow.com/questions/19183180/how-to-save-an-image-to-localstorage-and-display-it-on-the-next-page
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 300;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);


    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
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