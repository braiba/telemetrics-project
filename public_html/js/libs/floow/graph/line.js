!function() {
    floow.graph.line = function()
    {
        var id         = 'line' + Math.random() * 100000;
        var _container = undefined;
        var _height    = 400;
        var _margins   = {
            top: 25,
            right: 25,
            bottom: 25,
            left: 25
        };
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
         *
         * @param {Object} container
         *
         * @returns {Object}
         */
        function line(container)
        {
            _container = container;

            var width = parseInt(container.style('width'));
            var rows  = _data;

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

            var clipPathName = id + 'path';

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
                'resize.' + id,
                function()
                {
                    var container = _container;
                    container.selectAll('*').remove();
                    line(container);
                }
            );
        }

        line.setHeight = function(height)
        {
            _height = height;

            return line;
        };

        line.setMargins = function(top, right, bottom, left)
        {
            _margins.top    = top;
            _margins.right  = right;
            _margins.bottom = bottom;
            _margins.left   = left;

            return line;
        };

        line.setData = function (data)
        {
            _data = data;

            return line;
        };

        line.setXDomain = function (min, max)
        {
            _xDomain.min = min;
            _xDomain.max = max;

            return line;
        };

        line.setYDomain = function (min, max)
        {
            _yDomain.min = min;
            _yDomain.max = max;

            return line;
        };

        line.setXFunc = function(func)
        {
            _xFunc = func;

            return line;
        };

        line.setYFunc = function(func)
        {
            _yFunc = func;

            return line;
        };

        line.setXTickFormatter = function(func)
        {
            _xTickFormatter = func;

            return line;
        };

        line.setYTickFormatter = function(func)
        {
            _yTickFormatter = func;

            return line;
        };

        line.addHorizontalMark = function(horizontalMark)
        {
            _horizontalMarks.push(horizontalMark);

            return line;
        };

        return line;
    }
}();