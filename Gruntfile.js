module.exports = function (grunt) {
    var configServer = {
        port: 8384,
        path: "fe/build/"
    };

    var config = {
        less: {
            fe: {
                files: {
                    'fe/src/styles/styles.css': 'fe/src/styles/styles.less'
                }
            }
        },
        clean: {
            clientBuild: ['fe/build']
        },
        htmlmin: {
            task: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyCSS: true
                },
                files: [{
                    expand: true,
                    cwd: 'fe/src',
                    src: ['**/*.html'],
                    dest: 'fe/build'
                }]
            }
        },
        uglify: {
            fe:{
                options: {
                    sourceMap: true,
                    mangle: false,
                    beautify: true,
                    compress: false
                },
                files: {
                    'fe/build/js/bundle.min.js': [
                        'fe/src/js/app/**/*.js'
                    ]
                }
            }
        },
        watch: {
            options: {
                spawn: false
            },
            js: {
                files: 'fe/src/**/*.js',
                tasks: ['uglify:fe']
            },
            html: {
                files: 'fe/src/**/*.html',
                tasks: ['htmlmin']
            },
            lessFE: {
                files: 'fe/src/**/*.less',
                tasks: ['less:fe', 'copy:styles']
            }
        },
        copy: {
            images: {
                files: [{
                    cwd: 'fe/src/images',
                    expand: true,
                    src: ['**/*'],
                    dest: 'fe/build/images'
                }]
            },
            libs: {
                files: [{
                    cwd: 'fe/src/js/libs',
                    expand: true,
                    src: ['**/*'],
                    dest: 'fe/build/js/libs'
                }]
            },
            styles: {
                files: [{
                    cwd: 'fe/src/styles',
                    expand: true,
                    src: ['*.css'],
                    dest: 'fe/build'
                }]
            }
        },
        browserSync: {
            dev: {
                options: {
                    port: configServer.port,
                    files: ["fe/build/*"],
                    watchTask: true,
                    server: {
                        baseDir: configServer.path,
                        directory: true
                    }
                }
            }
        }
    };

    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.registerTask('build', ['clean:clientBuild', 'uglify:fe', 'less:fe', 'copy:images', 'copy:libs', 'copy:styles', 'htmlmin']);
    grunt.registerTask('dev', ['build', 'browserSync:dev', 'watch']);
};