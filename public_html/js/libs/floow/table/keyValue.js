!function() {
    floow.table.keyValue = function()
    {
        var _data = undefined;

        function keyValue(container)
        {
            var rows = _data;

            var table = container.append("table")
                .attr('class', 'keyValue');

            for (var key in rows) {
                var value = rows[key];

                var tr = table.append("tr");

                tr.append('th')
                    .html(key);

                tr.append('td')
                    .html(value);
            }
        }


        keyValue.setData = function (data)
        {
            _data = data;

            return keyValue;
        };

        return keyValue;
    }
}();