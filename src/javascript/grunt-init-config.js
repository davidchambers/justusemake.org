module.exports = function(grunt) {

  grunt.initConfig({
    copy: {
      main: {
        expand: true,
        cwd: 'src/assets/',
        src: '**',
        dest: 'dist/assets/',
        flatten: true,
        filter: 'isFile',
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['copy']);

};
