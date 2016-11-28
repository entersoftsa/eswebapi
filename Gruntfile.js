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
                src: ['src/js/eswebservices.js', 'src/js/esanalytics.js', 'src/js/esenvironment.js', 'src/js/esinit.js', 'src/js/eslog.js', 'src/js/esWEBUI.js'],
                dest: 'dist/<%= pkg.name %>.js'
            },
        },


        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': '<%= concat.dist.dest %>',
                    'dist/eswebapi.templates.min.js': 'dist/eswebapi.templates.js'
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
                "examples/StoreExample/lib/eswebapi/dist",
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
            },
            hybrid: {
                files: [{
                    src: [
                        'dist/hybrid/js/*.js',
                        'dist/hybrid/styles/*.css',
                    ]
                }]
            }

        },

        useminPrepare: {
            html: ['src/hybrid/es*.html'],
            options: {
                dest: 'dist/hybrid',
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

                        js: ['concat', 'uglify:generated'],

                        css: ['concat', 'cssmin']
                    },
                    // also you MUST define 'post' field to something not null
                    post: {}

                }
            }
        },

        usemin: {
            assetsDir: ['dist/hybrid/js', 'dist/hybrid/styles'],
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
            html: ['dist/hybrid/es*.html']
        },

        htmlmin: {
            hybrid: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/hybrid/eschart.html': 'dist/hybrid/eschart.html',
                    'dist/hybrid/esgrid.html': 'dist/hybrid/esgrid.html',
                    'dist/hybrid/escombo.html': 'dist/hybrid/escombo.html',
                    'dist/hybrid/esmap.html': 'dist/hybrid/esmap.html',
                }
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
                files: [
                    {
                        cwd: 'src/languages',
                        expand: true,
                        src: ['*.*'],
                        dest: 'dist/languages/'
                    },
                ]
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
                        dest: 'examples/StoreExample/lib/eswebapi/'
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
                }, 
                {
                    expand: true,
                    cwd: 'src/languages',
                    src: ['*.*'],
                    dest: 'dist/hybrid/languages'
                }, 

                {
                    expand: true,
                    cwd: 'bower_components/bootstrap/fonts/',
                    src: ['*.*'],
                    dest: 'dist/hybrid/fonts/'
                }, {
                    expand: true,
                    cwd: 'bower_components/kendo-ui/styles/bootstrap',
                    src: ['*.*'],
                    dest: 'dist/hybrid/styles/Bootstrap'
                }]
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
                title: 'API '  + '<%= pkg.version %>'
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
                src: ['package.json', 'src/js/*.js']
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
        'ngtemplates',
        'uglify',
        'filerev:scripts',
        'copy:build',
        'copy:sourcefiles',

        /* compile documentation */
        'clean:docs',
        'clean:pub_docs',
        'ngdocs',
        'copy:docs_images',
        'copy:pub_docs',
        'hybrid'
    ]);

    // Full deploy Task
    grunt.registerTask('fulldeploy', [
        /* compile and prepare source files */
        'clean:build',
        'concat:dist',
        'ngtemplates',
        'uglify',
        'filerev:scripts',
        'copy:build',
        'copy:sourcefiles',
        /* compile documentation */
        'clean:docs',
        'clean:pub_docs',
        'ngdocs',
        'copy:docs_images',
        'copy:pub_docs',
        'hybrid',

        /* prepare for github push*/
        'prompt:github',

        /* push to gihub both documentation and source files */
        'shell:github_pub_docs',
        'shell:github_sourcefiles',

        // send email to dev community
        //'nodemailer:internal'
    ]);

    grunt.registerTask('hybrid', ['clean:hybrid', 'copy:hybrid', 'useminPrepare', 'concat:generated', 'cssmin:generated', 'uglify:generated', 'filerev:hybrid', 'usemin', 'htmlmin:hybrid']);



    // doc
    grunt.registerTask('0doc', ['clean:docs', 'clean:pub_docs', 'ngdocs', 'copy:docs_images']);

    // publish doc
    grunt.registerTask('publishdoc', ['clean:docs', 'clean:pub_docs', 'ngdocs', 'copy:docs_images', 'copy:pub_docs', 'prompt:github', 'shell:pub_docs']);

};
