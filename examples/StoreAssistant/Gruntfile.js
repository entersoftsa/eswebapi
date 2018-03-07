/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Task configuration.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
            '  */\n',

        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: false
            },
        },

        clean: {
            options: {
                force: true
            },
            build: ['dist'],
        },

        version: {
            // options: {}, 
            defaults: {
                src: ['package.json', 'scripts/app.js']
            }
        },

        copy: {
            build: {
                files: [{
                    src: ['index.html', 'termsofuse.html', 'manifest.xml', 'eslogo.png', 'eslogo32.png', 'eslogohires.png'],
                    dest: 'dist/'
                }, 
                {
                    expand: true,
                    cwd: 'languages/',
                    src: ['*.*'],
                    dest: 'dist/languages/'
                }]
            }
        },

        ngtemplates: {
            app: {
                src: ['views/*.html'],
                dest: 'scripts/app.templates.js',
                options: {
                    module: 'esStoreAssistant',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true, // Only if you don't use comment directives! 
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                }
            }
        },

        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 16
            },
            release: {
                // filerev:release hashes(md5) all assets (images, js and css )
                // in dist directory
                files: [{
                    src: [
                        'dist/js/*.js',
                        'dist/styles/*.css',
                    ]
                }]
            }
        },

        useminPrepare: {
            html: 'index.html',
            options: {
                dest: 'dist',
                blockReplacements: {
                    ESDEBUG: function(block) {
                        return '';
                    }
                },
                flow: {
                    // i'm using this config for all targets, not only 'html'
                    steps: {
                        // Here you define your flow for your custom block - only concat
                        extjs: ['concat'],

                        extcss: ['concat'],

                        js: ['concat', 'uglify:generated']
                    },
                    // also you MUST define 'post' field to something not null
                    post: {}

                }
            }
        },
        usemin: {
            assetsDir: ['dist/js', 'dist/styles'],
            options: {
                blockReplacements: {
                    extjs: function(block) {
                        return '<script src="' + block.dest + '"></script>';
                    },
                    extcss: function(block) {
                        return '<link rel="stylesheet" href="' + block.dest + '">';
                    }
                }
            },
            html: ['dist/index.html']
        },
        

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-filerev');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-version');

    grunt.registerTask('readpkg', 'Read in the package.json file', function() {
        grunt.config.set('pkg', grunt.file.readJSON('package.json'));
    });

    grunt.registerTask('release', ['readpkg', 'clean:build', 'copy:build', 'ngtemplates', 'useminPrepare', 'concat:generated',  'uglify:generated', 'filerev', 'usemin']);
};
