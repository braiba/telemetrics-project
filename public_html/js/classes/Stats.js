function Stats()
{
    /** @var {number} */
    this.distanceTravelled = 0;

    /** @var {number} */
    this.fastestSpeed = 0;

    /** @var {number} */
    this.averageSpeed = 0;

    /** @var {LatLong} */
    this.highestPoint = 0;

    /** @var {number} */
    this.averageAltitude = 0;

    /** @var {LatLong} */
    this.centralPoint = new LatLong(0, 0);
}

/**
 *
 * @param rows
 *
 * @returns {Stats}
 */
function calculateStats(rows)
{
    var totalDistance = 0;
    var maxSpeed      = 0;
    var sigmaSpeed    = 0;
    var maxAltitude   = 0;
    var sigmaAltitude = 0;
    var minLatitude   = Infinity;
    var maxLatitude   = 0;
    var minLongitude  = Infinity;
    var maxLongitude  = 0;
    var highestPoint  = new LatLong(0, 0);
    var count         = rows.length;

    var prevLatitude  = undefined;
    var prevLongitude = undefined;

    rows.forEach(
        function (row) {
            var distance  = 0;
            var altitude  = +row.altitude;
            var speed     = +row.speed;
            var latitude  = +row.latitude;
            var longitude = +row.longitude;

            if (prevLatitude !== undefined) {
                var deltaLatitude  = prevLatitude - latitude;
                var deltaLongitude = prevLongitude - longitude;

                distance = getDistanceFromLatLonInKm(prevLatitude, prevLongitude, latitude, longitude);
            }

            totalDistance  += distance;
            sigmaSpeed     += speed;
            sigmaAltitude  += altitude;

            if (speed > maxSpeed) {
                maxSpeed = speed;
            }
            if (altitude > maxAltitude) {
                maxAltitude = altitude;
                highestPoint.latitude  = latitude;
                highestPoint.longitude = longitude;
            }
            if (latitude < minLatitude) {
                minLatitude = latitude;
            }
            if (latitude > maxLatitude) {
                maxLatitude = latitude;
            }
            if (longitude < minLongitude) {
                minLongitude = longitude;
            }
            if (longitude > maxLongitude) {
                maxLongitude = longitude;
            }

            prevLatitude  = latitude;
            prevLongitude = longitude;
        }
    );

    var stats = new Stats();

    stats.distanceTravelled = totalDistance;
    stats.fastestSpeed      = maxSpeed;
    stats.averageSpeed      = sigmaSpeed / count;
    stats.highestPoint      = highestPoint;
    stats.averageAltitude   = sigmaAltitude / count;
    stats.centralPoint      = new LatLong(
        (minLatitude + maxLatitude) / 2,
        (minLongitude + maxLongitude) / 2
    );

    return stats;
}