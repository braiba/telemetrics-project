function LatLong(latitude, longitude)
{
    /** @var {number} */
    this.latitude = latitude;

    /** @var {number} */
    this.longitude = longitude;

    /**
     * Determines how this object should be converted to a string for display methods, etc.
     *
     * @returns {string}
     */
    this.toString = function()
    {
        return '(' + this.getFormattedLatitude() + ', ' + this.getFormattedLongitude() + ')';
    };

    /**
     * Returns the latitude in the standard display format
     *
     * @returns {string}
     */
    this.getFormattedLatitude = function()
    {
        return formatLatitude(this.latitude, false);
    };

    /**
     * Returns the latitude in the standard display format
     *
     * @returns {string}
     */
    this.getFormattedLongitude = function()
    {
        return formatLongitude(this.longitude, false);
    };
}

/**
 * Formats a number as a longitude value
 *
 * @param {number}  value   the value to be formatted
 * @param {boolean} unicode whether to display the values in unicode (otherwise display with html entities)
 *
 * @returns {string} the formatted value
 */
function formatLongitude(value, unicode)
{
    return formatLatLongCore(Math.abs(value), unicode) + (value < 0 ? 'W' : 'E');
}

/**
 * Formats a number as a latitude value
 *
 * @param {number}  value   the value to be formatted
 * @param {boolean} unicode whether to display the values in unicode (otherwise display with html entities)
 *
 * @returns {string} the formatted value
 */
function formatLatitude(value, unicode)
{
    return formatLatLongCore(Math.abs(value), unicode) + (value < 0 ? 'S' : 'N');
}

/**
 * Used by formatLongitude and formatLatitude to do everything except the compass directions
 *
 * @param {number}  value   the value to be formatted
 * @param {boolean} unicode whether to display the values in unicode (otherwise display with html entities)
 *
 * @returns {string} the formatted value
 */
function formatLatLongCore(value, unicode)
{
    var degrees = Math.floor(value);
    value = 60 * (value - degrees);
    var minutes = Math.floor(value);
    value = 60 * (value - minutes);
    var seconds = Math.round(value * 10) / 10;

    if (unicode) {
        return degrees + "\u00B0" + this.leftPad(minutes, 2, '0') + "\u2019" + this.leftPad(seconds.toFixed(1), 4, '0') + "\u201D";
    } else {
        return degrees + "&#0176;" + this.leftPad(minutes, 2, '0') + "&#8217;" + this.leftPad(seconds.toFixed(1), 4, '0') + "&#8221;";
    }
}

/**
 * Pads a string to a specified length by repeatedly prepending a given character
 *
 * @param {string} input   the input value
 * @param {int}    length  the length to pad to
 * @param {string} padding the character to use for padding
 *
 * @returns {string}
 */
function leftPad(input, length, padding)
{
    var output = '' + input; // force string
    while (output.length < length) {
        output = padding + output;
    }
    return output;
}

/**
 * Calculates the distance in km between two points
 *
 * @param {number} latitudeA  the latitude of the first point
 * @param {number} longitudeA the longitude of the first point
 * @param {number} latitudeB  the latitude of the second point
 * @param {number} longitudeB the longitude of the second point
 *
 * @returns {number} the distance between the two points in km
 */
function getDistanceFromLatLonInKm(latitudeA, longitudeA, latitudeB, longitudeB)
{
    var radius = 6371; // Radius of the earth in km

    var deltaLatitude  = deg2rad(latitudeB - latitudeA);
    var deltaLongitude = deg2rad(longitudeB - longitudeA);

    var h =
        haversin(deltaLatitude) +
        Math.cos(deg2rad(latitudeA)) * Math.cos(deg2rad(latitudeB)) *
        haversin(deltaLongitude);

    return 2 * radius * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/**
 *
 * @param rad
 *
 * @returns {number}
 */
function haversin(rad)
{
    return Math.sin(rad / 2) * Math.sin(rad / 2)
}

/**
 *
 * @param deg
 *
 * @returns {number}
 */
function deg2rad(deg)
{
    return deg * (Math.PI/180)
}