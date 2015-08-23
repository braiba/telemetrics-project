!function () {
    /**
     * Class for generating map charts
     *
     * @returns {map}
     */
    floow.graph.map = function ()
    {
        var _id         = 'line' + Math.random() * 100000;
        var _container = undefined;
        var _height    = 400;
        var _margins   = {
            top: 25,
            right: 25,
            bottom: 25,
            left: 25
        };
        var _title   = undefined;
        var _data    = undefined;
        var _xDomain = {
            min: 0,
            max: 1
        };
        var _yDomain = {
            min: 0,
            max: 1
        };
        var _xFunc = function (row) { return row.x;};
        var _yFunc = function (row) { return row.y;};

        /**
         *
         * @param {Object} container
         *
         * @returns {Object}
         */
        function map(container)
        {
            _container = container;

            var width = parseInt(container.style('width'));
            var rows  = _data;

            if (_title !== undefined) {
                container.append("div")
                    .attr('class', 'header')
                    .html(_title);
            }

            var svg = container.append("svg")
                .attr('class', 'graph map')
                .attr('width', width)
                .attr('height', _height);

            var innerWidth = width - (_margins.left + _margins.right);
            var innerHeight = _height - (_margins.top + _margins.bottom);

            var domains = calculateDomains(rows, innerWidth, innerHeight);

            var yScale = d3.scale.linear()
                .range([_height - _margins.bottom, _margins.top])
                .domain([domains.latitude.min, domains.latitude.max]);

            var xScale = d3.scale.linear()
                .range([_margins.left, width - _margins.right])
                .domain([domains.longitude.min, domains.longitude.max]);

            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .tickFormat(function (latitude) {return floow.geo.formatLatitude(latitude, true);});

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .tickFormat(function (longitude) {return floow.geo.formatLongitude(longitude, true);});

            var line = d3.svg.line()
                .x(function (row) { return xScale(row.longitude);})
                .y(function (row) { return yScale(row.latitude);})
                .interpolate('linear');

            svg.append("path")
                .attr("d", line(rows))
                .attr('stroke', 'blue')
                .attr('stroke-width', 2)
                .attr('fill', 'none');

            svg
                .append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + (_height - _margins.bottom) + ')')
                .call(xAxis)
                .selectAll('text')
                .attr("y", 0)
                .attr("x", -9)
                .attr("dy", ".40em")
                .attr('transform', 'rotate(-90)')
                .style("text-anchor", "end");

            svg.append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + (_margins.left) + ',0)')
                .call(yAxis);

            d3.select(window).on(
                'resize.' + _id,
                function ()
                {
                    var container = _container;
                    container.selectAll('*').remove();
                    map(container);
                }
            );
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
        function calculateDomains(rows, innerWidth, innerHeight)
        {
            var latitudeFunc = function (row) {return row.latitude;};
            var longitudeFunc = function (row) {return row.longitude;};

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
         * Height setter/getter
         *
         * @param {number} height the new height (if not specified, this will return the current height)
         *
         * @returns {line|number}
         */
        map.height = function (height)
        {
            _height = height;

            return map;
        };

        /**
         * Margins setter/getter
         *
         * @param {number} top    the new top margin (if no arguments are given, this will return the current margins)
         * @param {number} right  the new right margin
         * @param {number} bottom the new bottom margin
         * @param {number} left   the new left margin
         *
         * @returns {line|object}
         */
        map.margins = function (top, right, bottom, left)
        {
            _margins.top    = top;
            _margins.right  = right;
            _margins.bottom = bottom;
            _margins.left   = left;

            return map;
        };

        /**
         * Title setter/getter
         *
         * @param {string} title the new title (if not specified, this will return the current title)
         *
         * @returns {line|number}
         */
        map.title = function (title)
        {
            if (!arguments.length) return _data;

            _title = title;

            return map;
        };

        /**
         * Data setter/getter
         *
         * @param {object[]} data the new data (if not specified, this will return the current data)
         *
         * @returns {line|number}
         */
        map.data = function (data)
        {
            _data = data;

            return map;
        };

        /**
         * Sets the domain for the x-axis
         *
         * @param {number} min minimum x value
         * @param {number} max maximum x value
         *
         * @returns {map}
         */
        map.xDomain = function (min, max)
        {
            _xDomain.min = min;
            _xDomain.max = max;

            return map;
        };

        /**
         * Sets the domain for the y-axis
         *
         * @param {number} min minimum y value
         * @param {number} max maximum y value
         *
         * @returns {map}
         */
        map.yDomain = function (min, max)
        {
            _yDomain.min = min;
            _yDomain.max = max;

            return map;
        };

        /**
         * Sets the function for extracting the x axis data from the data array
         *
         * @param {Function} func the function for extracting the x value from the data array
         *
         * @returns {map}
         */
        map.xFunc = function (func)
        {
            _xFunc = func;

            return map;
        };

        /**
         * Sets the function for extracting the y axis data from the data array
         *
         * @param {Function} func the function for extracting the y value from the data array
         *
         * @returns {map}
         */
        map.yFunc = function (func)
        {
            _yFunc = func;

            return map;
        };

        /**
         * Adds a horizontal mark to the graph
         *
         * @param {horizontalMark} horizontalMark the data object for the mark
         *
         * @returns {map}
         */
        map.addHorizontalMark = function (horizontalMark)
        {
            _horizontalMarks.push(horizontalMark);

            return map;
        };

        return map;
    }
}();