(function(root, mod) {
    if (typeof exports == "object" && typeof module == "object") return mod(exports); // CommonJS
    if (typeof define == "function" && define.amd) return define(["exports"], mod); // AMD
    mod(root.lzw || (root.lzw = {})); // Plain browser env
})(this, function(exports) {

    var INIT_TABLE_LEN = 256;

    function LZW(source) {
        this.source = source;
    }

    LZW.prototype = {
        constructor: LZW,

        encode: function() {
            var table    = {},
                source   = this.source || '',
                len      = source.length,
                tableLen = INIT_TABLE_LEN - 1,
                output   = [],
                str      = source[0],
                i,
                char, group;

            if(!len) return source;

            for(i = 0; i < INIT_TABLE_LEN; i++) {
                table[String.fromCharCode(i)] = i;
            }


            for(i = 1; i < len; i++) {
                char  = source[i];
                group = str + char;

                if(table.hasOwnProperty(group)) {
                    str = group;
                } else {
                    output.push(table[str]);
                    table[group] = ++tableLen;
                    str = char;
                }
            }

            str && output.push(table[str]);

            return output;
        },

        /**
         * http://rosettacode.org/wiki/LZW_compression#JavaScript
         */
        decode: function() {
            var table    = {},
                source   = this.source || [],
                len      = source.length,
                tableLen = INIT_TABLE_LEN,
                k, w, output, entry;

            if(!len) return source;

            for(i = 0; i < INIT_TABLE_LEN; i++) {
                table[i] = String.fromCharCode(i);
            }

            w      = table[source[0]];
            output = [w];

            for(var i = 1; i < len; i++) {
                k = source[i];

                if(typeof table[k] != 'undefined') {
                    entry = table[k];
                } else {
                    k == tableLen && (entry = w + w[0]);
                }

                output.push(entry);
                table[tableLen++] = w + entry[0];
                w = entry;
            }

            return output.join('');
        }
    };


    exports.encode = function(str) {
        return new LZW(str).encode();
    };

    exports.decode = function(arr) {
        return new LZW(arr).decode();
    };
})