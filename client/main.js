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
	// console.log("slope")
	// console.log(slope)
	// console.log("perp slope")
	// console.log(new_slope)
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
	var sights = packageData()

	var lines =[];
	var ap_point;

	sights.forEach(function(sight, index, initial_array){
		var m = zn_slope(sight.zn, upt_lat)
		var perp_m = perp_slope(m)
		var adjustedLong = (sight.ap_long - upt_long)
		var xpoint = 60*scaledLong(adjustedLong, upt_lat)
		var ypoint = upt_lat
		var lop_x = xpoint + lop_xshift(sight.delta, m, sights.zn)
	
		
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
	var sights = packageData()

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
	var sights = packageData()
	
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

Template.GraphLayout.helpers({
  center(){
    var data = Session.get("data");
    return data
  },
  sights(){
    var data = packageData()
    return data
  }
});

AutoForm.hooks({
  inputData: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      event.preventDefault();
      console.log("IMPORTANT DOCUMENT")
      console.log(insertDoc)
      Session.set('data', insertDoc)
      FlowRouter.go('/graph');
    }
  }
});

// HUMZA'S REDUCTION CODE

//library



// this formula needs some work on the wrap around case
//   , LHA is off by up to .4 degrees if wraps around 360.
// because we are using exact numbers and not rounding in our reductions,
// there may actually be no error


//** HELPERS **//

// Converts from degrees to radians.
function rad(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
function deg(radians) {
  return radians * 180 / Math.PI;
};


//** REDUCTION **//
function LHA(UPSLong, GHA)
{
  if (UPSLong > 0.)
    var apLong = Math.ceil(GHA) - GHA + UPSLong;
  else
    var apLong = UPSLong - (GHA - Math.floor(GHA));

  var decimalLHA = apLong + GHA;

// make sure angle is 0 < x < 360
  if (decimalLHA < 0.) 
    return 360. + decimalLHA;
  if (decimalLHA > 360.)
    return decimalLHA - 360.;
  return decimalLHA;

console.log(apLong);
}

console.log("LHA");
console.log(LHA(-71.,69.8));
console.log("lha PSET");
console.log(LHA(-71., 114.53))


// Hc in degrees decimal
function hC(Dec, LHA, Lat)
{
  var s = Math.sin(rad(Dec));
  var c = Math.cos(rad(Dec)) * Math.cos(rad(LHA));
  var decimalhC = Math.asin(((s * Math.sin(rad(Lat))) +  
    c * Math.cos(rad(Lat))));

  return deg(decimalhC);
}


console.log("hC from almanac");
console.log(hC(-15.,37.,32.));

console.log("hC from pset");
console.log(hC(-20.128,43,42));

//Zn in degrees decimal

function zN(Dec, LHA, Lat)
{
  var hc = hC(Dec, LHA, Lat);
  var s = Math.sin(rad(Dec));
  var c = Math.cos(rad(Dec)) * Math.cos(rad(LHA));

  var x = ((s * Math.cos(rad(Lat)) - c * Math.sin(rad(Lat))) / Math.cos(rad(hc)))
 // var decimalZn = Math.acos(((s * Math.sin(rad(Lat))) +  
 //   c * Math.cos(rad(Lat))));
  if (x > 1.) 
    var a = Math.acos(1.);
  if (x < -1.) 
    var a = Math.acos(-1.);
  else
    var a = Math.acos(x);

  // determine Zn from Z
  if (LHA > 180)
    return deg(a);
  else
    return (360 - deg(a));
}

console.log("Zn from almanac");
console.log(zN(-15.,37.,32.));

// this is more exact than pset, bc not rounded to degree
console.log("Zn from pset");
console.log(zN(-20.128,43,42));


// Ha (Index error corrector and Dip corrector (Hs → Ha ))
// + for off
// height in meter

function hA(Hs, indexError, myHeight)
{
  console.log("HSHSHSHSHSHS")
  console.log(Hs)
  var dip = .0293 * Math.sqrt(myHeight);
  console.log("HA")
  console.log((Hs + indexError/60 - dip))
  return (Hs + indexError/60 - dip);
}


// Ho (3rd limb and refraction corrector (Ha → Ho))

function hO(Ha, celObject)
{
  var r = 0.0167 / Math.tan(Ha + 7.32/(Ha + 4.32));

console.log("refraction");
console.log(r);

  console.log("celObject")
  console.log(celObject)

if (celObject == 1 || celObject == 3){
	var sd = -(16/60);
} else if (celObject == 2 || celObject == 4){
	var sd = 16/60;
} else {
	var sd = 0;
}

console.log("SD")
  console.log(sd)

  // if (celObject = 1) // moon upper
  //   var sd = 16/60*-1.;
  // else if (celObject = 2) // moon lower
  //   var sd = 16/60;
  // else if (celObject = 3) // sun upper
  // {  console.log("correct place")
  //   var sd = -(16/60);
  //   console.log(sd)}
  // else if (celObject = 4) // sun lower
  // {  console.log("wrong place")
  //   var sd = 16/60;}
  // else
  //   var sd = 0;

console.log("sd");
console.log(sd);
  return (Ha - r + sd);
}

console.log("Hao from almanac");
console.log(hA(21.3283, 0, 5.4));
console.log(hO(hA(21.3283, 0, 5.4), 4));
// this is more exact than pset, bc not rounded to degree
console.log("Hao from pset");
console.log(hA(15.4316, 8.5, 0));
console.log(hO(hA(15.4316, 8.5, 0), 4));

// delta, distance. positive means towards

function delta(Ho, Hc)
{ 
  console.log("Ho and Hc");
  console.log(Ho);
  console.log(Hc);
  return (Ho - Hc);
}

//** the function that ties it all together **//

function reduce(GHA, Dec, Lat, UPSLong, celObject, myHeight, indexError, Hs)
{
 var Azimuth = zN(Dec, LHA(UPSLong,GHA), Lat);
  var Delta = delta(hO(hA(Hs,indexError,myHeight), celObject), hC(Dec, LHA(UPSLong,GHA), Lat));
  console.log("DELTA")
  console.log(Delta)
  var apLat = Lat;

  if (UPSLong > 0.)
    var apLong = Math.ceil(GHA) - GHA + UPSLong;
  else
    var apLong = UPSLong - (GHA - Math.floor(GHA));

  var plotInfo = new Array(4);
  plotInfo[0] = Azimuth;
  plotInfo[1] = Delta;
  plotInfo[2] = apLat;
  plotInfo[3] = apLong;

  var plotInfo = {zn: Azimuth, delta: 60*Delta, ap_lat: apLat, ap_long: apLong}
  return plotInfo;
}

// console.log("plotting aray almanac");
// console.log(reduce(53, -15, 32, -16, 4, 5.4, 0, 21.3283));

// console.log("plotting array pset");
// console.log(reduce(114.53, -20.128, 42., -71., 4, 0, 8.5, 15.4316));

// console.log("plotting array pset 2");
// console.log(reduce(132.5683, -20.14, 42., -71., 3, 0, 8.5, 5.9733));

var packageData = function(){
	var data = Session.get("data");

	var upt_lat = data.upt_lat
	var upt_long = data.upt_long
	var sights = data.sights
	console.log("sightssightsights")
	console.log(sights)
	var usableSights = []

	sights.forEach(function(sight, index, initial_array){
console.log("sight.hs")
				console.log(sight.hs)
		var obj = reduce(sight.gha, sight.dec, upt_lat, upt_long, sight.num,sight.myHieght, sight.ie, sight.hs)
		usableSights.push(obj)
	})

	return usableSights

}

SimpleSchema.debug = true;

