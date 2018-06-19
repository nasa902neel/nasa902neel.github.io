

r(function(){
	function sph2cart(azimuth, elevation, r) {
		r *= ((1/696000) * (6.955e5/149598000)); // Convert from km to AU
		return [r*Math.cos(elevation)*Math.cos(azimuth),r*Math.cos(elevation)*Math.sin(azimuth),r*Math.sin(elevation)];
	}

	// Set graph
		var width = 800,
			height = 700,
			padding = 10
			0;
	var vis = d3.select("#graphics")
	.append("svg")
	.attr("width", width,)
	.attr("height", height);    
	var fileNames = {earth : '/dat/Earth_2018_Oct_NONinert.txt', sol : '/dat/SolO_2018_Oct_NONinert.txt', spp : '/dat/SPP_2018_Oct_NONinert.txt'}
	var fileData = {earth : [], sol : [], spp : []};

	//due to async loading you cannot use a for loop here. FIX
	d3.csv(fileNames['earth'], function(data) {
		data.forEach(function(d) {
			ret = sph2cart(d['lon'],d['lat'],d['rad_dist']);
			fileData['earth'].push({ time 	: new Date(d['time']),
				x 		: ret[0],
				y		: ret[1],
				z		: ret[2]
			});
		});
	});
	d3.csv(fileNames['sol'], function(data) {
		data.forEach(function(d) {
			ret = sph2cart(d['lon'],d['lat'],d['rad_dist']);
			fileData[['sol']].push({ time 	: new Date(d['time']),
				x 		: ret[0],
				y		: ret[1],
				z		: ret[2]
			});
		});
	});
	d3.csv(fileNames['spp'], function(data) {
		data.forEach(function(d) {
			ret = sph2cart(d['lon'],d['lat'],d['rad_dist']);
			fileData[['spp']].push({ time 	: new Date(d['time']),
				x 		: ret[0],
				y		: ret[1],
				z		: ret[2]
			});
		});
	});





// Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 600 - margin.left - margin.right,
        height = 270 - margin.top - margin.bottom;
    
    
    // Set the ranges
    var x =  d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);
    
    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(8);
    
    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);
    
    // Define the line
    var valueline = d3.svg.line()
        .x(function(d) { return x(d.datax); })
        .y(function(d) { return y(d.datay); });
        
    // Adds the svg canvas
    var svg = d3.select("body")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", 
                  "translate(" + margin.left + "," + margin.top + ")");

});
function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}