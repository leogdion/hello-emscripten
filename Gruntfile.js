module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    svn_export: {
      dev: {
        options: {
          repository: 'http://game-music-emu.googlecode.com/svn/trunk/',
          output: 'tmp/src'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-svn-export');
  grunt.registerTask('default', ['svn_export']);
};
