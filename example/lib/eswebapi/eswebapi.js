/*! Entersoft Application Server WEB API - v0.0.1 - 2015-07-03
* Copyright (c) 2015 Entersoft SA; Licensed Apache-2.0 */
/***********************************
 * Entersoft SA
 * http://www.entersoft.eu
 * v0.0.72
 *
 ***********************************/

(function() {
    'use strict';

    /* Services */

    var esWebServices = angular.module('es.Services.Web', ['ngStorage', 'ngSanitize' /*, 'es.Services.Analytics' */ ]);

    esWebServices.
    constant('ESWEBAPI_URL', {
        __LOGIN__: "api/Login",
        __PUBLICQUERY__: "api/rpc/PublicQuery/",
        __PUBLICQUERY_INFO__: "api/rpc/PublicQueryInfo/",
        __USERSITES__: "api/Login/Usersites",
        __STANDARD_ZOOM__: "api/rpc/FetchStdZoom/",
        __SCROLLERROOTTABLE__: "api/rpc/SimpleScrollerRootTable/",
        __SCROLLER__: "api/rpc/SimpleScroller/",
        __ENTITYACTION__: "api/Entity/",
        __ENTITYBYGIDACTION__: "api/EntityByGID/",
        __ELASTICSEARCH__: "api/esearch/",
        __SERVER_CAPABILITIES__: "api/Login/ServerCapabilities/",
        __REGISTER_EXCEPTION__: "api/rpc/registerException/",
        __FETCH_COMPANY_PARAM__: "api/rpc/FetchCompanyParam/",
        __FETCH_COMPANY_PARAMS__: "api/rpc/FetchCompanyParams/",
        __SCROLLER_COMMAND__: "api/rpc/ScrollerCommand/",
        __FORM_COMMAND__: "api/rpc/FormCommand/",
        __FETCH_SESSION_INFO__: "api/rpc/FetchSessionInfo/",
        __FETCH_ODS_TABLE_INFO__: "api/rpc/FetchOdsTableInfo/",
        __FETCH_ODS_COLUMN_INFO__: "api/rpc/FetchOdsColumnInfo/",
        __FETCH_ODS_RELATION_INFO__: "api/rpc/FetchOdsRelationInfo/",
        __FETCH_ODS_DETAIL_RELATIONS_INFO__: "api/rpc/FetchOdsDetailRelationsInfo/",
        __FETCH_ODS_MASTER_RELATIONS_INFO__: "api/rpc/FetchOdsMasterRelationsInfo/",
    });

    esWebServices.value("__WEBAPI_RT__", {
        url: ""
    });


    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    function startsWith(str, prefix) {
        return str.toLowerCase().indexOf(prefix.toLowerCase()) === 0;
    }

    esWebServices.provider("es.Services.WebApi",
        function() {

            var urlWEBAPI = "";
            var unSecureWEBAPI = "";
            var secureWEBAPI = "";

            var esConfigSettings = {
                host: "",
                allowUnsecureConnection: false,
                subscriptionId: "",
                subscriptionPassword: ""
            };

            return {
                getSettings: function() {
                    return esConfigSettings;
                },

                getServerUrl: function() {
                    return urlWEBAPI;
                },

                setSettings: function(setting) {
                    var __SECURE_HTTP_PREFIX__ = "https://";
                    var __UNSECURE_HTTP_PREFIX__ = "http://";

                    esConfigSettings = setting;

                    if (esConfigSettings.host) {
                        esConfigSettings.host = esConfigSettings.host.trim();

                        if (startsWith(esConfigSettings.host, __SECURE_HTTP_PREFIX__)) {
                            esConfigSettings.host = esConfigSettings.host.slice(__SECURE_HTTP_PREFIX__.length).trim();
                        } else if (startsWith(esConfigSettings.host, __UNSECURE_HTTP_PREFIX__)) {
                            esConfigSettings.host = esConfigSettings.host.slice(__UNSECURE_HTTP_PREFIX__.length).trim();
                        }

                        if (esConfigSettings.host == "") {
                            throw "host for Entersoft WEB API Server is not specified";
                        }

                        if (!endsWith(esConfigSettings.host, "/")) {
                            esConfigSettings.host += "/";
                        }

                        unSecureWEBAPI = __UNSECURE_HTTP_PREFIX__ + esConfigSettings.host;;
                        secureWEBAPI = __SECURE_HTTP_PREFIX__ + esConfigSettings.host;

                        if (esConfigSettings.allowUnsecureConnection) {
                            urlWEBAPI = unSecureWEBAPI;
                        } else {
                            urlWEBAPI = secureWEBAPI;
                        }

                    } else {
                        throw "host for Entersoft WEB API Server is not specified";
                    }
                    return this;
                },

                $get: ['$http', '$log', '$q', '$rootScope', 'ESWEBAPI_URL', 'es.Services.Globals',
                    function($http, $log, $q, $rootScope, ESWEBAPI_URL, esGlobals) {

                        function fregisterException(inMessageObj, storeToRegister) {
                            if (!inMessageObj) {
                                return;
                            }

                            var messageObj = angular.copy(inMessageObj);

                            try {
                                messageObj.__SubscriptionID = esConfigSettings.subscriptionId;
                                messageObj.__ServerUrl = urlWEBAPI;
                                messageObj.__EDate = new Date();
                                $.ajax({
                                    type: "POST",
                                    url: urlWEBAPI.concat(ESWEBAPI_URL.__REGISTER_EXCEPTION__),
                                    contentType: "application/json",
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
                                    data: JSON.stringify({
                                        exceptionData: messageObj,
                                        exceptionStore: storeToRegister
                                    }, null, '\t')
                                });

                                // if google analytics are enabled register the exception as well
                                var esGA = esGlobals.getGA();
                                if (esGA) {
                                    esGA.registerException(messageObj);
                                }

                            } catch (loggingError) {

                                // For Developers - log the log-failure.
                                $log.warn("Error logging failed");
                                $log.error(loggingError);
                            }
                        }

                        function execScrollerCommand(scrollerCommandParams) {
                            if (!scrollerCommandParams || !scrollerCommandParams.ScrollerID || !scrollerCommandParams.CommandID) {
                                throw "ScrollerID and CommandID properties must be defined";
                            }
                            var surl = ESWEBAPI_URL.__SCROLLER_COMMAND__;

                            var tt = esGlobals.trackTimer("SCR", "COMMAND", scrollerCommandParams.ScrollerID.concat("/", scrollerCommandParams.CommandID));
                            tt.startTime();

                            var ht = $http({
                                method: 'post',
                                headers: {
                                    "Authorization": esGlobals.getWebApiToken()
                                },
                                url: surl,
                                data: scrollerCommandParams
                            });

                            ht.then(function() {
                                tt.endTime().send();
                            });
                            return ht;
                        }

                        function getOdsInfo(odsType, odsID) {
                            var defered = $q.defer();
                            $http.get(unSecureWEBAPI + ESWEBAPI_URL[odsType] + odsID)
                                .success(function(data) {
                                    defered.resolve(data);
                                })
                            return defered.promise;
                        }

                        function execFormCommand(formCommandParams) {
                            if (!formCommandParams || !formCommandParams.EntityID || !formCommandParams.CommandID) {
                                throw "EntityID and CommandID properties must be defined";
                            }
                            var surl = ESWEBAPI_URL.__FORM_COMMAND__;

                            var tt = esGlobals.trackTimer("FORM", "COMMAND", formCommandParams.EntityID.concat("/", formCommandParams.CommandID));
                            tt.startTime();

                            var ht = $http({
                                method: 'post',
                                headers: {
                                    "Authorization": esGlobals.getWebApiToken()
                                },
                                url: surl,
                                data: formCommandParams
                            });

                            ht.then(function() {
                                tt.endTime().send();
                            });
                            return ht;
                        }

                        function execScroller(apiUrl, groupID, filterID, params) {
                            var surl = urlWEBAPI.concat(apiUrl, groupID, "/", filterID);
                            var tt = esGlobals.trackTimer("SCR", "FETCH", groupID.concat("/", filterID));
                            tt.startTime();

                            var ht = $http({
                                method: 'GET',
                                headers: {
                                    "Authorization": esGlobals.getWebApiToken()
                                },
                                url: surl,
                                params: params
                            });

                            ht.then(function() {
                                tt.endTime().send();
                            });
                            return ht;
                        }

                        return {

                            getServerUrl: function() {
                                return urlWEBAPI;
                            },

                            openSession: function(credentials) {
                                var tt = esGlobals.trackTimer("AUTH", "LOGIN", "");
                                tt.startTime();

                                return $http({
                                    method: 'post',
                                    url: urlWEBAPI + ESWEBAPI_URL.__LOGIN__,
                                    data: {
                                        SubscriptionID: esConfigSettings.subscriptionId,
                                        SubscriptionPassword: esConfigSettings.subscriptionPassword,
                                        Model: credentials
                                    }
                                }).
                                success(function(data) {
                                    esGlobals.sessionOpened(data, credentials);
                                    tt.endTime().send();
                                }).
                                error(function(data, status, headers, config) {
                                    esGlobals.sessionClosed();
                                    if (data) {
                                        $log.error(data);
                                    } else {
                                        console.log("Generic Http error");
                                    }
                                });
                            },

                            logout: function() {
                                esGlobals.sessionClosed();
                                $log.info("LOGOUT User");
                            },

                            fetchCompanyParam: function(esparam) {
                                if (!esparam) {
                                    return undefined;
                                }

                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__FETCH_COMPANY_PARAM__, esparam);
                                var ht = $http({
                                    method: 'get',
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
                                    url: surl
                                });
                                return ht;
                            },

                            fetchCompanyParams: function(esparam) {
                                var surl;
                                if (!esparam) {
                                    // get all parameters
                                    surl = urlWEBAPI + ESWEBAPI_URL.__FETCH_COMPANY_PARAMS__;
                                } else {
                                    if (angular.isArray(esparam)) {
                                        surl = urlWEBAPI + ESWEBAPI_URL.__FETCH_COMPANY_PARAMS__ + esparam.join("/");
                                    } else {
                                        surl = urlWEBAPI + ESWEBAPI_URL.__FETCH_COMPANY_PARAMS__ + esparam;
                                    }
                                }

                                var ht = $http({
                                    method: 'get',
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
                                    url: surl
                                });
                                return ht;
                            },

                            registerException: fregisterException,

                            fetchOdsTableInfo: function(tableID) {
                                return getOdsInfo("__FETCH_ODS_TABLE_INFO__", tableID);
                            },

                            fetchOdsColumnInfo: function(tableID, columnID) {
                                var odsItem = columnID ? tableID + "/" + columnID : tableID;
                                return getOdsInfo("__FETCH_ODS_COLUMN_INFO__", odsItem);
                            },

                            fetchOdsRelationInfo: function(relationID) {
                                return getOdsInfo("__FETCH_ODS_RELATION_INFO__", relationID);
                            },

                            fetchOdsMasterRelationsInfo: function(tableID, columnID) {
                                return getOdsInfo("__FETCH_ODS_MASTER_RELATIONS_INFO__", tableID + "/" +columnID);  
                            },

                            fetchOdsdDetailRelationsInfo: function(tableID, columnID) {
                                return getOdsInfo("__FETCH_ODS_DETAIL_RELATIONS_INFO__", tableID + "/" +columnID);  
                            },

                            fetchServerCapabilities: function() {

                                var defered = $q.defer();

                                $http.get(unSecureWEBAPI + ESWEBAPI_URL.__SERVER_CAPABILITIES__)
                                    .success(function(data) {
                                        defered.resolve(data);
                                    })
                                    .error(function() {
                                        $http.get(secureWEBAPI + ESWEBAPI_URL.__SERVER_CAPABILITIES__)
                                            .success(function(data) {
                                                defered.resolve(data);
                                            })
                                            .error(function(dat, stat, header, config) {
                                                defered.reject([dat, stat, header, config]);
                                            });
                                    });

                                return defered.promise;
                            },

                            fetchScroller: function(groupID, filterID, params) {
                                return execScroller(ESWEBAPI_URL.__SCROLLER__, groupID, filterID, params);
                            },

                            fetchSimpleScrollerRootTable: function(groupID, filterID, params) {
                                return execScroller(ESWEBAPI_URL.__SCROLLERROOTTABLE__, groupID, filterID, params);
                            },

                            fetchUserSites: function(ebsuser) {
                                return $http({
                                    method: 'post',
                                    url: urlWEBAPI + ESWEBAPI_URL.__USERSITES__,
                                    data: {
                                        SubscriptionID: esConfigSettings.subscriptionId,
                                        SubscriptionPassword: esConfigSettings.subscriptionPassword,
                                        Model: ebsuser
                                    }
                                });
                            },

                            fetchSessionInfo: function() {
                                return $http({
                                    method: 'get',
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
                                    url: urlWEBAPI + ESWEBAPI_URL.__FETCH_SESSION_INFO__
                                });
                            },

                            executeNewEntityAction: function(entityType, actionID, commandParams) {
                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__ENTITYACTION__, entityType, "/", actionID);
                                var tt = esGlobals.trackTimer("ACTION", "NEW_ENTITY", entityType.concat("/", actionID));
                                tt.startTime();

                                var ht = $http({
                                    method: 'post',
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
                                    url: surl,
                                    data: commandParams
                                });
                                ht.then(function() {
                                    tt.endTime().send();
                                });
                                return ht;
                            },

                            executeEntityActionByCode: function(entityType, entityCode, actionID, commandParams) {
                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__ENTITYACTION__, entityType, "/", entityCode, "/", actionID);
                                var tt = esGlobals.trackTimer("ACTION", "ENTITY_CODE", entityType.concat("/", actionID));
                                tt.startTime();

                                var ht = $http({
                                    method: 'post',
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
                                    url: surl,
                                    data: commandParams
                                });

                                ht.then(function() {
                                    tt.endTime().send();
                                });
                                return ht;
                            },

                            executeEntityActionByGID: function(entityType, entityGID, actionID, commandParams) {
                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__ENTITYBYGIDACTION__, entityType, "/", entityGID, "/", actionID);
                                var tt = esGlobals.trackTimer("ACTION", "ENTITY_GID", entityType.concat("/", actionID));
                                tt.startTime();

                                var ht = $http({
                                    method: 'post',
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
                                    url: surl,
                                    data: commandParams
                                });

                                ht.then(function() {
                                    tt.endTime().send();
                                });
                                return ht;

                            },

                            executeFormCommand: function(formCommandParams) {
                                return execFormCommand(formCommandParams);
                            },

                            executeFormCommandDS: function(entityID, commandID, commandParams, ds) {
                                var params = {
                                    EntityID: entityID,
                                    CommandID: commandID,
                                    CommandParams: commandParams
                                };
                                if (ds) {
                                    params.EntityDataset = ds;
                                }

                                return execFormCommand(params);
                            },

                            executeScrollerCommandSRV: function(groupID, filterID, commandID, scrollerParams, commandParams) {

                                var scrollerCommandParams = {
                                    ScrollerID: groupID + "/" + filterID,
                                    CommandID: commandID,
                                    ScrollerParams: scrollerParams,
                                    CommandParams: commandParams
                                };
                                return execScrollerCommand(scrollerCommandParams);
                            },

                            executeScrollerCommandDS: function(groupID, filterID, commandID, dataSet, commandParams) {
                                var scrollerCommandParams = {
                                    ScrollerID: groupID + "/" + filterID,
                                    CommandID: commandID,
                                    ScrollerDataset: dataSet,
                                    CommandParams: commandParams
                                };
                                return execScrollerCommand(scrollerCommandParams);
                            },

                            fetchPublicQueryInfo: function(GroupID, FilterID) {
                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__PUBLICQUERY_INFO__, GroupID, "/", FilterID);
                                var tt = esGlobals.trackTimer("PQ", "INFO", GroupID.concat("/", FilterID));
                                tt.startTime();

                                var ht = $http({
                                    method: 'get',
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
                                    url: surl
                                });


                                ht.then(function() {
                                    tt.endTime().send();
                                });

                                //finally return the $http promise
                                return ht;
                            },

                            fetchStdZoom: function(zoomID, options) {
                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__STANDARD_ZOOM__, zoomID);
                                var tt = esGlobals.trackTimer("ZOOM", "FETCH", zoomID);
                                tt.startTime();

                                var ht = $http({
                                    method: 'get',
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken(),
                                        "X-ESPQOptions": JSON.stringify(options)
                                    },
                                    url: surl
                                });


                                ht.then(function() {
                                    tt.endTime().send();
                                });

                                //finally return the $http promise
                                return ht;
                            },

                            /**
                             * fetch PQ schema
                             * @param  {string} GroupID
                             * @param  {string} FilterID
                             * @param  {object} Params - parameters specific to GroupID / FilterID
                             * [@param  {string} httpVerb] - optional parameter to specify HTTP verb. Default is GET
                             * @return {AngularHttpPromise}
                             */
                            fetchPublicQuery: function(GroupID, FilterID, options, Params, httpVerb) {
                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__PUBLICQUERY__, GroupID, "/", FilterID);
                                var tt = esGlobals.trackTimer("PQ", "FETCH", GroupID.concat("/", FilterID));
                                tt.startTime();

                                /**
                                 * $http object configuration
                                 * @type {Object}
                                 */
                                var httpConfig = {
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
                                    url: surl,
                                    params: Params
                                };

                                if (options) {
                                    httpConfig.headers["X-ESPQOptions"] = JSON.stringify(options);
                                }

                                //if called with 3 arguments then default to a GET request
                                httpConfig.method = httpVerb || 'GET';

                                //if not a GET request, switch to data instead of params
                                if (httpConfig.method !== 'GET') {
                                    delete httpConfig.params;
                                    httpConfig.data = Params;
                                }

                                var ht = $http(httpConfig);
                                ht.then(function() {
                                    tt.endTime().send();
                                });

                                //finally return the $http promise
                                return ht;
                            },



                            eSearch: function(eUrl, eMethod, eBody) {
                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__ELASTICSEARCH__, eUrl);

                                return $http({
                                    method: eMethod,
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
                                    url: surl,
                                    data: eBody
                                }).success(function(data) {
                                    // if google analytics are enabled register the exception as well
                                    var esGA = esGlobals.getGA();
                                    if (esGA) {
                                        esGA.registerEventTrack({
                                            category: "ELASTIC_SEARCH",
                                            action: "SEARCH",
                                            label: eUrl
                                        });
                                    }
                                }).error(function(err) {
                                    try {
                                        fregisterException(err);
                                    } catch (exc) {

                                    }
                                });
                            }
                        }
                    }
                ]
            }
        }
    );

    esWebServices.factory('es.Services.ElasticSearch', ['es.Services.WebApi',
        function(esWebApi) {
            return {
                searchIndex: function(index, body) {
                    var eUrl = index + "/_search";
                    return esWebApi.eSearch(eUrl, "post", body);
                },

                searchIndexAndDocument: function(index, docType, body) {
                    var eUrl = index + "/" + docType + "/_search";
                    return esWebApi.eSearch(eUrl, "post", body);
                },

                searchFree: esWebApi.eSearch
            };
        }
    ]);

}());

    (function() {
        'use strict';

        var esModule = angular.module('es.Services.Analytics', []);
        esModule.provider("es.Services.GA",
            function() {
                var settings = {
                    gaKey: undefined,
                    pageTracking: {
                        autoTrackFirstPage: true,
                        autoTrackVirtualPages: true,
                        trackRelativePath: false,
                        autoBasePath: false,
                        basePath: ''
                    },
                    developerMode: false // Prevent sending data in local/development environment
                };

                return {
                    setGAKey: function(key) {
                        gaKey = key;
                    },
                    settings: settings,
                    virtualPageviews: function(value) {
                        this.settings.pageTracking.autoTrackVirtualPages = value;
                    },
                    firstPageview: function(value) {
                        this.settings.pageTracking.autoTrackFirstPage = value;
                    },
                    withBase: function(value) {
                        this.settings.pageTracking.basePath = (value) ? angular.element('base').attr('href').slice(0, -1) : '';
                    },
                    withAutoBase: function(value) {
                        this.settings.pageTracking.autoBasePath = value;
                    },
                    developerMode: function(value) {
                        this.settings.developerMode = value;
                    },

                    start: function(key, domain) {
                        if (window.ga && (key && key != "")) {
                            settings.gaKey = key;
                            ga('create', key, domain);
                        }
                    },

                    $get: ['$window', function($window) {
                        return {
                            settings: settings,

                            registerPageTrack: function(path) {
                                if ($window.ga) {
                                    $window.ga('send', 'pageview', path);
                                }
                            },

                            registerException: function(excObj) {
                                if ($window.ga && excObj) {
                                    $window.ga('send', 'exception', {
                                        exDescription: JSON.stringify(excObj),
                                        exFatal: false
                                    });
                                }
                            },

                            registerTiming: function(properties) {
                                if ($window.ga) {
                                    // do nothing if there is no category (it's required by GA)
                                    if (!properties || !properties.timingCategory || !properties.timingVar || !properties.timingValue) {
                                        return;
                                    }

                                     if (properties.timingValue) {
                                        var parsed = parseInt(properties.timingValue, 10);
                                        properties.timingValue = isNaN(parsed) ? 0 : parsed;
                                        if (properties.timingValue == 0) {
                                            return;
                                        }
                                    }
                                    
                                    $window.ga('send', 'timing', properties);
                                    /*
                                    angular.forEach($analyticsProvider.settings.ga.additionalAccountNames, function(accountName) {
                                        ga(accountName + '.send', 'event', eventOptions);
                                    });
                                    */
                                }
                            },

                            registerEventTrack: function(properties) {
                                if ($window.ga) {
                                    // do nothing if there is no category (it's required by GA)
                                    if (!properties || !properties.category) {
                                        return;
                                    }
                                    // GA requires that eventValue be an integer, see:
                                    // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#eventValue
                                    // https://github.com/luisfarzati/angulartics/issues/81
                                    if (properties.value) {
                                        var parsed = parseInt(properties.value, 10);
                                        properties.value = isNaN(parsed) ? 0 : parsed;
                                    }

                                    var eventOptions = {
                                        eventCategory: properties.category || null,
                                        eventAction: properties.action || null,
                                        eventLabel: properties.label || null,
                                        eventValue: properties.value || null,
                                        nonInteraction: properties.noninteraction || null
                                    };

                                    // add custom dimensions and metrics
                                    for (var idx = 1; idx <= 20; idx++) {
                                        if (properties['dimension' + idx.toString()]) {
                                            eventOptions['dimension' + idx.toString()] = properties['dimension' + idx.toString()];
                                        }
                                        if (properties['metric' + idx.toString()]) {
                                            eventOptions['metric' + idx.toString()] = properties['metric' + idx.toString()];
                                        }
                                    }
                                    $window.ga('send', 'event', eventOptions);
                                    /*
                                    angular.forEach($analyticsProvider.settings.ga.additionalAccountNames, function(accountName) {
                                        ga(accountName + '.send', 'event', eventOptions);
                                    });
                                    */
                                }
                            }
                        }
                    }]
                };
            }
        );

        esModule.run(['$rootScope', '$window', 'es.Services.GA', '$injector', function($rootScope, $window, esAnalytics, $injector) {
            if (esAnalytics.settings.pageTracking.autoTrackFirstPage) {
                $injector.invoke(['$location', function($location) {
                    /* Only track the 'first page' if there are no routes or states on the page */
                    var noRoutesOrStates = true;
                    if ($injector.has('$route')) {
                        var $route = $injector.get('$route');
                        for (var route in $route.routes) {
                            noRoutesOrStates = false;
                            break;
                        }
                    } else if ($injector.has('$state')) {
                        var $state = $injector.get('$state');
                        for (var state in $state.get()) {
                            noRoutesOrStates = false;
                            break;
                        }
                    }
                    if (noRoutesOrStates) {
                        if (esAnalytics.settings.pageTracking.autoBasePath) {
                            esAnalytics.settings.pageTracking.basePath = $window.location.pathname;
                        }
                        if (esAnalytics.settings.trackRelativePath) {
                            var url = esAnalytics.settings.pageTracking.basePath + $location.url();
                            esAnalytics.registerPageTrack(url, $location);
                        } else {
                            esAnalytics.registerPageTrack($location.absUrl(), $location);
                        }
                    }
                }]);
            }

            if (esAnalytics.settings.pageTracking.autoTrackVirtualPages) {
                $injector.invoke(['$location', function($location) {
                    if (esAnalytics.settings.pageTracking.autoBasePath) {
                        /* Add the full route to the base. */
                        esAnalytics.settings.pageTracking.basePath = $window.location.pathname + "#";
                    }
                    if ($injector.has('$route')) {
                        $rootScope.$on('$routeChangeSuccess', function(event, current) {
                            if (current && (current.$$route || current).redirectTo) return;
                            var url = esAnalytics.settings.pageTracking.basePath + $location.url();
                            esAnalytics.registerPageTrack(url, $location);
                        });
                    }
                    if ($injector.has('$state')) {
                        $rootScope.$on('$stateChangeSuccess', function(event, current) {
                            var url = esAnalytics.settings.pageTracking.basePath + $location.url();
                            esAnalytics.registerPageTrack(url, $location);
                        });
                    }
                }]);
            }
            if (esAnalytics.settings.developerMode) {
                angular.forEach(esAnalytics, function(attr, name) {
                    if (typeof attr === 'function') {
                        esAnalytics[name] = function() {};
                    }
                });
            }
        }]);

        esModule.directive('esAnalyticsOn', ['$document', 'es.Services.GA', function($document, esAnalytics) {

            function isAnchor(element) {
                return element.tagName.toLowerCase() + ':' + (element.type || '') == "a:";
            }

            function isCommand(element) {
                return ['button:', 'button:button', 'button:submit', 'input:button', 'input:submit'].indexOf(
                    element.tagName.toLowerCase() + ':' + (element.type || '')) >= 0;
            }

            function inferEventType(element) {
                if (isCommand(element) || isAnchor(element)) {
                    return 'click';
                }

                return 'click';
            }

            function inferCategory(element) {
                if (isCommand(element)) {
                    return "Command";
                }

                if (isAnchor(element)) {

                    if (!element.href) {
                        return "Navigate";
                    }

                    var href = element.href;
                    var filetypes = /\.(mov|jpg|png|rar|avi|zip|exe|pdf|doc*|xls*|ppt*|mp*)$/i;

                    if (href.match(/^https?\:/i)) {
                        var isFileType = href.match(filetypes);
                        if (!href.match($document[0].domain)) {
                            if (isFileType) {
                                return "External Download";
                            }
                            return "External Link";
                        } else {
                            if (isFileType) {
                                return "Internal Download";
                            }
                            return "Internal Link";
                        }
                    }

                    if (href.match(/^mailto\:/i)) {
                        return "Mail To";
                    }
                    if (href.match(filetypes)) {
                        return "Download";
                    }

                    return "Navigate";

                }

                return element.id || element.name || element.tagName;
            }


            function inferAction(element) {
                if (isCommand(element)) {
                    return element.tagName.toLowerCase() + ':' + (element.type || '');
                }

                if (isAnchor(element)) {
                    if (element.href) {
                        return element.href;
                    }
                    return element.innerText || element.value;
                }

                return element.id || element.name || element.tagName;
            }

            function inferLabel(element) {
                if (isCommand(element) || isAnchor(element)) {
                    return element.innerText || element.value;
                }

                return element.id || element.name || element.tagName;
            }

            function isProperty(name) {
                return name.substr(0, 11) === 'esAnalytics' && ['On', 'If', 'Properties', 'EventType'].indexOf(name.substr(11)) === -1;
            }

            function propertyName(name) {
                var s = name.slice(11); // slice off the 'analytics' prefix
                if (typeof s !== 'undefined' && s !== null && s.length > 0) {
                    return s.substring(0, 1).toLowerCase() + s.substring(1);
                } else {
                    return s;
                }
            }

            return {
                restrict: 'A',
                link: function($scope, $element, $attrs) {
                    var eventType = $attrs.esAnalyticsOn || inferEventType($element[0]);
                    var trackingData = {};

                    angular.forEach($attrs.$attr, function(attr, name) {
                        if (isProperty(name)) {
                            trackingData[propertyName(name)] = $attrs[name];
                            $attrs.$observe(name, function(value) {
                                trackingData[propertyName(name)] = value;
                            });
                        }
                    });

                    trackingData.category = trackingData.category || inferCategory($element[0], $document);
                    trackingData.action = trackingData.action || inferAction($element[0], $document);
                    trackingData.label = trackingData.label || inferLabel($element[0], $document);

                    angular.element($element[0]).bind(eventType, function($event) {
                        if ($attrs.esAnalyticsIf) {
                            if (!$scope.$eval($attrs.esAnalyticsIf)) {
                                return; // Cancel this event if we don't pass the analytics-if condition
                            }
                        }
                        // Allow components to pass through an expression that gets merged on to the event properties
                        // eg. analytics-properites='myComponentScope.someConfigExpression.$analyticsProperties'
                        if ($attrs.esAnalyticsProperties) {
                            angular.extend(trackingData, $scope.$eval($attrs.esAnalyticsProperties));
                        }

                        esAnalytics.registerEventTrack(trackingData);
                    });
                }
            };
        }]);

    })();

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
(function(window, angular, undefined) {
    'use strict';

    // Module global settings.
    var settings = {};

    // Module global flags.
    var flags = {
        sdk: false,
        ready: false
    };

    // Deferred Object which will be resolved when the Facebook SDK is ready
    // and the `fbAsyncInit` function is called.
    var loadDeferred;

    /**
     * @name facebook
     * @kind function
     * @description
     * An Angularjs module to take approach of Facebook javascript sdk.
     *
     * @author Luis Carlos Osorio Jayk <luiscarlosjayk@gmail.com>
     */
    angular.module('es.Services.Social', []).

    // Declare module settings value
    value('settings', settings).

    // Declare module flags value
    value('flags', flags).

    /**
     * Facebook provider
     */
    provider('esFacebook', [
        function() {

            /**
             * Facebook appId
             * @type {Number}
             */
            settings.appId = null;

            this.setAppId = function(appId) {
                settings.appId = appId;
            };

            this.getAppId = function() {
                return settings.appId;
            };

            /**
             * Locale language, english by default
             * @type {String}
             */
            settings.locale = 'en_US';

            this.setLocale = function(locale) {
                settings.locale = locale;
            };

            this.getLocale = function() {
                return settings.locale;
            };

            /**
             * Set if you want to check the authentication status
             * at the start up of the app
             * @type {Boolean}
             */
            settings.status = true;

            this.setStatus = function(status) {
                settings.status = status;
            };

            this.getStatus = function() {
                return settings.status;
            };

            /**
             * Adding a Channel File improves the performance of the javascript SDK,
             * by addressing issues with cross-domain communication in certain browsers.
             * @type {String}
             */
            settings.channelUrl = null;

            this.setChannel = function(channel) {
                settings.channelUrl = channel;
            };

            this.getChannel = function() {
                return settings.channelUrl;
            };

            /**
             * Enable cookies to allow the server to access the session
             * @type {Boolean}
             */
            settings.cookie = true;

            this.setCookie = function(cookie) {
                settings.cookie = cookie;
            };

            this.getCookie = function() {
                return settings.cookie;
            };

            /**
             * Parse XFBML
             * @type {Boolean}
             */
            settings.xfbml = true;

            this.setXfbml = function(enable) {
                settings.xfbml = enable;
            };

            this.getXfbml = function() {
                return settings.xfbml;
            };

            /**
             * Auth Response
             * @type {Object}
             */

            this.setAuthResponse = function(obj) {
                settings.authResponse = obj || true;
            };

            this.getAuthResponse = function() {
                return settings.authResponse;
            };

            /**
             * Frictionless Requests
             * @type {Boolean}
             */
            settings.frictionlessRequests = false;

            this.setFrictionlessRequests = function(enable) {
                settings.frictionlessRequests = enable;
            };

            this.getFrictionlessRequests = function() {
                return settings.frictionlessRequests;
            };

            /**
             * HideFlashCallback
             * @type {Object}
             */
            settings.hideFlashCallback = null;

            this.setHideFlashCallback = function(obj) {
                settings.hideFlashCallback = obj || null;
            };

            this.getHideFlashCallback = function() {
                return settings.hideFlashCallback;
            };

            /**
             * Custom option setting
             * key @type {String}
             * value @type {*}
             * @return {*}
             */
            this.setInitCustomOption = function(key, value) {
                if (!angular.isString(key)) {
                    return false;
                }

                settings[key] = value;
                return settings[key];
            };

            /**
             * get init option
             * @param  {String} key
             * @return {*}
             */
            this.getInitOption = function(key) {
                // If key is not String or If non existing key return null
                if (!angular.isString(key) || !settings.hasOwnProperty(key)) {
                    return false;
                }

                return settings[key];
            };

            /**
             * load SDK
             */
            settings.loadSDK = true;

            this.setLoadSDK = function(a) {
                settings.loadSDK = !!a;
            };

            this.getLoadSDK = function() {
                return settings.loadSDK;
            };

            /**
             * SDK version
             */
            settings.version = 'v2.2';

            this.setSdkVersion = function(version) {
                settings.version = version;
            };

            this.getSdkVersion = function() {
                return settings.version;
            };

            /**
             * Init Facebook API required stuff
             * This will prepare the app earlier (on settingsuration)
             * @arg {Object/String} initSettings
             * @arg {Boolean} _loadSDK (optional, true by default)
             */
            this.init = function(initSettings, _loadSDK) {
                // If string is passed, set it as appId
                if (angular.isString(initSettings)) {
                    settings.appId = initSettings;
                }

                if (angular.isNumber(initSettings)) {
                    settings.appId = initSettings.toString();
                }

                // If object is passed, merge it with app settings
                if (angular.isObject(initSettings)) {
                    angular.extend(settings, initSettings);
                }

                // Set if Facebook SDK should be loaded automatically or not.
                if (angular.isDefined(_loadSDK)) {
                    settings.loadSDK = !!_loadSDK;
                }
            };

            /**
             * This defined the Facebook service
             */
            this.$get = [
                '$q',
                '$rootScope',
                '$timeout',
                '$window',
                function($q, $rootScope, $timeout, $window) {
                    /**
                     * This is the NgFacebook class to be retrieved on Facebook Service request.
                     */
                    function NgFacebook() {
                        this.appId = settings.appId;
                    }

                    /**
                     * Ready state method
                     * @return {Boolean}
                     */
                    NgFacebook.prototype.isReady = function() {
                        return flags.ready;
                    };

                    NgFacebook.prototype.login = function() {

                        var d = $q.defer(),
                            args = Array.prototype.slice.call(arguments),
                            userFn,
                            userFnIndex; // Converts arguments passed into an array

                        // Get user function and it's index in the arguments array,
                        // to replace it with custom function, allowing the usage of promises
                        angular.forEach(args, function(arg, index) {
                            if (angular.isFunction(arg)) {
                                userFn = arg;
                                userFnIndex = index;
                            }
                        });

                        // Replace user function intended to be passed to the Facebook API with a custom one
                        // for being able to use promises.
                        if (angular.isFunction(userFn) && angular.isNumber(userFnIndex)) {
                            args.splice(userFnIndex, 1, function(response) {
                                $timeout(function() {

                                    if (response && angular.isUndefined(response.error)) {
                                        d.resolve(response);
                                    } else {
                                        d.reject(response);
                                    }

                                    if (angular.isFunction(userFn)) {
                                        userFn(response);
                                    }
                                });
                            });
                        }

                        // review(mrzmyr): generalize behaviour of isReady check
                        if (this.isReady()) {
                            $window.FB.login.apply($window.FB, args);
                        } else {
                            $timeout(function() {
                                d.reject("Facebook.login() called before Facebook SDK has loaded.");
                            });
                        }

                        return d.promise;
                    };

                    /**
                     * Map some asynchronous Facebook SDK methods to NgFacebook
                     */
                    angular.forEach([
                        'logout',
                        'api',
                        'ui',
                        'getLoginStatus'
                    ], function(name) {
                        NgFacebook.prototype[name] = function() {

                            var d = $q.defer(),
                                args = Array.prototype.slice.call(arguments), // Converts arguments passed into an array
                                userFn,
                                userFnIndex;

                            // Get user function and it's index in the arguments array,
                            // to replace it with custom function, allowing the usage of promises
                            angular.forEach(args, function(arg, index) {
                                if (angular.isFunction(arg)) {
                                    userFn = arg;
                                    userFnIndex = index;
                                }
                            });

                            // Replace user function intended to be passed to the Facebook API with a custom one
                            // for being able to use promises.
                            if (angular.isFunction(userFn) && angular.isNumber(userFnIndex)) {
                                args.splice(userFnIndex, 1, function(response) {
                                    $timeout(function() {

                                        if (response && angular.isUndefined(response.error)) {
                                            d.resolve(response);
                                        } else {
                                            d.reject(response);
                                        }

                                        if (angular.isFunction(userFn)) {
                                            userFn(response);
                                        }
                                    });
                                });
                            }

                            $timeout(function() {
                                // Call when loadDeferred be resolved, meaning Service is ready to be used.
                                loadDeferred.promise.then(function() {
                                    $window.FB[name].apply(FB, args);
                                });
                            });

                            return d.promise;
                        };
                    });

                    /**
                     * Map Facebook sdk XFBML.parse() to NgFacebook.
                     */
                    NgFacebook.prototype.parseXFBML = function() {

                        var d = $q.defer();

                        $timeout(function() {
                            // Call when loadDeferred be resolved, meaning Service is ready to be used
                            loadDeferred.promise.then(function() {
                                $window.FB.XFBML.parse();
                                d.resolve();
                            });
                        });

                        return d.promise;
                    };

                    /**
                     * Map Facebook SDK subscribe/unsubscribe method to NgFacebook.
                     * Use it as Facebook.subscribe / Facebook.unsubscribe in the service.
                     */

                    angular.forEach([
                        'subscribe',
                        'unsubscribe',
                    ], function(name) {

                        NgFacebook.prototype[name] = function() {

                            var d = $q.defer(),
                                args = Array.prototype.slice.call(arguments), // Get arguments passed into an array
                                userFn,
                                userFnIndex;

                            // Get user function and it's index in the arguments array,
                            // to replace it with custom function, allowing the usage of promises
                            angular.forEach(args, function(arg, index) {
                                if (angular.isFunction(arg)) {
                                    userFn = arg;
                                    userFnIndex = index;
                                }
                            });

                            // Replace user function intended to be passed to the Facebook API with a custom one
                            // for being able to use promises.
                            if (angular.isFunction(userFn) && angular.isNumber(userFnIndex)) {
                                args.splice(userFnIndex, 1, function(response) {

                                    $timeout(function() {

                                        if (response && angular.isUndefined(response.error)) {
                                            d.resolve(response);
                                        } else {
                                            d.reject(response);
                                        }

                                        if (angular.isFunction(userFn)) {
                                            userFn(response);
                                        }
                                    });
                                });
                            }

                            $timeout(function() {
                                // Call when loadDeferred be resolved, meaning Service is ready to be used
                                loadDeferred.promise.then(function() {
                                    $window.FB.Event[name].apply(FB, args);
                                });
                            });

                            return d.promise;
                        };
                    });

                    return new NgFacebook(); // Singleton
                }
            ];

        }
    ]).

    /**
     * Module initialization
     */
    run([
        '$rootScope',
        '$q',
        '$window',
        '$timeout',
        function($rootScope, $q, $window, $timeout) {
            // Define global loadDeffered to notify when Service callbacks are safe to use
            loadDeferred = $q.defer();

            var loadSDK = settings.loadSDK;
            delete(settings['loadSDK']); // Remove loadSDK from settings since this isn't part from Facebook API.

            /**
             * Define fbAsyncInit required by Facebook API
             */
            $window.fbAsyncInit = function() {
                // Initialize our Facebook app
                $timeout(function() {
                    if (!settings.appId) {
                        throw 'Missing appId setting.';
                    }

                    FB.init(settings);

                    flags.ready = true;

                    /**
                     * Subscribe to Facebook API events and broadcast through app.
                     */
                    angular.forEach({
                        'auth.login': 'login',
                        'auth.logout': 'logout',
                        'auth.prompt': 'prompt',
                        'auth.sessionChange': 'sessionChange',
                        'auth.statusChange': 'statusChange',
                        'auth.authResponseChange': 'authResponseChange',
                        'xfbml.render': 'xfbmlRender',
                        'edge.create': 'like',
                        'edge.remove': 'unlike',
                        'comment.create': 'comment',
                        'comment.remove': 'uncomment'
                    }, function(mapped, name) {
                        FB.Event.subscribe(name, function(response) {
                            $timeout(function() {
                                $rootScope.$broadcast('Facebook:' + mapped, response);
                            });
                        });
                    });

                    // Broadcast Facebook:load event
                    $rootScope.$broadcast('Facebook:load');

                    loadDeferred.resolve(FB);
                });
            };

            /**
             * Inject Facebook root element in DOM
             */
            (function addFBRoot() {
                var fbroot = document.getElementById('fb-root');

                if (!fbroot) {
                    fbroot = document.createElement('div');
                    fbroot.id = 'fb-root';
                    document.body.insertBefore(fbroot, document.body.childNodes[0]);
                }

                return fbroot;
            })();

            /**
             * SDK script injecting
             */
            if (loadSDK) {
                (function injectScript() {
                    var src = '//connect.facebook.net/' + settings.locale + '/sdk.js',
                        script = document.createElement('script');
                    script.id = 'facebook-jssdk';
                    script.async = true;

                    // Prefix protocol
                    // for sure we don't want to ignore things, but this tests exists,
                    // but it isn't recognized by istanbul, so we give it a 'ignore if'
                    /* istanbul ignore if */
                    if ($window.location.protocol.indexOf('file:') !== -1) {
                        src = 'https:' + src;
                    }

                    script.src = src;
                    script.onload = function() {
                        flags.sdk = true;
                    };

                    // Fix for IE < 9, and yet supported by latest browsers
                    document.getElementsByTagName('head')[0].appendChild(script);
                })();
            }
        }
    ]);

})(window, angular);
(function() {
    'use strict';

    var underscore = angular.module('underscore', []);
    underscore.factory('_', function() {
        return window._; //Underscore must already be loaded on the page 
    });


    var esWebFramework = angular.module('es.Services.Web');


    esWebFramework.provider('es.Services.Cache', function() {
        var cache = null;
        var settings = {};
        settings.maxSize = -1;
        settings.storage = null;

        return {
            setMaxSize: function(size) {
                if (angular.isNumber(size)) {
                    settings.maxSize = size;
                }
            },

            getMaxSize: function() {
                return settings.maxSize;
            },

            getStorageSettings: function() {
                return settings.storage;
            },

            setStorageSettings: function(setings) {
                if (settings) {
                    settings.storage = settings;
                }
            },

            $get: function() {
                if (typeof(Cache) === 'undefined') {
                    throw "You must include jscache.js";
                }

                cache = new Cache(settings.maxSize, false, settings.storage);

                return {
                    getItem: function(key) {
                        return cache.getItem(key);
                    },

                    setItem: function(key, val, options) {
                        cache.setItem(key, val, options);
                    },

                    removeItem: function(key) {
                        cache.removeItem(key);
                    },

                    removeWhere: function(f) {
                        cache.removeWhere(function(k, v) {
                            return f(k, v);
                        });
                    },

                    size: function() {
                        return cache.size();
                    },

                    clear: function() {
                        cache.clear();
                    },

                    stats: function() {
                        return cache.stats();
                    }
                }
            }

        }

    });

    // Define the factory on the module.
    // Inject the dependencies.
    // Point to the factory definition function.
    esWebFramework.factory('es.Services.Messaging', function() {
        //#region Internal Properties
        var cache = {};

        //#endregion

        //#region Internal Methods
        function publish() {
            if (!arguments || arguments.Length < 1) {
                throw "Publishing events requires at least one argument for topic id";
            }

            var topic = arguments[0];
            var restArgs = Array.prototype.slice.call(arguments, 1);

            cache[topic] && angular.forEach(cache[topic], function(callback) {
                try {
                    callback.apply(null, restArgs);
                } catch (exc) {
                    console.log("Error in messaging handler for topic ", topic);
                }
            });
        }

        function subscribe(topic, callback) {
            if (!cache[topic]) {
                cache[topic] = [];
            }
            cache[topic].push(callback);
            return [topic, callback];
        }

        function unsubscribe(handle) {
            var t = handle[0];
            cache[t] && angular.forEach(cache[t], function(idx) {
                if (this == handle[1]) {
                    cache[t].splice(idx, 1);
                }
            });
        }

        //#endregion

        // Define the functions and properties to reveal.
        var service = {
            publish: publish,
            subscribe: subscribe,
            unsubscribe: unsubscribe
        };

        return service;
    });


    esWebFramework.factory('es.Services.Globals', ['$sessionStorage', '$log', 'es.Services.Messaging', '$injector' /* 'es.Services.GA' */ ,
        function($sessionStorage, $log, esMessaging, $injector) {

            function fgetGA() {
                if (!$injector) {
                    return undefined;
                }

                try {
                    return $injector.get('es.Services.GA');
                } catch (x) {
                    return undefined;
                }

            }

            function fgetModel() {
                if (!esClientSession.connectionModel) {

                    // check to see if session data are stored in the session storage so that 
                    // we can use this object as model
                    var inStorage = $sessionStorage;
                    var session = null;
                    if (typeof inStorage.__esrequest_sesssion !== 'undefined' && inStorage.__esrequest_sesssion !== null) {
                        session = inStorage.__esrequest_sesssion;
                        esClientSession.connectionModel = session;

                        esMessaging.publish("AUTH_CHANGED", esClientSession, getAuthToken(session));

                        var esga = fgetGA();
                        if (angular.isDefined(esga)) {

                            esga.registerEventTrack({
                                category: 'AUTH',
                                action: 'RELOGIN',
                                label: esClientSession.connectionModel.GID
                            });
                        }

                        $log.info("RELOGIN User ", esClientSession.connectionModel.Name);
                    } else {
                        esMessaging.publish("AUTH_CHANGED", null, getAuthToken(null));
                        $log.info("NO RELOGIN from stored state");
                    }
                }

                return esClientSession.connectionModel;
            }

            function fsetModel(model) {
                var currentGID = null;

                if (esClientSession.connectionModel) {
                    currentGID = esClientSession.connectionModel.GID;
                }

                esClientSession.connectionModel = model;

                if (!model) {
                    delete $sessionStorage.__esrequest_sesssion;

                    var esga = fgetGA();
                    if (angular.isDefined(esga)) {
                        esga.registerEventTrack({
                            category: 'AUTH',
                            action: 'LOGOUT',
                            label: currentGID
                        });
                    }

                } else {
                    $sessionStorage.__esrequest_sesssion = model;
                }

                esMessaging.publish("AUTH_CHANGED", esClientSession, getAuthToken(model));
            }

            function getAuthToken(model) {
                if (model) {
                    return 'Bearer ' + model.WebApiToken;
                }
                return '';
            }

            // Private variables//
            var esClientSession = {
                hostUrl: "",
                credentials: null,
                connectionModel: null,

                getWebApiToken: function() {
                    return getAuthToken(fgetModel());
                },

                setModel: fsetModel,

                getModel: fgetModel
            };

            function TrackTiming(category, variable, opt_label) {
                this.category = category;
                this.variable = variable;
                this.label = opt_label ? opt_label : undefined;
                this.startTime;
                this.endTime;
                return this;
            }

            TrackTiming.prototype.startTime = function() {
                this.startTime = new Date().getTime();
                return this;
            }

            TrackTiming.prototype.endTime = function() {
                this.endTime = new Date().getTime();
                return this;
            }

            TrackTiming.prototype.send = function() {
                var timeSpent = this.endTime - this.startTime;
                var esga = fgetGA();
                if (!esga) {
                    return;
                }

                esga.registerTiming({
                    timingCategory: this.category,
                    timingVar: this.variable,
                    timingValue: timeSpent,
                    timingLabel: this.label
                });
                return this;
            }

            return {

                getVersion: function() {
                    return {
                        Major: 0,
                        Minor: 0,
                        Patch: 140
                    };
                },

                getGA: fgetGA,

                getWebApiToken: function() {
                    return esClientSession.getWebApiToken();
                },

                getClientSession: function() {
                    return esClientSession;
                },

                sessionClosed: function() {
                    esClientSession.setModel(null);
                },

                trackTimer: function(category, variable, opt_label) {
                    return new TrackTiming(category, variable, opt_label);
                },

                sessionOpened: function(data, credentials) {
                    try {
                        esClientSession.setModel(data.Model);
                        esClientSession.credentials = credentials;


                        var esga = fgetGA();
                        if (angular.isDefined(esga)) {
                            var i;
                            for (i = 0; i < 12; i++) {
                                if (angular.isDefined(esga)) {
                                    esga.registerEventTrack({
                                        category: 'AUTH',
                                        action: 'LOGIN',
                                        label: data.Model.GID
                                    });
                                }
                            }
                        }

                        $log.info("LOGIN User ", data.Model.Name);

                    } catch (exc) {
                        $log.error(exc);
                        throw exc;
                    }
                }
            }

        }
    ]);


    esWebFramework.run(['es.Services.Globals', 'es.Services.WebApi', function(esGlobals, esWebApi) {
        var esSession = esGlobals.getClientSession();
        esSession.getModel();
        esSession.hostUrl = esWebApi.getServerUrl();
    }]);
})();


 // is now in the Global scope; but, we don't want to reference
 // global objects inside the AngularJS components - that's
 // not how AngularJS rolls; as such, we want to wrap the
 // stacktrace feature in a proper AngularJS service that
 // formally exposes the print method.
 // version 0.0.24

 (function() {
     'use strict';

     var esWebFramework = angular.module('es.Services.Web');
     esWebFramework.factory(
         "es.Services.StackTrace",
         function() {
             // "printStackTrace" is a global object.
             return ({
                 print: printStackTrace
             });
         }
     );

     esWebFramework.provider("$log",
         function() {
             var logAppenders = [];
             var ajaxAppender = null;
             var logger = null;
             var level = log4javascript.Level.ALL;
             var lt = null;

             function getLogger() {
                 return log4javascript.getLogger('esLogger');
             }

             function createDefaultAppenders(addPopup) {
                 doaddAppender(new log4javascript.BrowserConsoleAppender());

                 var x = angular.isDefined(addPopup) && addPopup;
                 if (x) {
                     doaddAppender(new log4javascript.PopUpAppender());
                 }
             }

             function setAccessToken(session, token) {
                 if (!ajaxAppender) {
                     return;
                 }

                 if (lt && session && session.connectionModel) {
                     lt.setCustomField("userId", session.connectionModel.UserID);
                     if (session.credentials) {
                         lt.setCustomField("branchId", session.credentials.BranchID);
                         lt.setCustomField("langId", session.credentials.LangID);
                     }
                 }

                 var hd = ajaxAppender.getHeaders();
                 if (hd) {
                     var i;
                     var foundIndex = -1;
                     for (i = 0; i < hd.length; i++) {
                         if (hd[i].name == "Authorization") {
                             foundIndex = i;
                             break;
                         }
                     }
                     if (foundIndex != -1) {
                         hd.splice(foundIndex, 1);
                     }
                 }

                 if (token && token != "") {
                     ajaxAppender.addHeader("Authorization", token);
                 }
             }

             function doaddAppender(appender) {
                 if (logAppenders.indexOf(appender) == -1) {
                     logAppenders.push(appender);
                     return true;
                 }
                 return false;
             }

             return {

                 setLevel: function(lvl) {
                     level = lvl;
                     if (logger) {
                         logger.setLevel(level);
                     }
                 },

                 getLevel: function() {
                     return level;
                 },

                 getCurrentLevel: function() {
                     if (logger) {
                         return logger.getEffectiveLevel();
                     } else {
                         return log4javascript.Level.OFF;
                     }
                 },

                 addAppender: doaddAppender,

                 addDefaultAppenders: createDefaultAppenders,

                 addESWebApiAppender: function(srvUrl, subscriptionId) {
                     // var ajaxUrl = srvUrl + "api/rpc/log/";
                     var ajaxUrl = srvUrl + "api/rpc/registerException/";

                     ajaxAppender = new log4javascript.AjaxAppender(ajaxUrl, false);
                     ajaxAppender.setSendAllOnUnload(true);

                     lt = new log4javascript.JsonLayout();
                     lt.setCustomField("subscriptionId", subscriptionId);

                     ajaxAppender.setLayout(lt);
                     ajaxAppender.setWaitForResponse(true);
                     ajaxAppender.setBatchSize(100);
                     ajaxAppender.setTimed(true);
                     ajaxAppender.setTimerInterval(60000);
                     ajaxAppender.addHeader("Content-Type", "application/json");

                     ajaxAppender.setRequestSuccessCallback(function(xmlHttp) {
                         console.log("ES Logger, BATCH of logs upoloaded", xmlHttp.responseURL, xmlHttp.status);
                     });

                     ajaxAppender.setFailCallback(function(messg) {
                         console.error("Failed to POST Logs to the server", messg);
                     });
                     return doaddAppender(ajaxAppender);
                 },

                 $get: ['es.Services.Messaging',
                     function(esMessaging) {
                         try {

                             logger = getLogger();
                             logger.setLevel(level);

                             if (logAppenders.length == 0) {
                                 createDefaultAppenders();
                             }

                             var i = 0;
                             for (i = 0; i < logAppenders.length; i++) {
                                 logger.addAppender(logAppenders[i]);
                             }

                             esMessaging.subscribe("AUTH_CHANGED", function(session, tok) {
                                 setAccessToken(session, tok)
                             });

                             logger.sendAll = function() {
                                 try {
                                     if (ajaxAppender) {
                                         ajaxAppender.sendAll();
                                     }
                                 } catch (exc) {

                                 }
                             }

                             console.info("ES Logger started");
                             return logger;
                         } catch (exception) {
                             console.log("Error in starting entersoft logger", exception);
                             return $log;
                         }

                     }
                 ]
             }
         }

     );


     // -------------------------------------------------- //
     // -------------------------------------------------- //


     // By default, AngularJS will catch errors and log them to
     // the Console. We want to keep that behavior; however, we
     // want to intercept it so that we can also log the errors
     // to the server for later analysis.
     esWebFramework.provider("$exceptionHandler",
         function() {
             var logSettings = {
                 pushToServer: false,
                 logServer: ""
             };
             return {
                 getSettings: function() {
                     return logSettings;
                 },

                 setPushToServer: function(pushToServer) {
                     logSettings.pushToServer = pushToServer;
                 },

                 setLogServer: function(logServer) {
                     logSettings.logServer = logServer;
                 },

                 $get: ['$log', '$window', 'es.Services.StackTrace', '$injector',
                     function($log, $window, stacktraceService, $injector) {

                         // I log the given error to the remote server.
                         function log(exception, cause) {
                                 var errorMessage, stackTrace, itm;

                                 try {
                                     errorMessage = exception.toString();
                                     stackTrace = stacktraceService.print({
                                         e: exception
                                     });

                                     itm = {
                                         errorUrl: $window.location.href,
                                         errorMessage: errorMessage,
                                         stackTrace: stackTrace,
                                         cause: (cause || "")
                                     };

                                     $log.error(JSON.stringify(itm, null, '\t'));

                                 } catch (loggingError) {
                                     console.log(arguments);
                                 }

                                 if (logSettings.pushToServer) {
                                     // Now, we need to try and log the error the server.
                                     // --
                                     // NOTE: In production, I have some debouncing
                                     // logic here to prevent the same client from
                                     // logging the same error over and over again! All
                                     // that would do is add noise to the log.
                                     try {
                                         var ESWEBAPI = $injector.get('es.Services.WebApi');

                                         ESWEBAPI.registerException(itm, logSettings.logServer);

                                     } catch (loggingError) {

                                         // For Developers - log the log-failure.
                                         $log.warn("ES Error in registerException on store " + logSettings.logServer);
                                         $log.error(loggingError);

                                     }
                                 }

                             }
                             // Return the logging function.
                         return (log);
                     }
                 ]

             }
         }
     );
 })();




