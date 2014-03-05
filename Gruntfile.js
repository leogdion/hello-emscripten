module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean : ["tmp"],
    svn_export: {
      dev: {
        options: {
          repository: 'http://game-music-emu.googlecode.com/svn/trunk/',
          output: 'tmp/src'
        }
      }
    },
    shell: {
      emscripten : {
        command : ["echo \"test\"", "mkdir tmp/build", "cd tmp/build", "emconfigure cmake ../src","emmake make","emcc gme/libgme.so"].join('&&'),
            options: {
                stdout: true
            }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-svn-export');
  grunt.loadNpmTasks('grunt-shell');
  grunt.registerTask('default', ['clean', 'svn_export', 'shell']);
};

/*
emconfigure cmake ../src
emmake make
emcc gme/libgme.so
*/