(function($, __global__) {
    var mvc = {},
        shift = Array.prototype.shift;


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
        },

        /**
         * PubSub
         */
        events: {
            handlers: {},

            /**
             * Register event
             *
             * @param {String}   evname  Event name
             * @param {Function} func    Function
             * @param {Boolean}  once    True if you want to fire this event only one time
             */
            on: function(evname, func, once) {
                if (! this.handlers[evname]) {
                    this.handlers[evname] = [];
                }

                this.handlers[evname].push({func: func, once: once});
            },

            /**
             * Register once event
             *
             * @param {String}   evname  Event name
             * @param {Function} func    Function
             *
             * @see mvc.util.events.on
             */
            once: function(evname, func) {
                this.on(evname, func, true);
            },

            /**
             * Fire registered events
             *
             * <pre>
             * arg0:     event name
             * arg1-n:   arguments to this event
             * </pre>
             *
             */
            fire: function() {
                var evname = shift.apply(arguments);
                var events = this.handlers[evname];
                if (! events) {
                    return;
                }

                for (var i = 0, len = events.length; i < len; i++) {
                    if (! events[i]) {
                        continue;
                    }

                    events[i].func.apply(this, arguments);
                    if (events[i].once) {
                        events[i] = null;
                    }
                }
            },

            /**
             * Delete register event
             *
             * @param {String} evname  Event name. If you not set, delete all events.
             */
            off: function(evname) {
                if (! evname) {
                    this.handlers = {};
                    return;
                }

                this.handlers[evname] = null;
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

