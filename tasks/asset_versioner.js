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

  /**
   * @param {String} filePath
   *
   * @returns {String} - The file extension
   */
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
    var options = this.options({
      mappingFile: './mappings.json',
    });

    console.log(util.inspect(options, {showHidden: true, depth: null})); // TODO : REMOVE.
    console.log(util.inspect(this.files, {showHidden: true, depth: null}));

    // Ensure the mapping file is created.
    if (!grunt.file.exists(options.mappingFile)) {
      grunt.file.write(options.mappingFile, '{}');
    }

    // Iterate over the list of file paths.
    this.files.forEach(function(file) {
      // Iterate over all files that match the file path.
      file.src.map((filePath) => {
        // Make sure this is a file, not a directory or symlink.
        if (!grunt.file.isFile(filePath)) {
          return null;
        }

        const md5Hash = crypto.createHash('md5');
        const fileExtension = getFileExtension(filePath);

        // Create a hash based on the file name and current micro-time.
        md5Hash.update(filePath + (new Date).getTime());

        const newFilePath = file.dest + '/' + md5Hash.digest('hex') + fileExtension;

        return {
          new_file_path: newFilePath,
          old_file_path: filePath,
        };
      }).filter((element) => {
        return (element !== null);
      }).forEach((pathMapping) => {
        console.log(pathMapping);
      });

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

    });
  });

};
