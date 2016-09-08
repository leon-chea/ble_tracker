// By Simon Sarris
// www.simonsarris.com
// sarris@acm.org
//
// Code from the following pages merged by Andrew Clark (amclark7@gmail.com):
//   http://simonsarris.com/blog/510-making-html5-canvas-useful
//   http://simonsarris.com/blog/225-canvas-selecting-resizing-shape
// Last update June 2013
//
// Free to use and distribute at will
// So long as you are nice to people, etc

// If you dont want to use <body onLoad='init()'>
// You could uncomment this init() reference and place the script reference inside the body tag
//init();

var canvas;

function main() {
	"use strict";

	if (!localStorage){
    	alert("ERROR: localStorage unavailable.");
    }
   
	canvas = new Canvas(document.getElementById('canvas'));

	document.getElementById('canvas').width = DISPLAY_WIDTH;
	document.getElementById('canvas').height = DISPLAY_HEIGHT;

	updateCanvasSize(canvas,parseFloat(localStorage.getItem("dimensions_width")),parseFloat(localStorage.getItem("dimensions_height")));

	canvas.setShapes(JSON.parse(localStorage.getItem("shapes")));
	canvas.setBeacons(JSON.parse(localStorage.getItem("beacons")));
	canvas.setObstacles(JSON.parse(localStorage.getItem("obstacles")));
	canvas.setDoors(JSON.parse(localStorage.getItem("doors")));


	// document.getElementById("fooBar").innerText = document.createTextNode("revision:" + 56).textContent;
	// document.getElementById("fooBar").innerText = document.createTextNode(canvas.toStringShapes()).textContent;

	 document.getElementById('floor').src = "data:image/png;base64," + localStorage.getItem("image");




	// $.post('index',"some string");
	gon.watch('target', {interval: 4000}, update)


	gon.watch('parsedMessage', {interval: 4000}, test)


	// document.getElementById("fooBar").innerText = document.createTextNode(gon.JSON_message['payload']).textContent;

}

function test(message) {
	document.getElementById("bad").innerText = document.createTextNode(message['payload']).textContent;

	$(function() {

		$.ajax({
			url:"/home/index",
			type:"post",
			// data: {'id':102,'name':'bob'},
			data: {
				'dimensions_width': localStorage.getItem("dimensions_width"),
				'dimensions_height': localStorage.getItem("dimensions_height"), 
				'shapes': canvas.toStringShapes(),
				'beacons': canvas.toStringBeacons(),
				'A': localStorage.getItem('A'),
				'H': localStorage.getItem('H'),
				'Q': localStorage.getItem('Q'),
				'R': localStorage.getItem('R')



			},
			// success: function() {
			// 	// alert("yay");
			// },
			error: function() {
				alert("ERROR with AJAX");
			}
		})
	});

}

function update(target) {
	// document.getElementById("fooBar").innerText = document.createTextNode(target[0][0]+ " " + target[0][1] + " " + target[1][0] + " " + target[1][1]).textContent;
	canvas.setTarget(parseFloat(target[0][0]),parseFloat(target[0][1]),parseFloat(target[1][0]),parseFloat(target[1][1]));
}