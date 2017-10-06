(function(angular) {
    'use strict';

    var esApp = angular.module('esWebPqApp', [
        /* angular modules */
        'ngStorage',
        'ui.router',

        /* Entersoft AngularJS WEB API Provider */
        'es.Services.Web',
        'kendo.directives',
        'underscore',
        'es.Web.UI',
        'ui.bootstrap',
    ]);

    esApp.run(['$anchorScroll', function($anchorScroll) {
        window.esGoTo = function(goinpage) {
            if (!goinpage) {
                return;
            }

            $anchorScroll(goinpage);
        }
    }]);


    esApp.config(['$logProvider', 'esWebApiProvider', '$translateProvider',
        function($logProvider, esWebApiServiceProvider, $translateProvider) {

            var settings = window.esWebApiSettings || {
                host: "eswebapi.entersoft.gr"
            };
            esWebApiServiceProvider.setSettings(settings);

            $translateProvider.useStaticFilesLoader({
                files: [{
                    prefix: 'languages/eswebapi-locale-',
                    suffix: '.json'
                }]
            });
            $translateProvider.preferredLanguage('el');
            $translateProvider.fallbackLanguage('en');
            $translateProvider.useSanitizeValueStrategy('escape');
        }
    ]);

    function doPrepareCtrl($scope, esMessaging, esGlobals) {
        $scope.isReady = false;


        esMessaging.subscribe("ES_HTTP_CORE_ERR", function(rejection, status) {
            var s = esGlobals.getUserMessage(rejection, status);
            alert(s.messageToShow);
        });

        esGlobals.getESUISettings().mobile = window.esDeviceMode;
        esGlobals.getESUISettings().defaultGridHeight = window.esGridHeight ? (window.esGridHeight.toString() + "px") : "";

        if (esGlobals.getESUISettings().mobile && window.esGridHeight && window.esGridHeight > 80) {
            esGlobals.getESUISettings().defaultGridHeight = (window.esGridHeight - 80).toString() + "px";
        }
    }

    function doLogin($scope, esGlobals, esWebApiService, runOnSuccess) {
        if (window.esWebApiToken) {
            $scope.ownLogin = false;
            esGlobals.setWebApiToken(window.esWebApiToken);
            if (angular.isFunction(runOnSuccess)) {
                runOnSuccess();
            }
            $scope.isReady = true;
            return;
        }

        if ($scope.esCredentials.subscriptionPassword && $scope.esCredentials.UserID && $scope.esCredentials.Password && $scope.esCredentials.BranchID) {
            $scope.authenticate();
            return;
        }

        $scope.showLogin = true;
    }


    esApp.controller('esComponentCtrl', ['$scope', '$log', '$window', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals',
        function($scope, $log, $window, esMessaging, esWebApiService, esWebUIHelper, esGlobals) {

            function esTranslate(item, lang) {

                if (lang) {
                    lang = lang.split("-")[0];
                }

                function fallBack(item) {
                    var trans = item["en"];
                    if (trans) {
                        return trans;
                    }
                    for (var prop in item) {
                        return item[prop];
                    }
                    return "";
                }

                if (!item) {
                    return "";
                }

                if (angular.isString(item)) {
                    return item;
                }

                if (!angular.isObject(item)) {
                    return item;
                }

                if (!lang) {
                    return fallBack(item);
                }

                return item[lang] || fallBack(item);
            }

            function processesDef(esDef, lang) {
                if (angular.isArray(esDef)) {
                    _.forEach(esDef, function(x) {
                        processesDef(x, lang);
                    });

                    return;
                }

                if (esDef && esDef.Title) {
                    esDef.Title = esTranslate(esDef.Title, lang);
                }


                if (angular.isArray(esDef)) {
                    processesDef(esDef, lang);
                    return;
                }

                if (esDef && esDef.Description) {
                    esDef.Descrption = esTranslate(esDef.Description, lang);
                }

                if (esDef && esDef.UIOptions && esDef.UIOptions.title) {
                    esDef.UIOptions.title = esTranslate(esDef.UIOptions.title, lang);
                }

                if (esDef && esDef.UIOptions && esDef.UIOptions.valueAxis) {
                    var loop = angular.isArray(esDef.UIOptions.valueAxis) ? esDef.UIOptions.valueAxis : [esDef.UIOptions.valueAxis];
                    _.forEach(loop, function(x) {
                        if (x.title && x.title.text) {
                            x.title.text = esTranslate(x.title.text, lang);
                        }
                    });
                }

                if (esDef && esDef.UIOptions && esDef.UIOptions.xAxis) {
                    var loop = angular.isArray(esDef.UIOptions.xAxis) ? esDef.UIOptions.xAxis : [esDef.UIOptions.xAxis];
                    _.forEach(loop, function(x) {
                        if (x.title && x.title.text) {
                            x.title.text = esTranslate(x.title.text, lang);
                        }
                    });
                }

                if (esDef && esDef.UIOptions && esDef.UIOptions.yAxis) {
                    var loop = angular.isArray(esDef.UIOptions.yAxis) ? esDef.UIOptions.yAxis : [esDef.UIOptions.yAxis];
                    _.forEach(loop, function(x) {
                        if (x.title && x.title.text) {
                            x.title.text = esTranslate(x.title.text, lang);
                        }
                    });
                }

                if (esDef && esDef.UIOptions && esDef.UIOptions.valueAxes) {
                    var loop = angular.isArray(esDef.UIOptions.valueAxes) ? esDef.UIOptions.valueAxes : [esDef.UIOptions.valueAxes];
                    _.forEach(loop, function(x) {
                        if (x.title && x.title.text) {
                            x.title.text = esTranslate(x.title.text, lang);
                        }
                    });
                }
            }

            function processComponent(item, lang) {
                if (angular.isArray(item)) {
                    _.forEach(item, function(x) {
                        processComponent(x, lang);
                    });
                    return;
                }

                if (angular.isObject(item)) {
                    if (angular.isDefined(item.Title)) {
                        item.Title = esTranslate(item.Title, lang);
                    }

                    if (angular.isDefined(item.Description)) {
                        item.Description = esTranslate(item.Description, lang);
                    }

                    processesDef(item, lang);

                    if (item.esDef) {
                        processesDef(item.esDef, lang);
                    }
                }
            }

            function processItem(item, lang) {

                if (angular.isArray(item)) {
                    item = _.map(item, function(x) {
                        return _.orderBy(x, ['AA']);
                    });
                }
                processComponent(item, lang);
                return item;
            }

            function transformIn(arr) {
                var arr_defs = _.map(arr, function(x) {
                    if (angular.isArray(x)) {
                        return transformIn(x);
                    }

                    var pqDef = new esGlobals.ESPublicQueryDef().initFromObj(x.esDef);
                    pqDef.ESUIType = x.ESUIType.toLowerCase();
                    pqDef.CtxID = x.ID;
                    if (x.esDef) {
                        pqDef.Params = esWebUIHelper.createESParams(x.esDef.Params);
                    }
                    pqDef.AA = x.AA;
                    pqDef.Title = x.Title;
                    return pqDef;
                });
                return arr_defs;
            }


            $scope.esCredentials = {};
            $scope.isReady = false;
            $scope.showLogin = false;
            $scope.ownLogin = true;

            if ($window.esWebApiSettings) {
                $scope.esCredentials.subscriptionId = $window.esWebApiSettings.subscriptionId || "";
                $scope.esCredentials.subscriptionPassword = $window.esWebApiSettings.subscriptionPassword || "";
                $scope.esCredentials.UserID = $window.esWebApiSettings.UserID || "";
                $scope.esCredentials.Password = $window.esWebApiSettings.Password || "";
                $scope.esCredentials.bridgeId = $window.esWebApiSettings.bridgeId || "";
                $scope.esCredentials.BranchID = $window.esWebApiSettings.BranchID || "";
                $scope.esCredentials.LangID = $window.esWebApiSettings.LangID || "";
            }
            doPrepareCtrl($scope, esMessaging, esGlobals);

            var brseLang = $window.navigator.language || $window.navigator.userLanguage;

            $scope.esCredentials.LangID = !$scope.esCredentials.LangID ? esGlobals.suggestESLanguageID(brseLang) : $scope.esCredentials.LangID;

            $scope.authenticate = function() {
                esWebApiService.openSession($scope.esCredentials)
                    .then(function(rep) {
                            $scope.showLogin = false;
                            window.esWebApiToken = esGlobals.getWebApiToken();
                            runOnSuccess();
                            $scope.isReady = true;

                        },
                        function(err) {
                            $scope.isReady = false;
                            $scope.showLogin = true;
                            var s = esGlobals.getUserMessage(err);
                        });

            };

            var runOnSuccess = function() {

                var arr = [];
                if (window.esDef.ESUIType.toLowerCase() != 'escombo') {
                    arr = [window.esDef];
                } else {
                    //combo case
                    arr = window.esDef.esDef;
                    arr = _.map(arr, function(x) {
                        if (angular.isArray(x)) {
                            return x;
                        } else {
                            return [x];
                        }
                    });
                }

                var arr_defs = transformIn(arr);

                if (window.esDef.ESUIType.toLowerCase() != 'escombo') {
                    $scope.esPqDef = processItem(arr_defs[0]);
                } else {
                    // case combo
                    $scope.esPqDef = processItem(arr_defs);
                }

            };

            doLogin($scope, esGlobals, esWebApiService, runOnSuccess);
        }
    ]);

})
(window.angular);