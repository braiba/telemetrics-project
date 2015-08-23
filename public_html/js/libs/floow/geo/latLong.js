!function() {
    /**
     * Object for storing latitude and longitude pairs
     *
     * @param {number} latitude  the latitude
     * @param {number} longitude the longitude
     *
     * @returns {latLong}
     */
    floow.geo.latLong = function (latitude, longitude)
    {
        /** @var {number} */
        var _latitude = latitude;

        /** @var {number} */
        var _longitude = longitude;

        function latLong()
        {
            // Data object
        }

        /**
         * Determines how this object should be converted to a string for display methods, etc.
         *
         * @returns {string}
         */
        latLong.toString = function()
        {
            return '(' + latLong.getFormattedLatitude() + ', ' + latLong.getFormattedLongitude() + ')';
        };

        /**
         * Determines how this object should be converted to a string for display methods, etc.
         *
         * @returns {number[]}
         */
        latLong.toArray = function()
        {
            return [_longitude, _latitude];
        };

        /**
         * Returns the longitude
         *
         * @returns {number}
         */
        latLong.getLatitude = function()
        {
            return _latitude;
        };

        /**
         * Returns the latitude
         *
         * @returns {number}
         */
        latLong.getLongitude = function()
        {
            return _longitude;
        };

        /**
         * Returns the longitude in the standard display format
         *
         * @returns {string}
         */
        latLong.getFormattedLatitude = function()
        {
            return floow.geo.formatLatitude(_latitude, false);
        };

        /**
         * Returns the latitude in the standard display format
         *
         * @returns {string}
         */
        latLong.getFormattedLongitude = function()
        {
            return floow.geo.formatLongitude(_longitude, false);
        };

        /**
         * Calculates the distance in km between two points
         *
         * @param {latLong} destination the destination
         *
         * @returns {number} the distance between the two points in km
         */
        latLong.distanceInKm = function(destination)
        {
            var radius            = 6371; // Radius of the earth in km
            var distanceInRadians = d3.geo.distance(latLong.toArray(), destination.toArray());

            return radius * distanceInRadians;
        };

        return latLong;
    };

    /**
     * Formats a number as a longitude value
     *
     * @param {number}  value   the value to be formatted
     * @param {boolean} unicode whether to display the values in unicode (otherwise display with html entities)
     *
     * @returns {string} the formatted value
     */
    floow.geo.formatLatitude = function (value, unicode)
    {
        return floow.geo.formatLatLongCore(Math.abs(value), unicode) + (value < 0 ? 'S' : 'N');
    };

    /**
     * Formats a number as a longitude value
     *
     * @param {number}  value   the value to be formatted
     * @param {boolean} unicode whether to display the values in unicode (otherwise display with html entities)
     *
     * @returns {string} the formatted value
     */
    floow.geo.formatLongitude = function(value, unicode)
    {
        return floow.geo.formatLatLongCore(Math.abs(value), unicode) + (value < 0 ? 'W' : 'E');
    };

    /**
     * Used by formatLongitude and formatLatitude to do everything except the compass directions
     *
     * @param {number}  value   the value to be formatted
     * @param {boolean} unicode whether to display the values in unicode (otherwise display with html entities)
     *
     * @returns {string} the formatted value
     */
    floow.geo.formatLatLongCore = function(value, unicode)
    {
        var degrees = Math.floor(value);
        value = 60 * (value - degrees);
        var minutes = Math.floor(value);
        value = 60 * (value - minutes);
        var seconds = Math.round(value * 10) / 10;

        if (unicode) {
            return degrees + "\u00B0" +
                floow.text.leftPad('' + minutes, 2, '0') + "\u2019" +
                floow.text.leftPad(seconds.toFixed(1), 4, '0') + "\u201D";
        } else {
            return degrees + "&#0176;" +
                floow.text.leftPad('' + minutes, 2, '0') + "&#8217;" +
                floow.text.leftPad(seconds.toFixed(1), 4, '0') + "&#8221;";
        }
    };
} ();
