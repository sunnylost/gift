(function(root, mod) {
    if (typeof exports == "object" && typeof module == "object") return mod(exports); // CommonJS
    if (typeof define == "function" && define.amd) return define(["exports"], mod); // AMD
    mod(root.lzw || (root.lzw = {})); // Plain browser env
})(this, function(exports) {

    var hasOwnProperty = Object.prototype.hasOwnProperty,
        initTable      = {},
        initTableLen   = 256,

        UNDEFINED = 'undefined';

    for(var i = 0; i < initTableLen; i++) {
        initTable[String.fromCharCode(i)] = i;
    }

    function copyTable() {
        var t = {};

        for(var i in initTable) {
            if(hasOwnProperty.call(initTable, i)) {
                t[i] = initTable[i];
            }
        }

        return t;
    }

    function LZW(source) {
        this.source = source;
        this.table  = copyTable();
    }

    LZW.prototype = {
        constructor: LZW,

        encode: function() {
            var source   = this.source || '',
                len      = source.length,
                table    = this.table,
                tableLen = initTableLen - 1,
                output   = [],
                str      = source[0],
                char, group;

            if(!len) return source;

            for(var i = 1; i < len; i++) {
                char  = source[i];
                group = str + char;
                if(typeof table[group] == UNDEFINED) {
                    output.push(table[str]);
                    table[group] = ++tableLen;
                    str = char;
                } else {
                    str = group;
                }
            }

            output.push(table[str]);

            return output.join(',');
        },

        decode: function() {
            var source   = this.source || '',
                len      = source.length,
                table    = this.table,
                tableLen = table.length - 1,
                output   = [],
                str      = source[0],
                char, group;

            if(!len) return source;

            for(var i = 1; i < len; i++) {
                char  = source[i];
                group = str + char;
                if(typeof table[group] == UNDEFINED) {
                    output.push(table[str]);
                    table[group] = tableLen + 1;
                    str = char;
                } else {
                    str += char;
                }
            }

            output.push(table[str]);

            return output.join(',');
        }
    };


    exports.encode = function(str) {
        return new LZW(str).encode();
    };
})