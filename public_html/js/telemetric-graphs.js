/**
 * Calculating the values for the stats tables
 *
 * @param {object[]} rows the route data
 */
function calculateStats(rows)
{
    var maxSpeed    = d3.max(rows, function(row) {return row.speed;});
    var avgSpeed    = d3.sum(rows, function(row) {return row.speed;}) / rows.length;
    var maxAltitude = d3.max(rows, function(row) {return row.altitude;});
    var avgAltitude = d3.sum(rows, function(row) {return row.altitude;}) / rows.length;

    var totalDistance = 0;
    var highestPoint  = undefined;
    var prevPoint     = undefined;
    rows.forEach(
        function (row) {
            var altitude  = +row.altitude;
            var latitude  = +row.latitude;
            var longitude = +row.longitude;
            var currPoint = floow.geo.latLong(latitude, longitude);

            if (prevPoint !== undefined) {
                totalDistance += currPoint.distanceInKm(prevPoint);
            }

            if (altitude == maxAltitude) {
                highestPoint = currPoint;
            }

            prevPoint = currPoint;
        }
    );

    var minLatitude = d3.min(rows, function(row) {return row.latitude;});
    var maxLatitude = d3.max(rows, function(row) {return row.latitude;});
    var minLongitude = d3.min(rows, function(row) {return row.longitude;});
    var maxLongitude = d3.max(rows, function(row) {return row.longitude;});

    var centralPoint = floow.geo.latLong(
        (minLatitude + maxLatitude) / 2,
        (minLongitude + maxLongitude) / 2
    );

    return {
        'Distance Travelled': (1000 * totalDistance).toFixed(1) + ' m',
        'Fastest Speed'     : maxSpeed.toFixed(2) + ' mph',
        'Average Speed'     : avgSpeed.toFixed(2) + ' mph',
        'Highest Point'     : '' + highestPoint + ' (' + maxAltitude.toFixed(2) + ' m)',
        'Average Altitude'  : avgAltitude.toFixed(2) + ' m',
        'Central Point'     : '' + centralPoint
    };
}

/**
 * Generate the stats table
 *
 * @param {object}   container the container DOM object to generate the table into
 * @param {object[]} rows      the route data
 */
function generateStatsTable(container, rows)
{
    var stats = calculateStats(rows);

    var table = floow.table.keyValue()
        .setData(stats);

    container.call(table);
}

/**
 * Generate the speed graph
 *
 * @param {object}   container the container DOM object to generate the graph into
 * @param {object[]} rows      the route data
 */
function generateSpeedGraph(container, rows)
{
    var speedFunc = function(row) {return row.speed;};
    var timeFunc  = function(row) {return row.time;};

    var maxSpeed = (1 + 0.10) * d3.max(rows, speedFunc);

    var minTime = d3.min(rows, timeFunc);
    var maxTime = d3.max(rows, timeFunc);

    var graph = floow.graph.line()
        .setSize(600, 400)
        .setMargins(25, 25, 55, 45)
        .setData(rows)
        .setXDomain(minTime, maxTime)
        .setYDomain(0, maxSpeed)
        .setXFunc(timeFunc)
        .setYFunc(speedFunc)
        .setXTickFormatter(function(time) {return time.toLocaleTimeString();})
        .setYTickFormatter(function(speed) {return speed + ' mph';});

    container.call(graph);
}


/**
 * Generate the altitude graph
 *
 * @param {object}   container the container DOM object to generate the graph into
 * @param {object[]} rows      the route data
 */
