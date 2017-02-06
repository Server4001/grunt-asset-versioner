# grunt-asset-versioner

> Versions your JS and CSS assets.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-asset-versioner --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-asset-versioner');
```

## The "asset_versioner" task

### Overview
Grunt Asset Versioner copies JS and CSS to a new file with a unique file name. By using these new files, you benefit from the fact that a file name changes each time the file is changed. Your assets will automatically bust their own cache anytime they are updated.

This plugin creates a file containing mappings between original asset file paths, and their new unique file paths. It does this to track which previous files to delete. However, you can also use this mapping file so that you don't have to reference unique file paths in your templates. Reference the original asset paths, then write code that does the conversion for you, using the mapping file.  

In your project's Gruntfile, add a section named `asset_versioner` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  asset_versioner: {
    javascript: {
      options: {
        mappingFile: './mappings/js-mappings.json'
      },
      src: [
        './js/**/*'
      ],
      dest: './built-js'
    }
  }
});
```

### Options

#### options.mappingFile
Type: `String`
Default value: `'./mappings.json'`

The path to the file containing the mappings between original and hashed files.

### Usage Examples

#### Default Options
In this example, the default options will create a mapping file at `./mappings.json`. We will load all files matching the `./js/**/*.js` glob, and copy them to the `./build/js` directory, using unique file names.

```js
grunt.initConfig({
  asset_versioner: {
    javascript: {
      options: {},
      src: [
        './js/**/*.js'
      ],
      dest: './build/js'
    }
  }
});
```

#### Custom Options
In this example, custom options are used to specify the mapping file path that should be used. We want CSS to use one mapping file, and JS to use another.

```js
grunt.initConfig({
  asset_versioner: {
    javascript: {
      options: {
        mappingFile: './mappings/js-mappings.json'
      },
      src: [
        './js/**/*.js',
        './assets/javascript/*.js'
      ],
      dest: './build/js'
    },
    stylesheets: {
      options: {
        mappingFile: './mappings/css-mappings.json'
      },
      src: [
        './css/**/*.css',
        './assets/stylesheets/*.css'
      ],
      dest: './build/css'
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
0.1.0 - Initial version
