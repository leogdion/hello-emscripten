var path = require('path');
var spawn = require('child_process').spawn;
var os = require('os');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean : ["tmp"],
    includes: {
      files: {
        src: ['src/js/*.js'], // Source files
        dest: 'public/js', // Destination directory
        flatten: true,
        cwd: '.'
      }
    },
    uglify: {
      hello_emscripten: {
        files: {
          'public/js/hello-emscripten.min.js': ['public/js/hello-emscripten.js']
        }
      }
    },
    connect: {
      server: {
        options: {
          keepalive: true,
          base: 'public',
          useAvailablePort: true
        }
      }
    }
  });

   grunt.registerTask('compile', 'Compile the C libraries with emscripten.', function(outfile) {
        var cb = this.async();

        var emcc = process.env.EMCC_BIN || grunt.option('emcc') || 'emcc';
        var src_dir = path.join('src', 'c');
        var src_files = grunt.file.expand(src_dir + '/*.c');
        grunt.file.mkdir('tmp');
        var import_flags = [];
        outfile = outfile || 'tmp/hello-emscripten.js';
        var flags = [
            '-s', "EXPORTED_FUNCTIONS=['_hello_world']",
            '-O3',
            '-o',  outfile,

            // GCC/Clang arguments to shut up about warnings in code I didn't
            // write. :D
            '-Wno-deprecated',
            '-Qunused-arguments',
            '-Wno-logical-op-parentheses'
        ];
        var args = [].concat(flags, src_files);
        grunt.log.writeln('Compiling via emscripten to ' + outfile);
        var build_proc;
        if (os.type() === "Windows_NT"){

          build_proc = spawn('cmd', ['/c', emcc].concat(args), {stdio: 'inherit'});
        } else {
          build_proc = spawn(emcc, args, {stdio: 'inherit'});
        }
        build_proc.on('exit', function() {
            cb();
        });
    });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-includes');
  grunt.registerTask('build', ['clean', 'compile', 'includes', 'uglify']);
  grunt.registerTask('run', ['build', 'connect']);
  grunt.registerTask('default', ['run']);
};