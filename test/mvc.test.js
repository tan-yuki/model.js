/**
 * Test case for mvc.js
 */

(function($, __global__) {
    module('util.events', {
        teardown: function() {
            mvc.util.events.off();
        }
    });

    test('make fire not register events', function() {
        var events = mvc.util.events;
        events.fire('nothing.event');
        ok(true, "fire not register events");
    });

    test('make fire register events', function() {
        expect(2);
        var events = mvc.util.events;

        events.on('test', function() {
            ok(true, "register by on");
        });

        events.fire('test');
        events.fire('test');
    });

    test('make fire register once events', function() {
        expect(1);
        var events = mvc.util.events;

        events.once('test', function() {
            ok(true, "register by on");
        });

        events.fire('test');
        events.fire('test');
    });

    test('register some events in the same event name', function() {
        expect(2);
        var events = mvc.util.events;

        events.on('test', function() {
            ok(true, "register by on (1)");
        });

        events.on('test', function() {
            ok(true, "register by on (2)");
        });

        events.fire('test');
    });

    test('events arguments', function() {
        expect(2);
        var events = mvc.util.events;

        events.on('test', function(txt, num) {
            equal(txt, "aaaa", "event argument0");
            equal(num, 100,    "event argument1");
        });

        events.fire('test', "aaaa", 100);
    });

    test('events off', function() {
        expect(1);
        var events = mvc.util.events;

        events.on('test', function() {
            ok(! true, "should not call off events");
        });

        events.off('test');
        events.fire('test');

        events.on('test1', function() {
            ok(! true, "should not call off event (1)");
        });
        events.on('test2', function() {
            ok(! true, "should not call off event (2)");
        });

        events.off();
        events.fire('test1');
        events.fire('test2');

        ok(true);
    });


    module('Class');

    test('Class exists', function() {
        ok(mvc.Class);
    });

    test('extend', function() {
        var greeting = "Hello!";

        var Person = new mvc.Class();
        Person.extend({
            say: function() {
                return greeting;
            },

            type: "human"
        });

        equal(Person.type,  "human",  "Class enable to extend property");
        equal(Person.say(), greeting, "Class enable to extend function");
    });

    test("include", function() {
        var greeting = "Good Bye!";

        var Person = new mvc.Class();
        Person.include({
            say: function() {
                return greeting;
            },

            age: 25
        });

        var person = new Person();
        equal(person.age,   25,       "Class enable to include property");
        equal(person.say(), greeting, "Class enable to include function");
    });

}) (this.jQuery, this);


