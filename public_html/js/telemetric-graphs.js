function calculateStats(rows)
{
    var maxSpeed    = d3.max(rows, function(row) {return row.speed;});
    var avgSpeed    = d3.sum(rows, function(row) {return row.speed;}) / rows.length;
    var maxAltitude = d3.max(rows, function(row) {return row.altitude;});
    var avgAltitude = d3.sum(rows, function(row) {return row.altitude;}) / rows.length;

    var totalDistance = 0;
    var highestPoint  = new LatLong(0, 0);
    var prevLatitude  = undefined;
    var prevLongitude = undefined;
    rows.forEach(
        function (row) {
            var altitude  = +row.altitude;
            var latitude  = +row.latitude;
            var longitude = +row.longitude;

            if (prevLatitude !== undefined) {
                totalDistance += getDistanceFromLatLonInKm(prevLatitude, prevLongitude, latitude, longitude);
            }

            if (altitude = maxAltitude) {
                highestPoint.latitude  = latitude;
                highestPoint.longitude = longitude;
            }

            prevLatitude  = latitude;
            prevLongitude = longitude;
        }
    );

    var minLatitude = d3.min(rows, function(row) {return row.latitude;});
    var maxLatitude = d3.max(rows, function(row) {return row.latitude;});
    var minLongitude = d3.min(rows, function(row) {return row.longitude;});
    var maxLongitude = d3.max(rows, function(row) {return row.longitude;});

    var centralPoint      = new LatLong(
        (minLatitude + maxLatitude) / 2,
        (minLongitude + maxLongitude) / 2
    );

    return {
        'Distance Travelled': (1000 * totalDistance) + ' m',
        'Fastest Speed'     : maxSpeed.toFixed(2) + ' mph',
        'Average Speed'     : avgSpeed.toFixed(2) + ' mph',
        'Highest Point'     : highestPoint,
        'Average Altitude'  : avgAltitude.toFixed(2) + ' m',
        'Central Point'     : centralPoint
    };
}

function generateStatsTable(rows)
{
    var stats = calculateStats(rows);

    var table = floow.table.keyValue()
        .setData(stats);

    var container = d3.select("#stats")
        .call(table);
}

function generateSpeedGraph(rows)
{
    var maxSpeed = (1 + 0.10) * d3.max(rows, function(row) {return row.speed;});

    var minTime = d3.min(rows, function(row) {return row.time;});
    var maxTime = d3.max(rows, function(row) {return row.time;});

    var graph = floow.graph.line()
        .setSize(600, 400)
        .setMargins(25, 25, 55, 45)
        .setData(rows)
        .setXDomain(minTime, maxTime)
        .setYDomain(0, maxSpeed)
        .setXFunc(function(row) {return row.time;})
        .setYFunc(function(row) {return row.speed;})
        .setXTickFormatter(function(time) {return time.toLocaleTimeString();})
        .setYTickFormatter(function(speed) {return speed + ' mph';});

    d3.select("#speedGraph")
        .call(graph);
}

function generateAltitudeGraph(rows)
{
    var minAltitude    = d3.min(rows, function(row) {return row.altitude;});
    var maxAltitude    = d3.max(rows, function(row) {return row.altitude;});
    var altitudeRange  = (maxAltitude - minAltitude);
    var altitudeBuffer = 0.10 * altitudeRange;

    minAltitude -= altitudeBuffer;
    maxAltitude += altitudeBuffer;

    var minTime = d3.min(rows, function(row) {return row.time;});
    var maxTime = d3.max(rows, function(row) {return row.time;});

    var graph = floow.graph.line()
        .setSize(600, 400)
        .setMargins(25, 25, 55, 45)
        .setData(rows)
        .setXDomain(minTime, maxTime)
        .setYDomain(minAltitude, maxAltitude)
        .setXFunc(function(row) {return row.time;})
        .setYFunc(function(row) {return row.altitude;})
        .setXTickFormatter(function(time) {return time.toLocaleTimeString();})
        .setYTickFormatter(function(altitude) {return altitude + ' m';});

    d3.select("#altitudeGraph")
        .call(graph);
}

function generateRouteGraph(rows)
{
    var container = d3.select("#routeMap");
    var svg = container.append("svg")
        .attr('width', 600)
        .attr('height', 400);
    var g   = svg.append("g");

    var width  = +svg.attr('width');
    var height = +svg.attr('height');

    var margins = {
        top    : 25,
        right  : 25,
        bottom : 70,
        left   : 70
    };

    var innerWidth = width - (margins.left + margins.right);
    var innerHeight = height - (margins.top + margins.bottom);

    var minLatitude    = d3.min(rows, function(row) {return row.latitude;});
    var maxLatitude    = d3.max(rows, function(row) {return row.latitude;});
    var latitudeRange  = (maxLatitude - minLatitude);
    var latitudeBuffer = 0.10 * latitudeRange;

    minLatitude   -= latitudeBuffer;
    maxLatitude   += latitudeBuffer;
    latitudeRange += 2 * latitudeBuffer;

    var minLongitude = d3.min(rows, function(row) {return row.longitude;});
    var maxLongitude = d3.max(rows, function(row) {return row.longitude;});
    var longitudeRange  = (maxLongitude - minLongitude);
    var longitudeBuffer = 0.10 * longitudeRange;

    minLongitude   -= longitudeBuffer;
    maxLongitude   += longitudeBuffer;
    longitudeRange += 2 * longitudeBuffer;

    // Adjusts the domain so that the scale is the same on each axis
    var latitudeDistance  = getDistanceFromLatLonInKm(minLatitude, 0, maxLatitude, 0);
    var longitudeDistance = getDistanceFromLatLonInKm(0, minLongitude, 0, maxLongitude);

    var yScale = latitudeDistance / innerHeight;
    var xScale = longitudeDistance / innerWidth;
    if (xScale < yScale) {
        var adjustedLongitudeRange = longitudeRange * (yScale / xScale);
        longitudeBuffer = (adjustedLongitudeRange - longitudeRange) / 2;
        minLongitude -= longitudeBuffer;
        maxLongitude += longitudeBuffer;
    } else if (yScale < xScale) {
        var adjustedLatitudeRange = latitudeRange * (xScale / yScale);
        latitudeBuffer = (adjustedLatitudeRange - latitudeRange) / 2;
        minLatitude -= latitudeBuffer;
        maxLatitude += latitudeBuffer;
    }

    var yScaleFunc = d3.scale.linear()
        .range([height - margins.bottom, margins.top])
        .domain([minLatitude, maxLatitude]);

    var xScaleFunc = d3.scale.linear()
        .range([margins.left, width - margins.right])
        .domain([minLongitude, maxLongitude]);

    var yAxis = d3.svg.axis()
        .scale(yScaleFunc)
        .orient('left')
        .ticks(5)
        .tickFormat(function(latitude) {return formatLatitude(latitude, true);});

    var xAxis = d3.svg.axis()
        .scale(xScaleFunc)
        .orient('bottom')
        .ticks(10)
        .tickFormat(function(longitude) {return formatLongitude(longitude, true);});

    var line = d3.svg.line()
        .x(function(row) { return xScaleFunc(row.longitude);})
        .y(function(row) { return yScaleFunc(row.latitude);})
        .interpolate('linear');

    svg.append("path")
        .attr("d", line(rows))
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (height - margins.bottom) + ')')
        .call(xAxis)
        .selectAll('text')
        .attr("y", 0)
        .attr("x", -9)
        .attr("dy", ".40em")
        .attr('transform', 'rotate(-90)')
        .style("text-anchor", "end");

    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + (margins.left) + ',0)')
        .call(yAxis);
}