function generateAltitudeGraph(container, rows)
{
    var altitudeFunc = function(row) {return row.altitude;};
    var timeFunc     = function(row) {return row.time;};

    var minAltitude    = d3.min(rows, altitudeFunc);
    var maxAltitude    = d3.max(rows, altitudeFunc);
    var altitudeRange  = (maxAltitude - minAltitude);
    var altitudeBuffer = 0.10 * altitudeRange;

    minAltitude -= altitudeBuffer;
    maxAltitude += altitudeBuffer;

    var minTime = d3.min(rows, timeFunc);
    var maxTime = d3.max(rows, timeFunc);

    var graph = floow.graph.line()
        .setSize(600, 400)
        .setMargins(25, 25, 55, 45)
        .setData(rows)
        .setXDomain(minTime, maxTime)
        .setYDomain(minAltitude, maxAltitude)
        .setXFunc(timeFunc)
        .setYFunc(altitudeFunc)
        .setXTickFormatter(function(time) {return time.toLocaleTimeString();})
        .setYTickFormatter(function(altitude) {return altitude + ' m';});

    container.call(graph);
}

/**
 * Calculate the domains to use such that the scale on the x and y axis will be roughly the same in km (they can't be
 *   completely the same, because the earth is not flat)
 *
 * @param {object[]} rows        the row data for the graph
 * @param {number}   innerWidth  the inner width of the graph in pixels
 * @param {number}   innerHeight the inner height of the graph in pixels
 *
 * @returns {{latitude: {min, max}, longitude: {min, max}}}
 */
function calculateRouteDomains(rows, innerWidth, innerHeight)
{
    var latitudeFunc = function(row) {return row.latitude;};
    var longitudeFunc = function(row) {return row.longitude;};

    var minLatitude    = d3.min(rows, latitudeFunc);
    var maxLatitude    = d3.max(rows, latitudeFunc);
    var avgLatitude    = d3.sum(rows, latitudeFunc) / rows.length;
    var latitudeRange  = (maxLatitude - minLatitude);
    var latitudeBuffer = 0.10 * latitudeRange;

    minLatitude   -= latitudeBuffer;
    maxLatitude   += latitudeBuffer;
    latitudeRange += 2 * latitudeBuffer;

    var minLongitude = d3.min(rows, longitudeFunc);
    var maxLongitude = d3.max(rows, longitudeFunc);
    var avgLongitude = d3.sum(rows, longitudeFunc) / rows.length;
    var longitudeRange  = (maxLongitude - minLongitude);
    var longitudeBuffer = 0.10 * longitudeRange;

    minLongitude   -= longitudeBuffer;
    maxLongitude   += longitudeBuffer;
    longitudeRange += 2 * longitudeBuffer;

    // Adjusts the domain so that the scale is the same on each axis
    var bottomCenter   = floow.geo.latLong(minLatitude, avgLongitude);
    var topCenter      = floow.geo.latLong(maxLatitude, avgLongitude);
    var middleLeft     = floow.geo.latLong(avgLatitude, minLongitude);
    var middleRight    = floow.geo.latLong(avgLatitude, maxLongitude);

    var latitudeDistance  = bottomCenter.distanceInKm(topCenter);
    var longitudeDistance = middleLeft.distanceInKm(middleRight);

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

    return {
        latitude: {
            min: minLatitude,
            max: maxLatitude
        },
        longitude: {
            min: minLongitude,
            max: maxLongitude
        }
    };
}

/**
 * Generate the route graph
 *
 * @param {object}   container the container DOM object to generate the graph into
 * @param {object[]} rows      the route data
 */
function generateRouteGraph(container, rows)
{
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

    var domains = calculateRouteDomains(rows, innerWidth, innerHeight);

    var yScaleFunc = d3.scale.linear()
        .range([height - margins.bottom, margins.top])
        .domain([domains.latitude.min, domains.latitude.max]);

    var xScaleFunc = d3.scale.linear()
        .range([margins.left, width - margins.right])
        .domain([domains.longitude.min, domains.longitude.max]);

    var yAxis = d3.svg.axis()
        .scale(yScaleFunc)
        .orient('left')
        .ticks(5)
        .tickFormat(function(latitude) {return floow.geo.formatLatitude(latitude, true);});

    var xAxis = d3.svg.axis()
        .scale(xScaleFunc)
        .orient('bottom')
        .ticks(10)
        .tickFormat(function(longitude) {return floow.geo.formatLongitude(longitude, true);});

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
