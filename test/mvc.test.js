/**
 * Test case for mvc.js
 */

(function($, __global__) {


    module('Model');

    test("Create model", function() {
        var Person = Model.create();
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
        var Person = Model.create();
        Person.attributes = ['name', 'age', 'male'];
        throws(function() {
            Person.find(1);
        });
    });

    test("Generate records id", function() {
        var Person = Model.create();

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
        var Person = Model.create();

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
        var Person = Model.create();

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
        var Person = Model.create();

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
        var Person = Model.create();
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
