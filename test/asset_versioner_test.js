'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.asset_versioner = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  custom_options: function(test) {
    test.expect(6);

    var javascripts = grunt.file.expand('tmp/*.js');
    var stylesheets = grunt.file.expand('tmp/*.css');

    test.equal(1, javascripts.length);
    test.equal(1, stylesheets.length);

    var actual = grunt.file.read(javascripts[0]);
    var expected = grunt.file.read('test/fixtures/123.js');
    test.equal(actual, expected, 'should describe what the default behavior is.');

    actual = grunt.file.read(stylesheets[0]);
    expected = grunt.file.read('test/fixtures/testing.css');
    test.equal(actual, expected, 'should describe what the default behavior is.');

    var mapping = grunt.file.readJSON('tmp/js-mappings.json');
    test.equal(mapping['test/fixtures/123.js'], javascripts[0]);
    test.equal(mapping['test/fixtures/testing.css'], stylesheets[0]);

    test.done();
  },
};
