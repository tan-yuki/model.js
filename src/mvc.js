(function($, __global__) {
    var mvc = {};


    /**
     * Utility for MVC
     */
    mvc.util = {
        object: {

            create: function(obj) {
                var F = function() {};
                F.prototype = obj;
                return new F();
            },

            keys: function(obj) {
                var keys = [];
                for (var key in obj) {
                    keys.push(key);
                }
                return keys;
            }
        }
    };


    /**
     * Class function.
     *
     * <code>
     *   var Model = new Class();
     *   Model.extend({
     *      // write class properties
     *   });
     *
     *   Model.include({
     *      // write instance properties
     *   });
     * </code>
     */
    mvc.Class = function () {
        var klass = function() {
            this.init.apply(this, arguments);
        };

        klass.prototype.init = function() {};

        klass.fn = klass.prototype;

        klass.fn.parent = klass;

        // Add class properties
        klass.extend = function(obj) {
            var extended = obj.extended;
            for (var i in obj) {
                klass[i] = obj[i];
            }
            if (extended) ectended(klass);
        };

        // Add instance properties
        klass.include = function(obj) {
            var included = obj.included;
            for (var i in obj) {
                klass.fn[i] = obj[i];
            }
            if (included) included(klass);
        };

        return klass;
    };

    // exports mvc to global
    __global__.mvc = mvc;

})(this.jQuery, this);