(function() {
    'use strict';
    var esWEBUI = angular.module('es.Web.UI', []);

    var esComplexParamFunctionOptions = [{
        caption: "=",
        value: "EQ"
    }, {
        caption: "<>",
        value: "NE"
    }, {
        caption: "<",
        value: "LT"
    }, {
        caption: "<=",
        value: "LE"
    }, {
        caption: ">",
        value: "GT"
    }, {
        caption: ">=",
        value: "GE"
    }, {
        caption: "...<=...<=...",
        value: "RANGE"
    }, {
        caption: "Empty",
        value: "NULL"
    }, {
        caption: "Not Empty",
        value: "NOTNULL"
    }];

    function ESParamVal(paramId, paramVal) {
        this.paramCode = paramId;
        this.paramValue = paramVal;
    }

    ESParamVal.prototype.getExecuteVal = function() {
        return this.paramValue;
    };


    function ESNumericParamVal(paramId, paramVal) {
        //call super constructor
        ESParamVal.call(this, paramId, paramVal);
    }

    //inherit from ESParamval SuperClass
    ESNumericParamVal.prototype = Object.create(ESParamVal.prototype);


    ESNumericParamVal.prototype.getExecuteVal = function() {
        switch (this.paramValue.oper) {
            case "RANGE":
                return "ESNumeric(" + this.paramValue.oper + ", '" + this.paramValue.value + "', '" + this.paramValue.valueTo + "')";
            case "NULL":
            case "NOTNULL":
                return "ESNumeric(" + this.paramValue.oper + ", '0')";
            default:
                return "ESNumeric(" + this.paramValue.oper + ", '" + this.paramValue.value + "')";
        }
    }

    function ESStringParamVal(paramId, paramVal) {
        //call super constructor
        ESParamVal.call(this, paramId, paramVal);
    }

    //inherit from ESParamval SuperClass
    ESStringParamVal.prototype = Object.create(ESParamVal.prototype);


    ESStringParamVal.prototype.getExecuteVal = function() {
        switch (this.paramValue.oper) {
            case "EQ":
                return this.paramValue.value;
            case "RANGE":
                return "ESString(" + this.paramValue.oper + ", '" + this.paramValue.value + "', '" + this.paramValue.valueTo + "')";
            case "NULL":
            case "NOTNULL":
                return "ESString(" + this.paramValue.oper + ", '')";
            default:
                return "ESString(" + this.paramValue.oper + ", '" + this.paramValue.value + "')";
        }
    }


    function ESParamValues(vals) {
        this.setParamValues(vals);
    }

    ESParamValues.prototype.setParamValues = function(vals) {
        var x = this;

        //delete any previsously assigned properties
        for (var prop in x) {
            if (x.hasOwnProperty(prop)) {
                delete x[prop];
            }
        };

        //asign new properties
        if (!vals || !_.isArray(vals) || vals.length == 0) {
            return;
        }

        vals.forEach(function(element, index, array) {
            x[element.paramCode] = element;
        });
    }

    ESParamValues.prototype.getExecuteVals = function() {
        var x = this;
        var ret = {};
        for (var prop in x) {
            if (x.hasOwnProperty(prop)) {
                var p = x[prop];

                if (p.paramValue) {
                    ret[p.paramCode] = p.getExecuteVal();
                }
            }
        }
        return ret;
    }

    function prepareStdZoom($log, zoomID, esWebApiService) {
        var xParam = {
            transport: {
                read: function(options) {

                    $log.info("FETCHing ZOOM data for [", zoomID, "] with options ", JSON.stringify(options));

                    var pqOptions = {};
                    esWebApiService.fetchStdZoom(zoomID, pqOptions)
                        .success(function(pq) {
                            // SME CHANGE THIS ONCE WE HAVE CORRECT PQ
                            if (pq.Count == -1) {
                                pq.Count = pq.Rows ? pq.Rows.length : 0;
                            }
                            // END tackling

                            options.success(pq);
                            $log.info("FETCHed ZOOM data for [", zoomID, "] with options ", JSON.stringify(options));
                        })
                        .error(function(err) {
                            options.error(err);
                        });
                }

            },
            schema: {
                data: "Rows",
                total: "Count"
            }
        }
        return new kendo.data.DataSource(xParam);
    }


    function prepareWebScroller(dsType, esWebApiService, $log, espqParams, esOptions) {
        var xParam = {
            transport: {
                read: function(options) {

                    var qParams = angular.isFunction(espqParams) ? espqParams() : espqParams;
                    $log.info("FETCHing PQ with PQParams ", JSON.stringify(qParams), " and gridoptions ", JSON.stringify(options));
                    var pqOptions = {};

                    if (options.data && options.data.page && options.data.pageSize) {
                        pqOptions.WithCount = true;
                        pqOptions.Page = options.data.page;
                        pqOptions.PageSize = options.data.pageSize
                    }

                    var executeParams = qParams.Params;
                    if (executeParams instanceof ESParamValues) {
                        executeParams = executeParams.getExecuteVals();
                    }


                    esWebApiService.fetchPublicQuery(qParams.GroupID, qParams.FilterID, pqOptions, executeParams)
                        .success(function(pq) {

                            if (!angular.isDefined(pq.Rows)) {
                                pq.Rows = [];
                                pq.Count = 0;
                            }

                            if (!angular.isDefined(pq.Count)) {
                                pq.Count = -1;
                            }

                            options.success(pq);
                            $log.info("FETCHed PQ with PQParams ", JSON.stringify(executeParams), " and gridoptions ", JSON.stringify(options));
                        })
                        .error(function(err) {
                            $log.error("Error in DataSource ", err);
                            options.error(err);
                        });
                },

            },
            requestStart: function(e) {
                $log.info("request started ", e);
            },

            schema: {
                data: "Rows",
                total: "Count"
            }
        }

        if (esOptions) {
            angular.extend(xParam, esOptions);
        }

        if (dsType && dsType === "pivot") {
            return new kendo.data.PivotDataSource(xParam);
        } else {
            return new kendo.data.DataSource(xParam);
        }
    }

    esWEBUI.filter('esTrustHtml', ['$sce',
        function($sce) {
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }
    ]);

    esWEBUI
        .filter('esParamTypeMapper', function() {
            var f = function(pParam) {
                if (!pParam) {
                    return "";
                }

                var pt = pParam.parameterType.toLowerCase()

                //ESNumeric
                if (pt.indexOf("entersoft.framework.platform.esnumeric") == 0) {
                    return "esParamAdvancedNumeric";
                }

                //ESString
                if (pt.indexOf("entersoft.framework.platform.esstring, queryprocess") == 0) {
                    return "esParamAdvancedString";
                }

                // Numeric (Integer or Decimal)
                if (pt.indexOf("system.string, mscorlib") == 0) {
                    switch (pParam.controlType) {
                        case 1:
                            {
                                return "esParamNumeric";
                            }
                            break;
                        case 2:
                            {
                                return "esParamNumeric";
                            }
                            break;
                    }
                }


                //case Enum 
                if (pParam.enumList && (pParam.enumList.length > 1)) {
                    if (pParam.enumOptionAll) {
                        return "esParamMultiEnum";
                    } else {
                        return "esParamEnum";
                    }
                }

                if (pParam.invSelectedMasterTable) {
                    if (pParam.invSelectedMasterTable[4] == "Z") {
                        if (pParam.multiValued) {
                            return "esParamMultiZoom";
                        } else {
                            return "esParamZoom";
                        }
                    } else {
                        return "esParamText";
                    }
                }

                return "esParamText";

            };


            return f;
        })
        .directive('esGrid', ['es.Services.WebApi', 'es.UI.Web.UIHelper', '$log', function(esWebApiService, esWebUIHelper, $log) {
            return {
                restrict: 'AE',
                scope: {
                    esGroupId: "=",
                    esFilterId: "=",
                    esExecuteParams: "=",
                    esGridOptions: "=",
                },
                templateUrl: function(element, attrs) {
                    $log.info("Parameter element = ", element, " Parameter attrs = ", attrs);
                    return "src/partials/esGrid.html";
                },
                link: function(scope, iElement, iAttrs) {
                    if (!scope.esGroupId || !scope.esFilterId) {
                        throw "You must set GroupID and FilterID for esgrid to work";
                    }


                    if (!scope.esGridOptions && !iAttrs.esGridOptions) {
                        // Now esGridOption explicitly assigned so ask the server 
                        esWebApiService.fetchPublicQueryInfo(scope.esGroupId, scope.esFilterId)
                            .success(function(ret) {
                                var p1 = ret;
                                var p2 = esWebUIHelper.winGridInfoToESGridInfo(scope.esGroupId, scope.esFilterId, p1);
                                scope.esGridOptions = esWebUIHelper.esGridInfoToKInfo(esWebApiService, scope.esGroupId, scope.esFilterId, scope.esExecuteParams, p2);
                            });
                    }
                }
            };
        }])
        .directive('esParam', ['$log', 'es.Services.WebApi', 'es.UI.Web.UIHelper', function($log, esWebApiService, esWebUIHelper) {
            return {
                restrict: 'AE',
                scope: {
                    esParamDef: "=",
                    esParamVal: "=",
                    esType: "="
                },
                template: '<div ng-include src="\'src/partials/\'+esType+\'.html\'"></div>',
                link: function(scope, iElement, iAttrs) {

                    if (!scope.esParamDef) {
                        throw "You must set a param";
                    }

                    scope.esWebUIHelper = esWebUIHelper;
                    scope.esWebApiService = esWebApiService;

                    if (scope.esParamDef.invSelectedMasterTable) {
                        scope.esParamLookupDS = prepareStdZoom($log, scope.esParamDef.invSelectedMasterTable, esWebApiService);
                    }
                }
            };
        }])
        .directive('esWebPq', ['$log', 'es.Services.WebApi', 'es.UI.Web.UIHelper', function($log, esWebApiService, esWebUIHelper) {
            return {
                restrict: 'AE',
                scope: {
                    esGroupId: "=",
                    esFilterId: "=",
                },
                templateUrl: function(element, attrs) {
                    $log.info("Parameter element = ", element, " Parameter attrs = ", attrs);
                    return "src/partials/esWebPQ.html";
                },
                link: function(scope, iElement, iAttrs) {
                    if (!scope.esGroupId || !scope.esFilterId) {
                        throw "You must set the pair es-group-id and es-filter-id attrs";
                    }

                    esWebApiService.fetchPublicQueryInfo(scope.esGroupId, scope.esFilterId)
                        .success(function(ret) {
                            var v = esWebUIHelper.winGridInfoToESGridInfo(scope.esGroupId, scope.esFilterId, ret);
                            scope.esParamsValues = v.defaultValues;
                            scope.esParamsDef = v.params;
                            scope.esGridOptions = esWebUIHelper.esGridInfoToKInfo(esWebApiService, scope.esGroupId, scope.esFilterId, scope.esParamsValues, v);
                        });
                }
            };
        }])
        .directive('esParamsPanel', ['$log', 'es.Services.WebApi', 'es.UI.Web.UIHelper', function($log, esWebApiService, esWebUIHelper) {
            return {
                restrict: 'AE',
                scope: {
                    esParamsDef: '=',
                    esPqInfo: '=',
                    esParamsValues: '=',
                    esGroupId: "=",
                    esFilterId: "=",
                },
                templateUrl: function(element, attrs) {
                    $log.info("Parameter element = ", element, " Parameter attrs = ", attrs);
                    return "src/partials/esParams.html";
                },
                link: function(scope, iElement, iAttrs) {
                    if (!iAttrs.esParamsDef && !iAttrs.esPqInfo && (!scope.esGroupId || !scope.esFilterId)) {
                        throw "You must set either the es-params-def or ea-pq-info or the pair es-group-id and es-filter-id attrs";
                    }

                    if (!iAttrs.esParamsDef) {
                        if (!iAttrs.esPqInfo) {
                            // we are given groupid and filterid =>
                            // we must retrieve pqinfo on owr own
                            esWebApiService.fetchPublicQueryInfo(scope.esGroupId, scope.esFilterId)
                                .success(function(ret) {
                                    var v = esWebUIHelper.winGridInfoToESGridInfo(scope.esGroupId, scope.esFilterId, ret);
                                    scope.esParamsValues = v.defaultValues;
                                    scope.esParamsDef = v.params;
                                });
                        } else {
                            scope.esParamDef = esPqInfo.params;
                        }
                    }
                }
            };
        }]);

    esWEBUI.factory("es.UI.Web.UIHelper", ['es.Services.WebApi', '$log',
        function(esWebApiService, $log) {

            function esColToKCol(esGridInfo, esCol) {
                var tCol = {
                    field: esCol.field,
                    title: esCol.title,
                    width: esCol.width,
                    attributes: esCol.attributes,
                    values: esCol.enumValues,

                }

                if (esCol.formatString && esCol.formatString != "") {
                    tCol.format = "{0:" + esCol.formatString + "}";
                }
                return tCol;
            }

            function esGridInfoToKInfo(esWebApiService, esGroupId, esFilterId, executeParams, esGridInfo) {
                var grdopt = {
                    pageable: {
                        refresh: true
                    },
                    sortable: true,
                    filterable: true,
                    resizable: true,
                    toolbar: ["excel"],
                    excel: {
                        allPages: true,
                        fileName: esGroupId + "-" + esFilterId + ".xlsx",
                        filterable: true
                    }
                };

                var kdsoptions = {
                    serverFiltering: true,
                    serverPaging: true,
                    pageSize: 20
                };

                grdopt.columns = esGridInfo.columns;

                grdopt.dataSource = prepareWebScroller(null, esWebApiService, $log, function() {
                    return {
                        GroupID: esGroupId,
                        FilterID: esFilterId,
                        Params: executeParams
                    }
                }, kdsoptions);

                return grdopt;
            }

            function winColToESCol(inGroupID, inFilterID, gridexInfo, jCol) {
                var esCol = {
                    AA: undefined,
                    field: undefined,
                    title: undefined,
                    width: undefined,
                    visible: undefined,
                    attributes: undefined,
                    enumValues: undefined,
                    formatString: undefined,
                };

                esCol.AA = parseInt(jCol.AA);
                esCol.field = jCol.ColName;
                esCol.title = jCol.Caption;
                esCol.formatString = jCol.FormatString;
                esCol.visible = (jCol.Visible == "true");

                if (jCol.TextAlignment == "3") {
                    esCol.attributes = {
                        style: "text-align: right;"
                    };
                }

                //Enum Column
                if (jCol.EditType == "5") {
                    var l1 = _.sortBy(_.filter(gridexInfo.ValueList, function(x) {
                        var v = x.ColName == jCol.ColName;
                        v = v && (typeof x.Value != 'undefined');
                        v = v && x.fFilterID == inFilterID;
                        return v;
                    }), function(x) {
                        return !isNaN(x.Value) ? parseInt(x.Value) : null;
                    });
                    var l2 = _.map(l1, function(x) {
                        return {
                            text: x.Caption,
                            value: !isNaN(x.Value) ? parseInt(x.Value) : null
                        };
                    });

                    if (l2 && l2.length) {
                        esCol.enumValues = l2;
                    }
                }
                return esCol;
            }

            //here 

            function esEval(pInfo, expr) {
                var EQ = {
                    oper: "EQ",
                    paramID: pInfo.id
                };
                var GE = {
                    oper: "GE",
                    paramID: pInfo.id
                };
                var GT = {
                    oper: "GT",
                    paramID: pInfo.id
                };
                var LE = {
                    oper: "LE",
                    paramID: pInfo.id
                };
                var LT = {
                    oper: "LT",
                    paramID: pInfo.id
                };
                var NE = {
                    oper: "NE",
                    paramID: pInfo.id
                };
                var RANGE = {
                    oper: "RANGE",
                    paramID: pInfo.id
                };
                var NULL = {
                    oper: "NULL",
                    paramID: pInfo.id
                };
                var NOTNULL = {
                    oper: "NOTNULL",
                    paramID: pInfo.id
                };
                return eval(expr);
            }

            function ESNumeric(inArg, val, val2) {
                var k = {
                    value: !isNaN(val) ? parseInt(val) : null,
                    valueTo: !isNaN(val2) ? parseInt(val2) : null,
                    oper: inArg.oper || "EQ"
                };
                return new ESNumericParamVal(inArg.paramID, k);
            }

            function ESString(inArg, val, val2) {
                var k = {
                    value: val,
                    valueTo: val2,
                    oper: inArg.oper || "EQ"
                };
                return new ESStringParamVal(inArg.paramID, k);
            }

            function getEsParamVal(esParamInfo, dx) {
                var ps = esParamInfo.parameterType.toLowerCase();

                //ESNumeric
                if (ps.indexOf("entersoft.framework.platform.esnumeric") == 0) {
                    if (!dx || dx.length == 0) {
                        return ESNumeric(esParamInfo.id, {
                            oper: "EQ"
                        });
                    }
                    return esEval(esParamInfo, dx[0].Value);
                }

                //ESString
                if (ps.indexOf("entersoft.framework.platform.esstring, queryprocess") == 0) {
                    if (!dx || dx.length == 0) {
                        return new ESStringParamVal(esParamInfo.id, {
                            oper: "EQ",
                            value: null
                        });
                    }

                    return esEval(esParamInfo, dx[0].Value);
                }

                //Not set
                if (!dx || dx.length == 0) {
                    return new ESParamVal(esParamInfo.id, null);
                }

                var processedVals = _.map(dx, function(k) {
                    return processStrToken(esParamInfo, k.Value);
                });

                if (processedVals.length == 1) {
                    processedVals = processedVals[0];
                }
                return new ESParamVal(esParamInfo.id, processedVals);
            }

            function processStrToken(esParamInfo, val) {
                if (!esParamInfo) {
                    return val;
                }

                var ps = esParamInfo.parameterType.toLowerCase();
                if (ps.indexOf("system.byte") != -1 || ps.indexOf("system.int") != -1) {
                    return parseInt(val);
                }

                if (esParamInfo.enumList && esParamInfo.enumList.length > 1) {
                    return parseInt(val);
                }

                return val;
            }

            function winParamInfoToesParamInfo(winParamInfo, gridexInfo) {
                if (!winParamInfo) {
                    return null;
                }

                var esParamInfo = {
                    id: undefined,
                    aa: undefined,
                    caption: undefined,
                    toolTip: undefined,
                    controlType: undefined,
                    parameterType: undefined,
                    precision: undefined,
                    multiValued: undefined,
                    visible: undefined,
                    required: undefined,
                    oDSTag: undefined,
                    formatStrng: undefined,
                    tags: undefined,
                    visibility: undefined,
                    invSelectedMasterTable: undefined,
                    invSelectedMasterField: undefined,
                    invTableMappings: undefined,
                    defaultValues: undefined,
                    enumOptionAll: undefined,
                    enumList: undefined
                };

                esParamInfo.id = winParamInfo.ID;
                esParamInfo.aa = parseInt(winParamInfo.AA);
                esParamInfo.caption = winParamInfo.Caption;
                esParamInfo.toolTip = winParamInfo.Tooltip;
                esParamInfo.controlType = parseInt(winParamInfo.ControlType);
                esParamInfo.parameterType = winParamInfo.ParameterType;
                esParamInfo.precision = parseInt(winParamInfo.Precision);
                esParamInfo.multiValued = winParamInfo.MultiValued == "true";
                esParamInfo.visible = winParamInfo.Visible == "true";
                esParamInfo.required = winParamInfo.Required == "true";
                esParamInfo.oDSTag = winParamInfo.ODSTag;
                esParamInfo.tags = winParamInfo.Tags;
                esParamInfo.visibility = parseInt(winParamInfo.Visibility);
                esParamInfo.invSelectedMasterTable = winParamInfo.InvSelectedMasterTable;
                esParamInfo.invSelectedMasterField = winParamInfo.InvSelectedMasterField;
                esParamInfo.invTableMappings = winParamInfo.InvTableMappings;

                esParamInfo.enumOptionAll = winParamInfo.EnumOptionAll;
                var enmList = _.sortBy(_.map(_.filter(gridexInfo.EnumItem, function(x) {
                    return x.fParamID == esParamInfo.id && (typeof x.ID != 'undefined');
                }), function(e) {
                    return {
                        text: esParamInfo.oDSTag ? e.Caption.substring(e.Caption.indexOf(".") + 1) : e.Caption,
                        value: !isNaN(e.ID) ? parseInt(e.ID) : null
                    };
                }), "value");

                esParamInfo.enumList = (enmList.length) ? enmList : undefined;


                var gxDef = gridexInfo.DefaultValue;
                if (gxDef && angular.isArray(gxDef)) {
                    var dx = _.where(gxDef, {
                        fParamID: esParamInfo.id
                    });

                    esParamInfo.defaultValues = getEsParamVal(esParamInfo, dx);
                }

                return esParamInfo;
            }

            function winGridInfoToESGridInfo(inGroupID, inFilterID, gridexInfo) {
                if (!gridexInfo || !gridexInfo.LayoutColumn) {
                    return null;
                }

                var filterInfo = _.where(gridexInfo.Filter, {
                    ID: inFilterID
                });

                if (!filterInfo || filterInfo.length != 1) {
                    return null;
                }

                var esGridInfo = {
                    id: undefined,
                    caption: undefined,
                    rootTable: undefined,
                    selectedMasterTable: undefined,
                    selectedMasterField: undefined,
                    totalRow: undefined,
                    columnHeaders: undefined,
                    columnSetHeaders: undefined,
                    columnSetRowCount: undefined,
                    columnSetHeaderLines: undefined,
                    headerLines: undefined,
                    groupByBoxVisible: undefined,
                    filterLineVisible: false,
                    previewRow: undefined,
                    previewRowMember: undefined,
                    previewRowLines: undefined,
                    columns: undefined,
                    params: undefined,
                    defaultValues: undefined,
                };

                var z2 = _.map(_.where(gridexInfo.LayoutColumn, {
                    fFilterID: inFilterID
                }), function(x) {
                    return winColToESCol(inGroupID, inFilterID, gridexInfo, x);
                });

                var z1 = _.sortBy(_.where(z2, {
                    visible: true
                }), function(x) {
                    return parseInt(x.AA);
                });

                var z3 = _.map(z1, function(x) {
                    return esColToKCol(esGridInfo, x);
                });

                filterInfo = filterInfo[0];
                esGridInfo.id = filterInfo.ID;
                esGridInfo.caption = filterInfo.Caption;
                esGridInfo.rootTable = filterInfo.RootTable;
                esGridInfo.selectedMasterTable = filterInfo.SelectedMasterTable;
                esGridInfo.selectedMasterField = filterInfo.SelectedMasterField;
                esGridInfo.totalRow = filterInfo.TotalRow;
                esGridInfo.columnHeaders = filterInfo.ColumnHeaders;
                esGridInfo.columnSetHeaders = filterInfo.ColumnSetHeaders;
                esGridInfo.columnSetRowCount = filterInfo.ColumnSetRowCount;
                esGridInfo.columnSetHeaderLines = filterInfo.ColumnSetHeaderLines;
                esGridInfo.headerLines = filterInfo.HeaderLines;
                esGridInfo.groupByBoxVisible = filterInfo.GroupByBoxVisible;
                esGridInfo.filterLineVisible = filterInfo.FilterLineVisible;
                esGridInfo.previewRow = filterInfo.PreviewRow;
                esGridInfo.previewRowMember = filterInfo.PreviewRowMember;
                esGridInfo.previewRowLines = filterInfo.PreviewRowLines;

                esGridInfo.columns = z3;

                esGridInfo.params = _.map(gridexInfo.Param, function(p) {
                    return winParamInfoToesParamInfo(p, gridexInfo);
                });


                var dfValues = _.map(esGridInfo.params, function(p) {
                    return p.defaultValues;
                });

                esGridInfo.defaultValues = new ESParamValues(dfValues);
                return esGridInfo;
            }

            return ({
                winGridInfoToESGridInfo: winGridInfoToESGridInfo,
                winColToESCol: winColToESCol,
                esColToKCol: esColToKCol,
                esGridInfoToKInfo: esGridInfoToKInfo,
                getZoomDataSource: prepareStdZoom,
                getPQDataSource: prepareWebScroller,
                getesComplexParamFunctionOptions: function() {
                    return esComplexParamFunctionOptions;
                },

            });
        }
    ]);

})();
