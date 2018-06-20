
r(function(){
	function sph2cart(azimuth, elevation, r) {
		r *= ((1/696000) * (6.955e5/149598000)); // Convert from km to AU
		return [r*Math.cos(elevation)*Math.cos(azimuth),r*Math.cos(elevation)*Math.sin(azimuth),r*Math.sin(elevation)];
	}

	// Set the dimensions of the canvas / graph
	var margin = {top: 30, right: 20, bottom: 30, left: 50},
	width = 700 - margin.left - margin.right,
	height = 700 - margin.top - margin.bottom;

    // Set the ranges
    var x =  d3.scale.linear().range([-1, width]);
    var y = d3.scale.linear().range([height, 0]);

    var fileNames = {earth : 'dat/Earth_2018_Oct_NONinert.txt', sol : 'dat/SolO_2018_Oct_NONinert.txt', spp : 'dat/SPP_2018_Oct_NONinert.txt'}
    var fileData = {earth : {color:"#68E30A",
    r:.35}, 
    				sol : {color:"#BED4E7", //1264A8
    				r:.45}, 
    				spp : {color:"#fc7237", //FF540B
    				r:.45}};
    				var posData = {};

                    function slice(date){
                       return String(new Date(date)).slice(4,16);
                   }
                   function pushData(date, type, x, y, z){
                       date = new Date(date);
    	//console.log(String(date).slice(4,15));
    	if(posData[slice(date)] == undefined){
    		posData[slice(date)] = [];
    	}
    	posData[slice(date)].push({
            type : type,
            time : date,
            x    : x,
            y    : y,
            z	 : z
        });
    }




    d3.csv(fileNames['earth'], function(data) {
       data.forEach(function(d) {
          ret = sph2cart(d['lon'],d['lat'],d['rad_dist']);
          d['x'] = ret[0];
          d['y'] = ret[1];
          d['z'] = ret[2];
			// Add the scatterplot
			svg.append("circle")
			.attr("r", fileData['earth']['r'])
			.attr("cx", x(d.x))
			.attr("cy", y(d.y))
			.attr("fill", fileData['earth']['color']);


			pushData(d['time'], "earth", d['x'], d['y'], d['z']);
			//posData['earth'].push(d);
		});
   });


    d3.csv(fileNames['sol'], function(data) {
       data.forEach(function(d) {
          ret = sph2cart(d['lon'],d['lat'],d['rad_dist']);
          d['time'] = new Date(d['time']);
          d['x'] = ret[0];
          d['y'] = ret[1];
          d['z'] = ret[2];
			// Add the scatterplot
			svg.append("circle")
			.attr("r", fileData['sol']['r'])
			.attr("cx", x(d.x))
			.attr("cy", y(d.y))
			.attr("fill", fileData['sol']['color']);




			pushData(d['time'], "sol", d['x'], d['y'], d['z']);
		});
   });
    d3.csv(fileNames['spp'], function(data) {
       data.forEach(function(d) {
          ret = sph2cart(d['lon'],d['lat'],d['rad_dist']);
          d['time'] = new Date(d['time']);
          d['x'] = ret[0];
          d['y'] = ret[1];
          d['z'] = ret[2];
			// Add the scatterplot
			svg.append("circle")
			.attr("r", fileData['spp']['r'])
			.attr("cx", x(d.x))
			.attr("cy", y(d.y))
			.attr("fill", fileData['spp']['color']);

			//posData['spp'].push(d);.
			pushData(d['time'], "spp", d['x'], d['y'], d['z']);
		});
   });



    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(15);
    
    var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(15);
    
    // Define the line
    var valueline = d3.svg.line()
    .x(function(d) { return x(d.datax); })
    .y(function(d) { return y(d.datay); });


    // Adds the svg canvas
    var svg = d3.select("#svg_graphy")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //x.domain(d3.extent(data, function(d) { return d.datax; }));
    x.domain([-1, 1]);
    y.domain([-1, 1]);

    // Add the X Axis
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + y(-1) + ")")
    .call(xAxis);

    // Add the Y Axis
    svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + x(-1) + ",0)")
    .call(yAxis);


    svg.append("circle") //SUN
    .attr("r", 15)
    .attr("cx", x(0))
    .attr("cy", y(0))
    .attr("fill", "yellow");

    var graph_text = svg.append('text').attr('x', x(0.75)).attr('y', y(-0.75)).attr('text-anchor', 'middle').style('fill', '#FFF').text('');
    var parker_text = svg.append('text').attr('x', x(0.75)).attr('y', y(-0.825)).attr('text-anchor', 'middle').attr("font-size", "20px").style('fill', fileData['spp']['color']).text('Parker Solar Probe');
    var solar_text = svg.append('text').attr('x', x(0.75)).attr('y', y(-0.9)).attr('text-anchor', 'middle').attr("font-size", "20px").style('fill', fileData['sol']['color']).text('Solar Orbiter');

    

    var r = 200,
    strokeWidth = 36,
    center = [r + strokeWidth, r + strokeWidth],
    circleStart = [r * 2 + strokeWidth, r + strokeWidth];

    var scrollableElement = document.querySelector('.scroll');
    var scrollableElementBounds = scrollableElement.getBoundingClientRect();
    var scrollableElementHeight = scrollableElementBounds.height;
    var windowHeight = window.innerHeight;

    var svg_scrolly = d3.select('.svg_scrolly').append('svg').attr('width', r * 2 + strokeWidth * 2).attr('height', r * 2 + strokeWidth * 2);

    var background = svg_scrolly.append('circle').attr('cx', center[0]).attr('cy', center[1]).attr('r', r).attr('stroke-width', strokeWidth * 2).style('stroke', 'rgba(0, 0, 0, 0.5)').style('fill', 'none');

    var bars = svg_scrolly.append('circle').attr('cx', center[0]).attr('cy', center[1]).attr('r', r).attr('stroke-dasharray', '2, 10').attr('stroke-dashoffset', 0).attr('stroke-width', strokeWidth * 1.6).style('stroke', 'gray').style('fill', 'none');

    var fullCircle = svg_scrolly.append('circle').attr('cx', center[0]).attr('cy', center[1]).attr('r', r).attr('stroke-dasharray', r * Math.PI * 2).attr('stroke-dashoffset', 0).attr('stroke-width', 4).style('opacity', 0).style('stroke', 'white').style('fill', 'none');

    var circle = svg_scrolly.append('circle').attr('cx', center[0]).attr('cy', center[1]).attr('r', r).attr('stroke-dasharray', r * Math.PI * 2).attr('stroke-dashoffset', 0).attr('stroke-width', strokeWidth).style('stroke', '#FF540B').style('fill', 'none');

    var control = svg_scrolly.append('circle').attr('cx', center[0]).attr('cy', center[1]).attr('r', r).attr('stroke-dasharray', r * Math.PI * 2).attr('stroke-dashoffset', 0).attr('stroke-width', strokeWidth).style('stroke', 'transparent').style('fill', 'none');

    var text = svg_scrolly.append('text').attr('x', center[0]).attr('y', center[1]).attr('text-anchor', 'middle').style('fill', '#FF540B').text('');
    var hover_text = svg_scrolly.append('text').attr('x', center[0]).attr('y', center[1] + 30).attr('text-anchor', 'middle').style('fill', 'gray').text('').style('font-size', '20px');

    var start = new Date("August 01, 2018");
    var end   = new Date("August 01, 2027");

    function getTheta(center, p1) {
    	var v = new Victor(p1[0] - center[0], center[1] - p1[1]);
    	if (p1[1] > center[1]) return v.horizontalAngleDeg() * -1;else return 360 - v.horizontalAngleDeg();
    }

    var circleLength = 2 * Math.PI * r,
    strokeTo = 0.001,
    strokeValue = 0,
    overlayOpaque = false,
    overlayVisible = false;

    function updateOverlay() {
    	if (overlayVisible && strokeValue < strokeTo !== overlayOpaque) {
    		return;
    	}
    	if (strokeValue < strokeTo) circle.transition().style('opacity', 0.7);else circle.transition().style('opacity', 1);
    	overlayOpaque = !(strokeValue < strokeTo);
    	overlayVisible = true;
    }

    svg_scrolly.on('mousemove', function () {
    	var t = getTheta(center, d3.mouse(this));
    	strokeTo = circleLength - circleLength * (t / 360);
    	fullCircle.attr('stroke-dashoffset', strokeTo);
    	hover_text.text(  String(new Date(start.getTime() + (((circleLength * (t / 360)) / circleLength) * (end.getTime() - start.getTime())))).slice(4,16));
    	updateOverlay();
    });

    svg_scrolly.on('mouseover', function () {
    	fullCircle.transition().style('opacity', 1);
    	updateOverlay();
    });

    svg_scrolly.on('mouseout', function () {
    	fullCircle.transition().style('opacity', 0);
    	overlayVisible = false;
    	hover_text.text('');
    });


    svg_scrolly.on('click', function () {
    	var t = getTheta(center, d3.mouse(this));
    	strokeValue = circleLength - circleLength * (t / 360);
    	var percent = 100 - strokeValue / circleLength * 100;
        document.getElementById("toggletext").innerText = "PAUSE";
        animateScrollTo(scrollY, (scrollableElementHeight - windowHeight) / 100 * percent, 0, 3000);

    });



    var lastScrollY = 0;
    var current_date = new Date(0);
    var earth = svg.append("circle")
    .attr("r", 0)
    .attr("x", x(0))
    .attr("y", y(0))
    .attr("fill", fileData['earth']['color']);
    var sol= svg.append("rect")
    .attr("width", 0)
    .attr("height", 0)
    .attr("x", x(0))
    .attr("y", y(0))
    .attr("fill", fileData['sol']['color']);
    var spp= svg.append("rect")
    .attr("width", 0)
    .attr("height", 0)
    .attr("x", x(0))
    .attr("y", y(0))
    .attr("fill", fileData['spp']['color']);

    function animate(time) {
    	requestAnimationFrame(animate);
    	TWEEN.update(time);
    	var progressPercent = scrollY / (scrollableElementHeight - windowHeight);
    	progressPercent = Math.min(100, Math.max(0, progressPercent));
    	current_date = new Date(start.getTime() + (progressPercent * (end.getTime() - start.getTime())));
  //text.text(new Date(progressPercent / 100) * (end.getTime() - start.getTime()));
  text.text(slice(current_date));
  graph_text.text(slice(current_date));

  for(i in posData[slice(current_date)]){
  	if(posData[slice(current_date)][i]['type'] == "earth"){
  		earth.attr("r", 6)
          .attr("cx", x(posData[slice(current_date)][i]["x"]))
          .attr("cy", y(posData[slice(current_date)][i]["y"]));
      }else if(posData[slice(current_date)][i]['type'] == "sol"){
        sol.attr("height", 16)
        .attr("width", 16)
        .attr("x", x(posData[slice(current_date)][i]["x"])-8)
        .attr("y", y(posData[slice(current_date)][i]["y"])-8);
    }else if(posData[slice(current_date)][i]['type'] == "spp"){
        spp.attr("height", 16)
        .attr("width", 16)
        .attr("x", x(posData[slice(current_date)][i]["x"])-8)
        .attr("y", y(posData[slice(current_date)][i]["y"])-8);
    }
}

strokeValue = circleLength - circleLength * progressPercent;
circle.attr('stroke-dashoffset', strokeValue);
updateOverlay();

}

