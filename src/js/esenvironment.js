(function(angular) {
    'use strict';

    /**
     * @module
     * @name  es.Services.Web#Environment
     * @description 
     * provides mutators ofr environment options.
     */
    angular.module('es.services.Web.Environment', [])
        .provider('Environment', [function () {
            /**
             * @private @type {Object}
             * @description holds domain to stage mappings
             */
            var domainConfig = {dev: [], prod: [], staging: []};
            var _stage = 'dev';
            var _assetsPath = '/KB/app/images';
            var _templatesPath = '/KB/app/templates';

            /**
             * attempts to get base domain from url
             * @return {string | null} domain will be null if check fails
             */
            function _getDomain() {
                var matches = document.location.href.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
                return (matches && matches[1]);
            }

            return {
                /**
                 * manually set stage
                 * @param {string env
                 */
                setStage: function (env) {
                    _stage = env;
                },

                /**
                 * read the current stage
                 * @return {string}
                 */
                getStage: function () {
                    return _stage;
                },

                /**
                 * path mutators
                 */
                setAssetsPath: function (path) {
                    _assetsPath = path;
                },
                setTemplatesPath: function (path) {
                    _templatesPath = path;
                },

                /**
                 * declares domains that run development codebase
                 * @param {array} domains
                 */
                addDevelopmentDomains: function (domains) {
                    domainConfig.dev = domains;
                    return this;
                },
                addProductionDomains: function (domains) {
                    domainConfig.prod = domains;
                    return this;
                },
                addStagingDomains: function (domains) {
                    domainConfig.staging = domains;
                    return this;
                },

                /**
                 * attempts to automatically set stage from domain url based on the domainConfig object
                 */
                setStageFromDomain: function() {
                    var domain;
                    for (var stage in domainConfig) {
                        domain = _getDomain();
                        if (domainConfig[stage].indexOf(domain) >= 0) {
                            _stage = stage;
                            break;
                        }
                    }
                },

                $get: function () {
                    return {
                        stage: _stage,
                        assetsPath: _assetsPath,
                        templatesPath: _templatesPath,
                        isDev: function () {
                            return (_stage === 'dev');
                        },
                        isProduction: function () {
                            return (_stage === 'prod');
                        },
                        isStaging: function () {
                            return (_stage === 'staging');
                        },
                        getAssetsPath: function () {
                            return _assetsPath
                        },
                        getTemplatesPath: function () {
                            return _templatesPath
                        }
                    };
                }
            };
        }]);

})(window.angular);