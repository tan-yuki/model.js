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

    module('Model');

    test("Create model", function() {
        var Person = mvc.Model.create();
        ok(Person.records, "model has records");

        var person = Person.init({
            name: 'tanakayuki',
            age:  25,
            male: true
        });

        person.save();

        var p = Person.find(person.id);
        equal(p.name, 'tanakayuki');
        equal(p.age,  25);
        ok(p.male)
    });

    test("Throw exception when not found record", function() {
        var Person = mvc.Model.create();
        Person.attributes = ['name', 'age', 'male'];
        throws(function() {
            Person.find(1);
        });
    });

    test("Generate records id", function() {
        var Person = mvc.Model.create();

        var person = Person.init({
            name: 'tanaka',
            age:  25,
            male: true
        });

        ok(! person.id);
        person.save();
        ok(person.id);
    });

    test("Saving record should not effect to other record", function() {
        var Person = mvc.Model.create();

        var person1 = Person.init({
            name: 'tanaka',
            age:  25,
            male: true
        });
        person1.save();

        var person2 = Person.init({
            name: 'akiyama',
            age:  26,
            male: false
        });
        person2.save();

        equal(Person.find(person1.id).name, 'tanaka');
        equal(Person.find(person1.id).age,  25);
        ok(Person.find(person1.id).male);

        equal(Person.find(person2.id).name, 'akiyama');
        equal(Person.find(person2.id).age,  26);
        ok(! Person.find(person2.id).male);

        person1.name = 'tanaka - update';
        person1.save();

        equal(Person.find(person1.id).name, 'tanaka - update');
        equal(Person.find(person2.id).name, 'akiyama');
    });

    test('populate', function() {
        expect(7);
        var Person = mvc.Model.create();

        var personMaster = [
            {
                name: 'itanotomomi',
                age:  22,
                male: false
            },
            {
                name: 'takahashiminami',
                age:  23,
                male: false
            },
            {
                name: 'akimotoyashushi',
                age: 48,
                male: true
            }
        ];

        // set attributes
        Person.populate(personMaster);
        var records = Person.records;

        var cnt = 0;
        for (var key in records) {
            cnt++;
            var record = records[key];
            if (record.name === 'itanotomomi') {
                equal(record.age, 22);
                ok(! record.male);
            } else if (record.name === 'takahashiminami') {
                equal(record.age, 23);
                ok(! record.male);
            } else if (record.name === 'akimotoyashushi') {
                equal(record.age, 48);
                ok(record.male);
            } else {
                ok(false, 'Unknown name [name=' + record.name + ']');
            }
        }

        equal(cnt, 3);
    });

    test('destroy', function() {
        var Person = mvc.Model.create();

        var person1 = Person.init({
            name: 'tanaka',
            age:  25,
            male: true
        });
        person1.save();

        var person2 = Person.init({
            name: 'akiyama',
            age:  26,
            male: false
        });
        person2.save();

        person1.destroy();

        ok(Person.find(person2.id));
        equal(Person.find(person2.id).name, 'akiyama');
        equal(Person.find(person2.id).age, 26);
        ok(! Person.find(person2.id).male);
        throws(function() {
            Person.find(person1.id);
        });

    });


    test('attributes', function() {
        var Person = mvc.Model.create();
        Person.attributes = ['name', 'age', 'male'];

        var person = Person.init({
            name: 'tanakayuki',
            male: true,
            profession: 'IT'
        })

        equal(person.attributes().name,       'tanakayuki');
        equal(person.attributes().age,        undefined);
        equal(person.attributes().male,       true);
        equal(person.attributes().profession, undefined);
    });
}) (this.jQuery, this);