requestAnimationFrame(animate);
_stop = false;


var twe = new TWEEN.Tween();
var pause = false;
var running = false;
document.getElementById("toggle").addEventListener("click", function( event ) {
    if(document.getElementById("toggletext").innerText == "PLAY"){
        document.getElementById("toggletext").innerText = "PAUSE";
        if(running){
            twe.stop();
        }else{
            if(scrollY >= 19000){
                animateScrollTo(0, 20000, 0, 5000);
            }else{
                animateScrollTo(scrollY, 20000, 0, 5000);
            }

        }
    }
    else{
        document.getElementById("toggletext").innerText = "PLAY";
        twe.stop();
    }
}, false);
function animateScrollTo(scrollFrom, scrollTo, cont, time) {
    twe.stop();
    twe = new TWEEN.Tween({ y: scrollFrom }).to({ y: scrollTo }, time).onStart(function start(){
        document.getElementById("toggletext").innerText = "PAUSE";
        running = true;
    }).onUpdate(function update() {
      setScrollTop(this.y);
      running = true;
  })
    .onStop(function stop(){
        document.getElementById("toggletext").innerText = "PLAY";
        running = false;
    })
    .onComplete(function done(){
        document.getElementById("toggletext").innerText = "PLAY";
        running = false;
    }).repeat(cont).start();
}

function setScrollTop(value) {
	if (window.scrollTo) {
		window.scrollTo(0, value);
	} else {
		document.body.scrollTop = value;
	}
}











});
function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}