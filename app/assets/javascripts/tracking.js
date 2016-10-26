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
	// gon.watch('target', {interval: 4000}, update)


	// gon.watch('parsedMessage', {interval: 4000}, test)


	// document.getElementById("fooBar").innerText = document.createTextNode(gon.JSON_message['payload']).textContent;


	var est_x = [346.75,350.39,348.32,352.55,349.31,342.53,327.01,325.54,316.55,331.72,340.84,348.27,348.65,350.34,345.75,342.58,354.03,348.52,342.88,324.13,306.45,345.03,333.34,304.21,303.82,305.76,289.31,268.4,254.58,234.3,197.65,170.47,149.48,137.68,99.867,100.02,102.04,98.93,97.475,82.582,82.197,75.585,73.714,80.887,140.95,186.31,149.17,195.89,200.54,195.29,210.18,212.35,231.88,256.84,284.76,330.47,416.61,429.2,429.41,433.3,402,398.23,396.21,436.58,477.84,509.8,507.28,499.07,530.11,615.93,608.03,607.44,634.99,679.66,711.69,705.49,710.63,693.37,688.35,727.09,720.32,706.34,679.13,641.97,641.31,592.17,584.6,524.55,497.83,482.21
];
	var est_y = [569.7,652.92,766.25,766.7,752.92,752.45,640.78,623.13,625.3,608.7,583.87,554.82,533.23,498.1,456.65,449.65,439.75,415.49,408.74,344.49,302.92,261.72,227.22,200.03,212.06,221.33,229.35,223.23,225.01,228.28,235.02,240.25,228.32,225.68,175.99,179.77,160.59,157.07,160.08,159.58,174.16,174.48,163.31,164.12,166.42,128.45,146.07,151.71,145.2,168.55,196.97,218.36,241.47,250.01,256.56,257.4,207.48,201.08,187.46,173.57,180.33,174.81,180.7,144.43,165.02,160.31,166.68,170.04,187.41,176.13,159.12,144.56,160.65,196.88,213.23,227.4,238.09,242.77,250.6,279.44,321.65,311.54,312.69,308.4,304.04,303.27,306.55,312.32,307.05,291.87
];
	var mea_x = [350,350,350,350,350,350,350,350,350,350,350,350,350,350,350,350,350,350,350,350,350,350,350,325,300,275,250,225,200,175,150,125,100,75,50,25,25,25,25,25,25,50,75,100,125,150,175,200,225,225,225,225,225,225,250,275,300,325,350,350,350,350,375,400,425,450,475,500,525,550,575,600,625,650,675,700,725,725,725,725,725,700,675,650,625,600,575,550,525,500
];
	var mea_y = [875,845,815,785,755,725,695,665,635,605,575,545,515,485,455,425,395,365,335,305,275,250,225,225,225,225,225,225,225,225,225,225,225,225,225,225,200,175,150,125,100,100,100,100,100,100,100,100,100,125,150,175,200,225,225,225,225,225,225,200,175,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,175,200,225,250,250,250,250,250,250,250,250,250,250
];

	var i = 1;
	var target = [[est_x[i],est_y[i]],[mea_x[i],mea_y[i]]];
	update(target);



	//BAD TWEAKS------------
	setInterval(function() {
		i+=1;
		target = [[est_x[i],est_y[i]],[mea_x[i],mea_y[i]]];
		update(target);
	},3000);


	///------------

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