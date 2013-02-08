(function($, __global__) {
    var util,
        Model;


    /**
     * Utility for Model
     */
    util = {
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


        guid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            }).toUpperCase();
        }
    };

    /**
     * Model class
     *
     * <code>
     * var Person = Model.create()
     * var person = Person.init();
     * </code>
     */
    Model = {
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

        attributes: [],

        find: function(id) {
            var record = this.records[id];
            if (! record) {
                throw('Not found record [id=' + id + ']');
            }
            return record.dup();
        },

        hasAttribute: function(attr) {
            var attrs = this.attributes;

            if (! attr || ! attrs.length) return false;

            for (var i = 0, len = attrs.length; i < len; i++) {
                if (attrs[i] === attr) {
                    return true;
                }
            }

            return false;
        },


        findBy: function(attr, val) {
            var result = [];
            if (! this.hasAttribute(attr)) {
                return result;
            }

            for (var _id in this.records) {
                if (this.records[_id][attr] == val) {
                    result.push(this.find(_id));
                }
            }

            return result;
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
        },

        toArray: function() {
            var arr = [];
            for (var _id in this.records) {
                arr.push(this.records[_id]);
            }

            return arr;
        },

        empty: function() {
            var r = this.records;
            for (var key in r) {
                return false;
            }
            return true;
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
            delete this.parent.records[this._id];
        },

        /**
         * Save record.
         */
        save: (function() {

            var create = function() {
                if (! this._id) this._id = util.guid();
                this.newRecord = false;
                this.parent.records[this._id] = this.dup();
            };

            var update = function() {
                this.parent.records[this._id] = this.dup();
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
            result._id = this._id;
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

    // exports model to global
    __global__.Model = Model;

})(this.jQuery, this);

