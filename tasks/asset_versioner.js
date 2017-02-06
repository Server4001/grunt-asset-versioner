/*
 * grunt-asset-versioner
 * https://github.com/server4001/grunt-asset-versioner
 *
 * Copyright (c) 2017 Brice Bentler
 * Licensed under the MIT license.
 */

'use strict';

const util = require('util'); // TODO : REMOVE.
const crypto = require('crypto');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('asset_versioner', 'Versions your JS and CSS assets.', function() {
    // TODO : Split this up into separate methods.

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({ // TODO : Add options.
      punctuation: '.',
      separator: ', '
    });

    console.log(util.inspect(options, {showHidden: true, depth: null})); // TODO : REMOVE.

    // Iterate over the list of file globs.
    this.files.forEach(function(fileGlob) {
      // TODO : REMOVE:
      // console.log(util.inspect(fileGlob, {showHidden: true, depth: null}));
      // console.log(fileGlob.orig.src);
      // console.log(fileGlob.orig.dest);
      // grunt.log.writeln('blah');

      console.log(fileGlob.orig.src); // TODO : REMOVE.
      // Find all file paths that match the glob.
      const hashes = grunt.file.expand(fileGlob.orig.src).map((filePath) => {
        // TODO : Check if this is a file. EG:  './js/something'.
        let fileExtension;
        let md5Hash = crypto.createHash('md5');

        // Create a hash based on the file name and current micro-time.
        md5Hash.update(filePath + (new Date).getTime());

        if (filePath.substr(-7) === '.min.js') {
          fileExtension = '.min.js';
        } else if (filePath.substr(-8) === '.min.css') {
          fileExtension = '.min.css';
        } else if (filePath.substr(-3) === '.js') {
          fileExtension = '.js';
        } else if (filePath.substr(-4) === '.css') {
          fileExtension = '.css';
        } else {
          grunt.log.error('File has unsupported file extension: ' + filePath);
          fileExtension = '';
        }

        return md5Hash.digest('hex') + fileExtension;
      });

      console.log(hashes);
      // grunt.file.copy(srcpath, destpath [, options])
      // var options = {
      //   // If an encoding is not specified, default to grunt.file.defaultEncoding.
      //   // If null, the `process` function will receive a Buffer instead of String.
      //   encoding: encodingName,
      //   // The source file contents, source file path, and destination file path
      //   // are passed into this function, whose return value will be used as the
      //   // destination file's contents. If this function returns `false`, the file
      //   // copy will be aborted.
      //   process: processFunction,
      //   // These optional globbing patterns will be matched against the filepath
      //   // (not the filename) using grunt.file.isMatch. If any specified globbing
      //   // pattern matches, the file won't be processed via the `process` function.
      //   // If `true` is specified, processing will be prevented.
      //   noProcess: globbingPatterns
      // };

      // grunt.file.delete(filepath [, options])
      // var options = {
      //   // Enable deleting outside the current working directory. This option may
      //   // be overridden by the --force command-line option.
      //   force: true
      // };
    });
  });

};
