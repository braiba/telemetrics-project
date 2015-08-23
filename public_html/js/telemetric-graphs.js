function getMaxSpeed(rows)
{
    return d3.max(rows, function(row) {return row.speed;});
}

function getAverageSpeed(rows)
{
    return d3.sum(rows, function(row) {return row.speed;}) / rows.length;
}

function getMinAltitude(rows)
{
    return d3.min(rows, function(row) {return row.altitude;});
}

function getMaxAltitude(rows)
{
    return d3.max(rows, function(row) {return row.altitude;});
}

function getAverageAltitude(rows)
{
    return d3.sum(rows, function(row) {return row.altitude;}) / rows.length;
}

function getTotalDistance(rows)
{
    var totalDistance = 0;
    var prevPoint     = undefined;

    rows.forEach(
        function (row) {
            var latitude  = +row.latitude;
            var longitude = +row.longitude;
            var currPoint = floow.geo.latLong(latitude, longitude);

            if (prevPoint !== undefined) {
                totalDistance += currPoint.distanceInKm(prevPoint);
            }

            prevPoint = currPoint;
        }
    );

    return totalDistance * 1000;
}

function getHighestPoint(rows)
{
    var highestPoint = undefined;
    var maxAltitude  = 0;

    rows.forEach(
        function (row) {
            var latitude  = +row.latitude;
            var longitude = +row.longitude;
            var currPoint = floow.geo.latLong(latitude, longitude);
            var altitude  = +row.altitude;

            if (altitude > maxAltitude) {
                highestPoint = currPoint;
                maxAltitude  = altitude;
            }
        }
    );

    return highestPoint;
}

function getCentralPoint(rows)
{
    var minLatitude = d3.min(rows, function(row) {return row.latitude;});
    var maxLatitude = d3.max(rows, function(row) {return row.latitude;});
    var minLongitude = d3.min(rows, function(row) {return row.longitude;});
    var maxLongitude = d3.max(rows, function(row) {return row.longitude;});

    return floow.geo.latLong(
        (minLatitude + maxLatitude) / 2,
        (minLongitude + maxLongitude) / 2
    );
}

/**
 * Calculating the values for the stats tables
 *
 * @param {object[]} rows the route data
 */
function calculateStats(rows)
{
    return {
        'Distance Travelled': getTotalDistance(rows).toFixed(1) + ' m',
        'Fastest Speed'     : getMaxSpeed(rows).toFixed(2) + ' kph',
        'Average Speed'     : getAverageSpeed(rows).toFixed(2) + ' kph',
        'Highest Point'     : '' + getHighestPoint(rows) + ' (' + getMaxAltitude(rows).toFixed(2) + ' m)',
        'Average Altitude'  : getAverageAltitude(rows).toFixed(2) + ' m',
        'Central Point'     : '' + getCentralPoint(rows)
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

    var avgSpeed = getAverageSpeed(rows);
    var maxSpeed = getMaxSpeed(rows);

    var minTime = d3.min(rows, timeFunc);
    var maxTime = d3.max(rows, timeFunc);

    var avgMark = floow.graph.line.horizontalMark(maxSpeed)
        .label('Fastest Speed: ' + maxSpeed.toFixed(2) + ' kph');
    var maxMark = floow.graph.line.horizontalMark(avgSpeed)
        .label('Average Speed: ' + avgSpeed.toFixed(2) + ' kph');

    var graph = floow.graph.line()
        .setSize(600, 400)
        .setMargins(5, 5, 55, 45)
        .setData(rows)
        .setXDomain(minTime, maxTime)
        .setYDomain(0, 1.10 * maxSpeed)
        .setXFunc(timeFunc)
        .setYFunc(speedFunc)
        .setXTickFormatter(function(time) {return time.toLocaleTimeString();})
        .setYTickFormatter(function(speed) {return speed + ' kph';})
        .addHorizontalMark(maxMark)
        .addHorizontalMark(avgMark);

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

    var minAltitude    = getMinAltitude(rows);
    var maxAltitude    = getMaxAltitude(rows);
    var avgAltitude    = getAverageAltitude(rows);
    var altitudeRange  = (maxAltitude - minAltitude);
    var altitudeBuffer = 0.10 * altitudeRange;

    var minTime = d3.min(rows, timeFunc);
    var maxTime = d3.max(rows, timeFunc);

    var avgMark = floow.graph.line.horizontalMark(maxAltitude)
        .label('Highest Point: ' + maxAltitude.toFixed(2) + ' m');
    var maxMark = floow.graph.line.horizontalMark(avgAltitude)
        .label('Average Altitude: ' + avgAltitude.toFixed(2) + ' m');

    var graph = floow.graph.line()
        .setSize(600, 400)
        .setMargins(25, 25, 55, 45)
        .setData(rows)
        .setXDomain(minTime, maxTime)
        .setYDomain(minAltitude - altitudeBuffer, maxAltitude + altitudeBuffer)
        .setXFunc(timeFunc)
        .setYFunc(altitudeFunc)
        .setXTickFormatter(function(time) {return time.toLocaleTimeString();})
        .setYTickFormatter(function(altitude) {return altitude + ' m';})
        .addHorizontalMark(maxMark)
        .addHorizontalMark(avgMark);

    container.call(graph);
}

/**
 * Generate the route map
 *
 * @param {object}   container the container DOM object to generate the graph into
 * @param {object[]} rows      the route data
 */
function generateRouteMap(container, rows)
{
    var latitudeFunc   = function(row) {return row.latitude;};
    var minLatitude    = d3.min(rows, latitudeFunc);
    var maxLatitude    = d3.max(rows, latitudeFunc);
    var latitudeRange  = (maxLatitude - minLatitude);
    var latitudeBuffer = 0.10 * latitudeRange;

    var longitudeFunc   = function(row) {return row.longitude;};
    var minLongitude    = d3.min(rows, longitudeFunc);
    var maxLongitude    = d3.max(rows, longitudeFunc);
    var longitudeRange  = (maxLongitude - minLongitude);
    var longitudeBuffer = 0.10 * longitudeRange;

    var graph = floow.graph.map()
        .setSize(600, 400)
        .setMargins(5, 5, 70, 70)
        .setData(rows)
        .setXDomain(minLatitude + latitudeBuffer, maxLatitude + latitudeBuffer)
        .setYDomain(minLongitude - longitudeBuffer, maxLongitude + longitudeBuffer);

    container.call(graph);
}
