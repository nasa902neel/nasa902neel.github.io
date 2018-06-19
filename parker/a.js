

r(function(){
	function sph2cart(azimuth, elevation, r) {
		r *= ((1/696000) * (6.955e5/149598000)); // Convert from km to AU
		return [r*Math.cos(elevation)*Math.cos(azimuth),r*Math.cos(elevation)*Math.sin(azimuth),r*Math.sin(elevation)];
	}


	var sampleSVG = d3.select("#graphics")
	.append("svg")
	.attr("width", 800,)
	.attr("height", 500);    
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

	console.log(fileData);
	

});
function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}