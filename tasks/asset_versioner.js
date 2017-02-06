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
const path = require('path');

module.exports = function(grunt) {

  function getFileExtension(filePath) {
    let fileExtension;

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

    return fileExtension;
  }

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
      // TODO : Change this out for a mapping of [original_file_path => new_file_path].
      const hashes = grunt.file.expand(fileGlob.orig.src).map((filePath) => {
        // Make sure this is a file, not a directory or symlink.
        if (!grunt.file.isFile(filePath)) {
          return null;
        }

        const md5Hash = crypto.createHash('md5');
        const fileName = path.basename(filePath);
        const fileExtension = getFileExtension(filePath);

        // Create a hash based on the file name and current micro-time.
        md5Hash.update(filePath + (new Date).getTime());

        const newFilePath = filePath.replace(fileName, md5Hash.digest('hex') + fileExtension);

        return {
          new_file_path: newFilePath,
          old_file_path: filePath,
        };
      }).filter((element) => {
        return (element !== null);
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
