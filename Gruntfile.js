var path = require('path');
var spawn = require('child_process').spawn;

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean : ["tmp"],
    svn_export: {
      dev: {
        options: {
          repository: 'http://game-music-emu.googlecode.com/svn/trunk',
          output: 'tmp/src'
        }
      }
    },
    includes: {
      files: {
        src: ['src/js/*.js'], // Source files
        dest: 'tmp', // Destination directory
        flatten: true,
        cwd: '.'
      }
    }
  });

   grunt.registerTask('compile', 'Compile the C libraries with emscripten.', function(outfile) {
        var cb = this.async();

        var emcc = process.env.EMCC_BIN || grunt.option('emcc') || 'emcc';
        var gme_dir = path.join('tmp', 'src', 'gme');
        var gme_files = grunt.file.expand(gme_dir + '/*.cpp');

        var import_flags = [];
        //var source_files = gme_files;
        var source_files = grunt.file.expand('src/c/*.c');
        outfile = outfile || 'tmp/build/a.out.js';
        var flags = [
            '-s', 'ASM_JS=1',
            //'-g3',
            //'-s', "EXPORTED_FUNCTIONS=['_gme_track_info','_gme_open_data','_gme_track_count','_gme_start_track','_gme_play','_gme_track_ended']",
            '-s', "EXPORTED_FUNCTIONS=['_gmemujs_test']",
            //'-s', 'LABEL_DEBUG=1',
            '-O1',
            //'-I' + gme_dir,
            '-o',  outfile,

            // GCC/Clang arguments to shut up about warnings in code I didn't
            // write. :D
            '-Wno-deprecated',
            '-Qunused-arguments',
            '-Wno-logical-op-parentheses'
        ];
        var args = [].concat(flags, source_files);
        console.log(args);
        grunt.log.writeln('Compiling via emscripten to ' + outfile);
        var build_proc = spawn(emcc, args, {stdio: 'inherit'});
        build_proc.on('exit', function() {
            cb();
        });
    });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-svn-export');
  grunt.loadNpmTasks('grunt-includes');
  grunt.registerTask('default', [/*'clean', 'svn_export',*/ 'compile', 'includes']);
};

/*
emconfigure cmake ../src
emmake make
emcc gme/libgme.so
*/