/**
 * Test case for mvc.js
 */

(function($, __global__) {

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


