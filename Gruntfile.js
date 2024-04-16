module.exports = function (grunt) {
   grunt.initConfig({
      concat: {
         core: {
            src: [
               'node_modules/jquery/dist/jquery.min.js',
               'src/js/prototype.js',
               'src/js/field-group.js',
               'src/js/icons-starter.js',
               'src/js/modal-map.js',
               'src/js/index.js',
            ],
            dest: "build/js/script.js",
         }
      },
      watch: {
         options: {
            livereload: false,
            nospawn: true,
         },
         watch_js: {
            files: ["src/js/*.js"],
            tasks: ["concat"],
            options: {
               spawn: false,
            },
         },
         watch_gruntfile: {
            files: ["Gruntfile.js"],
            tasks: ["concat"],
            options: {
               spawn: false,
            }
         }
      }
   })

   grunt.loadNpmTasks("grunt-contrib-watch")
   grunt.loadNpmTasks("grunt-contrib-concat")

   grunt.registerTask('default', ['concat'])
}