!function() {
    floow.graph.line.horizontalMark = function(value)
    {
        var _value = value;
        var _label = undefined;

        /**
         *
         * @param {Object}   svg       the svg to add the mark to
         * @param {Function} xScale    the x-scale callback
         * @param {Function} yScale    the y-scale callback
         * @param {*}        minXValue the minimum value of the horizontal domain
         * @param {*}        maxXValue the maximum value of the horizontal domain
         */
        function horizontalMark(svg, xScale, yScale, minXValue, maxXValue)
        {
            var xMin = xScale(minXValue);
            var xMax = xScale(maxXValue);
            var yPos = yScale(_value);

            var g = svg.append("g")
                .attr("class", "marker");

            g.append("line")
                .attr("x1", xMin)
                .attr("y1", yPos)
                .attr("x2", xMax)
                .attr("y2", yPos);

            if (_label !== undefined) {
                g.append("text")
                    .attr("x", xMax)
                    .attr("y", yPos)
                    .attr("dy", "-.15em")
                    .attr("text-anchor", "end")
                    .text(_label);
            }
        }

        horizontalMark.label = function(label)
        {
            _label = label;

            return horizontalMark;
        };

        return horizontalMark;
    }
}();