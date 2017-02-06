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
      grunt.fail.warn('File has unsupported file extension: ' + filePath, 6);
      fileExtension = '';
    }

    return fileExtension;
  }

  /**
   * Create a file name consisting of a hash based on the original file name and current micro-time.
   *
   * @param {String} filePath
   *
   * @returns {String} - The hashed file name.
   */
  function getHashedFilePath(filePath) {
    const md5Hash = crypto.createHash('md5');
    const fileExtension = getFileExtension(filePath);

    md5Hash.update(filePath + (new Date).getTime());

    return md5Hash.digest('hex') + fileExtension;
  }

  grunt.registerMultiTask('asset_versioner', 'Versions your JS and CSS assets.', function() {
    // Merge default options with existing ones.
    var options = this.options({
      mappingFile: './mappings.json'
    });

    if (!grunt.file.exists(options.mappingFile)) {
      // Create the mapping file. Use an empty JSON object as the file contents.
      grunt.file.write(options.mappingFile, '{}');
    }

    let mappings = grunt.file.readJSON(options.mappingFile);

    if ((typeof mappings) !== 'object') {
      grunt.fail.fatal('Unable to parse mapping file, and read as JSON: ' + options.mappingFile, 3);
    }

    // Iterate over the list of file paths.
    this.files.forEach(function(file) {
      // Iterate over all files that match the file path.
      file.src.map((filePath) => {
        // Make sure this is a file, not a directory or symlink.
        if (!grunt.file.isFile(filePath)) {
          return null;
        }

        const newFilePath = file.dest + '/' + getHashedFilePath(filePath);

        grunt.log.debug('Used file path "' + filePath + '" to create hashed file path: "' + newFilePath + '".');

        return {
          new_file_path: newFilePath,
          old_file_path: filePath
        };
      }).filter((element) => {
        // Remove any null values that were previously not a path to a valid file.
        return (element !== null);
      }).forEach((pathMapping) => {
        // Copy the original file to the new file path.
        grunt.file.copy(pathMapping.old_file_path, pathMapping.new_file_path);
        grunt.log.debug('Copied "' + pathMapping.old_file_path + '" to "' + pathMapping.new_file_path + '".');
      });

    });
  });

};
