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
    }

    this.getFormattedLatitude = function()
    {
        return this.formatLatitude(this.latitude);
    }

    this.getFormattedLongitude = function()
    {
        return this.formatLongitude(this.longitude);
    }

    /**
     * Formats a number as a longitude value
     *
     * @param {number} value the value to be formatted
     *
     * @returns {string} the formatted value
     */
    this.formatLongitude = function(value)
    {
        return this.formatLatLongCore(Math.abs(value)) + (value < 0 ? 'W' : 'E');
    }

    /**
     * Formats a number as a latitude value
     *
     * @param {number} value the value to be formatted
     *
     * @returns {string} the formatted value
     */
    this.formatLatitude = function(value)
    {
        return this.formatLatLongCore(Math.abs(value)) + (value < 0 ? 'S' : 'N');
    }

    /**
     * Used by formatLongitude and formatLatitude to do everything except the compass directions
     *
     * @param {number} value the value to be formatted
     *
     * @returns {string} the formatted value
     */
    this.formatLatLongCore = function(value)
    {
        var a = Math.floor(value);
        value = 60 * (value - a);
        var b = Math.floor(value);
        value = 60 * (value - b);
        var c = Math.round(value * 10) / 10;

        return a + "&deg;" + this.leftPad(b, 2, '0') + "&#8217;" + this.leftPad(c, 4, '0') + "&#8221;";
    }

    /**
     * Pads a string to a specified length by repeatedly prepending a given character
     *
     * @param {string}  input   the input value
     * @param {integer} length  the length to pad to
     * @param {string}  padding the character to use for padding
     *
     * @returns {string}
     */
    this.leftPad = function(input, length, padding)
    {
        var output = '' + input; // force string
        while (output.length < length) {
            output = padding + output;
        }
        return output;
    }
}