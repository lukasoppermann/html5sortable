'use strict';

module.exports = function( grunt ) {
  grunt.initConfig({
    pkg    : grunt.file.readJSON('package.json'),
    banner : '/* \n * <%= pkg.name %> <%= pkg.version %>\n * <%= pkg.homepage %>\n * \n * Licensed under the <%= pkg.license %> license\n */',
    uglify : {
      production : {
        src: [ 'src/html.sortable.js' ],
        dest: 'dist/html.sortable.min.js'
      },
      'production-angular' : {
        src: [ 'src/html.sortable.angular.js' ],
        dest: 'dist/html.sortable.angular.min.js'
      }
    },
    copy : {
      production : {
        files : [
          { src: 'src/html.sortable.js', dest : 'dist/html.sortable.js' },
          { src: 'src/html.sortable.angular.js', dest : 'dist/html.sortable.angular.js' }
        ]
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            'dist/*',
            '!dist/.git*'
          ]
        }]
      }
    },
    jsvalidate: {
      options:{
        globals: {},
        esprimaOptions: {},
        verbose: false
      },
      targetName:{
        files:{
          src: [
            'Gruntfile.js',
            'src/*.js'
          ]
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'src/*.js'
      ]
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsvalidate');

  grunt.registerTask('default', ['build']);
  grunt.registerTask('clean', ['clean']);
  grunt.registerTask('validate', ['jsvalidate', 'jshint']);
  grunt.registerTask('build', ['validate', 'copy', 'uglify']);
};
