module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    cssmin: {
      target: {
        files: {
          './dist/quizzem.min.css': './src/quizzem.css'
        }
      }
    },

    uglify: {
        js: {
            src: ['./dist/quizzem.js'],
            dest: './dist/quizzem.min.js'
        }
    },

    ngAnnotate: {
      options: {
          singleQuotes: true
      },
      app: {
          files: {
              './dist/quizzem.js': ['./src/quizzem.js']
          }
      }
    },

  });


  grunt.registerTask('build', ['ngAnnotate', 'uglify', 'cssmin']);

}