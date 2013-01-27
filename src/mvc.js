(function($, __global__) {
    var mvc = {},
        util,
        Model,
        View,
        Controller,
        Class,
        shift = Array.prototype.shift;


    /**
     * Utility for MVC
     */
    util = mvc.util = {
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

        },

        guid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            }).toUpperCase();
        }
    };


    /**
     * Class.
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
    Class = mvc.Class = function () {
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
            if (extended) extended(klass);
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


    /**
     * Model class
     *
     * <code>
     * var Person = Model.create()
     * var person = Person.init();
     * </code>
     */
    Model = mvc.Model = {
        inherited: function() {},
        created: function() {},
        prototype: {
            init: function() {}
        },

        create: function() {
            var object = util.object.create(this);

            object.parent = this;
            object.fn = object.prototype;

            object.created();
            this.inherited(object);

            return object;
        },

        init: function() {
            var instance = util.object.create(this.prototype);
            instance.parent = this;
            instance.init.apply(instance, arguments);
            return instance;
        },

        extend: function(o) {
            var extended = o.extended;
            $.extend(this, o);
            if (extended) extended(this);
        },

        include: function(o) {
            var included = o.included;
            $.extend(this.prototype, o);
            if (included) included(this);
        }
    };

    // Add Model class properties
    Model.extend({
        records: {},

        find: function(id) {
            var record = this.records[id];
            if (! record) {
                throw('Not found record [id=' + id + ']');
            }
            return record.dup();
        },

        created: function() {
            this.records = {};
            this.attributes = [];
        },

        populate: function(values) {
            this.records = {};

            for(var i = 0, len = values.length; i < len; i++) {
                var record = this.init(values[i]);
                record.save();
            }
        }
    });

    // Add Model instance properties
    Model.include({
        newRecord: true,

        init: function(attrs) {
            if (attrs) this.load(attrs);
        },

        load: function(attrs) {
            for(var name in attrs) {
                this[name] = attrs[name];
            }
        },

        destroy: function() {
            delete this.parent.records[this.id];
        },

        /**
         * Save record.
         */
        save: (function() {

            var create = function() {
                if (! this.id) this.id = util.guid();
                this.newRecord = false;
                this.parent.records[this.id] = this.dup();
            };

            var update = function() {
                this.parent.records[this.id] = this.dup();
            };

            return function() {
                this.newRecord ? create.call(this) : update.call(this);
            };
        }) (),

        dup: function() {
            return $.extend(true, {}, this);
        },

        attributes: function() {
            var result = {};
            for (var i in this.parent.attributes) {
                var attr = this.parent.attributes[i];
                result[attr] = this[attr];
            }
            result.id = this.id;
            return result;
        },

        createRemote: function(url, callback) {
            $.post(url, this.attributes(), callback);
        },

        updateRemote: function(url, callback) {
            $.ajax({
                url: url,
                data: this.attributes(),
                success: callback,
                type: "PUT"
            });
        }
    });
    // exports mvc to global
    __global__.mvc = mvc;

})(this.jQuery, this);

