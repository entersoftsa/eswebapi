/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',


        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: false
            },
            hybrid: {

            },

            dist: {
                // the files to concatenate
                src: ['src/js/eswebservices.js', 'src/js/esanalytics.js', 'src/js/esinit.js', 'src/js/eslog.js', 'src/js/esWEBUI.js'],
                dest: 'dist/<%= pkg.name %>.js'
            },

            distalljs: {
                src: [
                    "bower_components/lodash/dist/lodash.min.js",
                    "bower_components/jquery/dist/jquery.min.js",
                    "bower_components/bootstrap/dist/js/bootstrap.min.js",
                    "bower_components/angular/angular.min.js",

                    "bower_components/devextreme-web/js/cldr.min.js",
                    "bower_components/devextreme-web/js/cldr/event.min.js",
                    "bower_components/devextreme-web/js/cldr/supplemental.min.js",

                    "bower_components/devextreme-web/js/globalize.min.js",
                    "bower_components/devextreme-web/js/globalize/message.min.js",
                    "bower_components/devextreme-web/js/globalize/number.min.js",
                    "bower_components/devextreme-web/js/globalize/currency.min.js",
                    "bower_components/devextreme-web/js/globalize/date.min.js",

                    "bower_components/ng-file-upload/ng-file-upload.min.js",
                    "bower_components/angular-animate/angular-animate.min.js",
                    "bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
                    "bower_components/angular-sanitize/angular-sanitize.min.js",
                    "bower_components/ngstorage/ngstorage.min.js",
                    "bower_components/stacktrace-js/dist/stacktrace.min.js",
                    "bower_components/log4javascript/js/log4javascript.js",
                    "bower_components/moment/min/moment-with-locales.min.js",
                    "bower_components/angular-simple-logger/dist/angular-simple-logger.min.js",
                    "bower_components/angular-aria/angular-aria.min.js",
                    "bower_components/angular-messages/angular-messages.min.js",
                    "bower_components/angular-material/angular-material.min.js",
                    "bower_components/angular-ui-router/release/angular-ui-router.min.js",
                    "bower_components/angular-translate/angular-translate.min.js",
                    "bower_components/angular-translate-loader-url/angular-translate-loader-url.min.js",
                    "bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js",
                    "bower_components/angular-growl-v2/build/angular-growl.min.js",
                    "bower_components/angular-loading-bar/build/loading-bar.min.js",
                    "bower_components/perfect-scrollbar/js/perfect-scrollbar.min.js",
                    "bower_components/perfect-scrollbar/js/perfect-scrollbar.jquery.min.js",
                    "bower_components/angular-clipboard/angular-clipboard.js",

                    "bower_components/jszip/dist/jszip.min.js",

                    "bower_components/devextreme-web/js/dx.all.js",

                    "bower_components/kendo-ui/js/kendo.all.min.js",
                    "bower_components/kendo-ui/js/cultures/kendo.culture.el-GR.min.js",
                    "bower_components/kendo-ui/js/cultures/kendo.culture.en-US.min.js",
                    "bower_components/kendo-ui/js/cultures/kendo.culture.bg-BG.min.js",
                    "bower_components/kendo-ui/js/cultures/kendo.culture.ro-RO.min.js",
                    "dist/eswebapi.min.js",
                    "dist/eswebapi.templates.min.js"
                ],

                dest: 'dist/<%= pkg.name %>.all.min.js'
            },

            distallcss: {
                src: ["bower_components/bootstrap/dist/css/bootstrap.min.css",
                    "bower_components/kendo-ui/styles/kendo.common-bootstrap.min.css",
                    "bower_components/kendo-ui/styles/kendo.bootstrap.min.css",
                    "bower_components/kendo-ui/styles/kendo.dataviz.min.css",
                    "bower_components/kendo-ui/styles/kendo.dataviz.bootstrap.min.css",
                    "bower_components/angular-material/angular-material.css",
                    "bower_components/mdi/css/materialdesignicons.min.css",
                    "bower_components/angular-loading-bar/build/loading-bar.min.css",
                    "bower_components/perfect-scrollbar/css/perfect-scrollbar.min.css",
                    "bower_components/devextreme-web/css/dx.common.css",
                    "bower_components/devextreme-web/css/dx.light.css",
                ],

                dest: 'dist/<%= pkg.name %>.all.css'
            },

            uilessdist: {
                // the files to concatenate
                src: ['src/js/eswebservices.js', 'src/js/esinit.js', 'src/js/eslog.js'],
                dest: 'dist/<%= pkg.name %>-uiless.js'
            },
        },


        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': '<%= concat.dist.dest %>',
                    'dist/<%= pkg.name %>-uiless.min.js': '<%= concat.uilessdist.dest %>',
                    'dist/eswebapi.templates.min.js': 'dist/eswebapi.templates.js'
                }
            },

            hybrid: {
                files: {
                    'dist/hybrid/js/app.min.js': 'src/hybrid/script.js',
                }
            }
        },

        clean: {
            options: {
                force: true
            },
            build: [
                "dist",
                "examples/eswebapicalls/lib/eswebapi/dist",
                "../eswebmanager/lib/eswebapi",
                "../esrfaloreal/lib/eswebapi"
            ],

            docs: ['docs'],

            hybrid: ['dist/hybrid'],

            pub_docs: ['../../docs_eswebapi/eswebapi/css/',
                '../../docs_eswebapi/eswebapi/font/',
                '../../docs_eswebapi/eswebapi/grunt-scripts/',
                '../../docs_eswebapi/eswebapi/grunt-styles/',
                '../../docs_eswebapi/eswebapi/js/',
                '../../docs_eswebapi/eswebapi/partials/',
                '../../docs_eswebapi/eswebapi/index.html'
            ]
        },

        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                globals: {
                    jQuery: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: ['lib/**/*.js', 'test/**/*.js']
            }
        },

        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 16
            },
            scripts: {
                src: 'dist/*.min.js',
                dest: 'dist'
            }

        },

        useminPrepare: {
            html: ['src/hybrid/es*.html'],
            options: {
                dest: 'dist/hybrid',
                blockReplacements: {
                    ESDEBUG: function(block) {
                        return 'Hello ';
                    }
                },

                flow: {
                    steps: {
                        css: ['concat', 'cssmin']
                    }
                },

                post: {}
            }
        },

        usemin: {
            assetsDir: ['dist/hybrid/'],
            options: {
                blockReplacements: {
                    ESDEBUG: function(block) {
                        return 'Hello ';
                    }
                }
            },
            html: ['dist/hybrid/es*.html']
        },

        htmlmin: {
            hybrid: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/hybrid/escombo.html': 'dist/hybrid/escombo.html'                }
            }
        },


        /**
         * compile templates into one single static file
         */
        ngtemplates: {
            app: {
                src: ['src/partials/**.html', 'src/partials/esSurvey/**.html'],
                dest: 'dist/<%= pkg.name %>.templates.js',
                options: {
                    module: 'es.Web.UI',
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

        copy: {
            build: {
                files: [{
                    cwd: 'src/languages',
                    expand: true,
                    src: ['*.*'],
                    dest: 'dist/languages/'
                }, 
                {
                    cwd: 'src/images',
                    expand: true,
                    src: ['*.*'],
                    dest: 'dist/images/'
                },]
            },

            sourcefiles: {
                files: [
                    // includes files within path and its sub-directories
                    {
                        expand: true,
                        src: ['dist/**', 'dist/languages/'],
                        dest: 'examples/eswebapicalls/lib/eswebapi/'
                    },
                    {
                        expand: true,
                        src: ['dist/**', 'dist/languages/'],
                        dest: '../eswebmanager/lib/eswebapi/'
                    },
                    {
                        expand: true,
                        src: ['dist/**', 'dist/languages/'],
                        dest: '../esrfaloreal/lib/eswebapi/'
                    },
                ],
            },

            hybrid: {
                files: [{
                        expand: true,
                        cwd: 'src/hybrid',
                        src: ['*.html'],
                        dest: 'dist/hybrid/'
                    }, {
                        expand: true,
                        cwd: 'src/languages',
                        src: ['*.*'],
                        dest: 'dist/hybrid/languages'
                    },
                    {
                        expand: true,
                        cwd: 'src/images',
                        src: ['*.*'],
                        dest: 'dist/hybrid/images'
                    },

                    {
                        expand: true,
                        cwd: 'dist',
                        src: 'eswebapi.all.min.js',
                        dest: 'dist/hybrid/js'
                    },

                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap/fonts/',
                        src: ['*.*'],
                        dest: 'dist/hybrid/fonts/'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/mdi/fonts/',
                        src: ['*.*'],
                        dest: 'dist/hybrid/fonts/'
                    },

                    {
                        expand: true,
                        cwd: 'bower_components/devextreme-web/css/icons',
                        src: ['*.*'],
                        dest: 'dist/hybrid/styles/icons/'
                    },

                    {
                        expand: true,
                        cwd: 'bower_components/kendo-ui/styles/bootstrap',
                        src: ['*.*'],
                        dest: 'dist/hybrid/styles/Bootstrap'
                    }, {
                        expand: true,
                        cwd: 'bower_components/kendo-ui/styles/fonts/glyphs/',
                        src: ['*.*'],
                        dest: 'dist/hybrid/styles/fonts/glyphs/'
                    }
                ]
            },

            verlibs: {
                files: [{
                        src: 'dist/eswebapi.all.min.js',
                        dest: 'dist/eswebapi.' + '<%= pkg.version %>' + '.all.min.js'
                    }, {
                        src: 'dist/eswebapi.all.css',
                        dest: 'dist/eswebapi.' + '<%= pkg.version %>' + '.all.css'
                    },
                    {
                        src: 'dist/eswebapi-uiless.min.js',
                        dest: 'dist/eswebapi-uiless.' + '<%= pkg.version %>' + '.min.js'
                    },
                    {
                        src: 'dist/eswebapi.min.js',
                        dest: 'dist/eswebapi.' + '<%= pkg.version %>' + '.min.js'
                    }
                ]
            },

            docs_images: {
                files: [{
                    cwd: 'src/content/assets/images',
                    expand: true,
                    src: ['favicon.ico'],
                    dest: 'docs/'
                }, {
                    cwd: 'src/content/assets/',
                    expand: true,
                    src: ['images/**', '!images/favicon.ico'],
                    dest: 'docs/'
                }, ],
            },
            pub_docs: {
                files: [
                    // includes files within path and its sub-directories
                    {
                        cwd: 'docs/',
                        expand: true,
                        src: ['**'],
                        dest: '../../docs_eswebapi/eswebapi/'
                    },
                ],
            }
        },

        connect: {
            options: {
                keepalive: true
            },
            server: {}
        },

        ngdocs: {
            options: {
                dest: 'docs',
                html5Mode: false,
                scripts: [
                    'bower_components/angular/angular.min.js',
                    'bower_components/angular-animate/angular-animate.min.js'
                ],
                bestMatch: true,
                startPage: '/api',
                title: "Entersoft AngularJS API",
                titleLink: "#/api",
                image: "src/content/assets/logo.png",
                imageLink: "http://www.entersoft.eu",
                analytics: {
                    account: 'UA-50505865-6',
                    domainName: 'entersoft.gr'
                }
            },
            api: {
                src: ['src/js/*.js', 'src/content/api/*.ngdoc'],
                title: 'API ' + '<%= pkg.version %>'
            },
            basicconcepts: {
                src: [
                    'src/content/basicconcepts/*.ngdoc'
                ],
                title: 'Basic Concepts'
            },

            installation: {
                src: [
                    'src/content/installation/*.ngdoc'
                ],
                title: 'Installation'
            }
        },

        prompt: {
            github: {
                options: {
                    questions: [{
                        config: 'github_userid',
                        type: 'input',
                        message: 'Github UserID',
                        validate: function(value) {
                            if (!value) {
                                return 'Should not be blank';
                            }
                            return true;
                        }
                    }, {
                        config: 'github_password',
                        type: 'password',
                        message: 'Github Password',
                        validate: function(value) {
                            if (!value) {
                                return 'Should not be blank';
                            }
                            return true;
                        }
                    }]
                }
            }
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: 'eswebapi.all.css',
                    dest: 'dist/hybrid/styles',
                    ext: '.min.css'
                }]
            }
        },

        shell: {
            github_sourcefiles: {
                command: "git add --all&&git commit -m '<%= pkg.version %>'&&git tag <%= pkg.version %>&&git push https://<%= github_userid %>:<%= github_password %>@github.com/entersoftsa/eswebapi.git dev1.8.0 --tags",
                options: {
                    execOptions: {
                        maxBuffer: 400 * 1024
                    }
                }
            },
            github_pub_docs: {
                command: "git add --all&&git commit -m '<%= pkg.version %>'&&git push https://<%= github_userid %>:<%= github_password %>@github.com/entersoftsa/eswebapi.git gh-pages --tags",
                options: {
                    execOptions: {
                        maxBuffer: 400 * 1024,
                        cwd: '../../docs_eswebapi/eswebapi/'
                    }
                }
            }
        },

        version: {
            // options: {}, 
            defaults: {
                src: ['package.json', 'src/js/*.js', 'src/hybrid/esver.txt']
            }
        },

        nodemailer: {
            options: {
                transport: {
                    type: 'SMTP',
                    options: {
                        host: 'septimus',
                        port: 25
                    }
                },
                message: {
                    from: "esWebApi <sme@entersoft.gr>",
                    subject: 'Entersoft AngularJS Web API v<%= pkg.version %> is available',
                    html: "<body><h1>Entersoft AngularJS Web API v<%= pkg.version %></h1><p>In order to get the latest version please visit <a href='https://github.com/entersoftsa/eswebapi'>Entersoft AngularJS Web API</a>.<br/>For the documentation please visit <a href='http://developer.entersoft.gr/eswebapi'>API Reference</a>.</p><br/><div><a href='http://www.entersoft.gr'><img title='Entersoft SA' src='http://www.entersoft.gr/User_Scenario/Images/Logo.png'/></a></div></body>",
                },

                recipients: [{
                    email: 'development@entersoft.gr',
                    name: 'Entersoft Development'
                }]
            },

            internal: {}
        },

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-filerev');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-prompt');
    grunt.loadNpmTasks('grunt-version');
    grunt.loadNpmTasks('grunt-nodemailer');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    // Build Sources Task
    grunt.registerTask('1build', [
        /* compile and prepare source files */
        'clean:build',
        'concat:dist',
        'concat:uilessdist',
        'ngtemplates',
        'uglify',
        'filerev:scripts',
        'copy:build',
        'concat:distalljs',
        'concat:distallcss',
        'copy:verlibs',

        /* compile documentation */
        'clean:docs',
        'clean:pub_docs',
        'ngdocs',
        'copy:docs_images',
        'copy:pub_docs',
        'hybrid',
        'copy:sourcefiles',

    ]);

    // Full deploy Task
    grunt.registerTask('fulldeploy', [
        /* compile and prepare source files */
        'clean:build',
        'concat:dist',
        'concat:uilessdist',
        'ngtemplates',
        'uglify',
        'filerev:scripts',
        'copy:build',
        'concat:distalljs',
        'concat:distallcss',
        'copy:verlibs',

        /* compile documentation */
        'clean:docs',
        'clean:pub_docs',
        'ngdocs',
        'copy:docs_images',
        'copy:pub_docs',
        'hybrid',
        'copy:sourcefiles',


        /* prepare for github push*/
        'prompt:github',

        /* push to gihub both documentation and source files */
        'shell:github_pub_docs',
        'shell:github_sourcefiles',

        // send email to dev community
        //'nodemailer:internal'
    ]);

    grunt.registerTask('hybrid', ['clean:hybrid', 'copy:hybrid', 'useminPrepare', 'usemin', 'concat:generated', 'cssmin:generated', 'uglify:hybrid', 'htmlmin:hybrid', 'cssmin']);



    // doc
    grunt.registerTask('0doc', ['clean:docs', 'clean:pub_docs', 'ngdocs', 'copy:docs_images']);

    // publish doc
    grunt.registerTask('publishdoc', ['clean:docs', 'clean:pub_docs', 'ngdocs', 'copy:docs_images', 'copy:pub_docs', 'prompt:github', 'shell:github_pub_docs']);

};