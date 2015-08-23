!function() {
    /**
     * Class for generating line graphs
     *
     * @returns {line}
     */
    floow.graph.line = function()
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
        var _xTickFormatter = function (value) {return value;};
        var _yTickFormatter = function (value) {return value;};
        var _horizontalMarks = [];

        /**
         * Callback for creating the line graph
         *
         * @param {Object} container the container to create the graph in
         *
         * @returns {Object}
         */
        function line(container)
        {
            _container = container;

            var width = parseInt(container.style('width'));
            var rows  = _data;

            if (_title !== undefined) {
                container.append('div')
                    .attr('class', 'header')
                    .html(_title);
            }

            var svg = container.append("svg")
                .attr('class', 'graph line')
                .attr('width', width)
                .attr('height', _height);

            var yScale = d3.scale.linear()
                .range([_height - _margins.bottom, _margins.top])
                .domain([_yDomain.min, _yDomain.max]);

            var xScale = d3.time.scale()
                .range([_margins.left, width - _margins.right])
                .domain([_xDomain.min, _xDomain.max]);

            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .tickFormat(_yTickFormatter);

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .tickFormat(_xTickFormatter);

            var svgLine = d3.svg.line()
                .x(
                    function (row) {
                        return xScale(_xFunc(row));
                    }
                )
                .y(
                    function (row) {
                        return yScale(_yFunc(row));
                    }
                )
                .interpolate('linear');

            var pathGroup = svg.append('g');

            var clipPathName = _id + 'path';

            pathGroup
                .append("clipPath")
                .attr('id', clipPathName)
                .append("rect")
                .attr("x", _margins.left)
                .attr("y", _margins.top)
                .attr("width", width - (_margins.right + _margins.left))
                .attr("height",  _height - (_margins.top + _margins.bottom));

            pathGroup
                .append("path")
                .attr('clip-path', 'url(#' + clipPathName + ')')
                .attr("d", svgLine(rows));

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

            var i;
            for (i in _horizontalMarks) {
                var horizontalMark = _horizontalMarks[i];
                svg.call(horizontalMark, xScale, yScale, _xDomain.min, _xDomain.max);
            }

            d3.select(window).on(
                'resize.' + _id,
                function()
                {
                    var container = _container;
                    container.selectAll('*').remove();
                    line(container);
                }
            );
        }

        /**
         * Height setter/getter
         *
         * @param {number} height the new height (if not specified, this will return the current height)
         *
         * @returns {line|number}
         */
        line.height = function (height)
        {
            if (!arguments.length) return _height;

            _height = height;

            return line;
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
        line.margins = function (top, right, bottom, left)
        {
            if (!arguments.length) return _margins;

            _margins.top    = top;
            _margins.right  = right;
            _margins.bottom = bottom;
            _margins.left   = left;

            return line;
        };

        /**
         * Title setter/getter
         *
         * @param {string} title the new title (if not specified, this will return the current title)
         *
         * @returns {line|number}
         */
        line.title = function (title)
        {
            if (!arguments.length) return _data;

            _title = title;

            return line;
        };

        /**
         * Data setter/getter
         *
         * @param {object[]} data the new data (if not specified, this will return the current data)
         *
         * @returns {line|number}
         */
        line.data = function (data)
        {
            if (!arguments.length) return _data;

            _data = data;

            return line;
        };

        /**
         * Sets the domain for the x-axis
         *
         * @param {number} min minimum x value
         * @param {number} max maximum x value
         *
         * @returns {line}
         */
        line.xDomain = function (min, max)
        {
            _xDomain.min = min;
            _xDomain.max = max;

            return line;
        };

        /**
         * Sets the domain for the y-axis
         *
         * @param {number} min minimum y value
         * @param {number} max maximum y value
         *
         * @returns {line}
         */
        line.yDomain = function (min, max)
        {
            _yDomain.min = min;
            _yDomain.max = max;

            return line;
        };

        /**
         * Sets the function for extracting the x axis data from the data array
         *
         * @param {Function} func the function for extracting the x value from the data array
         *
         * @returns {line}
         */
        line.xFunc = function (func)
        {
            _xFunc = func;

            return line;
        };

        /**
         * Sets the function for extracting the y axis data from the data array
         *
         * @param {Function} func the function for extracting the y value from the data array
         *
         * @returns {line}
         */
        line.yFunc = function(func)
        {
            _yFunc = func;

            return line;
        };

        /**
         * Sets the function for formatting x values as tick labels
         *
         * @param {Function} func the formatting function
         *
         * @returns {line}
         */
        line.xTickFormatter = function (func)
        {
            _xTickFormatter = func;

            return line;
        };

        /**
         * Sets the function for formatting y values as tick labels
         *
         * @param {Function} func the formatting function
         *
         * @returns {line}
         */
        line.yTickFormatter = function (func)
        {
            _yTickFormatter = func;

            return line;
        };

        /**
         * Adds a horizontal mark to the graph
         *
         * @param {horizontalMark} horizontalMark the data object for the mark
         *
         * @returns {line}
         */
        line.addHorizontalMark = function (horizontalMark)
        {
            _horizontalMarks.push(horizontalMark);

            return line;
        };

        return line;
    }
} ();