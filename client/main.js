import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { GraphData } from '../collections/graphData.js'

window.GraphData = GraphData

// Converts from degrees to radians.
function rad(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
function deg(radians) {
  return radians * 180 / Math.PI;
};

var scaledLong = function (long, lat){
  return deg(rad(long)*Math.cos(rad(lat)));
}

var zn_slope = function(zn,upt_lat){
	var slope = (1/Math.tan(rad(zn)))
	return slope
}

var perp_slope = function(slope){
	var new_slope = -(Math.pow(slope, -1))
	console.log("slope")
	console.log(slope)
	console.log("perp slope")
	console.log(new_slope)
	return new_slope
}

var lop_xshift = function(delta, slope, zn){

	if (zn >= 180) {
		var shift = delta*Math.cos(Math.atan(slope))
	} else {
		var shift = -delta*Math.cos(Math.atan(slope))
	}
	
	return shift

}

var lop_yshift = function(delta, slope, zn){
	if (zn >= 180) {
		var shift = delta*Math.sin(Math.atan(slope))
	} else {
		var shift = -delta*Math.sin(Math.atan(slope))
	}
	return shift
}

var getRandomArbitrary = function () {
  return Math.random() * 8;
}

var graphSight = function (sights){

	var data = Session.get("data");
	
	var upt_lat = data.upt_lat
	var upt_long = data.upt_long
	var sights = data.sights

	var lines =[];
	var ap_point;
	//var colors = ["black", "red", "pink", "yello", "blue", "green", "orange", "brown", "purple"]

	sights.forEach(function(sight, index, initial_array){
		var m = zn_slope(sight.zn, upt_lat)
		var perp_m = perp_slope(m)
		console.log("m slope")
		console.log(m)
		var adjustedLong = (sight.ap_long - upt_long)
		var xpoint = 60*scaledLong(adjustedLong, upt_lat)
		var ypoint = upt_lat
		var lop_x = xpoint + lop_xshift(sight.delta, m, sights.zn)
		// var color = colors[Math.floor((Math.random() * 8) + 1);]
		// console.log("color")
		// console.log(color)
		
		ap_point = {
					points: [
				      [xpoint, 0],
				    ],
				    fnType: 'points',
				    graphType: 'scatter',
				    color: 'red'
				  	}

		shifted_line =  {fn: m.toString()+""+'*x-'+""+m.toString()+"*"+xpoint.toString(),
	      				color: 'blue',
	      				nSamples: 100,
    					graphType: 'scatter'
						}

		lop =  {fn: 
				perp_m.toString()+""+'*x-'+""+perp_m.toString()+"*"+lop_x+"+"+lop_yshift(sight.delta, m, sights.zn).toString(),
	      		color: 'blue'
				}

		lines.push(ap_point,shifted_line, lop)
	})
	return lines
}

var graphData = function (){

	var data = Session.get("data");
	
	var upt_lat = data.upt_lat
	var upt_long = data.upt_long
	var sights = data.sights

	var finalgraph = [
				    { fn: '60', color: 'grey',
				      skipTip: true },
				    { fn: '-60', color: 'grey',
				      skipTip: true },
				    { fn: '0', color: 'grey',
				      skipTip: true },
				    { fn: 'x * x + y * y - 60*60',
				      fnType: 'implicit',
				      skipTip: true, color: 'grey'
					},
					{ fn: 'x-'+""+scaledLong(60,upt_lat).toString(),
				      fnType: 'implicit', color: 'grey',
				      skipTip: true
					},
					{ fn: 'x+'+""+scaledLong(60,upt_lat).toString(),
				      fnType: 'implicit', color: 'grey',
				      skipTip: true
					},
					{ fn: 'x',
				      fnType: 'implicit', color: 'grey',
				      skipTip: true
					}
				  ]

	return finalgraph.concat(graphSight(sights))
}

var textify_long = function (longit){

	if (longit > 0){
		var text = longit.toString()+""+'E'
	} else {
		var text = Math.abs(longit).toString()+""+'W'
	}
	return text
}

var textify_lat = function (lat){
	if (lat > 0){
		var text = lat.toString()+""+'N'
	} else {
		var text = Math.abs(lat).toString()+""+'S'
	}
	return text
}

Template.GraphLayout.rendered = function(){
	
	var data = Session.get("data");
	
	var upt_lat = data.upt_lat
	var upt_long = data.upt_long
	var sights = data.sights
	
	functionPlot({
	  target: '#graph',
	  width: 500,
	  height: 500,
	  yAxis: {domain: [-80, 80]},
	  xAxis: {domain: [-80, 80]},
	  grid: true,
	  data: graphData(),
	  annotations: [
	  				{
				    y: 60,
				    text: textify_lat(upt_lat+1)
				  	},
				  	{
				    y: -60,
				    text: textify_lat(upt_lat-1)
				  	}, 
				  	{
				    y: 0,
				    text: textify_lat(upt_lat)
				  	},
				  	{
				    x: -scaledLong(60,upt_lat).toString(),
				    text: textify_long(upt_long-1)
				  	},
				  	{
				    x: scaledLong(60,upt_lat).toString(),
				    text: textify_long(upt_long+1)
				  	},
				  	{
				    x: 0,
				    text: textify_long(upt_long)
				  	}],
	})
}

// Template.GraphLayout.rendered = function(){
// 	Tracker.autorun(function(){

// 	Template.HomeLayout.events({
//   'submit form': function(){
//   	event.preventDefault();
//     FlowRouter.go('/graph');
//   }
// });

Template.GraphLayout.helpers({

  plotData(){
    var data = Session.get("data");
    console.log("data")
    console.log(data)
	
	var upt_lat = data.upt_lat
	var upt_long = data.upt_long
	var sights = data.sights

    var newArray = [{label: '7AM', value: 7},
                    {label: '8AM', value: 8},
                    {label: '9AM', value: 9},
                    {label: '10AM', value: 10},
                    {label: '11AM', value: 11},
                    {label: '12PM', value: 12},
                    {label: '1PM', value: 13},
                    {label: '2PM', value: 14},
                    {label: '3PM', value: 15},
                    {label: '4PM', value: 16},
                    {label: '5PM', value: 17},
                    {label: '6PM', value: 18}]
    return data
  }
});

AutoForm.hooks({
  inputData: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      event.preventDefault();
      console.log(insertDoc)
      Session.set('data', insertDoc)
      FlowRouter.go('/graph');
    }
  }
});

	

SimpleSchema.debug = true;

