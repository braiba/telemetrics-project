!function() {
    floow.text = {

        /**
         * Pads a string to a specified length by repeatedly prepending a given character
         *
         * @param {string} input   the input value
         * @param {int}    length  the length to pad to
         * @param {string} padding the character to use for padding
         *
         * @returns {string}
         */
        leftPad: function(input, length, padding)
        {
            var output = '' + input; // force string
            while (output.length < length) {
                output = padding + output;
            }
            return output;
        }
    };
}();