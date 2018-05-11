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
        'pascalprecht.translate',
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
        $scope.doShowForm = false;

        esMessaging.subscribe("ES_HTTP_CORE_ERR", function(rejection, status) {
            var s = esGlobals.getUserMessage(rejection, status);
            $scope.esnotify.error(s.messageToShow);
        });

        esGlobals.getESUISettings().mobile = window.esDeviceMode;
        esGlobals.getESUISettings().defaultGridHeight = window.esGridHeight ? (window.esGridHeight.toString() + "px") : "";

        if (esGlobals.getESUISettings().mobile && window.esGridHeight && window.esGridHeight > 80) {
            esGlobals.getESUISettings().defaultGridHeight = (window.esGridHeight - 80).toString() + "px";
        }
    }

    function doLogin($scope, esGlobals, esWebApiService, runOnSuccess, progress) {
        if (window.esWebApiToken) {
            esWebApiService.validateToken(window.esWebApiToken, $scope.esCredentials)
                .then(function(ret) {
                    esGlobals.setWebApiToken(window.esWebApiToken);
                    if (angular.isFunction(runOnSuccess)) {
                        runOnSuccess();
                    }
                    $scope.isReady = true;
                    $scope.doShowForm = false;

                })
                .catch(function(err) {
                    kendo.ui.progress(progress, false);
                    if ($scope.esCredentials.UserID && $scope.esCredentials.Password && $scope.esCredentials.BranchID && $scope.esCredentials.bridgeId) {
                        $scope.authenticate();
                        return;
                    }

                    $scope.isReady = false;
                    $scope.doShowForm = true;

                });

            return;
        }

        if ($scope.esCredentials.UserID && $scope.esCredentials.Password && $scope.esCredentials.BranchID && $scope.esCredentials.bridgeId) {
            $scope.authenticate();
            return;
        }

        kendo.ui.progress(progress, false);
        $scope.isReady = false;
        $scope.doShowForm = true;
    }


    esApp.controller('esComponentCtrl', ['$scope', '$log', '$window', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals', '$translate', '$q', 'esCache',
        function($scope, $log, $window, esMessaging, esWebApiService, esWebUIHelper, esGlobals, $translate, $q, esCache) {

            var del = angular.element(document.querySelector('#esWait'));
            kendo.ui.progress(del, true);

            $scope.esCredentials = {};
            $scope.isReady = false;

            if ($window.esWebApiSettings) {
                $scope.esCredentials.subscriptionId = $window.esWebApiSettings.subscriptionId || "";
                $scope.esCredentials.subscriptionPassword = $window.esWebApiSettings.subscriptionPassword || "";
                $scope.esCredentials.UserID = $window.esWebApiSettings.UserID || "";
                $scope.esCredentials.Password = $window.esWebApiSettings.Password || "";
                $scope.esCredentials.bridgeId = $window.esWebApiSettings.bridgeId || "";
                $scope.esCredentials.BranchID = $window.esWebApiSettings.BranchID || "";
                $scope.esCredentials.LangID = $window.esWebApiSettings.LangID || "";
                $scope.esClaims = $window.esWebApiSettings.esClaims || {};
            }
            doPrepareCtrl($scope, esMessaging, esGlobals);

            var brseLang = $window.navigator.language || $window.navigator.userLanguage;

            $scope.esCredentials.LangID = !$scope.esCredentials.LangID ? esGlobals.suggestESLanguageID(brseLang) : $scope.esCredentials.LangID;

            $scope.esLinkPrefix = $window.esLinkPrefix || "";

            $scope.authenticate = function() {

                esWebApiService.openSession($scope.esCredentials, $scope.esClaims)
                    .then(function(rep) {
                            window.esWebApiToken = esGlobals.getWebApiToken();
                            runOnSuccess();
                            $scope.isReady = true;
                            $scope.doShowForm = false;

                        },
                        function(err) {
                            $scope.isReady = false;
                            $scope.doShowForm = true;
                            kendo.ui.progress(del, false);
                            var s = esGlobals.getUserMessage(err);
                        });

            };


            function deepSearch(inp, id) {

                if (!angular.isArray(inp)) {
                    return inp.ID.toLowerCase() == id ? inp : null;
                }

                for (var i = 0; i < inp.length; i++) {
                    var el = inp[i];

                    if (angular.isArray(el)) {
                        for (var j = 0; j < el.length; j++) {
                            var t = deepSearch(el[j], id);
                            if (t) {
                                return t;
                            }
                        }
                    } else {
                        if (el.ID.toLowerCase() == id) {
                            return el;
                        }

                        if (angular.isArray(el.esDef)) {
                            var ret = deepSearch(el.esDef, id);
                            if (ret) {
                                return ret;
                            }
                        }
                    }
                }
                return null;
            }

            function createFavItem(menuItem, shortcutItem) {

                var pqDef = new esGlobals.ESPublicQueryDef().initFromObj(menuItem.esDef);
                pqDef.Params = esWebUIHelper.createESParams(shortcutItem.Params);
                pqDef.CtxID = menuItem.ID;
                pqDef.Title = shortcutItem.Title || menuItem.Title;

                return {
                    AA: menuItem.AA,
                    ID: menuItem.ID,
                    Title: shortcutItem.Title || menuItem.Title,
                    ESUIType: menuItem.ESUIType.toLowerCase(),
                    esDef: pqDef
                };
            }

            var runOnSuccess = function() {
                $scope.esLinkPrefix = window.esLinkPrefix || "";
                $scope.esSimpleMode = window.esSimpleMode || false;
                
                if (window.esDef.ESUIType.toLowerCase() == 'eslink') {
                    var mn = {
                        Title: $translate.instant("ESUI.FAV.LINK"),
                        ID: "eslink",
                        ESUIType: "esCombo",
                        esDef: []
                    };

                    if (!window.esDef.ID || !(window.esMainMenu && angular.isArray(window.esMainMenu) && window.esMainMenu.length)) {
                        $scope.esPqDef = mn;
                        kendo.ui.progress(del, false);
                        return;
                    }

                    esWebApiService.getBodyFromES00Blob(window.esDef.ID)
                        .then(function(blob) {
                            var elems = [];
                            blob = blob.data;
                            if (blob.GID.toLowerCase() == window.esDef.ID.toLowerCase() && blob.TextBody) {
                                var g = JSON.parse(blob.TextBody);
                                var el = deepSearch(window.esMainMenu, g.ID.toLowerCase());
                                if (el) {
                                    mn.esDef = [createFavItem(el, g)];
                                }
                            }

                            $scope.esPqDef = mn;
                            kendo.ui.progress(del, false);

                        })
                        .catch(function(err) {
                            $scope.esPqDef = mn;
                            kendo.ui.progress(del, false);
                            var s = esGlobals.getUserMessage(err);
                            $scope.esnotify.error(s.messageToShow);
                        })
                    return;
                }

                if (window.esDef.ESUIType.toLowerCase() == 'esfav') {

                    $scope.isFav = true;

                    var deferred = $q.defer();
                    var y = esCache.getItem("ES_USR_FAV");
                    if (y) {
                        deferred.resolve(y);
                    } else {
                        esWebApiService.getBodyFromES00Blob("ESGOUser", esGlobals.getClientSession().connectionModel.GID, 9000)
                            .then(function(ret) {
                                var x = new esWebUIHelper.ESFavourites(ret.data.TextBody);
                                esCache.setItem("ES_USR_FAV", x);
                                deferred.resolve(x);
                            })
                            .catch(function(err) {
                                deferred.reject(err);
                            });
                    }

                    deferred.promise
                        .then(function(fav) {
                            var elems;

                            if (window.esMainMenu && angular.isArray(window.esMainMenu) && window.esMainMenu.length) {
                                elems = _.map(fav.shortcuts, function(g) {
                                    var el = g ? deepSearch(window.esMainMenu, g.ID) : null;
                                    return el ? createFavItem(el, g) : null;
                                });

                                _.remove(elems, function(n) {
                                    return !n;
                                });
                            } else {
                                elems = [];
                            }

                            var mn = {
                                Title: $translate.instant("ESUI.FAV.FAVOURITES"),
                                ID: "favourites",
                                ESUIType: "esCombo",
                                esDef: elems
                            };

                            $scope.esPqDef = mn;
                            kendo.ui.progress(del, false);
                            return;

                        })
                        .catch(function(err) {
                            kendo.ui.progress(del, false);
                            var s = esGlobals.getUserMessage(err);
                            $scope.esnotify.error(s.messageToShow);
                        });
                    return;
                } else {
                    $scope.isFav = false;
                }

                if (window.esDef.ESUIType.toLowerCase() == 'escombo') {
                    $scope.esPqDef = window.esDef;
                    kendo.ui.progress(del, false);
                    return;
                } else {
                    $scope.esPqDef = {
                        "AA": 1,
                        "ID": "PQ_1",
                        "ESUIType": "esCombo",
                        "esDef": [window.esDef]
                    };
                    kendo.ui.progress(del, false);
                }
            };

            doLogin($scope, esGlobals, esWebApiService, runOnSuccess, del);
        }
    ]);

})
(window.angular);
