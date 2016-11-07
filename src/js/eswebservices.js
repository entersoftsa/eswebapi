/***********************************
 * Entersoft SA
 * http://www.entersoft.eu
 * v0.0.72
 *
 ***********************************/

/**
 * @ngdoc overview
 * @name es.Services.Web
 * @module es.Services.Web
 * @requires ngStorage
 * @requires ngFileUpload
 * @kind module
 * @description
 * This module encapsulates the services, providers, factories and constants for the **Entersoft AngularJS WEB API** services that can be used
 * within the context of any AngularJS Single Page Application (SPA).
 * The core components of the ES WEB API is the Angular Provider {@link es.Services.Web.esWebApi esWebApiProvider}
 */

(function() {
    'use strict';

    /* Services */

    var esWebServices = angular.module('es.Services.Web', ['ngStorage' /*, 'es.Services.Analytics' */ ]);

    esWebServices.
    constant('ESWEBAPI_URL', {
        __LOGIN__: "api/Login/Login",
        __LOGOUT__: "api/Login/Logout",
        __USER_LOGO__: "api/Login/UserLogo/",
        __REMOVE_USER_LOGO__: "api/Login/RemoveUserLogo/",
        __PERSON_LOGO__: "api/rpc/personLogo/",
        __POST_USER_LOGO__: "api/Login/UpdateUserLogo/",
        __EVENTLOG__: "api/rpc/EventLog/",
        __PUBLICQUERY__: "api/rpc/PublicQuery/",
        __MULTI_PULIC_QUERY__: "api/rpc/MultiPublicQuery/",
        __PUBLICQUERY_INFO__: "api/rpc/PublicQueryInfo/",
        __USERSITES__: "api/Login/Usersites",
        __STANDARD_ZOOM__: "api/rpc/FetchStdZoom/",
        __MULTI_STANDARD_ZOOM__: "api/rpc/MultiFetchStdZoom/",
        __SCROLLERROOTTABLE__: "api/rpc/SimpleScrollerRootTable/",
        __SCROLLER__: "api/rpc/SimpleScroller/",
        __ENTITYACTION__: "api/Entity/",
        __ENTITYBYGIDACTION__: "api/EntityByGID/",
        __ELASTICSEARCH__: "api/esearch/",
        __SERVER_CAPABILITIES__: "api/Login/ServerCapabilities/",
        __FETCH_COMPANY_PARAM__: "api/rpc/FetchCompanyParam/",
        __FETCH_COMPANY_PARAMS__: "api/rpc/FetchCompanyParams/",
        __SCROLLER_COMMAND__: "api/rpc/ScrollerCommand/",
        __FORM_COMMAND__: "api/rpc/FormCommand/",
        __EBS_SERVICE__: "api/rpc/EbsService/",
        __FETCH_SESSION_INFO__: "api/rpc/FetchSessionInfo/",
        __FETCH_ODS_TABLE_INFO__: "api/rpc/FetchOdsTableInfo/",
        __FETCH_ODS_COLUMN_INFO__: "api/rpc/FetchOdsColumnInfo/",
        __FETCH_ODS_RELATION_INFO__: "api/rpc/FetchOdsRelationInfo/",
        __FETCH_ODS_DETAIL_RELATIONS_INFO__: "api/rpc/FetchOdsDetailRelationsInfo/",
        __FETCH_ODS_MASTER_RELATIONS_INFO__: "api/rpc/FetchOdsMasterRelationsInfo/",
        __FI_IMPORTDOCUMENT___: "api/rpc/FIImportDocument/",
        __FETCH_ENTITY__: "api/rpc/fetchEntity/",
        __FETCH_ENTITY_BY_CODE__: "api/rpc/fetchEntityByCode/",
        __FETCH_ESPROPERTY_SET__: "api/rpc/fetchPropertySet/",
        __FETCH_ESSCALE__: "api/rpc/fetchESScale/",
        __FETCH_WEB_EAS_ASSET__: "api/asset/",
        __FETCH_ES00DOCUMENT_BY_GID__: "api/ES00Documents/InfoByGID/",
        __FETCH_ES00DOCUMENT_BY_CODE__: "api/ES00Documents/InfoByCode/",
        __FETCH_ES00DOCUMENT_BY_ENTITYGID__: "api/ES00Documents/InfoByEntityGid/",
        __FETCH_ES00DOCUMENT_BLOBDATA_BY_GID__: "api/ES00Documents/BlobDataByGID/",
        __FETCH_ES00DOCUMENT_MIME_TYPES__: "api/ES00Documents/ESMimeTypes/",
        __DELETE_ES00DOCUMENT__: "api/ES00Documents/DeleteES00Document/",
        __ADD_OR_UPDATE_ES00DOCUMENT_BLOBDATA__: "api/ES00Documents/AddOrUpdateES00DocumentBlobData/",
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

    /**
     * @ngdoc service
     * @name es.Services.Web.esWebApiProvider
     * @module es.Services.Web
     * @kind provider
     * @description
     * Provides the functions needed to configure the esWebAPI service through the esWebApiProvider that is taking place typically in the _app.js_ file of the AngularJS SPA
     *  in the _app.config_ function.
     * Web API.
     */

    /**
     * @ngdoc service
     * @name es.Services.Web.esWebApi
     * @module es.Services.Web
     * @requires $http 
     * @requires $log 
     * @requires $q 
     * @requires $rootScope 
     * @requires es.Services.Web.esGlobals 
     * @requires es.Services.Web.esMessaging
     * @kind provider
     * @description
     * In order to use the esWebApi service you have to configure within your AngularJS application the service through the {@link es.Services.Web.esWebApiProvider esWebApiProvider}.
     * Web API.
     */
    esWebServices.provider("esWebApi",
        function() {

            var urlWEBAPI = "";
            var unSecureWEBAPI = "";
            var secureWEBAPI = "";
            var additionalHeaders = {};

            var esConfigSettings = {
                host: "",
                allowUnsecureConnection: false,
                subscriptionId: "",
                subscriptionPassword: "",
                bridgeId: "",
                additionalHeaders: {},
            };

            return {
                /**
                 * @ngdoc function
                 * @name es.Services.Web.esWebApiProvider#getSettings
                 * @methodOf es.Services.Web.esWebApiProvider
                 * @module es.Services.Web
                 * @kind function
                 * @description Function that returns the current settings that have been used for the configuration of the esWebApiProvider.
                 * @return {object} A JSON object representing the esWebApiProvider configuration settings. A typical form 
                 * of the _settings_ configuration object is as follows:
```js
var esWebApiSettings = {
    host: string, // i.e. "localhost/eswebapi" the url (with out the http or https protocol) that points to the Entersoft WEB API Server
                  // if you specify the complete url, then the https or https part will be automatically removed. The actual protocol that 
                  // wil be used depends on the allowUnsecureConnection property.
    subscriptionId: string, // i.e. in typical installations this should be an empty string ""
    subscriptionPassword: string, // the passowrd for the selected subscriptionId. In typical instllations this would be "passx"
    allowUnsecureConnection: boolean // whether the ES Web Api Server allows for unsecure connections i.e. http or not i.e. https will be used
}
```
                 **/
                getSettings: function() {
                    return esConfigSettings;
                },

                /**
                 * @ngdoc function
                 * @name es.Services.Web.esWebApiProvider#getServerUrl
                 * @methodOf es.Services.Web.esWebApiProvider
                 * @module es.Services.Web
                 * @kind function
                 * @description Function that returns the actual URL to the Entersoft WEB API Server as it has been resolved after configuration of
                 * the esWebApiProvider.
                 * @return {string} Returns the actual URL to the Entersoft WEB API Server 
                 **/
                getServerUrl: function() {
                    return urlWEBAPI;
                },

                /**
                 * @ngdoc function
                 * @name es.Services.Web.esWebApiProvider#setSettings
                 * @methodOf es.Services.Web.esWebApiProvider
                 * @module es.Services.Web
                 * @kind function
                 * @description Function that returns the full URL to the Entersoft WEB API Server as it has been resolved 
                 * according to the configuration of the esWebApiProvider at the provider's configuration function of the AngularJS application.
                 * For more information on how to setup the Entersoft Web Api Server please refer to {@link installation/es02wapis ES WEB API Server}.
                 * A typical form 
                 * of the _settings_ configuration object is as follows:
```js
var esWebApiSettings = {
            host: string, // i.e. "localhost/eswebapi" the url  .
            subscriptionId: string, // i.e. in typical installations this should be an empty string ""
            subscriptionPassword: string, // the passowrd for the selected subscriptionId. In typical instllations this would be "passx"
            allowUnsecureConnection: boolean // whether the ES Web Api Server allows for unsecure connections i.e. http or not i.e. https will be used
        }
```
                 * @param {object} settings A JSON object that contains the configuration properties for the esWebApi service to work. 
                 * @param {string} settings.host The URL (with out the http or https protocol) that points to the Entersoft WEB API Server.
                 * if you specify the complete url, then the https or https part will be automatically removed. The actual protocol that 
                 * will be used depends on the allowUnsecureConnection property. For example, "localhost/eswebapi" or "api.entersoft.gr".
                 * @param {boolean} settings.allowUnsecureConnection Boolean value that indicates whether the ES WEB API Server allows for unsecure connections (true) i.e. http or not (false) i.e. https will be used
                 * @param {string=} settings.subscriptionId The ID that identifies from the list of the registered subscriptions in the {@link installation/es02wapis#config-file config.json} will be used to open session.
                 * If null, or empty or undefined, then if  the __subscriptionId__ is not specified at the run-time when calling the {@link es.Services.Web.esWebApi#methods_opensession openSession}
                 * the framework will search for a Subscription with SubscriptionID = "". If such a subscription is not found in 
                 * the {@link installation/es02wapis#config-file config.json} under the Subscriptions list, an error will be returned.
                 * @param {string=} settings.subscriptionPassword The password that has been assigned in the {@link installation/es02wapis#config-file config.json} for the given 
                 * SubscriptionId.
                 * @param {string=} settings.bridgeId The ID that identifies the bridge from the list of bridges under the given Subscription that matches the SubscrptionID that
                 * will be used in {@link es.Services.Web.esWebApi#methods_opensession openSession} and in {@link es.Services.Web.esWebApi#methods_fetchUserSites fetchUserSites}.
                 * If null, or empty or undefined, then if the __bridgeId__ is not specified at the run-time when calling the {@link es.Services.Web.esWebApi#methods_opensession openSession}
                 * the framework will search for a Bridge with BridgeID = "" under the list of bridges of the specific Subscription. If such a bridge is not found in 
                 * the {@link installation/es02wapis#config-file config.json} under the Subscription's Bridges list, an error will be returned.
                 * @param {object=} claims A JSON string/value pairs object with a set of claims that should be passed all the way from the web api client to
                 * the Entersoft Application Server with full support of Call Context. For more information
                 * @example
                 * This sample assumes that the Entersoft WEB API Server has been installed in the local Microsoft IIS as a WEB Application under
                 * the Default Web Site as shown below:
                 * ![Local ES WEB API Server](images/api/es01webapisrv.png)
```js
eskbApp.config(['$logProvider',
    '$routeProvider',
    'esWebApiProvider',
    '$exceptionHandlerProvider',
    function($logProvider, $routeProvider, esWebApiServiceProvider, $exceptionHandlerProvider) {

        // The configuration of the other providers used in this AngularJS Application is 
        // omitted for clarity purposes

        var subscriptionId = "";
        esWebApiServiceProvider.setSettings({
            host: "localhost/eswebapi",
            subscriptionId: subscriptionId,
            subscriptionPassword: "passx",
            bridgeId: "",
            allowUnsecureConnection: true
        });
    }
]);
```
                **/
                setSettings: function(settings) {
                    var __SECURE_HTTP_PREFIX__ = "https://";
                    var __UNSECURE_HTTP_PREFIX__ = "http://";

                    esConfigSettings = settings;

                    if (esConfigSettings.host) {
                        esConfigSettings.host = esConfigSettings.host.trim();

                        if (startsWith(esConfigSettings.host, __SECURE_HTTP_PREFIX__)) {
                            esConfigSettings.host = esConfigSettings.host.slice(__SECURE_HTTP_PREFIX__.length).trim();
                        } else if (startsWith(esConfigSettings.host, __UNSECURE_HTTP_PREFIX__)) {
                            esConfigSettings.host = esConfigSettings.host.slice(__UNSECURE_HTTP_PREFIX__.length).trim();
                        }

                        if (esConfigSettings.host == "") {
                            throw new Error("host for Entersoft WEB API Server is not specified");
                        }

                        if (!endsWith(esConfigSettings.host, "/")) {
                            esConfigSettings.host += "/";
                        }

                        unSecureWEBAPI = __UNSECURE_HTTP_PREFIX__ + esConfigSettings.host;;
                        secureWEBAPI = __SECURE_HTTP_PREFIX__ + esConfigSettings.host;
                        additionalHeaders = esConfigSettings.additionalHeaders;

                        if (esConfigSettings.allowUnsecureConnection) {
                            urlWEBAPI = unSecureWEBAPI;
                        } else {
                            urlWEBAPI = secureWEBAPI;
                        }

                    } else {
                        throw new Error("host for Entersoft WEB API Server is not specified");
                    }
                    return this;
                },

                $get: ['$http', '$log', '$q', '$timeout', '$rootScope', '$injector', 'ESWEBAPI_URL', 'esGlobals', 'esMessaging', 'esCache',
                    function($http, $log, $q, $timeout, $rootScope, $injector, ESWEBAPI_URL, esGlobals, esMessaging, esCache) {

                        function prepareHeaders(inHds) {

                            var hds = inHds || {
                                "Authorization": esGlobals.getWebApiToken()
                            };

                            angular.extend(hds, additionalHeaders);
                            return hds;
                        }

                        function fregisterException(inMessageObj, storeToRegister) {
                            if (!inMessageObj) {
                                return;
                            }

                            var messageObj = angular.copy(inMessageObj);

                            try {
                                $.ajax({
                                    type: "POST",
                                    url: urlWEBAPI.concat(ESWEBAPI_URL.__EVENTLOG__),
                                    contentType: "application/json",
                                    headers: prepareHeaders(),
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

                        function fGetMimeTypes() {
                            var deferred = $q.defer();
                            var cItem = esCache.getItem("ES_MIME_TYPES");
                            if (cItem) {
                                $timeout(function() {
                                    deferred.resolve(cItem);
                                });
                                return deferred.promise;
                            }

                            var surl = urlWEBAPI.concat(ESWEBAPI_URL.__FETCH_ES00DOCUMENT_MIME_TYPES__);
                            var tt = esGlobals.trackTimer("ES00DOCUMENT_MIME", "FETCH", "");
                            tt.startTime();

                            var httpConfig = {
                                method: 'GET',
                                headers: prepareHeaders(),
                                url: surl,
                            };
                            var ht = $http(httpConfig);
                            processWEBAPIPromise(ht, tt)
                                .then(function(ret) {
                                    esCache.setItem("ES_MIME_TYPES", ret.data);
                                    deferred.resolve(ret.data);
                                }, function() {
                                    deferred.reject(arguments);
                                });
                            return deferred.promise;
                        }

                        function execScrollerCommand(scrollerCommandParams) {
                            if (!scrollerCommandParams || !scrollerCommandParams.ScrollerID || !scrollerCommandParams.CommandID) {
                                throw new Error("ScrollerID and CommandID properties must be defined");
                            }
                            var surl = ESWEBAPI_URL.__SCROLLER_COMMAND__;

                            var tt = esGlobals.trackTimer("SCR", "COMMAND", scrollerCommandParams.ScrollerID.concat("/", scrollerCommandParams.CommandID));
                            tt.startTime();

                            var ht = $http({
                                method: 'post',
                                headers: prepareHeaders(),
                                url: surl,
                                data: scrollerCommandParams
                            });

                            ht.then(function() {
                                tt.endTime().send();
                            });

                            return ht;
                        }

                        function getOdsInfo(odsType, odsID) {
                            var surl = urlWEBAPI + ESWEBAPI_URL[odsType] + odsID;

                            var deferred = $q.defer();
                            var cItem = esCache.getItem(surl);
                            if (cItem) {
                                $timeout(function() {
                                    deferred.resolve(cItem);
                                });
                                return deferred.promise;
                            }

                            var ht = $http({
                                method: 'get',
                                headers: prepareHeaders(),
                                url: surl
                            });

                            processWEBAPIPromise(ht)
                                .then(function(ret) {
                                    esCache.setItem(surl, ret);
                                    deferred.resolve(ret);

                                }, function() {
                                    deferred.reject(arguments);
                                });

                            return deferred.promise;
                        }

                        function execFormCommand(formCommandParams) {
                            if (!formCommandParams || !formCommandParams.EntityID || !formCommandParams.CommandID) {
                                throw new Error("EntityID and CommandID properties must be defined");
                            }
                            var surl = urlWEBAPI + ESWEBAPI_URL.__FORM_COMMAND__;

                            var tt = esGlobals.trackTimer("FORM", "COMMAND", formCommandParams.EntityID.concat("/", formCommandParams.CommandID));
                            tt.startTime();

                            var ht = $http({
                                method: 'post',
                                headers: prepareHeaders(),
                                url: surl,
                                data: formCommandParams
                            });

                            return processWEBAPIPromise(ht, tt);
                        }

                        function execScroller(apiUrl, groupID, filterID, params) {
                            groupID = groupID ? groupID.trim() : "";
                            filterID = filterID ? filterID.trim() : "";

                            var surl = urlWEBAPI.concat(apiUrl, groupID, "/", filterID);
                            var tt = esGlobals.trackTimer("SCR", "FETCH", groupID.concat("/", filterID));
                            tt.startTime();

                            var ht = $http({
                                method: 'GET',
                                headers: prepareHeaders(),
                                url: surl,
                                params: params
                            });

                            return processWEBAPIPromise(ht, tt);
                        }

                        function processWEBAPIPromise(promise, tt) {
                            if (!promise) {
                                throw new Error("processWEBAPIToken can have parameter promise null or undefined");
                            }

                            var webapitoken = function(a, b) {
                                var hds;
                                if (a) {
                                    hds = a.headers();
                                    if (hds && hds["x-es-refresh-token"]) {
                                        esGlobals.setWebApiToken(hds["x-es-refresh-token"], a.config.url || "-");
                                    }
                                }
                            };

                            promise.then(webapitoken, webapitoken);

                            if (tt) {
                                promise.then(function() {
                                    tt.endTime().send();
                                });
                            }

                            promise.error(function(a, b) {
                                if (tt) {
                                    tt.endTime().send();
                                }

                                if (a) {
                                    $log.error(a);
                                } else {
                                    console.log("Generic Http error");
                                }

                                esMessaging.publish("ES_HTTP_CORE_ERR", a, b);
                            });
                            return promise;
                        }

                        return {
                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#getServerUrl
                             * @methodOf es.Services.Web.esWebApi
                             * @module es.Services.Web
                             * @kind function
                             * @description Function that returns the full URL to the Entersoft WEB API Server as it has been resolved 
                             * according to the configuration of the esWebApiProvider at the provider's configuration function of the AngularJS application.
                             * For more information, please  
                             * @return {string} The URL to the Entersoft WEB API Server
                             * @example
```js
// getServerUrl

var sUrl = esWebApi.getServerUrl();
alert(sUrl);

// i.e. http://localhost/eswebapi/ (if allowUnsecureConnection configuration setting of the esWebApiProvider is true)
// i.e. https://localhost/eswebapi/ (if allowUnsecureConnection configuration setting of the esWebApiProvider is false)
```
                             **/
                            getServerUrl: function() {
                                return urlWEBAPI;
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#openSession
                             * @methodOf es.Services.Web.esWebApi
                             * @description This is the function that enables for login and connect through the Entersoft WEB API Server to the Entersoft Application Server.
                             * The vast majority of the esWebApi service methods **REQUIRE** for an authorization token in order to be executed. This Authorization token is obtained 
                             * through a successfull call of the **__openSession__**  function and it is implicitly stored and managed by the esWebApi for its complete lifecycle.
                             *
                             * When credentials.StickySession evaluates to true this is a requirement to the Entersoft WEB API Server
                             * that it requires / mandates the Entersoft WEB API Server to route all the subsequent calls to the same server side session object
                             * i.e. stick to the initial session. That means that in case that more than one Entersoft Application Servers have been registered in the
                             * web api server config.json file as shown in the image below
                             * 
                             * ![Load-Balanced WEB API Server servers](images/api/es011loadbalance.png)
                             * 
                             * the server that will be selected to full fill the stickySession request will be the same that will serve all the subsequent
                             * calls for this session, i.e. all calls will be serverd by the same ESSession of the same server.
                             * On the other hand, openSession instructs Entersoft WEB API Server to fully use load balancing and fault-tolerant logic by
                             * randomly selecting one of the available server to fullfil any susequent call on a per call basis. 
                             * 
                             * @module es.Services.Web
                             * @kind function
                             * @param {object} credentials Entersoft Business Suite login credentials in the form of a JSON object with the following form:
                             * @param {string} credentials.UserID The Entersoft Application User ID
                             * @param {string} credentials.Password The Entersoft Application User password.
                             * @param {string} credentials.BranchID The Entersoft BranchID
                             * @param {string} credentials.LangID The language that will be used for all UI and message elements
                             * @param {string=} credentials.subscriptionId The id of the Subscription. It should be a valid and existing ID that uniquely identifies the
                             * Subscription object in the config.json file of the Entersoft WEB API Server. For more information, {@link installation/es02wapis#config-file ES WEB API Server Configuration File}.
                             * If null or undefined or empty, the esWebApiProvider settings configuration will be used as described in the For more information, {@link api/es.Services.Web.esWebApiProvider#methods_setsettings esWebApiProvider.setSettings}.
                             * @param {string=} credentials.subscriptionPassword The password for the given Subscription
                             * @param {string=} credentials.bridgeId The BridgeID
                             ```js
                             var credentials  = {
                                UserID: "xxxx", //Entersoft User id 
                                Password: "this is my password", // Entersoft User's password
                                BranchID: "Branch", // a valid Branch that the user has access rights and will be used as default for all operations requiring a BranchID
                                LangID: "el-GR",
                                SubscriptionID: "", // a valid subscription id that is registred in the Entersoft WEB API Server config.json file. If undefined, then
                                the esWebApiProvider settings configuration value will be used. This was specified in the config module of the AngularJS app like in the example below
                                SubscriptionPassword: "passx", // the password for the given subscription
                                BridgeID: "", // the ID of the specific bridge to be used 
                             }
                             ```
                             * Example of esWebApiProvider configuration statements:
```js
(function(angular) {
    var eskbApp = angular.module('smeApp', [
        'ngRoute',
        'ngStorage',
        'ui.bootstrap',
        'es.Services.Web',
        'smeControllers'
    ]);

    eskbApp.config(['$logProvider',
        '$routeProvider',
        'esWebApiProvider',
        '$exceptionHandlerProvider',
        function($logProvider, $routeProvider, esWebApiServiceProvider, $exceptionHandlerProvider) {

            esWebApiServiceProvider.setSettings({
                "host" : "192.168.1.190/eswebapijti",
                subscriptionId: "",
                subscriptionPassword: "passx",
                bridgeId: "",
                allowUnsecureConnection: true
            });

        }
    ]);

})(window.angular);
```

                             * @return {httpPromise} Returns a promise.
                             ** If success i.e. success(function(ret) {...}) the response ret is a JSON object that holds the current web session
                             * properties. In an Entersoft AngularJS SPA typical template, upon successful login i.e. openSession, the response object is stored
                             * in the browser's local storage and in most of the cases the developer will not need to use or retrieve it manually. It is up to
                             * Entersoft AngularJS WEB API calls that need the access token in order to access the Web API services and methods to retrieve it from the 
                             * local storage.
                             * 
                             * A success response object has the following form:
```js
var rep = {
    "data": {
        "Model": {
            "GID": "5b6f2e05-0ab6-4f29-9015-6a4352009ead",
            "UserID": "Admin",
            "Name": "Administrator",
            "Inactive": false,
            "WebApiToken": "abcd",
            "WebApiTokenExpiresAt": "2015-09-08T09:59:36.5487011+00:00",
            "PasswdKey": "*",
            "Administrator": true,
            "UserSites": [{
                "Site": {
                    "GID": "86947579-6885-4e86-914e-46378db3794f",
                    "fPersonCodeGID": "11ea77d7-f5dc-4a8d-b629-845c8ff207ac",
                    "Code": "ΑΘΗ",
                    "Description": "Κεντρικά Entersoft",
                    "Status": true,
                    "KindSite": true,
                    "KindWH": true
                },
                "GID": "198e94d8-2026-4426-8bee-b029e39fa4a2",
                "fUserGID": "5b6f2e05-0ab6-4f29-9015-6a4352009ead",
                "fCompanyCode": "ES",
                "fCompanySiteGID": "86947579-6885-4e86-914e-46378db3794f",
                "ServiceLevel": 0
            }, {
                "Site": {
                    "GID": "9a151756-7185-4f40-834f-e6153062b5e2",
                    "fPersonCodeGID": "11ea77d7-f5dc-4a8d-b629-845c8ff207ac",
                    "Code": "ΘΕΣ",
                    "Description": "Υποκατάστημα Θεσσαλονίκης ES",
                    "Status": true,
                    "KindSite": true,
                    "KindWH": true
                },
                "GID": "e1515a3c-8262-4581-8332-8663c2787964",
                "fUserGID": "5b6f2e05-0ab6-4f29-9015-6a4352009ead",
                "fCompanyCode": "ES",
                "fCompanySiteGID": "9a151756-7185-4f40-834f-e6153062b5e2",
                "ServiceLevel": 0
            }]
        },
        "SubscriptionID": "",
        "SubscriptionPassword": "passx"
    },
    "status": 200,
    "config": {
        "method": "POST",
        "transformRequest": [null],
        "transformResponse": [null],
        "url": "http://localhost/eswebapi/api/Login",
        "data": {
            "SubscriptionID": "",
            "SubscriptionPassword": "passx",
            "Model": {
                "UserID": "admin",
                "Password": "entersoft",
                "BranchID": "ΑΘΗ",
                "LangID": "el-GR"
            }
        },
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json;charset=utf-8"
        }
    },
    "statusText": "OK"
}
```
                             * In case of an error i.e. function(err) {...} the err contains the Entersoft's Application Server error message and 
                             * the http error codes in case the error is network related. As in the case of success, should you use the typical Entersoft
                             * AngularJS development template for SPAs, the framework automatically handles the error response of openSession call and 
                             * performs a clean-up in browsers local storage, cache, messaging, etc. so that no valid web session exists (as if the user never)
                             * logged-in or performed a logout operation
                             * 
                             * An Entersoft application server releated response error e.g. User does not exist has the following form:
```js
var x = {
    "data": {
        "MessageID": "login-invalid-user",
        "UserMessage": "User [ADMINDSDSDS] is not registered",
        "Messages": []
    },
    "status": 401,
    "config": {
        "method": "POST",
        "transformRequest": [null],
        "transformResponse": [null],
        "url": "http://localhost/eswebapi/api/Login",
        "data": {
            "SubscriptionID": "",
            "SubscriptionPassword": "passx",
            "Model": {
                "UserID": "admindsdsds",
                "Password": "entersoft",
                "BranchID": "ΑΘΗ",
                "LangID": "el-GR"
            }
        },
        "headers": {
            "Accept": "application/json, text/plain",
            "Content-Type": "application/json;charset=utf-8"
        }
    },
    "statusText": "Unauthorized"
};

```
                             * @example
```js
$scope.credentials = {
    UserID: 'admin',
    Password: 'entersoft',
    BranchID: 'ΑΘΗ',
    LangID: 'el-GR'
};

$scope.doLogin = function() {
    esWebApiService.openSession($scope.credentials)
        .then(function(rep) {
                $log.info(rep);
                $location.path("/pq");
            },
            function(err) {
                $log.error(err);
            });
}
```
*/
                            openSession: function(credentials, claims) {
                                var tt = esGlobals.trackTimer("AUTH", "LOGIN", "");
                                tt.startTime();

                                var dat = {
                                    SubscriptionID: credentials.subscriptionId || esConfigSettings.subscriptionId,
                                    SubscriptionPassword: credentials.subscriptionPassword || esConfigSettings.subscriptionPassword,
                                    BridgeID: credentials.bridgeId || esConfigSettings.bridgeId,
                                    Model: credentials,
                                    Claims: claims || esConfigSettings.claims
                                };

                                if (!!credentials.StickySession) {
                                    dat.SessionSpec = '*';
                                }

                                var promise = $http({
                                    method: 'post',
                                    url: urlWEBAPI + ESWEBAPI_URL.__LOGIN__,
                                    headers: prepareHeaders({}),
                                    data: dat
                                }).
                                success(function(data) {
                                    esGlobals.sessionOpened(data, credentials);
                                }).
                                error(function(data, status, headers, config) {
                                    esGlobals.sessionClosed();
                                });

                                return processWEBAPIPromise(promise, tt);
                            },

                            /**
                            * @ngdoc function
                            * @name es.Services.Web.esWebApi#eventLog
                            * @methodOf es.Services.Web.esWebApi
                            * @module es.Services.Web
                            * @kind function
                            * @description This function inserts a new log entry in the ES00EventLog Entersoft Application Server subsystem
                            * @param {object} esLog a simple JSON object with the following properties:
                            * @param {string} esLog.ID The ID (class identifier) for the event to be logged.
                            * @param {string} esLog.Description The description of the event to be logged.
                            * @param {number} esLog.TypeID TypeID The severity of the event to be logged, where:
                            * 0 = _Information_
                            * 
                            * 1 = _Warning_
                            * 
                            * 2 = _Error_
                            * 
                            * 3 = _Fatal Error_
                            * @return {promise} A promise that denotes either success or error. No data are expected to be retrieved from the promise success function
                            * @example
```html
<div>
        <h3>29. eventLog</h3>
        <span>
            <input type="text" ng-model="eID" placeholder="Event ID"/>
            <input type="text" ng-model="eDescription" placeholder="Event Description"/>
            <input type="number" ng-model="eSeverity" placeholder="Event Severity"/>

            <button ng-click="eventLog()">Log an Event</button>
            <textarea>{{eRet}}</textarea>
        </span>
    </div>
```
```js
$scope.eventLog = function() {
    esWebApi.eventLog({
            ID: $scope.eID,
            Description: $scope.eDescription,
            TypeID: $scope.eSeverity
        })
        .then(function(ret) {
                $scope.eRet = ret.data;
            },
            function(err) {
                $scope.eRet = err;
            });
}
```
                            */
                            eventLog: function(esLog) {
                                if (!esLog) {
                                    throw new Error("esLog parameter cannot be empty");
                                }

                                var tt = esGlobals.trackTimer("AUTH", "EVENTLOG", esLog.ID || "NO-ID");
                                tt.startTime();

                                var promise = $http({
                                    method: 'post',
                                    headers: prepareHeaders(),
                                    url: urlWEBAPI + ESWEBAPI_URL.__EVENTLOG__,
                                    data: JSON.stringify(esLog)
                                });
                                return processWEBAPIPromise(promise, tt);
                            },

                            /**
                            * @ngdoc function
                            * @name es.Services.Web.esWebApi#ebsService
                            * @methodOf es.Services.Web.esWebApi
                            * @module es.Services.Web
                            * @kind function
                            * @description This function executes an EBS service method defined and registered at the Entersoft Application Server.
                            * For such an example you may download the Microsoft VS2015 C# project and solution that has the implementation of such an example project.
                            * Download the zip file from [esbotestapiservice.zip](images/esbotestapiservice.zip) 
                            * Once you download and extract the zip, please resolve the .NET Assembly References to the required dlls by pointing the Reference Path to the run-time
                            * directory where the Entersoft Application Server is installed and running. 
                            * Compile the assembly and copy the built DLL in the run-time directory of the EAS.
                            * @param {object} serviceObj a simple JSON object with the following properties:
                            * @param {string} serviceObj.netAssembly The .NET assembly name that contains the service class to be executed. You should specify 
                            * only the assembly name without any extension i.e. .dll or .EXE. For example, _esbotestapiservice_
                            * @param {string} serviceObj.netNamespace The .NET namespace where the service class is defined. In case that the name space 
                            * has more than one depth i.e. esbotestapiservice.Generic then instead of . you should use / so in the previous case
                            * the namespace will be _esbotestapiservice/Generic_
                            * @param {string} serviceObj.netClass The .NET class that holds the service method i.e. __ESWebApiCustomService__
                            * @param {string} serviceObj.netMethod The .NET method of the class that will be executed i.e. Identity2
                            * @param {boolean=} serviceObj.netIsBinaryResult Indicates whether the expected result is a byt array i.e. binary. By default this parameter is false. 
                            * When calling a service that returns a byte array the set this parameter to true and the ret.data response will contain an Angular arrayBuffer.
                            * @param {object|string|number|date|*} paramObject the object that will be passed as parameter to the method call. It should be compatible and
                            * consistent to what the service method expects in the .NET space. In case that .NET method expects a POCO class or struct as the type of the 
                            * function's argument you can pass a javascript POCO class with respect to property names and types
                            * @return {httpPromise} Returns a promise that upon success the ret.data contains the result of the service
                            * @example
* __.NET Assembly and class definitions __
```cs
using Entersoft.Framework.Platform;
using Entersoft.Web.Api;
using Entersoft.Web.Api.Text;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace esbotestapiservice.Generic
{
    public class ESWebApiCustomService
    {
        public class Identity2Payload
        {
            public string TextValue { get; set; }
            public int IntValue { get; set; }
            public byte[] ByteArray { get; set; }
            public int[] IntArray { get; set; }
        }

        public struct Identity2Struct
        {
            public string TextValue { get; set; }
            public int IntValue { get; set; }
            public byte[] ByteArray { get; set; }
            public int[] IntArray { get; set; }
        }

        [EbsService]
        public static byte[] SanRebel(ESSession session, string Message)
        {
            return Enumerable.Range(64, 90).Select(i => (byte)i).ToArray();
        }

        [EbsService]
        public static Identity2Payload Identity2(ESSession session, Identity2Payload payload)
        {
            payload.TextValue += payload.TextValue;
            payload.IntValue += payload.IntValue;
            payload.ByteArray = Enumerable.Range(1, 10).Select(i => (byte)i).ToArray();
            payload.IntArray = Enumerable.Range(1, 10).ToArray();
            return payload;
        }

        [EbsService]
        public static Identity2Struct Identity2Structure(ESSession session, Identity2Struct payload)
        {
            payload.TextValue += payload.TextValue;
            payload.IntValue += payload.IntValue;
            payload.ByteArray = Enumerable.Range(1, 10).Select(i => (byte)i).ToArray();
            payload.IntArray = Enumerable.Range(1, 10).ToArray();
            return payload;
        }

        [EbsService]
        public static Identity2Payload ReturnNull(ESSession session, Identity2Payload payload)
        {
            return null;
        }

        [EbsService]
        public static int SimpleInt(ESSession session, int x)
        {
            return x * x;
        }

        [EbsService]
        public static string ReturnString(ESSession session, Identity2Payload payload)
        {
            return "{0}-{1}".SafeFormat(payload.IntValue, payload.TextValue);
        }


        [EbsService]
        public static int ReturnInt(ESSession session, Identity2Payload payload)
        {
            return payload.IntValue * 2;
        }

        [EbsService]
        public static byte[] ReturnByteArray(ESSession session, Identity2Payload payload)
        {
            return Enumerable.Range(0, payload.IntValue).Select(i => (byte)i).ToArray();

        }

        public static int InvalidService(ESSession session, Identity2Payload payload)
        {
            return payload.IntValue * 2;
        }
    }
}
```

* __Ajax calls sample __
```js
tester.register_ajax_call({
    caption: 'execute an EBS service - returns null',
    ajax_options: function () {
        return {
            //    /api/rpc/EbsService/<assembly>/<namespace>/<namespace>/<namespace>/<class>/<method>,
            url: '/api/rpc/EbsService/ESWebApiServices/Entersoft/Web/Test/EbsServiceTest/ReturnNull',
            type: 'POST',
            headers: {
                Authorization: 'Bearer ' + tester.user.Model.WebApiToken
            },

            data: JSON.stringify({
                TextValue: "hello",
                IntValue: 123
            }),
            contentType: "application/json; charset=utf-8"
        }
    },
    done: function (results) {
        assert.are_equal(null, results);
        logger.ok();
    }
});

tester.register_ajax_call({
    caption: 'execute an EBS service - returns a complex object ',
    ajax_options: function () {
        return {
            //    /api/rpc/EbsService/<assembly>/<namespace>/<namespace>/<namespace>/<class>/<method>,
            url: '/api/rpc/EbsService/ESWebApiServices/Entersoft/Web/Test/EbsServiceTest/Identity2',
            type: 'POST',
            headers: {
                Authorization: 'Bearer ' + tester.user.Model.WebApiToken
            },

            data: JSON.stringify({
                    TextValue: "hello",
                    IntValue: 123
            }),
            contentType: "application/json; charset=utf-8"
        }
    },
    done: function (results) {
        assert.existy(results);
        assert.are_equal("hellohello", results.TextValue);
        assert.are_equal("246", results.IntValue);
        logger.ok();
    }
});

tester.register_ajax_call({
    caption: 'execute an EBS service - returns a struct' ,
    ajax_options: function () {
        return {
            //    /api/rpc/EbsService/<assembly>/<namespace>/<namespace>/<namespace>/<class>/<method>,
            url: '/api/rpc/EbsService/ESWebApiServices/Entersoft/Web/Test/EbsServiceTest/Identity2Structure',
            type: 'POST',
            headers: {
                Authorization: 'Bearer ' + tester.user.Model.WebApiToken
            },

            data: JSON.stringify({
                TextValue: "hello",
                IntValue: 123
            }),
            contentType: "application/json; charset=utf-8"
        }
    },
    done: function (results) {
        assert.existy(results);
        assert.are_equal("hellohello", results.TextValue);
        assert.are_equal("246", results.IntValue);
        logger.ok();
    }
});


tester.register_ajax_call({
    caption: 'execute an EBS service - returns a string',
    ajax_options: function () {
        return {
            //    /api/rpc/EbsService/<assembly>/<namespace>/<namespace>/<namespace>/<class>/<method>,
            url: '/api/rpc/EbsService/ESWebApiServices/Entersoft/Web/Test/EbsServiceTest/ReturnString',
            type: 'POST',
            headers: {
                Authorization: 'Bearer ' + tester.user.Model.WebApiToken
            },

            data: JSON.stringify({
                TextValue: "hello",
                IntValue: 123
            }),
            contentType: "application/json; charset=utf-8"
        }
    },
    done: function (results) {
        assert.existy(results);
        assert.are_equal("123-hello", results);
        logger.ok();
    }
});

tester.register_ajax_call({
    caption: 'execute an EBS service - returns an integer',
    ajax_options: function () {
        return {
            //    /api/rpc/EbsService/<assembly>/<namespace>/<namespace>/<namespace>/<class>/<method>,
            url: '/api/rpc/EbsService/ESWebApiServices/Entersoft/Web/Test/EbsServiceTest/ReturnInt',
            type: 'POST',
            headers: {
                Authorization: 'Bearer ' + tester.user.Model.WebApiToken
            },

            data: JSON.stringify({
                TextValue: "hello",
                IntValue: 123
            }),
            contentType: "application/json; charset=utf-8"
        }
    },
    done: function (results) {
        assert.existy(results);
        assert.are_equal(246, results);
        logger.ok();
    }
});


tester.register_ajax_call({
    caption: 'execute an EBS service - returns a byte array',
    ajax_options: function () {
        return {
            url: '/api/rpc/EbsService/ESWebApiServices/Entersoft/Web/Test/EbsServiceTest/ReturnByteArray',
            type: 'POST',
            headers: {
                Authorization: 'Bearer ' + tester.user.Model.WebApiToken
            },

            data: JSON.stringify({
                TextValue: "hello",
                IntValue: 10
            }),
            contentType: "application/json; charset=utf-8"
        }
    },
    done: function (results) {
        assert.existy(results);
        assert.are_equal("AAECAwQFBgcICQ==", results);
        var byteCharacters = atob(results);
        //logger.ok(byteCharacters.to_s());
        assert.are_equal(0, byteCharacters.charCodeAt(0));
        //assert.are_equal(10, byteCharacters.length);
        logger.ok();
    }
});


tester.register_ajax_call({
    caption: 'execute an invaldid EBS service',
    ajax_options: function () {
        return {
            url: '/api/rpc/EbsService/ESWebApiServices/Entersoft/Web/Test/EbsServiceTest/InvalidService',
            type: 'POST',
            headers: {
                Authorization: 'Bearer ' + tester.user.Model.WebApiToken
            },

            data: JSON.stringify({
                TextValue: "hello",
                IntValue: 10
            }),
            contentType: "application/json; charset=utf-8"
        }
    },
    done: function (user) {
        assert.fail('invaldid EBS service')
    }, error: function (jqXHR, textStatus, errorThrown) {
        assert.are_equal(403, jqXHR.status);
        var data = jqXHR.responseJSON;
        assert.are_equal("invalid-service", data.MessageID)
        logger.ok();
        return true;
    }
});
```
* __javascript sample__
```js
$scope.serviceObj = {
    netAssembly: "esbotestapiservice",
    netNamespace: "esbotestapiservice/Generic",
    netClass: "ESWebApiCustomService",
    netIsBinaryResult: false,
    netMethod: ""
}

$scope.execEbsService = function() {
    esWebApi.ebsService($scope.serviceObj, $scope.netParam)
    .then(function(ret) {
        $scope.ebsret = ret.data;
    }, function(err) {
        $scope.ebsret = JSON.stringify(err);
    });
}
```
* __html sample__
```html
<hr/>
    <div>
        <h3>34. esService</h3>
        <span>
            <input type="text" ng-model="serviceObj.netAssembly" placeholder=".NET Assembly name"/>
            <input type="text" ng-model="serviceObj.netNamespace" placeholder=".NET Namespace"/>
            <input type="text" ng-model="serviceObj.netClass" placeholder=".NET Class"/>
            <input type="text" ng-model="serviceObj.netMethod" placeholder=".NET Method"/>
            <input type="text" ng-model="netParam" placeholder="POCO Object in string format"/>
            <label>Binary Result: 
                <input type="checkbox" ng-model="serviceObj.netIsBinaryResult">
            </label>

            <button ng-click="execEbsService()">Execute EBS Service</button>
        </span>
        <textarea>{{ebsret}}</textarea>
    </div>
```
                            **/
                            ebsService: function(serviceObj, paramObject) {
                                if (!serviceObj || !serviceObj.netAssembly || !serviceObj.netNamespace || !serviceObj.netClass || !serviceObj.netMethod) {
                                    throw new Error("serviceObj.netAssembly, serviceObj.netNamespace, serviceObj.netClass, serviceObj.netMethod properties MUST ALL have value");
                                }

                                var sPart = serviceObj.netAssembly.concat("/", serviceObj.netNamespace, "/", serviceObj.netClass, "/", serviceObj.netMethod);
                                var dData = paramObject;

                                var tt = esGlobals.trackTimer("EBS_SERVICE", serviceObj.netMethod, sPart);
                                tt.startTime();

                                var httpOptions = {
                                    method: 'post',
                                    headers: prepareHeaders(),
                                    url: urlWEBAPI.concat(ESWEBAPI_URL.__EBS_SERVICE__, sPart),
                                    data: dData
                                };

                                if (serviceObj.netIsBinaryResult) {
                                    httpOptions.headers.Accept = undefined;
                                    httpOptions.responseType = 'arraybuffer';
                                } else {
                                    httpOptions.contentType = "application/json; charset=utf-8";
                                }

                                var promise = $http(httpOptions);
                                return processWEBAPIPromise(promise, tt);
                            },

                            /**
                            * @ngdoc function
                            * @name es.Services.Web.esWebApi#fetchUserLogo
                            * @methodOf es.Services.Web.esWebApi
                            * @module es.Services.Web
                            * @kind function
                            * @description This function inserts a new log entry in the ES00EventLog Entersoft Application Server subsystem
                            * @param {string|guid=} userID Either the code of the user (ESGOUser) or the GID of the ESGOUser the logo of which we are interested in.
                            * If empty, null or undefined, the logo of the current logged-in user will be requested
                            * @return  {httpPromise} If success i.e. function(ret) { ...} the ret.data contains the string __base64__ of the image that corresponds to the requested logo.
                            * If the ESGOUser exists BUT there is no logo stored for the given user an empty string will be returned.
                            * If the ESGOUser does not exist an error 404 will be returned.
                            * @example
```html
<div>
        <h3>30. fetchUserLogo</h3>
        <span>
            <input type="text" ng-model="lUserID" placeholder="User ID or GID"/>

            <button ng-click="fetchUserLogo()">Get the PHOTO</button>
            <img ng-if="userPhoto" data-ng-src="{{'data:image/jpg;base64,' + userPhoto}}"/>
        </span>
    </div>
```
```js
$scope.fetchUserLogo = function() {
    esWebApi.fetchUserLogo($scope.lUserID)
        .then(function(ret) {
                $scope.userPhoto = ret.data;
            },
            function(err) {
                $scope.userPhoto = "";
            });
}
```
                            */
                            fetchUserLogo: function(userID) {
                                var tt = esGlobals.trackTimer("USER", "LOGO", userID || "NO-ID");
                                tt.startTime();

                                var promise = $http({
                                    method: 'get',
                                    headers: prepareHeaders(),
                                    url: urlWEBAPI.concat(ESWEBAPI_URL.__USER_LOGO__, userID || ""),
                                });
                                return processWEBAPIPromise(promise, tt);
                            },

                            /**
                            * @ngdoc function
                            * @name es.Services.Web.esWebApi#uploadUserLogo
                            * @methodOf es.Services.Web.esWebApi
                            * @module es.Services.Web
                            * @kind function
                            * @description This function uploads and stores in the EAS an image as the current logged-in User's Logo
                             * 
                             * __ATTENTION__ 
                             * 
                             * This method requires the ngFileUpload module of AngularJS. In order to use it you must make sure that the appropriate js libraries have been loaded.
                             * For example, in the main html file e.g. index.html of the AngularJS application you have to include the ng-file-upload/ng-file-upload-shim.min.js prior to loading the angular library
                             * and the ng-file-upload/ng-file-upload.min.js just after the Angular library has been loaded, as shown in the example below:
```html
<script src="bower_components/ng-file-upload/ng-file-upload-shim.min.js"></script>
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/ng-file-upload/ng-file-upload.min.js"></script>
```
                             * Also in your application Angular controller module or application module you should also require the ngFileUpload module as 
                             * shown in the code below:
```js
var smeControllers = angular.module('smeControllers', ['kendo.directives', 'underscore', 'es.Web.UI', 'ui.bootstrap', 'uiGmapgoogle-maps', 'ngFileUpload']);
```
                             * And in the AngularJS application controller function you should inject the _Upload_ service as shown below:
```js
smeControllers.controller('examplesCtrl', ['$log', '$q', '$scope', 'Upload', 'esWebApi', 'esUIHelper', 'esGlobals', 'esCache', 'esGeoLocationSrv', 'uiGmapGoogleMapApi',
function($log, $q, $scope, Upload, esWebApi, esWebUIHelper, esGlobals, esCache, esGeoLocationSrv, GoogleMapApi) {
    // your application code
    // goes here
}
```
                            * @param {file} file The file that should be of type image that will be uploaded and stored in the EAS
                            * @param {function=} okfunc a function that will be called when the upload is completed
                            * @param {function=} errfunc a function that will called should an error occurs while uploading the file
                            * @param {function=} progressfunc a function that will be called as many times as necessary to indicate the progress of the
                            * uploading of the file i.e. to inform the user about the percentage of the bytes that have been uploaded so far
                            * @return {Upload} An object of type Upload. For detailed documentation please visit {@link https://github.com/danialfarid/ng-file-upload ng-file-upload}.
                            * @example
```html
<div>
        <h3>31. uploadUserLogo</h3>
        <span>
            <input type="file" ngf-select ng-model="userLogoImage" name="file" accept="image/*" required>
            <button ng-click="uploadUserLogo()">Upload Photo</button>
        </span>
        <div ng-if="userLogoImage.progress">
            <div kendo-progress-bar k-min="0" k-max="100" ng-model="userLogoImage.progress" style="width: 100%;"></div>
        </div>
    </div>
```
```js
$scope.uploadUserLogo = function() {
var progressf = function(evt) {
    $scope.userLogoImage.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
};
var errf = function(x) {
    alert(x);
}
esWebApi.uploadUserLogo($scope.userLogoImage, undefined, errf, progressf);
}
```
                            */
                            uploadUserLogo: function(file, okfunc, errfunc, progressfunc) {

                                if (!file) {
                                    throw new Error("Invalid File");
                                }

                                var Upload = $injector.get('Upload');
                                if (!Upload) {
                                    throw new Error("You have to include the ngFileUpload");
                                }

                                var tt = esGlobals.trackTimer("USER", "UPLOAD LOGO", file);
                                tt.startTime();
                                file.upload = Upload.upload({
                                    url: urlWEBAPI.concat(ESWEBAPI_URL.__POST_USER_LOGO__),
                                    method: 'POST',
                                    headers: prepareHeaders(),
                                    file: file,
                                });


                                file.upload.then(function(response) {
                                    $timeout(function() {
                                        file.result = response.data;
                                        tt.endTime().send();
                                        if (angular.isFunction(okfunc)) {
                                            okfunc(file);
                                        }
                                    });
                                }, errfunc);

                                file.upload.progress(progressfunc);

                                return file.upload;
                            },

                            /**
                            * @ngdoc function
                            * @name es.Services.Web.esWebApi#removeCurrentUserLogo
                            * @methodOf es.Services.Web.esWebApi
                            * @module es.Services.Web
                            * @kind function
                            * @description This function delete the current logged in user logo from the Entersoft Application. 
                            * @return {httpPromise} Returns an httpPromise that once resolved, it has a status code OK if everything went OK, or BadRequest if an error occurred.
                            * @example
```html
<div>
        <h3>30. fetchUserLogo</h3>
        <span>
            <input type="text" ng-model="lUserID" placeholder="User ID or GID"/>

            <button ng-click="fetchUserLogo()">Get the PHOTO</button>
            <img  class="img-circle" width="304" height="236" ng-if="userPhoto" data-ng-src="{{'data:image/jpg;base64,' + userPhoto}}"/>
            <button ng-click="removeCurrentUserLogo()">Remove Current User Logo</button>
        </span>
    </div>
```
```js
$scope.removeCurrentUserLogo = function() {
    esWebApi.removeCurrentUserLogo();
}
```
                            */
                            removeCurrentUserLogo: function() {
                                var tt = esGlobals.trackTimer("USER", "REMOCE LOGO", "");
                                tt.startTime();
                                var promise = $http({
                                    method: 'POST',
                                    headers: prepareHeaders(),
                                    url: urlWEBAPI.concat(ESWEBAPI_URL.__REMOVE_USER_LOGO__),
                                });
                                return processWEBAPIPromise(promise, tt);
                            },

                            /**
                            * @ngdoc function
                            * @name es.Services.Web.esWebApi#fetchPersonLogo
                            * @methodOf es.Services.Web.esWebApi
                            * @module es.Services.Web
                            * @kind function
                            * @description This function delete the current logged in user logo from the Entersoft Application. 
                            * @param {string} personGID The GID of the ESGOPerson in string format, the logo of which we are looking for
                            * @return {httpPromise} Returns an httpPromise that once resolved, the ret.data contains the base64 string for the logo image
                            * of the specified person
                            * @example
```html
<hr/>
<div>
    <h3>33. fetchPersonLogo</h3>
    <span>
        <input type="text" ng-model="PersonGID" placeholder="PersonGID"/>

        <button ng-click="fetchPersonlogo()">Get Person Logo</button>
        <img  class="img-circle" width="304" height="236" ng-if="personPhoto" data-ng-src="{{'data:image/jpg;base64,' + personPhoto}}"/>
        
    </span>
</div>
```
* and the controller's part
```js
        $scope.fetchPersonlogo = function() {
            esWebApi.fetchPersonLogo($scope.PersonGID)
                .then(function(x) {
                    $scope.personPhoto = x.data;
                });
        }
```
                            */
                            fetchPersonLogo: function(personGID) {
                                if (!personGID) {
                                    throw new Error("Invalid personGID");
                                }

                                var tt = esGlobals.trackTimer("PERSON", "LOGO", personGID);
                                tt.startTime();

                                var promise = $http({
                                    method: 'get',
                                    headers: prepareHeaders(),
                                    url: urlWEBAPI.concat(ESWEBAPI_URL.__PERSON_LOGO__, personGID),
                                });
                                return processWEBAPIPromise(promise, tt);
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#logout
                             * @methodOf es.Services.Web.esWebApi
                             * @description Function that performs a web session logout. As a result of calling this function, all internal state
                             * related to the current web session, if any, is cleaned-up and no valid web session is available. The application/user must login again through {@link es.Services.Web.esWebApi#methods_opensession openSession}
                             * in order to be able to call any Entersoft WEB API autheticated method or service.
                             * @module es.Services.Web
                             * @kind function
                             * @example
```js
//logout sample
$scope.doLogout = function ()
{
    esWebApi.logout();
    alert("LOGGED OUT. You must relogin to run the samples");
};
```
                             */
                            logout: function() {
                                // 
                                var hds = prepareHeaders();

                                esGlobals.sessionClosed();
                                esCache.clear();

                                var tt = esGlobals.trackTimer("AUTH", "LOGOUT", "");
                                tt.startTime();

                                var promise = $http({
                                    method: 'post',
                                    headers: hds,
                                    url: urlWEBAPI.concat(ESWEBAPI_URL.__LOGOUT__),
                                });
                                return processWEBAPIPromise(promise, tt);
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchCompanyParam
                             * @methodOf es.Services.Web.esWebApi
                             * @description Function that returns the ES Param for a requested ParamID.
                             * @module es.Services.Web
                             * @kind function
                             * @param {string} esParam The ID of the ES CompanyParam. The ID should not contain the @ i.e. fetchCompanyParam("MyValidParamKey")
                             * @return {httpPromise} Returns a promise.
                             ** If sucess the response.data contains the Parameter definition and parameter value.
                             ** If error the err.data object contains the Entersoft Application Server error definition. Typically the user error message is 
                             * err.data.UserMessage
                             *
                             * Success promise return value i.e. response.data is of the following form:
```js
var x = {
    "ID": "MyValidParamKey",
    "Value": "hello world",
    "Description": "Password for use of Google mapping service",
    "Help": "Password for use of Google mapping service",
    "ESType": 0
};
```
                             *
                             * Error promise return value i.e. function(err) is of the following form:
```js
var f = {
    "data": {
        "MessageID": "company-parameter-not-found",
        "UserMessage": "Company parameter 'ssaS' not found",
        "Messages": []
    },
    "status": 404,
    "config": {
        "method": "GET",
        "transformRequest": [null],
        "transformResponse": [null],
        "headers": {
            "Authorization": "Bearer xyzquerty....",
            "Accept": "application/json, text/plain"
        },
        url ":",
        http: "//localhost/eswebapi/api/rpc/FetchCompanyParam/ssaS"
    },
    "statusText": "Not Found"
}; 
``` 
                            * @example
```js
// fetchCompanyParam
$scope.fetchCompanyParam = function() {
    esWebApi.fetchCompanyParam($scope.pCompanyParam)
        .then(function(x) {
                $scope.pCompanyParamValue = x.data;
            },
            function(err)
            {
                $scope.pCompanyParamValue = JSON.stringify(err);
            });
}

```
*/
                            fetchCompanyParam: function(esparam) {
                                if (!esparam) {
                                    return undefined;
                                }

                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__FETCH_COMPANY_PARAM__, esparam.replace(" ", ""));
                                var ht = $http({
                                    method: 'get',
                                    headers: prepareHeaders(),
                                    url: surl
                                });
                                return processWEBAPIPromise(ht);
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchCompanyParams
                             * @methodOf es.Services.Web.esWebApi
                             * @description Function that returns the ES Params for the requested array of parameter id's
                             * @module es.Services.Web
                             * @kind function
                             * @param {string[]|string} esParams can be
                             ** an array of strings
                             ** a comma separated string of values
                             ** a string of comma separated list of es params the values of which we want to be returned.
                             * _If esParams is null or undefined or emprty string_ the complete set of ES Company Params will be returned.
                             * @return {httpPromise} Returns a promise.
                             ** If sucess the response.data contains the Array of Parameter definition and parameter value objects.
                             ** If error the err.data object contains the Entersoft Application Server error definition. Typically the user error message is 
                             * err.data.UserMessage
                             *
                             * Success promise return value i.e. *response.data* is of the following form:
```js
var x = [{
    "ID": "PERSONINTERESTCATEGORYVALUE",
    "Value": "ΠΡΟΤΙΜΗΣΕΙΣ ΦΥΣΙΚΟΥ ΠΡΟΣΩΠΟΥ",
    "Description": "Person preference category code",
    "Help": "It is required to define ONE preference set whose contents will be available for (multi) selection in the person form.",
    "ESType": 0
}, {
    "ID": "ES_MAIL_BODYFOOTER",
    "Value": "Powered by Entersoft Business Suite",
    "Description": "Footer in e-mail text",
    "Help": "Text to appear as footer in e-mails to be sent by the application.",
    "ESType": 0
}];

```
                             *
                             * Error promise return value i.e. function(err) is of the following form:
```js
var f = {
    "data": {
        "MessageID": "company-parameter-not-found",
        "UserMessage": "Company parameter 'ssaS' not found",
        "Messages": []
    },
    "status": 404,
    "config": {
        "method": "GET",
        "transformRequest": [null],
        "transformResponse": [null],
        "headers": {
            "Authorization": "Bearer xyzquerty....",
            "Accept": "application/json, text/plain"
        },
        url ":",
        http: "//localhost/eswebapi/api/rpc/FetchCompanyParam/ssaS"
    },
    "statusText": "Not Found"
}; 
``` 
                            * @example
```js
//fetchCompanyParams
$scope.fetchCompanyParams = function() {
    if (!$scope.pCompanyParams) {
        $scope.pCompanyParams = null;
    }
    esWebApi.fetchCompanyParams($scope.pCompanyParams)
        .then(function(x) {
                $scope.pCompanyParamsValue = x.data;
            },

            function(err) {
                $scope.pCompanyParamsValue = JSON.stringify(err);
            });
};
```
*/
                            fetchCompanyParams: function(esparams) {
                                var surl;
                                if (!esparams) {
                                    // get all parameters
                                    surl = urlWEBAPI + ESWEBAPI_URL.__FETCH_COMPANY_PARAMS__;
                                } else {
                                    if (angular.isArray(esparams)) {
                                        surl = urlWEBAPI + ESWEBAPI_URL.__FETCH_COMPANY_PARAMS__ + esparams.join("/").replace(/ /g, "");
                                    } else {
                                        surl = urlWEBAPI + ESWEBAPI_URL.__FETCH_COMPANY_PARAMS__ + esparams.replace(/,/g, "/").replace(/ /g, "");
                                    }
                                }

                                var ht = $http({
                                    method: 'get',
                                    headers: prepareHeaders(),
                                    url: surl
                                });
                                return processWEBAPIPromise(ht);
                            },

                            registerException: fregisterException,

                            /**
                                                         * @ngdoc function
                                                         * @name es.Services.Web.esWebApi#fetchOdsTableInfo
                                                         * @methodOf es.Services.Web.esWebApi
                                                         * @description Function that returns the ODSTable definition from the ** Entersoft Object Description System (ODS)** repository.
                                                         * @module es.Services.Web
                                                         * @kind function
                                                         * @param {string} tableID The ODS Table ID or the ODS Table GID in string (guid) to retrieve
                                                         * @return {promise} Returns a promise.
                                                         ** If sucess the response.data contains the ODS Table Definition object in JSON representation
                                                         ** If error the err.data object contains the Entersoft Application Server error definition. Typically the user error message is 
                                                         * err.data.UserMessage
                                                         *
                                                         * Success promise return value i.e. response.data is of the following form:
                            ```js
                            var odsTableforESGOCity = {
                                "Role": 1,
                                "ModuleID": "ESGO",
                                "ID": "ESGOZCity",
                                "GID": "0a3f7d43-dfb9-4a11-8610-8e2931c09868",
                                "DBTableName": "ESGOZCity",
                                "Flags": 1028,
                                "Columns": [{
                                    "ID": "Code",
                                    "GID": "aa00f03d-640b-4c0c-8bbe-4b3adabea477",
                                    "TableID": "ESGOZCity",
                                    "TableGID": "0a3f7d43-dfb9-4a11-8610-8e2931c09868",
                                    "DBColumnName": "Code",
                                    "AllowEQUC": true,
                                    "Size": 20,
                                    "ODSType": "ESZOOMCODE",
                                    "Precision": 0,
                                    "Nullable": false,
                                    "ChoiceType": "",
                                    "Flags": 0,
                                    "HelpTxt": "",
                                    "SeqNum": 1
                                }, {
                                    "ID": "Description",
                                    "GID": "b92ab124-86c0-4c70-9093-53337f91577b",
                                    "TableID": "ESGOZCity",
                                    "TableGID": "0a3f7d43-dfb9-4a11-8610-8e2931c09868",
                                    "DBColumnName": "Description",
                                    "AllowEQUC": true,
                                    "Size": 100,
                                    "ODSType": "ESFIELD",
                                    "Precision": 0,
                                    "Nullable": true,
                                    "ChoiceType": "",
                                    "Flags": 0,
                                    "HelpTxt": "",
                                    "SeqNum": 2
                                }, {
                                    "ID": "AlternativeDescription",
                                    "GID": "bcccdd8d-afe8-4fca-a448-cacde6593adc",
                                    "TableID": "ESGOZCity",
                                    "TableGID": "0a3f7d43-dfb9-4a11-8610-8e2931c09868",
                                    "DBColumnName": "AlternativeDescription",
                                    "AllowEQUC": true,
                                    "Size": 100,
                                    "ODSType": "ESFIELD",
                                    "Precision": 0,
                                    "Nullable": true,
                                    "ChoiceType": "",
                                    "Flags": 0,
                                    "HelpTxt": "",
                                    "SeqNum": 3
                                }, {
                                    "ID": "Inactive",
                                    "GID": "df7e74e8-af69-4f9f-bd5a-8bec32361423",
                                    "TableID": "ESGOZCity",
                                    "TableGID": "0a3f7d43-dfb9-4a11-8610-8e2931c09868",
                                    "DBColumnName": "Inactive",
                                    "AllowEQUC": false,
                                    "Size": -1,
                                    "ODSType": "ESBOOL",
                                    "Precision": 0,
                                    "Nullable": false,
                                    "ChoiceType": "",
                                    "Flags": 0,
                                    "HelpTxt": "",
                                    "SeqNum": 4
                                }, {
                                    "ID": "PhonePrefix",
                                    "GID": "806db65c-9f30-4859-b5b0-7f91a32d6aca",
                                    "TableID": "ESGOZCity",
                                    "TableGID": "0a3f7d43-dfb9-4a11-8610-8e2931c09868",
                                    "DBColumnName": "PhonePrefix",
                                    "AllowEQUC": true,
                                    "Size": 15,
                                    "ODSType": "ESTELNO",
                                    "Precision": 0,
                                    "Nullable": true,
                                    "ChoiceType": "",
                                    "Flags": 0,
                                    "HelpTxt": "",
                                    "SeqNum": 5
                                }, {
                                    "ID": "fMunicipalityCode",
                                    "GID": "3ebdcae6-a3a4-4cfd-8371-8b8825a1d542",
                                    "TableID": "ESGOZCity",
                                    "TableGID": "0a3f7d43-dfb9-4a11-8610-8e2931c09868",
                                    "DBColumnName": "fMunicipalityCode",
                                    "AllowEQUC": false,
                                    "Size": 20,
                                    "ODSType": "ESFZOOMCODE",
                                    "Precision": 0,
                                    "Nullable": true,
                                    "ChoiceType": "",
                                    "Flags": 0,
                                    "HelpTxt": "",
                                    "SeqNum": 6
                                }]
                            };
                            ```
                                                         *
                                                         * Error promise return value i.e. function(err) is of the following form:
                            ```js
                            // fetchOdsTableInfo("escity"), which does not exist in the ODS
                            var f = {
                                    "data": {
                                        "MessageID": "invalid-table-id",
                                        "UserMessage": "invalid table id: escity",
                                        "Messages": []
                                    },
                                    "status": 404,
                                    "config": {
                                        "method": "GET",
                                        "transformRequest": [null],
                                        "transformResponse": [null],
                                        "headers": {
                                            "Authorization": "Bearer xyzquerty....",
                                            "Accept": "application/json, text/plain},"
                                            url ":"
                                            http: //localhost/eswebapi/api/rpc/FetchOdsTableInfo/escity"},"statusText":"Not Found"};

                            ``` 
                                                        * @example
                            ```js
                            //fetchODSTableInfo example
                            $scope.fetchOdsTableInfo = function() {
                                esWebApi.fetchOdsTableInfo($scope.odsID)
                                    .then(function(ret) {
                                        $scope.pTableInfo = ret.data;
                                    }, function(err) {
                                        $scope.pTableInfo = err;
                                    });
                            }
                            ```
                            */
                            fetchOdsTableInfo: function(tableID) {
                                tableID = tableID ? tableID.trim() : "";
                                return getOdsInfo("__FETCH_ODS_TABLE_INFO__", tableID);
                            },

                            /**
                                                         * @ngdoc function
                                                         * @name es.Services.Web.esWebApi#fetchOdsColumnInfo
                                                         * @methodOf es.Services.Web.esWebApi
                                                         * @description Function that returns the ODSTable definition from the ** Entersoft Object Description System (ODS)** repository.
                                                         * @module es.Services.Web
                                                         * @kind function
                                                         * @param {string} tableID The ODS Table ID i.e. "ESFFitem". If columnID parameter is undefined, null or empty string **then**
                                                         * additional forms of tableid-column id definition are available:
                                                         ** Fully qualified column name i.e. "ESFIItem.Description"
                                                         ** ODS Column's GID in string i.e. "74c82778-6b49-4928-9f06-81b4384bf677"
                                                         * @param {string=} columnID The ODS Column/Field ID  to retrieve i.e. "Description". If columnID is undefined or null or empty string
                                                         * then tableID should be one of the forms described above.
                                                         * @return {promise} Returns a promise.
                                                         ** If sucess the response.data contains the ODS Column/Field Definition object in JSON representation
                                                         ** If error the err.data object contains the Entersoft Application Server error definition. Typically the user error message is 
                                                         * err.data.UserMessage
                                                         *
                                                         * Success promise return value i.e. response.data is of the following form:
                            ```js
                            var odsColumnforESFIItem_Code = {
                                "ID": "Code",
                                "GID": "74c82778-6b49-4928-9f06-81b4384bf677",
                                "TableID": "ESFIItem",
                                "TableGID": "8445cfd5-9dda-47cc-8f3a-01b5586347d2",
                                "DBColumnName": "Code",
                                "AllowEQUC": true,
                                "Size": 50,
                                "ODSType": "ESCODE",
                                "Precision": 0,
                                "Nullable": false,
                                "ChoiceType": "",
                                "Flags": 2112,
                                "HelpTxt": "",
                                "SeqNum": 2
                            };
                            ```
                                                         *
                                                         * Error promise return value i.e. function(err) is of the following form:
                            ```js
                            // fetchOdsColumnInfo("esfiitem", "codeg"), which does not exist in the ODS
                            var f = {
                                    "data": {
                                        "MessageID": "invalid-column-id",
                                        "UserMessage": "invalid column id: esfiitem.codeg",
                                        "Messages": []
                                    },
                                    "status": 404,
                                    "config": {
                                        "method": "GET",
                                        "transformRequest": [null],
                                        "transformResponse": [null],
                                        "headers": {
                                            "Authorization": "Bearer xyzquerty....",
                                            "Accept": "application/json, text/plain},"
                                            url ":"
                                            http: //localhost/eswebapi/api/rpc/FetchOdsColumnInfo/esfiitem/codeg"},"statusText":"Not Found"};

                            ``` 
                                                        * @example
                            ```js
                             //fetchODSColumnInfo example
                            $scope.fetchOdsColumnInfo = function() {
                                esWebApi.fetchOdsColumnInfo($scope.odsID, $scope.odsColumnID)
                                    .then(function(ret) {
                                        $scope.pColumnInfo = ret.data;
                                    }, function(err) {
                                        $scope.pColumnInfo = err;
                                    });
                            }
                            ```
                            */
                            fetchOdsColumnInfo: function(tableID, columnID) {
                                tableID = tableID ? tableID.trim() : "";
                                columnID = columnID ? columnID.trim() : "";
                                var odsItem = "";
                                columnID ? tableID + "/" + columnID : tableID;
                                if (columnID) {
                                    odsItem = tableID + "/" + columnID;
                                } else {
                                    var ids = tableID.split(".");
                                    if (ids.length == 2) {
                                        odsItem = ids[0] + "/" + ids[1];
                                    } else {
                                        odsItem = tableID;
                                    }
                                }
                                return getOdsInfo("__FETCH_ODS_COLUMN_INFO__", odsItem);
                            },

                            /**
                                                         * @ngdoc function
                                                         * @name es.Services.Web.esWebApi#fetchOdsRelationInfo
                                                         * @methodOf es.Services.Web.esWebApi
                                                         * @description Function that returns the ODS Releation definition from the ** Entersoft Object Description System (ODS)** repository.
                                                         * @module es.Services.Web
                                                         * @kind function
                                                         * @param {string} relationID The ODS Relation ID or the ODS Relation GID in string (guid) to retrieve
                                                         * @return {promise} Returns a promise.
                                                         ** If sucess the response.data contains the ODS Relation Definition object in JSON representation
                                                         ** If error the err.data object contains the Entersoft Application Server error definition. Typically the user error message is 
                                                         * err.data.UserMessage
                                                         *
                                                         * Success promise return value i.e. response.data is of the following form:
                            ```js
                            var odsRelation = {
                                "ID": "FK_ESFIPricelistItem_ESFIPricelist",
                                "GID": "87fbc76d-7ac7-4102-a7cd-00374a6a4338",
                                "NameInDB": "FK_ESFIPricelistItem_ESFIPricelist",
                                "MTableID": "ESFIPricelist",
                                "DTableID": "ESFIPricelistItem",
                                "MTableGID": "1f361b65-09e3-40c7-b675-ba70d24ec33d",
                                "MValue1GID": "2c8ea6ae-5438-46a3-bcb0-2d0208a84ad0",
                                "DTableGID": "1aae96fc-f1bc-448a-9940-1d122a935e37",
                                "DValue1GID": "3a9f7b4b-c4fd-4900-8337-cddb9e4cf1f5",
                                "IsVirtual": false,
                                "IsDeleted": false,
                                "MasterColumns": [{
                                    "ID": "GID",
                                    "GID": "2c8ea6ae-5438-46a3-bcb0-2d0208a84ad0",
                                    "TableID": "ESFIPricelist",
                                    "TableGID": "1f361b65-09e3-40c7-b675-ba70d24ec33d",
                                    "DBColumnName": "GID",
                                    "AllowEQUC": false,
                                    "Size": -1,
                                    "ODSType": "ESGID",
                                    "Precision": 0,
                                    "Nullable": false,
                                    "ChoiceType": "",
                                    "Flags": 0,
                                    "HelpTxt": "",
                                    "SeqNum": 1
                                }],
                                "DetailColumns": [{
                                    "ID": "fPricelistGID",
                                    "GID": "3a9f7b4b-c4fd-4900-8337-cddb9e4cf1f5",
                                    "TableID": "ESFIPricelistItem",
                                    "TableGID": "1aae96fc-f1bc-448a-9940-1d122a935e37",
                                    "DBColumnName": "fPricelistGID",
                                    "AllowEQUC": false,
                                    "Size": -1,
                                    "ODSType": "ESFGID",
                                    "Precision": 0,
                                    "Nullable": true,
                                    "ChoiceType": "",
                                    "Flags": 2048,
                                    "HelpTxt": "",
                                    "SeqNum": 2
                                }]
                            };

                            ```
                                                         *
                                                         * Error promise return value i.e. function(err) is of the following form:
                            ```js
                            // fetchRelationInfo("abcd"), which does not exist in the ODS
                            var f = {
                                    "data": {
                                        "MessageID": "invalid-relation-id",
                                        "UserMessage": "invalid relation id: abcd",
                                        "Messages": []
                                    },
                                    "status": 404,
                                    "config": {
                                        "method": "GET",
                                        "transformRequest": [null],
                                        "transformResponse": [null],
                                        "headers": {
                                            "Authorization": "Bearer xyzquerty....",
                                            "Accept": "application/json, text/plain},"
                                            url ":"
                                            http: //localhost/eswebapi/api/rpc/FetchOdsRelationInfo/abcd"},"statusText":"Not Found"};


                            ``` 
                                                        * @example
                            ```js
                            //fetchOdsRelationInfo example
                            $scope.fetchOdsRelationInfo = function() {
                                esWebApi.fetchOdsRelationInfo($scope.odsID)
                                    .then(function(ret) {
                                        $scope.pRelationInfo = ret.data;
                                    }, function(err) {
                                        $scope.pRelationInfo = err;
                                    });
                            }
                            ```
                            */
                            fetchOdsRelationInfo: function(relationID) {
                                relationID = relationID ? relationID.trim() : "";
                                return getOdsInfo("__FETCH_ODS_RELATION_INFO__", relationID);
                            },

                            /**
                                                         * @ngdoc function
                                                         * @name es.Services.Web.esWebApi#fetchOdsMasterRelationsInfo
                                                         * @methodOf es.Services.Web.esWebApi
                                                         * @description Function that returns the Master Relations ODS Relation definitions that exist in the ODS Repository for a given Master TableID on a given foreign ColumnID of the Master TableID
                                                         * from the ** Entersoft Object Description System (ODS)** repository.
                                                         * @module es.Services.Web
                                                         * @kind function
                                                         * @param {string} tableID The ODS Table ID i.e. "ESFFitem". 
                                                         * @param {string} columnID The ODS Column/Field ID  to retrieve i.e. "fDim1Code".
                                                         * @return {promise} Returns a promise..
                                                         ** If sucess the response.data contains an Array of Master relations of the ODS Relation Definition objects in JSON representation, that exist
                                                         * for the given *tableID* and foreign *columnID*
                                                         ** If error the err.data object contains the Entersoft Application Server error definition. Typically the user error message is 
                                                         * err.data.UserMessage
                                                         *
                                                         * Success promise return value i.e. response.data is of the following form:
                            ```js
                            var odsMasterRelations = [{
                                "ID": "FK_ESFIPricelistItem_ESFIPricelist",
                                "GID": "87fbc76d-7ac7-4102-a7cd-00374a6a4338",
                                "NameInDB": "FK_ESFIPricelistItem_ESFIPricelist",
                                "MTableID": "ESFIPricelist",
                                "DTableID": "ESFIPricelistItem",
                                "MTableGID": "1f361b65-09e3-40c7-b675-ba70d24ec33d",
                                "MValue1GID": "2c8ea6ae-5438-46a3-bcb0-2d0208a84ad0",
                                "DTableGID": "1aae96fc-f1bc-448a-9940-1d122a935e37",
                                "DValue1GID": "3a9f7b4b-c4fd-4900-8337-cddb9e4cf1f5",
                                "IsVirtual": false,
                                "IsDeleted": false,
                                "MasterColumns": [{
                                    "ID": "GID",
                                    "GID": "2c8ea6ae-5438-46a3-bcb0-2d0208a84ad0",
                                    "TableID": "ESFIPricelist",
                                    "TableGID": "1f361b65-09e3-40c7-b675-ba70d24ec33d",
                                    "DBColumnName": "GID",
                                    "AllowEQUC": false,
                                    "Size": -1,
                                    "ODSType": "ESGID",
                                    "Precision": 0,
                                    "Nullable": false,
                                    "ChoiceType": "",
                                    "Flags": 0,
                                    "HelpTxt": "",
                                    "SeqNum": 1
                                }],
                                "DetailColumns": [{
                                    "ID": "fPricelistGID",
                                    "GID": "3a9f7b4b-c4fd-4900-8337-cddb9e4cf1f5",
                                    "TableID": "ESFIPricelistItem",
                                    "TableGID": "1aae96fc-f1bc-448a-9940-1d122a935e37",
                                    "DBColumnName": "fPricelistGID",
                                    "AllowEQUC": false,
                                    "Size": -1,
                                    "ODSType": "ESFGID",
                                    "Precision": 0,
                                    "Nullable": true,
                                    "ChoiceType": "",
                                    "Flags": 2048,
                                    "HelpTxt": "",
                                    "SeqNum": 2
                                }]
                            }];
                            ```
                                                         *
                                                         * Error promise return value i.e. function(err) is of the following form:
                            ```js
                            // fetchOdsMasterRelationsInfo("esfiitem", "fnon"), which does not exist in the ODS
                            var f = {
                                "data": {
                                    "MessageID": "invalid-column-id",
                                    "UserMessage": "invalid column id: esfiitem.fnon",
                                    "Messages": []
                                },
                                "status": 404,
                                "config": {
                                    "method": "GET",
                                    "transformRequest": [null],
                                    "transformResponse": [null],
                                    "headers": {
                                        "Authorization": "Bearer xyzquerty....",
                                        "Accept": "application/json, text/plain"
                                    },
                                    "url": "http://localhost/eswebapi/api/rpc/FetchOdsMasterRelationsInfo/esfiitem/fnon"
                                },
                                "statusText": "Not Found"
                            };
                            ```
                                                        * @example
                            ```js
                            //fetchOdsMasterRelationsInfo example
                            $scope.fetchOdsMasterRelationsInfo = function() {
                                esWebApi.fetchOdsMasterRelationsInfo($scope.odsID, $scope.odsColumnID)
                                    .then(function(ret) {
                                        $scope.pRelationInfo = ret.data;
                                    }, function(err) {
                                        $scope.pRelationInfo = err;
                                    });
                            }
                            ```
                            */
                            fetchOdsMasterRelationsInfo: function(tableID, columnID) {
                                tableID = tableID ? tableID.trim() : "";
                                columnID = columnID ? columnID.trim() : "";
                                return getOdsInfo("__FETCH_ODS_MASTER_RELATIONS_INFO__", tableID + "/" + columnID);
                            },

                            /**
                                                         * @ngdoc function
                                                         * @name es.Services.Web.esWebApi#fetchOdsDetailRelationsInfo
                                                         * @methodOf es.Services.Web.esWebApi
                                                         * @description Function that returns the Detail ODS Relation definitions that exist in the ODS Repository for a given Master TableID on a given ColumnID of the Master TableID
                                                         * from the ** Entersoft Object Description System (ODS)** repository.
                                                         * @module es.Services.Web
                                                         * @kind function
                                                         * @param {string} tableID The ODS Table ID i.e. "ESFFitem". 
                                                         * @param {string} columnID The ODS Column/Field ID  to retrieve i.e. "GID".
                                                         * @return {promise} Returns a promise..
                                                         ** If sucess the response.data contains an Array of the Detail ODS Relation Definition objects in JSON representation, that exist
                                                         * for the given *tableID* and foreign *columnID*
                                                         ** If error the err.data object contains the Entersoft Application Server error definition. Typically the user error message is 
                                                         * err.data.UserMessage
                                                         *
                                                         * Success promise return value i.e. response.data is of the following form:
                            ```js
                            var odsDetailRelations = [{
                                "ID": "FK_ESFIItemPriceHistory_ESFIPricelist",
                                "GID": "6ec8be7a-bfac-42c2-95c2-c15b68cca9d2",
                                "NameInDB": "FK_ESFIItemPriceHistory_ESFIPricelist",
                                "MTableID": "ESFIPricelist",
                                "DTableID": "ESFIItemPriceHistory",
                                "MTableGID": "1f361b65-09e3-40c7-b675-ba70d24ec33d",
                                "MValue1GID": "2c8ea6ae-5438-46a3-bcb0-2d0208a84ad0",
                                "DTableGID": "08b1d27b-5425-4dbf-8dc5-8f340f289d84",
                                "DValue1GID": "71f4b69d-0db5-4fd3-9e62-772f50673b69",
                                "IsVirtual": false,
                                "IsDeleted": false,
                                "MasterColumns": [{
                                    "ID": "GID",
                                    "GID": "2c8ea6ae-5438-46a3-bcb0-2d0208a84ad0",
                                    "TableID": "ESFIPricelist",
                                    "TableGID": "1f361b65-09e3-40c7-b675-ba70d24ec33d",
                                    "DBColumnName": "GID",
                                    "AllowEQUC": false,
                                    "Size": -1,
                                    "ODSType": "ESGID",
                                    "Precision": 0,
                                    "Nullable": false,
                                    "ChoiceType": "",
                                    "Flags": 0,
                                    "HelpTxt": "",
                                    "SeqNum": 1
                                }],
                                "DetailColumns": [{
                                    "ID": "fPricelistGID",
                                    "GID": "71f4b69d-0db5-4fd3-9e62-772f50673b69",
                                    "TableID": "ESFIItemPriceHistory",
                                    "TableGID": "08b1d27b-5425-4dbf-8dc5-8f340f289d84",
                                    "DBColumnName": "fPricelistGID",
                                    "AllowEQUC": false,
                                    "Size": -1,
                                    "ODSType": "ESFGID",
                                    "Precision": 0,
                                    "Nullable": true,
                                    "ChoiceType": "",
                                    "Flags": 0,
                                    "HelpTxt": "",
                                    "SeqNum": 7
                                }]
                            },

                            // ...
                            // ...

                            }];

                            ```
                                                         *
                                                         * Error promise return value i.e. function(err) is of the following form:
                            ```js
                            // fetchOdsDetailRelationsInfo("ESFIPricelist", "gidc"), which does not exist in the ODS
                            var f = {
                                "data": {
                                    "MessageID": "invalid-column-id",
                                    "UserMessage": "invalid column id: ESFIPricelist.gidc",
                                    "Messages": []
                                },
                                "status": 404,
                                "config": {
                                    "method": "GET",
                                    "transformRequest": [null],
                                    "transformResponse": [null],
                                    "headers": {
                                        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6ImFkbWluIiwieC1lcy11c2VyLXBhc3N3b3JkIjoiZW50ZXJzb2Z0IiwieC1lcy11c2VyLWJyYW5jaC1pZCI6Is6RzpjOlyIsIngtZXMtdXNlci1sYW5nLWlkIjoiZWwtR1IiLCJ4LWVzbG9naW5pbmZvLVN1YnNjcmlwdGlvblBhc3N3b3JkIjoicGFzc3giLCJpc3MiOiJFbnRlcnNvZnQiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0IiwiZXhwIjoxNDQxODkyMDcwLCJuYmYiOjE0NDE4ODYwNzB9.tCuasMPd4kXT02kQo0Z9M8MuwnoGCTkexDs58OeRwcI",
                                        "Accept": "application/json, text/plain"
                                    },
                                    "url": "http://localhost/eswebapi/api/rpc/FetchOdsDetailRelationsInfo/ESFIPricelist/gidc"
                                },
                                "statusText": "Not Found"
                            };
                            ```
                                                        * @example
                            ```js
                            //fetchOdsDetailRelationsInfo example
                            $scope.fetchOdsDetailRelationsInfo = function() {
                                esWebApi.fetchOdsDetailRelationsInfo($scope.odsID, $scope.odsColumnID)
                                    .then(function(ret) {
                                        $scope.pRelationInfo = ret.data;
                                    }, function(err) {
                                        $scope.pRelationInfo = err;
                                    });
                            }
                            ```
                            */
                            fetchOdsDetailRelationsInfo: function(tableID, columnID) {
                                tableID = tableID ? tableID.trim() : "";
                                columnID = columnID ? columnID.trim() : "";
                                return getOdsInfo("__FETCH_ODS_DETAIL_RELATIONS_INFO__", tableID + "/" + columnID);
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchServerCapabilities
                             * @methodOf es.Services.Web.esWebApi
                             * @description Function that returns the WEB API Server capabilities in terms of http(s). This service does not require
                             * authorization prior to call
                             * @module es.Services.Web
                             * @kind function
                             * @return {httpPromise} If success i.e. function(ret) { ... } **_ret_** is a JSON object of the current WEB API Server capabilities.
                             * The return object has the following structure:
```js
var srvCapabilities = {
    AllowInsecureHttp: boolean, 
    // If false, WEB API Server does not allow unsecure conncetions. ONLY httpS is supported
    // If true, WEB API Server allows for unsecure connection. This scenario is most likely expected in VPN connections for LOB applications
    WebApiVersion: {
        Major: int, // i.e. 1
        Minor: int, // i.e. 7
        Patch: int  // i.e. 7
    }
};
```
                             * @example
```js
$scope.fetchServerCapabilities = function()
{
    esWebApi.fetchServerCapabilities()
        .then(function(ret) {
            $scope.pSrvCapabilities = ret;
        }, function(err) {
            $scope.pSrvCapabilities = err;
        });
}
```
*/
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

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchScroller
                             * @methodOf es.Services.Web.esWebApi
                             * @description Function that returns the results of the execution of an Entersoft Scroller (simple or hierarchical) in JSON format
                             * @module es.Services.Web
                             * @kind function
                             * @param {string} groupID Entersoft Scroller GroupID
                             * @param {string} filterID Entersoft Scroller FilterID
                             * @param {object} params pqParams Parameters that will be used for the execution of the Scroller at the Entersoft Application Server
                             * The typical structure of the params object is:
```js
var pqParams = {
    Name: "a*",
    RegDate: "ESDateRange(Day)"
};
```
                             * params is a typical JSON object of key: value properties, where key is the parameter name as defined in the Scroller 
                             * (through Entersoft Scroller Designer) and value is an Entersoft Application server acceptable value for the given parameter, depending on the
                             * parameter type and properties as defined in the Scroller (through Entersoft Scroller Designer)
                             *
                             ** If params is null or undefined or empty object i.e. {} THEN the Scroller will be executed by the Entersoft Application Server
                             * with all parameters assigned the value null.
                             *
                             ** If params is not null and some parameters are specified THEN all the parameters that are not explicitly assigned a value i.e. are missing or are null or undefined in the params object 
                             * at the execution time will be treated by the Entersoft Application Server as having null value.
                             * @return {httpPromise} Returns a promise. 
                             ** If success i.e. function(ret) { ...} ret.data contains the JSON object of the results of tables and records in the following form:
```js
var scrollerRet = {
    DatasetTable1: [
        {
         Field_1: value1,
         ...
         Field_N: valueN
        } // Row 1,
        ...
        {
        Field_1: value1,
         ...
         Field_N: valueN
        } // Row N
    ],
    ...
    DatasetTableY: [
        {
         Field_1: value1,
         ...
         Field_N: valueN
        } // Row 1,
        ...
        {
        Field_1: value1,
         ...
         Field_Z: valueZ
        } // Row K
    ]
};
```
                            ** If error i.e. function(err) { ... } err contains the server error oject in JSON Format.
                            *@example
```js
// fetchScroller sample
$scope.fetchScroller = function() {
     var scroller_params = {
        Name: "a*"
    };
    esWebApi.fetchScroller($scope.pGroup, $scope.pFilter, scroller_params)
        .then(function(ret) {
                $scope.pScrollerResults = ret.data;
                $log.info(ret);
            },
            function(err) {
                $scope.pScrollerResults = ret;
                $log.error(err);
            });
}
```
                            * The result for fetchScroller("ESGOPerson", "PersonList", scroller_Params) has the following format:
```js
var scrollerResults = {
    "ESGOPerson": [{
        "GID": "d4b166f4-417d-46b8-8459-1d11d81f4aff",
        "Code": "0000026",
        "Name": "AGROSKY A.E.",
        "Description1": "Εμπόριο Αγροτικών Προϊόντων",
        "TaxRegistrationNumber": "094123469",
        "Code5": "1",
        "Address1": "ΑΝΔΡΕOY 212",
        "fPostalCode": "30300",
        "fCityCode": "ΝΑΥΠΑΚΤΟΣ",
        "Area": "ΑΙΤΩΛΟΑΚΑΡΝΑΝΙΑΣ",
        "Code7": "010",
        "Description5": "ΔΥΤΙΚΗ ΣΤΕΡΕΑ / ΛΕΥΚΑΔΑ",
        "Telephone1": "2310-804858",
        "Code8": "ΣΥΝΕΡΓΑΤΗΣ",
        "Description6": "ΣΥΝΕΡΓΑΤΗΣ",
        "Code9": "ΥΠΗΡΕΣΙΕΣ",
        "Description7": "ΥΠΗΡΕΣΙΕΣ",
        "EMailAddress": "info@agrosky.gr"
    }, 
    // ...
    {
        "GID": "ee80474d-0f07-48df-b8e0-b47d58d9e9ba",
        "Code": "0000003",
        "Name": "AMY Α.Ε.",
        "Description1": "Εμπόριο - Διανομή Ποτών & Αναψυκτικών",
        "TaxRegistrationNumber": "094123478",
        "Code5": "2",
        "Address1": "ΧΟΛΑΡΓΟΥ 34",
        "fPostalCode": "10437",
        "fCityCode": "ΑΘΗΝΑ",
        "Area": "ΟΜΟΝΟΙΑ",
        "Code7": "001",
        "Description5": "ΑΘΗΝΑ - ΠΡΟΑΣΤΙΑ",
        "Telephone1": "23210-24680",
        "Code8": "ΠΕΛΑΤΕΣ",
        "Description6": "ΠΕΛΑΤΕΣ",
        "Code9": "BIOMHXANIA",
        "Description7": "BIOMHXANIA",
        "EMailAddress": "info@elma.gr"
    }]
};
```
                            **/
                            fetchScroller: function(groupID, filterID, params) {
                                return execScroller(ESWEBAPI_URL.__SCROLLER__, groupID, filterID, params);
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchSimpleScrollerRootTable
                             * @methodOf es.Services.Web.esWebApi
                             * @description Function that returns the data of the defined MasterTable for an Entersoft Scroller (simple or hierarchical) in JSON format.
                             * It is very similar to fetchScroller function with the **MAIN** difference that it only returns the data for the **MASTER Table** as
                             * defined by the creator at the Scroller Definition
                             * @module es.Services.Web
                             * @kind function
                             * @param {string} groupID Entersoft Scroller GroupID
                             * @param {string} filterID Entersoft Scroller FilterID
                             * @param {object} params pqParams Parameters that will be used for the execution of the Scroller at the Entersoft Application Server
                             * The typical structure of the params object is:
```js
var pqParams = {
    Name: "a*",
    RegDate: "ESDateRange(Day)"
};
```
                             * params is a typical JSON object of key: value properties, where key is the parameter name as defined in the Scroller 
                             * (through Entersoft Scroller Designer) and value is an Entersoft Application server acceptable value for the given parameter, depending on the
                             * parameter type and properties as defined in the Scroller (through Entersoft Scroller Designer)
                             *
                             ** If params is null or undefined or empty object i.e. {} THEN the Scroller will be executed by the Entersoft Application Server
                             * with all parameters assigned the value null.
                             *
                             ** If params is not null and some parameters are specified THEN all the parameters that are not explicitly assigned a value i.e. are missing or are null or undefined in the params object 
                             * at the execution time will be treated by the Entersoft Application Server as having null value.
                             * @return {httpPromise} Returns a promise. 
                             ** If success i.e. function(ret) { ...} ret.data contains the **array** of the JSON objects that represent the records of the Master Table. Result has the following form:
```js
var simpleRootTablescrollerRet = [
        {
         Field_1: value1,
         ...
         Field_N: valueN
        } // Row 1,
        ...
        {
        Field_1: value1,
         ...
         Field_N: valueN
        } // Row N
    ];
```
                            ** If error i.e. function(err) { ... } err contains the server error oject in JSON Format.
                            *@example
```js
// fetchSimpleScrollerRootTable sample
$scope.fetchSimpleScrollerRootTable = function() {
     var scroller_params = {
        Name: "a*"
    };
    esWebApi.fetchSimpleScrollerRootTable($scope.pGroup, $scope.pFilter, scroller_params)
        .then(function(ret) {
                $scope.pScrollerResults = ret.data;
                $log.info(ret);
            },
            function(err) {
                $scope.pScrollerResults = ret;
                $log.error(err);
            });
}
```
                            * The result for fetchSimpleScrollerRootTable("ESGOPerson", "PersonList", scroller_Params) has the following format:
```js
var simpleRootTable_scrollerResults = [{
        "GID": "d4b166f4-417d-46b8-8459-1d11d81f4aff",
        "Code": "0000026",
        "Name": "AGROSKY A.E.",
        "Description1": "Εμπόριο Αγροτικών Προϊόντων",
        "TaxRegistrationNumber": "094123469",
        "Code5": "1",
        "Address1": "ΑΝΔΡΕOY 212",
        "fPostalCode": "30300",
        "fCityCode": "ΝΑΥΠΑΚΤΟΣ",
        "Area": "ΑΙΤΩΛΟΑΚΑΡΝΑΝΙΑΣ",
        "Code7": "010",
        "Description5": "ΔΥΤΙΚΗ ΣΤΕΡΕΑ / ΛΕΥΚΑΔΑ",
        "Telephone1": "2310-804858",
        "Code8": "ΣΥΝΕΡΓΑΤΗΣ",
        "Description6": "ΣΥΝΕΡΓΑΤΗΣ",
        "Code9": "ΥΠΗΡΕΣΙΕΣ",
        "Description7": "ΥΠΗΡΕΣΙΕΣ",
        "EMailAddress": "info@agrosky.gr"
    }, 
    // ...
    {
        "GID": "ee80474d-0f07-48df-b8e0-b47d58d9e9ba",
        "Code": "0000003",
        "Name": "AMY Α.Ε.",
        "Description1": "Εμπόριο - Διανομή Ποτών & Αναψυκτικών",
        "TaxRegistrationNumber": "094123478",
        "Code5": "2",
        "Address1": "ΧΟΛΑΡΓΟΥ 34",
        "fPostalCode": "10437",
        "fCityCode": "ΑΘΗΝΑ",
        "Area": "ΟΜΟΝΟΙΑ",
        "Code7": "001",
        "Description5": "ΑΘΗΝΑ - ΠΡΟΑΣΤΙΑ",
        "Telephone1": "23210-24680",
        "Code8": "ΠΕΛΑΤΕΣ",
        "Description6": "ΠΕΛΑΤΕΣ",
        "Code9": "BIOMHXANIA",
        "Description7": "BIOMHXANIA",
        "EMailAddress": "info@elma.gr"
    }];
```
                            **/
                            fetchSimpleScrollerRootTable: function(groupID, filterID, params) {
                                return execScroller(ESWEBAPI_URL.__SCROLLERROOTTABLE__, groupID, filterID, params);
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchUserSites
                             * @methodOf es.Services.Web.esWebApi
                             * @description Function that returns ESGOSites of the current ESCompany that the given user has access to
                             * authorization prior to call
                             * @module es.Services.Web
                             * @kind function
                             * @param {string} ebsuser The Entersoft Business Suite UserID for whom we want to fetch the ESGOSites of the current ESCompany
                             * the user has access to.
                             * @param {object=} credentials A JSON object with subscriptionId, subscriptionPassword and bridgeId properties defined. If empty
                             * the default configuration settings will be used
                             * @param {string} credentials.subscriptionId The id of the Subscription
                             * @param {string} credentials.subscriptionPassword The password for the given Subscription
                             * @param {string} credentials.bridgeId The BridgeID
                             * @return {httpPromise} If success i.e. function(ret) { ... } ret.data is an Array of JSON objects representing the ESGOSites user has access to whitin the context of the current ESCompany.
                             * The return object has the following structure:
```js
var UserSite = {
    Key: string,  // The ESGOSite Code i.e. "ΑΘΗ",
    Value: string // The ESGOSite Description i.e. "Κεντρικά Entersoft" 
};
```
                             * @example
```js
$scope.fetchUserSites = function()
{
    esWebApi.fetchUserSites($scope.pUser)
        .then(function(ret) {
            $scope.pUserSites = ret.data;
        }, function(err) {
            $scope.pUserSites = err;
        });
}

// results based on EBS Demo fetchUserSites("esmaster") =>
// ret.data ===> [{"Key":"ΑΘΗ","Value":"Κεντρικά Entersoft"},{"Key":"ΘΕΣ","Value":"Υποκατάστημα Θεσσαλονίκης ES"}]
```
*/
                            fetchUserSites: function(ebsuser, credentials) {
                                credentials = credentials || {};

                                var ht = $http({
                                    method: 'post',
                                    url: urlWEBAPI + ESWEBAPI_URL.__USERSITES__,
                                    data: {
                                        SubscriptionID: credentials.subscriptionId || esConfigSettings.subscriptionId,
                                        SubscriptionPassword: credentials.subscriptionPassword || esConfigSettings.subscriptionPassword,
                                        BridgeID: credentials.bridgeId || esConfigSettings.bridgeId,
                                        Model: ebsuser
                                    }
                                });
                                return processWEBAPIPromise(ht);
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchSessionInfo
                             * @methodOf es.Services.Web.esWebApi
                             * @description Function that returns Entersoft Application Server session information
                             * @module es.Services.Web
                             * @kind function
                             * @return {httpPromise} Returns a promise.
                             ** If sucess the **response.data.ESProperty** contains the array of the session properties objects.
                             * Each session property object is fo the following form:
                            ```js
                            var sessprop = {
                                ID: string, // property ID i.e. "101"
                                Description: string, // property Description in the session's language translation i.e. "Έκδοση Εγκατάστασης"
                                ValueS: string, // property Value in string format i.e. "4.0.36 - 2"
                                Type: int // property EBS Type i.e. 0
                            };
                            ```
                                                         ** If error the err.data object contains the Entersoft Application Server error definition. Typically the user error message is 
                                                         * err.data.UserMessage
                                                         *
                                                         * Success promise return value i.e. response.data is of the following form:
                            ```js
                            var x = {
                                "ESProperty": [{
                                    "ID": "101",
                                    "Description": "Έκδοση Εγκατάστασης",
                                    "ValueS": "4.0.36 - 2",
                                    "Type": 0
                                }, {
                                    "ID": "102",
                                    "Description": "Έκδοση Παραστατικών",
                                    "ValueS": "167",
                                    "Type": 0
                                }, 
                                // ... more properties
                                {
                                    "ID": "16",
                                    "Description": "Τρέχων Αριθμός Χρηστών",
                                    "ValueS": "BackOffice = 1, Retail = 0, Mobile = 6, Web = 0",
                                    "Type": 0
                                }]
                            };

                            ```
                                                         * @example
                            ```js
                            //fetchSessionInfo example
                            $scope.fetchSessionInfo = function() {
                                esWebApi.fetchSessionInfo()
                                    .then(function(ret) {
                                        $scope.pSessionInfo = ret.data;
                                    }, function(err) {
                                        $scope.pSessionInfo = err;
                                    });
                            }
                            ```
                            */
                            fetchSessionInfo: function() {
                                var promise = $http({
                                    method: 'get',
                                    headers: prepareHeaders(),
                                    url: urlWEBAPI + ESWEBAPI_URL.__FETCH_SESSION_INFO__
                                });

                                return processWEBAPIPromise(promise);
                            },

                            executeNewEntityAction: function(entityType, actionID, commandParams) {
                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__ENTITYACTION__, entityType, "/", actionID);
                                var tt = esGlobals.trackTimer("ACTION", "NEW_ENTITY", entityType.concat("/", actionID));
                                tt.startTime();

                                var ht = $http({
                                    method: 'post',
                                    headers: prepareHeaders(),
                                    url: surl,
                                    data: commandParams
                                });
                                return processWEBAPIPromise(ht, tt);
                            },

                            executeEntityActionByCode: function(entityType, entityCode, actionID, commandParams) {
                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__ENTITYACTION__, entityType, "/", entityCode, "/", actionID);
                                var tt = esGlobals.trackTimer("ACTION", "ENTITY_CODE", entityType.concat("/", actionID));
                                tt.startTime();

                                var ht = $http({
                                    method: 'post',
                                    headers: prepareHeaders(),
                                    url: surl,
                                    data: commandParams
                                });

                                return processWEBAPIPromise(ht, tt);
                            },

                            executeEntityActionByGID: function(entityType, entityGID, actionID, commandParams) {
                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__ENTITYBYGIDACTION__, entityType, "/", entityGID, "/", actionID);
                                var tt = esGlobals.trackTimer("ACTION", "ENTITY_GID", entityType.concat("/", actionID));
                                tt.startTime();

                                var ht = $http({
                                    method: 'post',
                                    headers: prepareHeaders(),
                                    url: surl,
                                    data: commandParams
                                });

                                return processWEBAPIPromise(ht, tt);

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

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchPublicQueryInfo
                             * @methodOf es.Services.Web.esWebApi
                             * @description Function that returns the Entersoft Janus based GridExLayout as a JSON object.
                             * @module es.Services.Web
                             * @kind function
                             * @param {string|ESPublicQueryDef} pqGroupID if string then Entersoft Public Query GroupID or a {@link es.Services.Web.esGlobals#methods_ESPublicQueryDef ESPublicQueryDef} object that defines the rest of the parameters
                             * @param {string} pqFilterID Entersoft Public Query FilterID. In case that pqGroupID is ESPublicQueryDef type then this parameter can be null or undefined
                             * @param {boolean} useCache If true, then the results of the fetchPublicQueryInfo will be cached by the framework for any
                             * subsequent calls.
                             * @return {httpPromise} Returns a promise. 
                             ** If success i.e. success(function(ret) {...}) the response ret is a JSON object representing the Entersoft 
                             * Business Suite Janus based GridEx Layout. The result of the fetchPublicQueryInfo is of the following type:
```js
var ret = {
// Identification and ID properties of the PQ
    "Filter": [{
        "ID": "ESMMStockItem_Def",
        "Caption": "Είδη Αποθήκης",
        "QueryID": "ESMMStockItem\\ESMMStockItem_Def\\ESMMStockItem_Def_Q1.esq",
        "RootTable": "ESFIItem",
        "SelectedMasterTable": "ESFIItem",
        "SelectedMasterField": "ISUDGID",
        "TotalRow": "0",
        "ColumnHeaders": "0",
        "ColumnSetHeaders": "0",
        "ColumnSetRowCount": "2",
        "ColumnSetHeaderLines": "1",
        "HeaderLines": "1",
        "GroupByBoxVisible": "false",
        "FilterLineVisible": "false",
        "PreviewRow": "false",
        "PreviewRowMember": "",
        "PreviewRowLines": "3"
    }],

// Definition of the Parameters, if any, for the PQ
    "Param": [{
        "ID": "ESDCreated",
        "AA": "1",
        "Caption": "Ημ/νία δημιουργίας",
        "Tooltip": "Ημ/νία δημιουργίας",
        "ControlType": "6",
        "ParameterType": "Entersoft.Framework.Platform.ESDateRange, QueryProcess",
        "Precision": "0",
        "MultiValued": "false",
        "Visible": "true",
        "Required": "false",
        "ODSTag": "AA049FD6-4EFF-499F-8F6B-0573BD14D183",
        "Tags": "",
        "Visibility": "0"
    }, {
        "ID": "ESUCreated",
        "AA": "2",
        "Caption": "Χρήστης δημιουργίας",
        "Tooltip": "Χρήστης δημιουργίας",
        "ControlType": "9",
        "ParameterType": "Entersoft.Framework.Platform.ESString, QueryProcess",
        "Precision": "0",
        "MultiValued": "false",
        "Visible": "true",
        "Required": "false",
        "ODSTag": "0ABDC77C-119B-4729-A99F-C226EBCE0C1B",
        "Tags": "",
        "Visibility": "0"
    }, {
        "ID": "ESDModified",
        "AA": "3",
        "Caption": "Ημ/νία τελ.μεταβολής",
        "Tooltip": "Ημ/νία τελ.μεταβολής",
        "ControlType": "20",
        "ParameterType": "Entersoft.Framework.Platform.ESDateRange, QueryProcess",
        "Precision": "0",
        "MultiValued": "false",
        "Visible": "true",
        "Required": "false",
        "ODSTag": "4E4E17A4-ECA5-4CB0-9F11-02C943F6E6C8",
        "Tags": "",
        "Visibility": "0"
    }],

    // Default Values for the parameters specified in the previous section
    "DefaultValue": [{
        "fParamID": "ESDCreated",
        "Value": "#2006/04/15#"
    }, {
        "fParamID": "ESUCreated",
        "Value": "ESString(RANGE, 'wλμ', 'χχω')"
    }, {
        "fParamID": "ESDModified",
        "Value": "#2011/03/14#"
    }],

    // Grid column Definition

    "LayoutColumn": [{
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "Code",
        "AA": "0",
        "Caption": "Κωδικός",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "74C82778-6B49-4928-9F06-81B4384BF677",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "Description",
        "AA": "4",
        "Caption": "Περιγραφή",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "2B666760-3FA7-478A-8112-CCC77FBC754E",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "AlternativeDescription",
        "AA": "5",
        "Caption": "Εναλλακτική περιγραφή",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "A8E42370-78F3-4F38-BB65-F861B6DD1F84",
        "Visible": "false",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "Price",
        "AA": "6",
        "Caption": "Τιμή χονδρικής",
        "FormatString": "#,0.00",
        "Width": "100",
        "ODSTag": "FC8D207E-FE62-4791-98C0-C5787C8940AD",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "3",
        "EditType": "1",
        "DataTypeName": "Decimal"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "RetailPrice",
        "AA": "7",
        "Caption": "Τιμή λιανικής",
        "FormatString": "#,0.00",
        "Width": "100",
        "ODSTag": "F1FE2820-573E-41A5-B0A8-5DE247EEC20A",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "3",
        "EditType": "1",
        "DataTypeName": "Decimal"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "AssemblyType",
        "AA": "8",
        "Caption": "Τύπος σύνθεσης",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "AEAA32D3-E015-4891-AEB9-8A60ABBCA9AF",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "5",
        "DataTypeName": "Byte"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemClass",
        "AA": "9",
        "Caption": "Κλάση",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "82538EA3-8EF0-4E8F-A395-9EF1466DCFB6",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "5",
        "DataTypeName": "Byte"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "AA": "10",
        "Caption": "Τύπος",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "0107AD25-0F2D-41F6-9D59-4C6B1CC0FE30",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "5",
        "DataTypeName": "Byte"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "Name",
        "AA": "11",
        "Caption": "Επωνυμία/Ονοματεπώνυμο",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "7699C12E-3B5F-47E8-B509-7AF97F4560B1",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "Description1",
        "AA": "12",
        "Caption": "Περιγραφή1",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "2BF1AC3B-BDB3-4239-A9D1-696793981822",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "fItemFamilyCode",
        "AA": "13",
        "Caption": "Οικογένεια",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "7D4D3335-3D6D-45B5-A1D3-FF237A33867C",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "fItemGroupCode",
        "AA": "14",
        "Caption": "Ομάδα",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "CE625D36-7744-4DF9-9AFA-2F0851F9B025",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "fItemCategoryCode",
        "AA": "15",
        "Caption": "Κατηγορία",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "19AB9EB4-7791-4090-8AF6-F9434B031EF0",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "fItemSubcategoryCode",
        "AA": "16",
        "Caption": "Υποκατηγορία",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "22E443E1-9A08-4FAD-835A-6B7C15A844C2",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ESDCreated",
        "AA": "1",
        "Caption": "Ημ/νία δημιουργίας",
        "FormatString": "d",
        "Width": "100",
        "ODSTag": "AA049FD6-4EFF-499F-8F6B-0573BD14D183",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "0",
        "DataTypeName": "DateTime"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ESDModified",
        "AA": "2",
        "Caption": "Ημ/νία τελ.μεταβολής",
        "FormatString": "d",
        "Width": "100",
        "ODSTag": "4E4E17A4-ECA5-4CB0-9F11-02C943F6E6C8",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "0",
        "DataTypeName": "DateTime"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ESUCreated",
        "AA": "3",
        "Caption": "Χρήστης δημιουργίας",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "0ABDC77C-119B-4729-A99F-C226EBCE0C1B",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "0",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ESUModified",
        "AA": "17",
        "Caption": "Χρήστης τελ.μεταβολής",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "FC41CA99-AC07-45B5-825F-3982037E148C",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "0",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "Comment",
        "AA": "18",
        "Caption": "Σχόλιο",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "BD9B18D3-BA45-4FA7-911A-C66ACA556AB9",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }],

    // List of values (enums, custom enums, etc.)
    "ValueList": [{
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "AssemblyType",
        "Value": "0",
        "Caption": "Απλό"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "AssemblyType",
        "Value": "1",
        "Caption": "Σετ"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "AssemblyType",
        "Value": "2",
        "Caption": "Παραγόμενο"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemClass",
        "Value": "0",
        "Caption": "Γενικό είδος-Υπηρεσία"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemClass",
        "Value": "1",
        "Caption": "Είδος Αποθήκης"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemClass",
        "Value": "2",
        "Caption": "Πάγιο"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "0",
        "Caption": "Εμπόρευμα"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "1",
        "Caption": "Προϊόν"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "8",
        "Caption": "Ημιέτοιμο"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "2",
        "Caption": "Ά ύλη"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "9",
        "Caption": "Β’ύλη"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "12",
        "Caption": "Υλικό συσκευασίας"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "3",
        "Caption": "Ανταλλακτικό"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "4",
        "Caption": "Αναλώσιμο"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "5",
        "Caption": "Είδος συσκευασίας"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "6",
        "Caption": "Eίδος εγγυοδοσίας"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "10",
        "Caption": "Προϋπ/να έσοδα"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "11",
        "Caption": "Προϋπ/να έξοδα"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "7",
        "Caption": "Άλλο"
    }],

    //Gridex format styles and conditions
    "FormatingCondition": [{
        "fFilterID": "ESMMStockItem_Def",
        "Key": "PriceMarkNegativeValues",
        "AllowMerge": "true",
        "ColumnKey": "Price",
        "ConditionOperator": "3",
        "Value1": "0",
        "TargetColumnKey": "Price",
        "fFormatStyleKey": "1ecd5e8f-b3d0-4a02-b9ac-d70a36ee4d41"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "Key": "RetailPriceMarkNegativeValues",
        "AllowMerge": "true",
        "ColumnKey": "RetailPrice",
        "ConditionOperator": "3",
        "Value1": "0",
        "TargetColumnKey": "RetailPrice",
        "fFormatStyleKey": "3a9999f7-322b-437d-abbf-43ded2a4bec6"
    }],
    "FormatStyle": [{
        "Key": "1ecd5e8f-b3d0-4a02-b9ac-d70a36ee4d41",
        "BackColor": "0",
        "ForeColor": "-65536",
        "FontBold": "0",
        "FontItalic": "0",
        "FontStrikeout": "0"
    }, {
        "Key": "3a9999f7-322b-437d-abbf-43ded2a4bec6",
        "BackColor": "0",
        "ForeColor": "-65536",
        "FontBold": "0",
        "FontItalic": "0",
        "FontStrikeout": "0"
    }]
};
```
                             * 
                             * See the example on how to use the returned value in order to create an esGrid options object
                             *
                             ** If error i.e. error(function(err, status) { ... }) the err contains the server error object and if available the status code i.e. 400
                             * @example
```js
function($scope, esWebApi, esWebUIHelper) {
    $scope.pGroup = "ESMMStockItem";
    $scope.pFilter = "ESMMStockItem_def";
    $scope.fetchPQInfo = function() {
        esWebApi.fetchPublicQueryInfo($scope.pGroup, $scope.pFilter)
            .success(function(ret) {
                // This is the gridlayout as defined in the EBS Public Query based on .NET Janus GridEx Layout
                $scope.esJanusGridLayout = ret;

                // This is the neutral-abstract representation of the Janus GridEx Layout according to the ES WEB UI simplification
                $scope.esWebGridInfo = esWebUIHelper.winGridInfoToESGridInfo($scope.pGroup, $scope.pFilter, $scope.esJanusGridLayout);

                // This is the kendo-grid based layout ready to be assigned to kendo-grid options attribute for rendering the results
                // and for executing the corresponding Public Query
                $scope.esWebGridLayout = esWebUIHelper.esGridInfoToKInfo(esWebApi, $scope.pGroup, $scope.pFilter, {}, $scope.esWebGridInfo);
            })
            .error(function(err, status) {
                alert(a.UserMessage || a.MessageID || "Generic Error");
            });
    }
}
```
                             */
                            fetchPublicQueryInfo: function(pqGroupID, pqFilterID, useCache) {
                                var group = "";
                                if (pqGroupID instanceof esGlobals.ESPublicQueryDef) {
                                    group = (pqGroupID.GroupID || "").trim();
                                    pqFilterID = (pqGroupID.FilterID || "").trim();
                                } else {
                                    group = pqGroupID ? pqGroupID.trim() : "";
                                    pqFilterID = pqFilterID ? pqFilterID.trim() : "";
                                }

                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__PUBLICQUERY_INFO__, group, "/", pqFilterID);

                                var deferred = $q.defer();
                                if (useCache) {
                                    var cItem = esCache.getItem(surl);
                                    if (cItem) {
                                        $timeout(function() {
                                            deferred.resolve(cItem);
                                        });
                                        return deferred.promise;
                                    }
                                }

                                var tt = esGlobals.trackTimer("PQ", "INFO", group.concat("/", pqFilterID));
                                tt.startTime();

                                var ht = $http({
                                    method: 'get',
                                    headers: prepareHeaders(),
                                    url: surl
                                });
                                processWEBAPIPromise(ht, tt)
                                    .then(function(ret) {
                                        if (useCache) {
                                            esCache.setItem(surl, ret);
                                        }

                                        deferred.resolve(ret);

                                    }, function() {
                                        deferred.reject(arguments);
                                    });
                                return deferred.promise;
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchStdZoom
                             * @methodOf es.Services.Web.esWebApi
                             * @module es.Services.Web
                             * @kind function
                             * @param {string} zoomID Entersoft Public Query GroupID
                             * @param {ESPQOptions} pqOptions Entersoft Public Query execution options with respect to Paging, PageSize and WithCount.
                             * See {@link es.Services.Web.esGlobals#methods_ESPQOptions ESPQOptions}
                             ** If pqOptions is null or undefined OR pqOptions.Page is null OR undefined OR NaN OR less than or equal to 0 THEN
                             * the Public Query will be executed at the Entersoft Application Server with no paging at all, which means that ALL the 
                             * rows will be returned.
                             *
                             ** If pqOptions is valid and pqOptions.PageSize is null OR undefined OR NaN OR less or equal to 0 THEN 
                             * the Public Query will be executed with PageSize equal to 20 which is the server's default
                             *
                             ** If pqOptions is valid and pqOptions.WithCount is true THEN the result will also include the total count of records 
                             * (no natter what the pagesize is) found in the server for the given Public Query and pqParams supplied for the PQ execution.
                             ** If pqOptions is valid and pqOptions.WithCount is false, the result still might contain information about the 
                             * total records depending on the other parameters. See the return section for detailed information about the returned value.
                             * @param {boolean} useCache if pqOptions is null or undefined meaning that we want all data for the zoom to be fetched from the server
                             * if useCache is true then on success the zoom records will be cached by the framework so that next call for the same zoom will get the results
                             * from the cache.
                             * @return {promise} Returns a promise.
                             ** If success i.e. then(function(ret) { ... }) ret.data holds the result of the Zoom Records.
                             * In any success response, ret.data.Table will hold as string the Public Query MasterTableName as defined through the Entersoft Scroller Designer.
                             * The response has the typical form as follows:
```js
var x = {
    Table: string, // The name of the standard i.e. in the form ESXXZxxxx provided in the **_zoomID_** parameter
    Rows: [{Record 1}, {Record 2}, ....], // An array of JSON objects each one representing a record in the form of fieldName: fieldValue
    Count: int, // In contrast to fetchPublicQuery, for fetchStdZoom, Count will always have value no matter of the options parameter and fields.
    Page: int, // If applicable the requested Page Number (1 based), otherwise -1
    PageSize: int, // If applicable the Number of records in the Page (i.e. less or equal to the requested PageSize) otherwise -1
}
```                        
                             *
                             ** If error i.e. function(err) { ... } then err.data contains the Entersoft Application server error object.
                             * @example
```js
$scope.fetchStdZoom = function()
{
    var zoomOptions = {
        WithCount: false,
        Page: 2,
        PageSize: 5

    };
    esWebApi.fetchStdZoom($scope.pZoomID, zoomOptions)
        .then(function(ret) {
            $scope.pZoomResults = ret.data;
        }, function(err) {
            $scope.pZoomResults = err;
        });
}
```
                             */
                            fetchStdZoom: function(zoomID, pqOptions, useCache) {
                                zoomID = zoomID ? zoomID.trim() : "";

                                useCache = !pqOptions && useCache;

                                var deferred = $q.defer();
                                if (useCache) {
                                    var it = esCache.getItem("ESZOOM_" + zoomID);
                                    if (it) {
                                        $timeout(function() {
                                            deferred.resolve(it);
                                        });
                                        return deferred.promise;
                                    }
                                }

                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__STANDARD_ZOOM__, zoomID);
                                var tt = esGlobals.trackTimer("ZOOM", "FETCH", zoomID);
                                tt.startTime();

                                var ht = $http({
                                    method: 'get',
                                    headers: prepareHeaders({
                                        "Authorization": esGlobals.getWebApiToken(),
                                        "X-ESPQOptions": JSON.stringify(pqOptions)
                                    }),
                                    url: surl
                                });
                                var sp = processWEBAPIPromise(ht, tt);

                                sp.then(function(ret) {
                                    if (useCache) {
                                        esCache.setItem("ESZOOM_" + zoomID, ret);
                                    }
                                    deferred.resolve(ret);
                                }, function() {
                                    deferred.reject(arguments);
                                });
                                return deferred.promise;
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchMultiStdZoom
                             * @methodOf es.Services.Web.esWebApi
                             * @module es.Services.Web
                             * @kind function
                             * @description a function that fetches with just one round-trip for the browser to the Entersoft Application Server
                             * the contebts of one or more ES Zooms as sepcified by the input parameter
                             * @param {ESMultiZoomDef[]} multizoomdefs An array of {@link es.Services.Web.esGlobals#methods_ESMultiZoomDef ESMultiZoomDef} objects each one of which specifies the ES Zoom to be retrieved from the server.
                             * @return {promise} Returns a promise that once resolved the returned object will hold an array with the Zoom contents in one-to-one mapping with the input array
                             * @example
```js
$scope.multifetchStdZoom = function() {
    var zoomOptions = new esGlobals.ESPQOptions(300, 5, false);

    var zooms = _.map($scope.pZoomID.split(','), function(k) {
        return new esGlobals.ESMultiZoomDef(k, zoomOptions, true);
    });

    esWebApi.fetchMultiStdZoom(zooms)
        .then(function(ret) {
            $scope.pZoomResults = ret;
        }, function(err) {
            $scope.pZoomResults = JSON.stringify(err);
        });
}
```
                             */
                            fetchMultiStdZoom: function(multizoomdefs) {
                                var deferred = $q.defer();
                                var retzooms = [];

                                multizoomdefs = multizoomdefs || [];

                                var toFetchFromSrv = _.filter(multizoomdefs, function(x) {
                                    if (x.UseCache && esCache.getItem("ESZOOM_" + x.ZoomID)) {
                                        return false;
                                    }
                                    return true;
                                });

                                if (toFetchFromSrv.length == 0) {
                                    $timeout(function() {
                                        var ix;
                                        for (ix = 0; ix < multizoomdefs.length; ix++) {
                                            retzooms.push(esCache.getItem("ESZOOM_" + multizoomdefs[ix].ZoomID))
                                        }
                                        deferred.resolve(retzooms);
                                    });
                                    return deferred.promise;
                                }


                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__MULTI_STANDARD_ZOOM__);
                                var tt = esGlobals.trackTimer("ZOOM", "MULTI_FETCH", "");
                                tt.startTime();

                                var ht = $http({
                                    method: 'POST',
                                    headers: prepareHeaders(),
                                    data: toFetchFromSrv,
                                    url: surl
                                });
                                var sp = processWEBAPIPromise(ht, tt);

                                sp.then(function(ret) {
                                    var kx = 0;

                                    _.each(multizoomdefs, function(element) {
                                        if (element.UseCache && esCache.getItem("ESZOOM_" + element.ZoomID)) {
                                            retzooms.push(esCache.getItem("ESZOOM_" + element.ZoomID));
                                        } else {
                                            var zx = ret[kx];
                                            kx = kx + 1;

                                            if (element.UseCache) {
                                                esCache.setItem("ESZOOM_" + element.ZoomID, zx);
                                            }
                                            retzooms.push(zx);
                                        }
                                    });

                                    deferred.resolve(retzooms);
                                }, function() {
                                    deferred.reject(arguments);
                                });

                                return deferred.promise;
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchPublicQuery
                             * @methodOf es.Services.Web.esWebApi
                             * @module es.Services.Web
                             * @kind function
                             * @description fetchPublicQuery is one of the most important functions of the esWebApi Service as it is the most preferable and
                             * strongly recommended way to get data from the Entersoft Application Server through the Entersoft WEB API Sever.
                             *
                             * **Public Queries** is a new Entersoft Data Retrieval component introduced since 4.0.28.0 version of EBS. Public Queries can be defined and managed 
                             * through the Entersoft Scroller Designer much like the well-know and widely used across all Entersoft Applications ecosystem *Entersoft Scroller*.
                             * Although, Entersoft Public Queries are very similar in principle and definition to Entersoft Scrollers, they have a completely new implementation and a set of prerequisites
                             * in order to use and execute them against the Entersoft Application Server.
                             *
                             * Public Queries have been designed and developed in order to enable for modern programming, customization and integration with 3rd party systems with respect to: 
                             * WEB Programming i.e. Ajax calls, JQuery, plain Javascript, AngularJS, node.js, Python, etc. as well as mobile programming in native platforms such as: Microsoft Univeral Applications, Microsoft .NET Framework applications, Xamarin Forms, Xamarin Monotouch, Xamarin Monodroid, Objective C, Java, etc.
                             * and in general in any Mono (.NET open source platform for Linux and Mac OSx OSs), .NET or javascript based development frameworks.
                             *
                             * The main features of Entersoft Public Queries (PQ) compared to Entersoft Scrollers are:
                             ** **async** PQs are executed asynchronously, by taking full advantage of the **async** capabilities of Microsoft .NET Framework 4.5.1, which is required to be installed and available at the Entersoft Application Server as well as at the Entersoft WEB API Server.
                             * This feaure allows for greater scalability i.e. greater number of concurrent calls to the Entersoft Application Server, better thread management and better use of server's CPU
                             * 
                             ** **server side paging** PQ's fully support first class Microsoft SQL Server server side paging with FAST and cpu and memory OPTIMIZED Transact SQL transformations and Execution.
                             * PQs require that the underlying Microsoft SQL Server should be SQL Server 2008 R2 or higher with SQL Server 2014 being strongly recommended.
                             * PQ's Paging allows for variable Page number request of variable PageSize. 
                             * 
                             * For example, suppose that we have a large table of ESGOPerson with millions of records 
                             * and we have defined a Public Query with Parameters such as @Name, @eMail, @City, etc. ORDERED BY the ESGOPerson.FullName. 
                             * Suppose we want to execute this PQ with no parameter values meaning ALL elgibile records and we want just the data of 6th Page with PageSize of 250 Records.
                             * Assuming that all prerequisites are met, the PQ will be executed by the Entersoft Application Server aynchronously, getting ONLY the 6th Page of 250 records pagesize. 
                             * Also interesting, we want a second execution of this PQ for the 37th Page with a PageSize of 1000 Rows. No problem, since, Page and PageSize are variable
                             * and can take any value in every subsequent call.
                             * Should this scenario is executed with Entersoft Scroller instead of PQ, we would have a huge burden on the SQL Server to get all millions of records !!! as well as a HUGE XML Dataset in the Entersoft Application Server (possibly an out-of-memory exception) 
                             * and a couple of memory operations to slice the data to get just the 6th page i.e. out of question !!!
                             * 
                             * **IMPORTANT** PQs also allow for ALL data to be returned, i.e. with No Paging at all, if this is what we want. Even in this bad scenario, PQ execution will be orders
                             * of magnitude BETTER performin in all aspects compared to Scoller execution: FASTER SQL Execution, LESS Memory required, ASYNC App Server Execution, MORE Efficient memory processing (JSON instead of XML).
                             * Of course, we have to be careful,
                             * so that we will not overload systems resources (SQL, Entersoft App Server, nework, traffic, bandwidth, Browser's memory etc.). 
                             * 
                             ** **Count of Records** PQs no matter whether Paging in taking place or not, allow for the Number of Records that meet the current sql statement (defined by the PQ along with the run-time params) to be returned along with the data.
                             * The number of records, if requested to be returned, it highly optimized executed by the SQL Server with just one round-trip to the server 
                             * with no need to re-write or restructure the PQ's defintion. Any transformations are done at run-time atomatically by the Entersoft Query Processor along with 
                             * the support of the new features of SQL Server, Transact SQL.
                             * 
                             ** **JSON format** The default format to which PQ data and results are transformed to and returned to the caller. 
                             * JSON for this kind of data i.e. records which outperforms in almost any aspect the *DataSet - XML* representation. Most important, PQ's execution 
                             * is taking advantage of the latest .NET Framework and ADO.NET execution options with ASYNC READERS, ASYNC Streams and StringBuilders in order to 
                             * construct the JSON result in the most optimal way. **Newtonsoft JSON** .NET library, now 1st class citizen of the .NET Framework, is the core 
                             * component used for serialization and deserialization of objects in the Entersoft .NET Framework code ecosystem. 
                             * **ATTENTION** Special consideration and Newtonsoft serialization configuration has taken place in order to properly handle NULL values and DATES.
                             *
                             ** **Precompiled SQL** PQ Actual SQL Statement is precompiled and stored at design time, which speeds up the application server PQ execution time as
                             * the sql statement to be sent to the SQL Server is instantly available. This is in contrast to the Scroller's execution model that requires the SQL Statement 
                             * to be constructed in every execution.
                             *
                             * 
                             * **Public Query Prerequisites**
                             ** Entersoft Business Suite, Entersoft Expert, Entersoft CRM family products of version 4.0.28 or later 
                             ** Microsoft .NET Framework 4.5.1 or later to be installed on the Entersoft Application Server(s) and Entersoft WEB API Server(s)
                             ** Microsoft SQL Server 2008 R2 or later (Recommended: SQL Server 2014 or later)
                             ** For Paging to work, the PQ Definition should explicitly contain at least one ORDER BY field
                             *
                             * 
                             * **Public Query Restrictions**
                             ** Hierarchical Public Queries are NOT SUPPORTED and will not be supported as the are fundamentally against the core concept of the PQ.
                             * The developer should design its solution in such a way with multiple PQ's i.e. for a Master-Detail old style Hierarchical DataSet OR if its not
                             * a major overhead to have a PQ for the details including the necessary fields form the Master (verbose). In case that a Hierarchical datase old style 
                             * result is absolutely necessary, the only choice is to use Scroller instead of Public Query with all the drawbacks.
                             ** BINARY* type fields are supported BUT not explicitly converted to any web or javascript recommended BASE64 representation. The use of fields of binary type
                             * in the PQ schema should be extemely rare for many reasons (web performance, security, javascript's limitations & restrictions, etc.).
                             * 
                             * @param {string|ESPublicQueryDef} pqGroupID if string then Entersoft Public Query GroupID or a {@link es.Services.Web.esGlobals#methods_ESPublicQueryDef ESPublicQueryDef} object that defines the rest of the parameters
                             * @param {string} pqFilterID Entersoft Public Query FilterID
                             * @param {ESPQOptions} pqOptions Entersoft Public Query execution options. See {@link es.Services.Web.esGlobals#methods_ESPQOptions ESPQOptions}.
                             * 
                             ** If pqOptions is null or undefined OR pqOptions.Page is null OR undefined OR NaN OR less than or equal to 0 THEN
                             * the Public Query will be executed at the Entersoft Application Server with no paging at all, which means that ALL the 
                             * rows will be returned.
                             *
                             ** If pqOptions is valid and pqOptions.PageSize is null OR undefined OR NaN OR less or equal to 0 THEN 
                             * the Public Query will be executed with PageSize equal to 20 which is the server's default
                             *
                             ** If pqOptions is valid and pqOptions.WithCount is true THEN the result will also include the total count of records 
                             * (no natter what the pagesize is) found in the server for the given Public Query and pqParams supplied for the PQ execution.
                             ** If pqOptions is valid and pqOptions.WithCount is false, the result still might contain information about the 
                             * total records depending on the other parameters. See the return section for detailed information about the returned value.
                             * @param {object} pqParams Parameters that will be used for the execution of the Public Query at the Entersoft Application Server
                             * The typical structure of the pqParams object is:
```js
var pqParams = {
    Name: "a*",
    RegDate: "ESDateRange(Day)"
};
```
                             * pqParams is a typical JSON object of key: value properties, where key is the parameter name as defined in the Public Query 
                             * (through Entersoft Scroller Designer) and value is an Entersoft Application server acceptable value for the given parameter, depending on the
                             * parameter type and properties as defined in the Public Query (through Entersoft Scroller Designer)
                             *
                             ** If pqParams is null or undefined or empty object i.e. {} THEN the Public Query will be executed by the Entersoft Application Server
                             * with all parameters assigned the value null.
                             *
                             ** If pqParams is not null and some parameters are specified THEN all the parameters that are not explicitly assigned a value i.e. are missing or are null or undefined in the pqParams object 
                             * at the execution time will be treated by the Entersoft Application Server as having null value.
                             * @param {string=} httpVerb Parameter to specify HTTP verb. Default is GET
                             * @return {httpPromise} Returns a promise.
                             ** If success i.e. then(function(ret) { ... }) ret.data holds the result of the Public Query Execution.
                             * In any success response, ret.data.Table will hold as string the Public Query MasterTableName as defined through the Entersoft Scroller Designer.
                             * The response has the typical form as follows:
```js
var x = {
    Table: string, // The name of the MasterTable as defined in the Public Query definition (through the Scroller Designer)
    Rows: [{Record 1}, {Record 2}, ....], // An array of JSON objects each one representing a record in the form of fieldName: fieldValue
    Count: int, // If applicable and capable the total number of records found in the server at the execution time for the current execution of Public Query / pqParams 
    Page: int, // If applicable the requested Page Number (1 based), otherwise -1
    PageSize: int, // If applicable the Number of records in the Page (i.e. less or equal to the requested PageSize) otherwise -1
}
```                        
                             *                              * 
                             * If **NO PAGING** is taking place (no matter how), which means that all data are returned from the server THEN
                             * ret.data.Count will always be greater or equal to 0 and it will always be equal to the ret.data.Rows.length i.e. the number of 
                             * records returned by the server. If the query returns no data, the ret.Count will be 0 and ret.data.Rows will always be an empty array []. 
                             * So, if NO PAGING is taking place, we always have ret.data.Count == ret.data.Rows.length.
                             * 
                             * **ATTENTION** If no records are returned by the Server ret.data.Rows will NOT BE null or undefined or not defined. It will be an empty array. ret.data.PageSize will be -1, ret.data.Page will be -1, 
                             * 
                             *If **PAGING** is taking place the following pseudo code diagram reflects the contents of ret.data response:
```js
IF WithCount == TRUE THEN
    {
        Count: 0, // (if no data at all exist or the number of records found in the database for the specific pq & params execution),
        Page: inputPage,
        PageSize: inputPageSize,
        Rows: [{} empty i.e. length = 0 or > 0 num of elements], // no page exists or the page has no data. IF Rows.length == 0 and Count == 0 THEN page is empty because in general no data exist
        Table: “xxxx”
    }
ELSE
    {
        Count: -1,
        Page: inputPage,
        PageSize: inputPageSize,
        Rows: [{} empty i.e. length = 0 or > 0 num of elements], // 0 length means that either no data at all exist or no page exists or the page has no data
        Table: “xxxx”
    }
END IF
```
                             *
                             ** If error i.e. function(err) { ... } then err.data contains the Entersoft Application server error object.
                             * @example
```js
$scope.dofetchPublicQuery = function() {
    var group = "ESGOPerson";
    var filter = "PersonList";
    $scope.pqResult = "";

    var pqOptions = {
        WithCount: false,
        Page: 2,
        PageSize: 5
    };

    var pqParams = {
        Name: "a*"
    };

    esWebApi.fetchPublicQuery(group, filter, pqOptions, pqParams)
        .then(function(ret) {
                $scope.pqResult = ret.data;
                $log.info(ret);
            },
            function(err) {
                $scope.pqResult = ret;
                $log.error(err);
            });
}
```
                             */
                            fetchPublicQuery: function(pqGroupID, pqFilterID, pqOptions, pqParams, httpVerb) {
                                var group;
                                var execParams;
                                if (pqGroupID instanceof esGlobals.ESPublicQueryDef) {
                                    group = (pqGroupID.GroupID || "").trim();
                                    pqFilterID = (pqGroupID.FilterID || "").trim();
                                    pqOptions = pqGroupID.PQOptions;
                                    execParams = pqGroupID.Params;
                                } else {
                                    group = pqGroupID ? pqGroupID.trim() : "";
                                    pqFilterID = pqFilterID ? pqFilterID.trim() : "";
                                    execParams = pqParams;
                                }

                                if (execParams && execParams instanceof esGlobals.ESParamValues) {
                                    execParams = execParams.getExecuteVals();
                                }

                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__PUBLICQUERY__, group, "/", pqFilterID);
                                var tt = esGlobals.trackTimer("PQ", "FETCH", group.concat("/", pqFilterID));
                                tt.startTime();

                                /**
                                 * $http object configuration
                                 * @type {Object}
                                 */
                                var httpConfig = {
                                    headers: prepareHeaders(),
                                    url: surl,
                                    params: execParams
                                };

                                if (pqOptions) {
                                    httpConfig.headers["X-ESPQOptions"] = JSON.stringify(pqOptions);
                                }

                                //if called with 3 arguments then default to a GET request
                                httpConfig.method = httpVerb || 'GET';

                                //if not a GET request, switch to data instead of params
                                if (httpConfig.method !== 'GET') {
                                    delete httpConfig.params;
                                    httpConfig.data = execParams;
                                }

                                var ht = $http(httpConfig);
                                return processWEBAPIPromise(ht, tt);
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#multiPublicQuery
                             * @methodOf es.Services.Web.esWebApi
                             * @module es.Services.Web
                             * @kind function
                             * @description multiPublicQuery is similar to the {@link es.Services.Web.esWebApi#methods_fetchPublicQuery fetchPublicQuery} with the difference 
                             * that it supports for multiple public queries execution with just one round-trip to the Entersoft WEB API Server and to the Entersoft
                             * Application Server.
                             * @param {ESPublicQueryDef[]} pqDefs An array of one or more public query defintion objects that are to be executed to the server.
                             * The object has the following structure:
                             * @param {string} pqDefs.GroupID The GroupID of the Public Query
                             * @param {string} pqDefs.FilterID The FilterID of the Public Query
                             * @param {object} pqDefs.Params The params to be used for the execution of the Public Query
                             * @param {ESPQOptions} pqDefs.PQOptions The paging options for the Public Query Execution. See {@link es.Services.Web.esGlobals#methods_ESPQOptions ESPQOptions}.
                             * @return {MultPublicQueryResult[]} An array of equal size to the _pqDefs_ of objects each one of which holds the results of the 
                             * corresponding public query. The structure of the MultPublicQueryResult object is as follows:
```js
{
    GroupID: //string representing the GroupIF of the Public Query,
    FilterID: //string representing the FilterID of the Public Query,
    PQResults: // string that should be parsed by JSON.parse that holds the results of the Public Query,
    Error: // string if null or undefined or empty string means that the specific Public Query was executed with no errors. Ohterwise, an error has occurred 
    and the PQResults will be null or undefined.
}```
                             * @example
```js
var pqParams = [{
        GroupID: "ESGOPerson",
        FilterID: "CRM_Personlist",
        Params: {
            Name: "εντ*"
        }
    },

    {
        GroupID: "notdefined",
        FilterID: "not exists",
        Params: {
            Name: "ao*",
            Code: "noname"
        }
    }
];

esWebApi.MultiPublicQuery(pqParams)
    .then(function(x) {
            $scope.ret = x.data;
        },
        function(err) {
            $scope.pCompanyParamValue = JSON.stringify(err);
        });
}
```
                             **/
                            multiPublicQuery: function(pqDefs) {
                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__MULTI_PULIC_QUERY__);
                                var tt = esGlobals.trackTimer("MULTI-PQ", "FETCH", "");
                                tt.startTime();

                                /**
                                 * $http object configuration
                                 * @type {Object}
                                 */
                                var httpConfig = {
                                    headers: prepareHeaders(),
                                    url: surl,
                                    method: 'POST'
                                };

                                httpConfig.data = pqDefs;

                                var ht = $http(httpConfig);
                                return processWEBAPIPromise(ht, tt);
                            },

                            /** 
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchEASWebAsset
                             * @methodOf es.Services.Web.esWebApi
                             * @kind function
                             * @description This function returns the contents of a file asset stored in the Entersoft Application Server (EAS) **ESWebAssets** 
                             * or **CSWebAssets** sub-directories of the EAS. 
                             * 
                             * **REQUIRES ESWebAPIServer >= 1.7.9**
                             * 
                             * @param {string} assetUrlPath the sub-path that points to the file the contents of which we need to retrieve. So,
                             * if at the EAS the file is stored in the _$/CSWebAssets/esrfa/config/menuConfig.json_ you have to provide as *assetUrlPath* 
                             * the value "esrfa/config/menuConfig.json". 
                             * @param {object=} options JSON object representing the options that will be used to get the contents of the file.
                             * These options depend on what the caller wants to do with the results and on the document type e.g. image, MS Office document, PDF, etc.
                             * If left null or unspecified, then contents of the file will be returned as _arraybuffer_ (requires AngularJS v1.2 or hogher)
                             *
                             * To get an image i.e. myphoto.png to be displayed by an <image> html element, you need to call with options.
                             *
                             * **ATTENTION**
                             *
                             * For the image to be shown correctly by an HTML image element you should pre-pappend to the begining of the returned string
                             * the following string: "data:image/png;base64," i.e. img_data = "data:image/png;base64," + ret.data
```js
var options = {
    base64: true
}
```
                             * To get a unicode or utf-8 text document contents as a string you need to call
```js
var options = {Accept: 'text/plain'}
```
                             * As described above, if options is null or undefined, then the default options that will be used to execute the operation:
```js
{
    base64: false,
    responseType: 'arraybuffer'
}
```
                             * @return {httpPromise} If success i.e. function(ret) { ...} the ret.data contains the string or the array buffer with the contents of the file requested
                             * @example
                             * ![EAS directory structure example for fetchEASWebAsset](images/api/es09api-fetchasset.png)
```js
 $scope.fetchEASWebAsset = function() {
    esWebApi.fetchEASWebAsset($scope.pAsset, false)
    .then(function(ret) {
        $scope.pAssetResults = ret.data;
    },
    function(err) {
        $scope.pAssetResults = err;
    });
}

// call this function
// esWebApi.fetchEASWebAsset("xx/yy/abcd.txt", {Accept: 'text/plain'})
// will return the contents of the file.
// sample
```
                             */
                            fetchEASWebAsset: function(assetUrlPath, options) {
                                var cOptions = {
                                    base64: false,
                                };

                                if (options) {
                                    cOptions.base64 = !!options.base64;
                                    cOptions.responseType = options.responseType;
                                    cOptions.Accept = options.Accept;
                                } else {
                                    cOptions.responseType = 'arraybuffer';
                                }

                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__FETCH_WEB_EAS_ASSET__, assetUrlPath);
                                var tt = esGlobals.trackTimer("EAS_ASSET", "FETCH", assetUrlPath);
                                tt.startTime();

                                var httpConfig = {
                                    method: 'GET',
                                    headers: prepareHeaders(),
                                    url: surl,
                                    params: {
                                        base64: cOptions.base64
                                    },
                                };

                                httpConfig.headers.Accept = cOptions.Accept;

                                if (cOptions.responseType) {
                                    httpConfig.responseType = cOptions.responseType;
                                }

                                var ht = $http(httpConfig);
                                return processWEBAPIPromise(ht, tt);
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchEntity
                             * @methodOf es.Services.Web.esWebApi
                             * @kind function
                             * @description This function returns the Entersoft Entity ISUD dataset in JSON representation
                             * @param {string} entityclass The Entersoft ODS object ID the ISUD record to be retrieved
                             * @param {string} entitygid The gid in string format that represents the Primary Key of the record to be retrieved
                             * @return {httpPromise} If success i.e. function(ret) { ...} the ret.data contains JSON object of the ISUD dataset.
                             * @example
```js
$scope.fetchEntity = function() {
    esWebApi.fetchEntity("esmmstockitem", "B485C0C2-D9A9-47A6-88A3-039A40CA0157")
        .then(function(ret) {
                $scope.pEntityDS = ret.data;
            },
            function(err) {
                $scope.pEntityDS = err;
            })
}

var x = {
    "ESMMStockItem": [{
        "GID": "b485c0c2-d9a9-47a6-88a3-039a40ca0157",
        "Code": "ΘΡ.ΑΛ.425",
        "Description": "ΛΟΥΚ.Τ.ΦΡΑΓΚΦ.18ΧΛ.400ΓΡ -20%",
        "AlternativeDescription": "SAUSAGE FRANFURT 18ΧΛ.400ΓΡ -20%",
        "InternationalCode": "ΘΡ.ΑΛ.425",
        "AlternativeCode": "THR.AL.425",
        "AssemblyType": 0,
        "ItemClass": 1,
        "ItemType": 0,
        "fMainSupplierGID": "f6f24cba-6c22-49ef-b072-7165ad834592",
        "fItemPricingCategoryCode": "ΕΜΠΟΡΕΥΜΑΤΑ",
        "Price": 35,
        "RetailPrice": 42,
        "MarkupOnPrice": 11,
        "MarkupOnRetailPrice": 14,
        "PriceIncludedVAT": 0,
        "RetailPriceIncludedVAT": 1,
        "fMainMUGID": "ac431509-66a2-4fdb-9b75-ac1cd5b9c1e7",
        "fVATCategoryCode": "1111",
        "Discount": 4,
        "MaxDiscount": 6,
        "MinProfitMargin": 8,
        "MinSalesOrderQty": 0,
        "UsualPurchaseOrderQty": 0,
        "fCommissionLevelCode": "M.FLAT",
        "fItemFamilyCode": "ΤΡΟΦΙΜΑ",
        "fItemGroupCode": "ΧΑΙΤΟΓΛΟΥ",
        "fItemCategoryCode": "ΛΟΥΚΑΝΙΚΑ",
        "StandardCost": 3.6,
        "ValuationMethod": 0,
        "fItemControlProfileGID": "134fe00c-3212-440a-8237-0abd89e5b02c",
        "IncludedTaxReports": 0,
        "SerialNumberMgmt": 0,
        "LotMgmt": 0,
        "ColorMgmt": 0,
        "SizeMgmt": 0,
        "StockDim1Mgmt": 0,
        "StockDim2Mgmt": 0,
        "fCatalogueItemGID": "c1f5f5b1-6a9e-4100-9186-49385878f18d",
        "DateField1": "2006-11-16T00:00:00",
        "NumericField1": 0,
        "NumericField2": 0,
        "NumericField3": 0,
        "NumericField4": 0,
        "NumericField5": 0,
        "NumericField6": 0,
        "NumericField7": 0,
        "NumericField8": 0,
        "NumericField9": 0,
        "NumericField10": 0,
        "Flag1": 0,
        "Flag2": 0,
        "Flag3": 0,
        "Flag4": 0,
        "Flag5": 0,
        "Flag6": 0,
        "Flag7": 0,
        "Flag8": 0,
        "Flag9": 0,
        "Flag10": 0,
        "Flag11": 0,
        "Flag12": 0,
        "fBusinessActivityCode": "ΤΡΟΦΙΜΑ",
        "fGLSegCode": "Εμπορεύματα",
        "Price1": 0,
        "Price2": 0,
        "Price3": 0,
        "Price1IncludedVAT": false,
        "Price2IncludedVAT": false,
        "Price3IncludedVAT": false,
        "fMUServiceCode": "ΤΕΜ",
        "fMUMainCode": "ΤΕΜ",
        "MainSupplier": "f9eef0bf-2995-45cc-85b6-473a03a25a0d",
        "VATCalculationValue": 1,
        "Web": 1,
        "ValuationMethodAnalysis": 0,
        "MainCode": 1,
        "ValuationPerPeriod": 0,
        "ServiceMUType": 0,
        "Mobile": 0,
        "SelectInMobileOrder": 1,
        "PerCentOfTaxExclusion": 0,
        "MarkupOnPrice1": 0,
        "MarkupOnPrice2": 0,
        "MarkupOnPrice3": 0,
        "OpeningPerFiscalYear": 1,
        "LotCharacteristicsMgmt": 0,
        "CatalogueItemBehaviour": 0,
        "NS_MainSupplierDescription_Col": "ZOLOTAS Α.Ε..",
        "NS_MainMUDescription_Col": "Τεμάχια",
        "NS_MainSupplierItemCode_Col": "ΘΡ.ΑΛ.425",
        "NS_MainSupplierCurrency_Col": "EUR",
        "fCurrencyRateGroupCode": "1",
        "SetDate": "2015-11-23T00:00:00",
        "CurrencyExchangePriceType": 2,
        "CurrencyRate": 1,
        "NS_MainSupplierPrice_Col": 0,
        "ESDCREATED": "2006-11-16T13:51:19.86",
        "ESDMODIFIED": "2013-09-30T11:42:29.65",
        "ESUCREATED": "esmaster",
        "ESUMODIFIED": "KAR",
        "INACTIVE": 0,
        "fCompanyCode": "ES"
    }],
    "ESMMCatalogueItemRelation": [],
    "ESMMCatalogueItemRelationStockDimSetMap": [],
    "ESMMItemStorageLocation": [],
    "ESMMItemCodes": [{
        "ItemGID": "b485c0c2-d9a9-47a6-88a3-039a40ca0157",
        "Code": "ΘΡ.ΑΛ.425",
        "fMUGID": "ac431509-66a2-4fdb-9b75-ac1cd5b9c1e7",
        "Description": "ΛΟΥΚ.Τ.ΦΡΑΓΚΦ.18ΧΛ.400ΓΡ -20%",
        "RequiresBCProcessing": 0,
        "NumericField1": 0,
        "NumericField2": 0,
        "Flag1": false,
        "Flag2": false,
        "INACTIVE": 0,
        "fCompanyCode": "ES"
    }],
    "ESMMItemMU": [{
        "GID": "ac431509-66a2-4fdb-9b75-ac1cd5b9c1e7",
        "fItemGID": "b485c0c2-d9a9-47a6-88a3-039a40ca0157",
        "fMUCode": "ΤΕΜ",
        "Relation": 1,
        "EditRelation": 0,
        "DefaultVar2": 1,
        "DefaultVar3": 1,
        "DefaultVar4": 0,
        "RelationType": 0,
        "ApplyOnUserSelection": 0,
        "INACTIVE": 0,
        "fCompanyCode": "ES"
    }],
    "ESMMSISupplier": [{
        "GID": "f6f24cba-6c22-49ef-b072-7165ad834592",
        "fItemGID": "b485c0c2-d9a9-47a6-88a3-039a40ca0157",
        "fSupplierGID": "f9eef0bf-2995-45cc-85b6-473a03a25a0d",
        "SupplierItemCode": "ΘΡ.ΑΛ.425",
        "fCurrencyCode": "EUR",
        "Price": 0,
        "CurrencyPrice": 0,
        "DeliveryDays": 2,
        "Discount": 10,
        "fMUCode": "ΤΕΜ",
        "MinOrderQty": 0,
        "OptionLevel": "1",
        "OfferPrice": 0,
        "RequiresBCProcessing": 0,
        "PurchaseNetPrice": 0,
        "CurrencyPurchaseNetPrice": 0,
        "CrossCompanyID": "7jgU4Jjao1LMuhSJe6fjJg==",
        "fCurrencyRateGroupCode": "1",
        "SetDate": "2015-11-23T00:00:00",
        "CurrencyExchangePriceType": 2,
        "CurrencyRate": 1,
        "fCompanyCode": "ES",
        "SeqNum": 1
    }],
    "ESMMItemWH": [{
        "GID": "9f88e587-185d-4e2a-8bd2-14eb4c169c9e",
        "fItemGID": "b485c0c2-d9a9-47a6-88a3-039a40ca0157",
        "fWareHouseGID": "86947579-6885-4e86-914e-46378db3794f",
        "BottomLevel": 1,
        "SecurityLevel": 0,
        "ReorderLevel": 0,
        "UpperLevel": 0,
        "DebitQty": 100,
        "CreditQty": 2,
        "ReservedStock": 0,
        "Remainder": 98,
        "Available": 98,
        "BottomLevelAltMU": 0,
        "SecurityLevelAltMU": 0,
        "ReorderLevelAltMU": 0,
        "UpperLevelAltMU": 0,
        "DebitQtyAltMU": 0,
        "CreditQtyAltMU": 0,
        "ReservedStockAltMU": 0,
        "RemainderAltMU": 0,
        "AvailableAltMU": 0,
        "NumericField1": 0,
        "NumericField2": 0,
        "NumericField3": 0,
        "NumericField4": 0,
        "NumericField5": 0,
        "AnalysisDebitQty": 0,
        "AnalysisCreditQty": 0,
        "AnalysisReservedStock": 0,
        "AnalysisRemainder": 0,
        "AnalysisAvailable": 0,
        "AnalysisDebitQtyAltMU": 0,
        "AnalysisCreditQtyAltMU": 0,
        "AnalysisReservedStockAltMU": 0,
        "AnalysisRemainderAltMU": 0,
        "AnalysisAvailableAltMU": 0,
        "fCompanyCode": "ES"
    }],
    "ESMMItemCostPrices": [],
    "ESMMItemDimensionPrices": [],
    "ESFIItemCategory": [],
    "ESMMDimensionalAnalysis": [{
        "GID": "098ec252-57c1-4d68-8f2d-65966c57c567",
        "fItemGID": "b485c0c2-d9a9-47a6-88a3-039a40ca0157",
        "fItemMUGID": "ac431509-66a2-4fdb-9b75-ac1cd5b9c1e7",
        "Length": 0,
        "Width": 0,
        "Height": 0,
        "SurfaceArea": 0,
        "Volume": 0,
        "NetWeight": 0,
        "GrossWeight": 0
    }],
    "ESMMItemMURelation": [],
    "ESWMItemContainerType": [],
    "FK_ESFIItem_ESMMCommercialProfile": [],
    "FK_ESFIItem_ESMMItemControlPolicy": [{
        "GID": "134fe00c-3212-440a-8237-0abd89e5b02c",
        "Code": "ΠΟΛ-ΔΙΑ-02",
        "Description": "Απαγόρευση Αρνητικών & Ελεγχος Διαστάσεων",
        "Display": "ΠΟΛ-ΔΙΑ-02 / Απαγόρευση Αρνητικών & Ελεγχος Διαστάσεων"
    }],
    "FK_ESFIItemCategory_ESTMTaskCategoryValue": [],
    "FK_ESFIItem_ESTMContractTerm": [],
    "FK_ESFIItem_TaxDifferencesAccount": [],
    "FK_ESFIItem_ESMMZIntrastatCode": [],
    "FK_ESMMStockItem_ES00PropertySet": [],
    "ESTMPCatalogueItem": [],
    "FK_ESMMCatalogueItemRelation_ESMMStockDimSetMap_Color": [],
    "FK_ESMMCatalogueItemRelation_ESMMStockDimSetMap_Size": [],
    "FK_ESMMCatalogueItemRelation_ESMMStockDimSetMap_StockDim1": [],
    "FK_ESMMCatalogueItemRelation_ESMMStockDimSetMap_StockDim2": [],
    "FK_ESMMCatalogueItemRelationStockDimSetMap_ESMMStockDimSetMap_Color": [],
    "FK_ESMMCatalogueItemRelationStockDimSetMap_ESMMStockDimSetMap_Size": [],
    "FK_ESMMCatalogueItemRelationStockDimSetMap_ESMMStockDimSetMap_StockDim1": [],
    "FK_ESMMCatalogueItemRelationStockDimSetMap_ESMMStockDimSetMap_StockDim2": [],
    "FK_ESMMStockItem_ESFIItem": [],
    "FK_ESMMStockItem_ESBGAllocationProfile": [],
    "FK_ESMMItemCodes_ESMMZColor": [],
    "FK_ESMMItemCodes_ESMMZSize": [],
    "FK_ESMMItemCodes_ESMMZStockDim1": [],
    "FK_ESMMItemCodes_ESMMZStockDim2": [],
    "FK_ESMMStockItem_ESFIItemAllocationProfile": [],
    "FK_ESFIItem_ESFISpecialAccountGroup_DiscountGroup": [],
    "FK_ESFIItem_ESFISpecialAccountGroup_TaxesGroup": [],
    "FK_ESFIItem_ESFISpecialAccountGroup_ChargesGroup": [],
    "FK_ESFIItem_ESFISpecialAccountGroup_DeductionGroup": [],
    "FK_ESFIItem_ESFISpecialAccountGroup_BonusGroup": [],
    "FK_ESFIItem_ESMMStockDimSet_Color": [],
    "FK_ESFIItem_ESMMStockDimSet_Size": [],
    "FK_ESFIItem_ESMMStockDimSet_1": [],
    "FK_ESFIItem_ESMMStockDimSet_2": [],
    "FK_ESMMSISupplier_ESFITradeAccount": [{
        "GID": "f9eef0bf-2995-45cc-85b6-473a03a25a0d",
        "Code": "ΠΡΟΜ00020",
        "Type": 1,
        "Name": "ZOLOTAS Α.Ε..",
        "fTradeCurrencyCode": "EUR"
    }],
    "FK_ESWMItemContainerType_ESWMContainerType": [],
    "FK_ESFIItem_ESWMItemControlPolicy": [],
    "FK_ESMMLot_ESMMItemDimensionPrices": [],
    "FK_ESMMZColor_ESMMItemDimensionPrices": [],
    "FK_ESMMZSize_ESMMItemDimensionPrices": [],
    "FK_ESMMZStockDim1_ESMMItemDimensionPrices": [],
    "FK_ESMMZStockDim2_ESMMItemDimensionPrices": [],
    "FK_ESFIItem_ESFIItemNetProfitCodes": [],
    "FK_Supplier": [{
        "GID": "f9eef0bf-2995-45cc-85b6-473a03a25a0d",
        "Code": "ΠΡΟΜ00020",
        "Name": "ZOLOTAS Α.Ε.."
    }],
    "FK_FamilyCode": [{
        "Code": "ΤΡΟΦΙΜΑ",
        "Description": "ΤΡΟΦΙΜΑ",
        "Display": "ΤΡΟΦΙΜΑ / ΤΡΟΦΙΜΑ"
    }],
    "FK_CategoryCode": [{
        "Code": "ΛΟΥΚΑΝΙΚΑ",
        "fParentCode": "ΧΑΙΤΟΓΛΟΥ",
        "Description": "ΛΟΥΚΑΝΙΚΑ",
        "Display": "ΛΟΥΚΑΝΙΚΑ / ΛΟΥΚΑΝΙΚΑ"
    }],
    "FK_GroupCode": [{
        "Code": "ΧΑΙΤΟΓΛΟΥ",
        "fParentCode": "ΤΡΟΦΙΜΑ",
        "Description": "ΧΑΙΤΟΓΛΟΥ",
        "Display": "ΧΑΙΤΟΓΛΟΥ / ΧΑΙΤΟΓΛΟΥ"
    }],
    "FK_SubCategoryCode": [],
    "FK_ESFIItem_ESGOZBusinessUnit": [],
    "FK_ESFIItem_ESGOZBusinessActivity": [{
        "Code": "ΤΡΟΦΙΜΑ",
        "Description": "ΤΡΟΦΙΜΑ",
        "Display": "ΤΡΟΦΙΜΑ / ΤΡΟΦΙΜΑ"
    }],
    "FK_ESMMItemUnit_ESMMZMeasurementUnit": [{
        "Code": "ΤΕΜ",
        "Description": "Τεμάχια",
        "DefaultRelation": 1,
        "Symbol": "ΤΕΜ"
    }],
    "FK_ESFIItem_ESGOPerson_Manufacturer": [],
    "FK_ESMMStorageLocation_ESGOSites_WareHouse": [],
    "FK_ESMMItemWH_ESGOSites": [{
        "GID": "86947579-6885-4e86-914e-46378db3794f",
        "Code": "ΑΘΗ",
        "Description": "Κεντρικά Entersoft",
        "Address1": "ΛΕΩΦΌΡΟΣ ΣΥΓΓΡΟΎ 362"
    }],
    "FK_ESMMItemCostPrices_ESGOFiscalYear": [],
    "FK_ESMMItemCostPrices_ESGOFiscalPeriod": [],
    "FK_ESFIItem_ESMMBOM_Base": [],
    "FK_ESFIItem_ESMMCatalogueItem": [{
        "GID": "c1f5f5b1-6a9e-4100-9186-49385878f18d",
        "Code": "ΘΡ.ΑΛ.425",
        "Description": "ΛΟΥΚ.Τ.ΦΡΑΓΚΦ.18ΧΛ.400ΓΡ -20%"
    }],
    "FK_ESFIItem_ESCOCostElementType": [],
    "ES00Documents": [],
    "ES00Properties": [],
    "ES00PropertiesMultipleValues": []
};
```
                             */
                            fetchEntity: function(entityclass, entitygid) {
                                if (!entityclass || !entitygid) {
                                    throw new Error("Invalid parameters");
                                }

                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__FETCH_ENTITY__, entityclass, "/", entitygid);
                                var tt = esGlobals.trackTimer("FETCH_ENTITY", entityclass, entitygid);
                                tt.startTime();

                                var ht = $http({
                                    method: 'get',
                                    headers: prepareHeaders(),
                                    url: surl
                                });
                                return processWEBAPIPromise(ht, tt);
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchEntityByCode
                             * @methodOf es.Services.Web.esWebApi
                             * @kind function
                             * @description This function returns the Entersoft Entity ISUD dataset in JSON representation
                             * @param {string} entityclass The Entersoft ODS object ID the ISUD record to be retrieved
                             * @param {string} entityCode The string code that represents the unique human understandable key of the record to be retrieved
                             * @return {httpPromise} If success i.e. function(ret) { ...} the ret.data contains JSON object of the ISUD dataset.
                             * @example
```js
$scope.fetchEntityByCode = function() {
    esWebApi.fetchEntityByCode("esmmstockitem", "ΕLΕ.Q.CΑΤΗ")
        .then(function(ret) {
                $scope.pEntityDS = ret.data;
            },
            function(err) {
                $scope.pEntityDS = err;
            })
}
                            */
                            fetchEntityByCode: function(entityclass, entityCode) {
                                if (!entityclass || !entityCode) {
                                    throw new Error("Invalid parameters");
                                }

                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__FETCH_ENTITY_BY_CODE__, entityclass, "/", entityCode);
                                var tt = esGlobals.trackTimer("FETCH_ENTITY", entityclass, entityCode);
                                tt.startTime();

                                var ht = $http({
                                    method: 'get',
                                    headers: prepareHeaders(),
                                    url: surl
                                });
                                return processWEBAPIPromise(ht, tt);
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchPropertySet
                             * @methodOf es.Services.Web.esWebApi
                             * @kind function
                             * @description This function returns the property set / survey identified by the psCode parameter that is optionally linked / attached to the 
                             * campaignID specified by the campaignGID parameter 
                             * @param {string} psCode The Entersoft ODS object ID the ISUD record to be retrieved
                             * @param {string} campaignGID The gid in string format that represents the gid of the campaign that is of type sruvey
                             * @return {httpPromise} If success i.e. function(ret) { ...} the ret.data contains JSON object of the ESPropertySet object.
                             * @example
```js
smeControllers.controller('surveyCtrl', ['$location', '$scope', '$log', 'esWebApi', 'esUIHelper', '_', 'esCache', 'esMessaging', 'esGlobals',
    function($location, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {

        $scope.surveyDef = {};

        $scope.startFrom = -1;
        $scope.surveyCode = "usage_s1";
        $scope.surveyAns = {};

        $scope.loadSurvey = function() {
            esWebApiService.fetchPropertySet($scope.surveyCode, "2E035E80-BFED-4B45-91D2-1CEB64C2BB7B")
                .then(function(ret) {
                        $scope.surveyDef = ret.data;
                        $scope.startFrom = -1;
                        $scope.surveyCode = "usage_s1";
                        $scope.surveyAns = {};
                    },
                    function(err) {
                        $scope.surveyDef = {};
                        alert(err);
                    });
        }
    }
]);
```
                            * and the result would be similar to the example below according to the following defintion in EBS:
                            * ![Entersoft Survey Marketing Campaign](images/api/es012propertySet.png)
                            *
                            * ![Entersoft Survey Definition](images/api/es013propertySet.png)
                            *
                            * ![Entersoft Survey Choice List](images/api/es014propertySet.png)
                            *
                            * and the JSON model for this definition would be as follows:
```js
{
    "GID": "254feeb8-b56e-4c57-bcd3-6c023b085cc6",
    "Code": "usage_s1",
    "Description": "Survey for RFA Usage",
    "ESDCreated": "2015-12-07T15:46:05.193",
    "ESUCreated": "ADMIN",
    "ESDModified": "0001-01-01T00:00:00",
    "Inactive": false,
    "Type": 1,
    "MobileSurvey": false,
    "Lines": [{
        "GID": "184b1993-db48-4c38-ac39-b31958b6cf0c",
        "fPropertySetGID": "254feeb8-b56e-4c57-bcd3-6c023b085cc6",
        "SeqNum": 1,
        "Category_Code": "Γενικές Ερωτήσεις",
        "Category_OrderPriority": 0,
        "ESDModified": "0001-01-01T00:00:00",
        "ESUCreated": "ADMIN",
        "ESDCreated": "2015-12-17T18:34:12.373",
        "Mandatory": true,
        "VisualizationStyle": 0,
        "Inactive": false,
        "PhotoRelated": false,
        "NotApplicable": false,
        "Code": "usage_s1 - Q001",
        "Description": "Profit",
        "PType": 1
    }, {
        "GID": "032d0b05-5fd5-46fa-a909-1cac51c5d766",
        "fPropertySetGID": "254feeb8-b56e-4c57-bcd3-6c023b085cc6",
        "SeqNum": 2,
        "Category_Code": "Ειδικά Στοιχεία",
        "Category_OrderPriority": 0,
        "ESDModified": "2015-12-20T13:02:57.067",
        "ESUModified": "ADMIN",
        "ESUCreated": "ADMIN",
        "ESDCreated": "2015-12-07T15:46:05.263",
        "Mandatory": true,
        "VisualizationStyle": 1,
        "Inactive": false,
        "PhotoRelated": false,
        "NotApplicable": false,
        "Code": "usage_s1 - Q002",
        "Description": "Age",
        "AlternativeDescription": "you should answer with care",
        "PArg": "AgeScale",
        "PType": 4
    }, {
        "GID": "57526e4c-ccf7-4d2b-92f1-754d31590771",
        "fPropertySetGID": "254feeb8-b56e-4c57-bcd3-6c023b085cc6",
        "SeqNum": 3,
        "Category_Code": "Ειδικά Στοιχεία",
        "Category_OrderPriority": 0,
        "ESDModified": "2015-12-17T18:34:12.353",
        "ESUModified": "ADMIN",
        "ESUCreated": "ADMIN",
        "ESDCreated": "2015-12-07T15:46:05.32",
        "Mandatory": true,
        "VisualizationStyle": 2,
        "Inactive": false,
        "PhotoRelated": false,
        "NotApplicable": false,
        "Code": "usage_s1 - Q003",
        "Description": "Colors",
        "PArg": "ColorsType",
        "PType": 14
    }, {
        "GID": "f4af1a79-16ee-45fa-b7fd-31654fd6876a",
        "fPropertySetGID": "254feeb8-b56e-4c57-bcd3-6c023b085cc6",
        "SeqNum": 4,
        "Category_Code": "Εμπορικά Θέματα",
        "Category_OrderPriority": 0,
        "ESDModified": "2015-12-17T18:34:12.353",
        "ESUModified": "ADMIN",
        "ESUCreated": "ADMIN",
        "ESDCreated": "2015-12-07T15:46:05.34",
        "Mandatory": true,
        "VisualizationStyle": 4,
        "Inactive": false,
        "PhotoRelated": false,
        "NotApplicable": false,
        "Code": "ES.YesNoDontKnow",
        "Description": "Σας αρέσει το EBS?",
        "PArg": "ES.YesNoDontKnow",
        "PType": 4
    }, {
        "GID": "753e2d67-28df-4054-877c-2706f8179711",
        "fPropertySetGID": "254feeb8-b56e-4c57-bcd3-6c023b085cc6",
        "SeqNum": 5,
        "Category_Code": "Εμπορικά Θέματα",
        "Category_OrderPriority": 0,
        "ESDModified": "2015-12-17T18:34:12.353",
        "ESUModified": "ADMIN",
        "ESUCreated": "ADMIN",
        "ESDCreated": "2015-12-07T15:46:05.34",
        "Mandatory": true,
        "VisualizationStyle": 0,
        "Inactive": false,
        "PhotoRelated": false,
        "NotApplicable": false,
        "Code": "usage_s1 - Q005",
        "Description": "Άλλα Στοιχεια",
        "PType": 0
    }, {
        "GID": "1708e894-c3c7-446c-8af7-595c07233cb2",
        "fPropertySetGID": "254feeb8-b56e-4c57-bcd3-6c023b085cc6",
        "SeqNum": 6,
        "Category_Code": "Εμπορικά Θέματα",
        "Category_OrderPriority": 0,
        "ESDModified": "2015-12-17T18:34:12.357",
        "ESUModified": "ADMIN",
        "ESUCreated": "ADMIN",
        "ESDCreated": "2015-12-07T15:46:05.343",
        "Mandatory": true,
        "VisualizationStyle": 0,
        "Inactive": false,
        "PhotoRelated": false,
        "NotApplicable": false,
        "Code": "usage_s1 - Q006",
        "Description": "Τζίρος",
        "PArg": "3",
        "PType": 1
    }, {
        "GID": "9c79a9d6-6943-42e2-b4af-108e440f9ec9",
        "fPropertySetGID": "254feeb8-b56e-4c57-bcd3-6c023b085cc6",
        "SeqNum": 7,
        "Category_Code": "Εμπορικά Θέματα",
        "Category_OrderPriority": 0,
        "ESDModified": "2015-12-17T18:34:12.357",
        "ESUModified": "ADMIN",
        "ESUCreated": "ADMIN",
        "ESDCreated": "2015-12-07T15:46:05.343",
        "Mandatory": true,
        "VisualizationStyle": 0,
        "Inactive": false,
        "PhotoRelated": false,
        "NotApplicable": false,
        "Code": "usage_s1 - Q007",
        "Description": "Αριθμός Υπαλλήλων",
        "PType": 2
    }, {
        "GID": "4c6a89e2-6d0e-48e0-9a34-c3603019c3d6",
        "fPropertySetGID": "254feeb8-b56e-4c57-bcd3-6c023b085cc6",
        "SeqNum": 8,
        "Category_Code": "Εμπορικά Θέματα",
        "Category_OrderPriority": 0,
        "ESDModified": "2015-12-17T18:34:12.357",
        "ESUModified": "ADMIN",
        "ESUCreated": "ADMIN",
        "ESDCreated": "2015-12-07T15:46:05.343",
        "Mandatory": true,
        "VisualizationStyle": 0,
        "Inactive": false,
        "PhotoRelated": false,
        "NotApplicable": false,
        "Code": "usage_s1 - Q008",
        "Description": "Ετος Ίδρυσης",
        "PType": 3
    }, {
        "GID": "51ca7792-a339-452a-bf68-023029fc7bad",
        "fPropertySetGID": "254feeb8-b56e-4c57-bcd3-6c023b085cc6",
        "SeqNum": 9,
        "Category_Code": "Ερωτηματολόγιο",
        "Category_OrderPriority": 0,
        "ESDModified": "2015-12-17T18:34:12.357",
        "ESUModified": "ADMIN",
        "ESUCreated": "ADMIN",
        "ESDCreated": "2015-12-07T15:46:05.347",
        "Mandatory": true,
        "VisualizationStyle": 0,
        "Inactive": false,
        "PhotoRelated": false,
        "NotApplicable": false,
        "Code": "usage_s1 - Q009",
        "Description": "Εναρξη Ημέρας",
        "PType": 12
    }, {
        "GID": "a408bc3c-75d8-49b7-a989-0c3cbbf686d3",
        "fPropertySetGID": "254feeb8-b56e-4c57-bcd3-6c023b085cc6",
        "SeqNum": 10,
        "Category_Code": "Ερωτηματολόγιο",
        "Category_OrderPriority": 0,
        "ESDModified": "2015-12-17T18:34:12.357",
        "ESUModified": "ADMIN",
        "ESUCreated": "ADMIN",
        "ESDCreated": "2015-12-07T15:46:05.347",
        "Mandatory": true,
        "VisualizationStyle": 0,
        "Inactive": false,
        "PhotoRelated": false,
        "NotApplicable": false,
        "Code": "usage_s1 - Q010",
        "Description": "Ραντεβού",
        "PType": 11
    }, {
        "GID": "f1e8406c-418a-4aa1-b1fe-e57e4aca09b7",
        "fPropertySetGID": "254feeb8-b56e-4c57-bcd3-6c023b085cc6",
        "SeqNum": 11,
        "Category_Code": "Ερωτηματολόγιο",
        "Category_OrderPriority": 0,
        "ESDModified": "2015-12-17T18:34:12.36",
        "ESUModified": "ADMIN",
        "ESUCreated": "ADMIN",
        "ESDCreated": "2015-12-07T15:46:05.35",
        "Mandatory": true,
        "VisualizationStyle": 0,
        "Inactive": false,
        "PhotoRelated": false,
        "NotApplicable": false,
        "Code": "usage_s1 - Q011",
        "Description": "Κατανομή Εσόδων",
        "PArg": "9",
        "PType": 15
    }, {
        "GID": "ce67f1ec-0ffb-4046-b2d9-512cf16ed7bc",
        "fPropertySetGID": "254feeb8-b56e-4c57-bcd3-6c023b085cc6",
        "SeqNum": 12,
        "Category_Code": "Γενικές Ερωτήσεις",
        "Category_OrderPriority": 0,
        "ESDModified": "0001-01-01T00:00:00",
        "ESUCreated": "ADMIN",
        "ESDCreated": "2015-12-17T19:36:02.473",
        "Mandatory": true,
        "VisualizationStyle": 0,
        "Inactive": false,
        "PhotoRelated": false,
        "NotApplicable": false,
        "Code": "usage_s1 - Q012",
        "Description": "Statisfaction",
        "AlternativeDescription": "0=δυσαρεστημένος και με το 5=ευχαριστημένος",
        "PArg": "5Scale",
        "PType": 4
    }, {
        "GID": "a3064835-afe2-4da9-bc90-db17d3980e33",
        "fPropertySetGID": "254feeb8-b56e-4c57-bcd3-6c023b085cc6",
        "SeqNum": 13,
        "Category_Code": "Ειδικά Στοιχεία",
        "Category_OrderPriority": 0,
        "ESDModified": "2015-12-20T13:02:57.48",
        "ESUModified": "ADMIN",
        "ESUCreated": "ADMIN",
        "ESDCreated": "2015-12-18T10:51:01.857",
        "Mandatory": true,
        "VisualizationStyle": 0,
        "Inactive": false,
        "PhotoRelated": false,
        "NotApplicable": false,
        "Code": "usage_s1 - Q013",
        "Description": "Πώς αξιολογείτε την Υποστήριξη",
        "AlternativeDescription": "0 = χαμηλά 4 = άριστα",
        "PArg": "9",
        "PType": 2
    }, {
        "GID": "00c75e94-a9e6-42a9-b5b0-e9b1f48cc0e9",
        "fPropertySetGID": "254feeb8-b56e-4c57-bcd3-6c023b085cc6",
        "SeqNum": 14,
        "Category_Code": "Γενικές Ερωτήσεις",
        "Category_OrderPriority": 0,
        "ESDModified": "0001-01-01T00:00:00",
        "ESUCreated": "ADMIN",
        "ESDCreated": "2015-12-21T08:57:06.54",
        "Mandatory": true,
        "VisualizationStyle": 0,
        "Inactive": false,
        "PhotoRelated": false,
        "NotApplicable": false,
        "Code": "usage_s1 - Q014",
        "Description": "Χώρα Προέλευσης",
        "PArg": "ESGOZCountry",
        "PType": 4
    }, {
        "GID": "57aaa798-9d49-499f-8807-4ce9daef6260",
        "fPropertySetGID": "254feeb8-b56e-4c57-bcd3-6c023b085cc6",
        "SeqNum": 15,
        "Category_Code": "Γενικές Ερωτήσεις",
        "Category_OrderPriority": 0,
        "ESDModified": "0001-01-01T00:00:00",
        "ESUCreated": "ADMIN",
        "ESDCreated": "2015-12-21T09:35:19.923",
        "Mandatory": true,
        "VisualizationStyle": 0,
        "Inactive": false,
        "PhotoRelated": false,
        "NotApplicable": false,
        "Code": "usage_s1 - Q015",
        "Description": "Μερίδιο Αγοράς",
        "PType": 15
    }],
    "Choices": [{
        "ChoiceCode": "5Scale",
        "Code": "0",
        "Description": "Καθόλου Ικανοποιημένος",
        "Value": "0",
        "OrderPriority": 1
    }, {
        "ChoiceCode": "5Scale",
        "Code": "1",
        "Description": "-",
        "Value": "1",
        "OrderPriority": 2
    }, {
        "ChoiceCode": "5Scale",
        "Code": "22",
        "Description": "-",
        "Value": "22",
        "OrderPriority": 3
    }, {
        "ChoiceCode": "5Scale",
        "Code": "33",
        "Description": "-",
        "Value": "33",
        "OrderPriority": 4
    }, {
        "ChoiceCode": "5Scale",
        "Code": "4",
        "Description": "Εξαιρετικά Ικανοποιημένος",
        "Value": "4",
        "OrderPriority": 5
    }, {
        "ChoiceCode": "AgeScale",
        "Code": "1",
        "Description": "18-25",
        "Value": "1",
        "OrderPriority": 1
    }, {
        "ChoiceCode": "AgeScale",
        "Code": "2",
        "Description": "26-35",
        "Value": "2",
        "OrderPriority": 2
    }, {
        "ChoiceCode": "AgeScale",
        "Code": "3",
        "Description": ">36",
        "Value": "3",
        "OrderPriority": 3
    }, {
        "ChoiceCode": "ColorsType",
        "Code": "1",
        "Description": "Red",
        "Value": "1",
        "OrderPriority": 1
    }, {
        "ChoiceCode": "ColorsType",
        "Code": "2",
        "Description": "Green",
        "Value": "2",
        "OrderPriority": 2
    }, {
        "ChoiceCode": "ColorsType",
        "Code": "3",
        "Description": "Blue",
        "Value": "3",
        "OrderPriority": 3
    }, {
        "ChoiceCode": "ES.YesNoDontKnow",
        "Code": "55",
        "Description": "Όχι",
        "Value": "55",
        "AlternativeDescription": "No",
        "OrderPriority": 1
    }, {
        "ChoiceCode": "ES.YesNoDontKnow",
        "Code": "Yes",
        "Description": "Ναι",
        "Value": "1",
        "AlternativeDescription": "Yes",
        "OrderPriority": 2
    }, {
        "ChoiceCode": "ES.YesNoDontKnow",
        "Code": "DontKnow",
        "Description": "Δεν γνωρίζω/Δεν απαντώ",
        "Value": "2",
        "AlternativeDescription": "Don't know",
        "OrderPriority": 3
    }],
    "Sections": [{
        "Code": "Γενικές Ερωτήσεις",
        "Description": "Γενικές Ερωτήσεις",
        "Inactive": false,
        "OrderPriority": 0
    }, {
        "Code": "Ειδικά Στοιχεία",
        "Description": "Ειδικά Χαρακτηριστικά Είδους",
        "Inactive": false,
        "OrderPriority": 0
    }, {
        "Code": "Εμπορικά Θέματα",
        "Description": "Εμπορικά Θέματα Είδους",
        "Inactive": false,
        "OrderPriority": 0
    }, {
        "Code": "Ερωτηματολόγιο",
        "Description": "Ερωτηματολόγιο",
        "Inactive": false,
        "OrderPriority": 0
    }]
}
``` 
                            */
                            fetchPropertySet: function(psCode, campaignGID) {
                                if (!psCode) {
                                    throw new Error("Invalid parameter");
                                }

                                if (campaignGID) {
                                    psCode = psCode + "/" + campaignGID;
                                }

                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__FETCH_ESPROPERTY_SET__, psCode);
                                var tt = esGlobals.trackTimer("FETCH", "PROPERTY_SET", psCode);
                                tt.startTime();

                                var ht = $http({
                                    method: 'get',
                                    headers: prepareHeaders(),
                                    url: surl
                                });
                                return processWEBAPIPromise(ht, tt);
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchESScale
                             * @methodOf es.Services.Web.esWebApi
                             * @kind function
                             * @description This function returns a scale object as it is defined in the Entersoft Application Server ESGOZScales
                             * @param {string} scaleCode The string code of the ESGOScale object we want to retrieve
                             * @return {object} If success i.e. function(ret) { ...} the ret contains the JSON representation of the ESGOScaleObject
                             * @example
```js
var ret = {
                                    "GID": "78bd32f1-398d-4779-850c-7ae4f0bc2290",
                                    "Code": "AgeScale",
                                    "Description": "Age scale",
                                    "InternationalID": "ES.AgeScale",
                                    "Inactive": false,
                                    "ESSystem": true,
                                    "Ranges": [{
                                        "GID": "d9a19f99-6f34-4a7d-aab8-288f77c6ee9d",
                                        "fScaleGID": "78bd32f1-398d-4779-850c-7ae4f0bc2290",
                                        "SeqNum": 1,
                                        "Code": "18-24",
                                        "Inactive": false,
                                        "MinValue": 0,
                                        "MaxValue": 24,
                                        "ImageIndex": 0,
                                        "ColorARGB": -103
                                    }, {
                                        "GID": "6eed297b-f7cb-4c06-9215-0276c424e39a",
                                        "fScaleGID": "78bd32f1-398d-4779-850c-7ae4f0bc2290",
                                        "SeqNum": 2,
                                        "Code": "25-34",
                                        "Inactive": false,
                                        "MinValue": 24,
                                        "MaxValue": 34,
                                        "ImageIndex": 0,
                                        "ColorARGB": -7876885
                                    }, {
                                        "GID": "cdf25cd5-1cf3-4f81-8b99-9a4f6907ecc8",
                                        "fScaleGID": "78bd32f1-398d-4779-850c-7ae4f0bc2290",
                                        "SeqNum": 3,
                                        "Code": "35-44",
                                        "Inactive": false,
                                        "MinValue": 34,
                                        "MaxValue": 44,
                                        "ImageIndex": 0,
                                        "ColorARGB": -1146130
                                    }, {
                                        "GID": "b63498c2-b104-4adb-b316-31c7b889b2f5",
                                        "fScaleGID": "78bd32f1-398d-4779-850c-7ae4f0bc2290",
                                        "SeqNum": 4,
                                        "Code": "45-54",
                                        "Inactive": false,
                                        "MinValue": 44,
                                        "MaxValue": 54,
                                        "ImageIndex": 0,
                                        "ColorARGB": -16776961
                                    }, {
                                        "GID": "e39f3163-e71a-43d6-9a04-bf09b2ba129d",
                                        "fScaleGID": "78bd32f1-398d-4779-850c-7ae4f0bc2290",
                                        "SeqNum": 5,
                                        "Code": "55-64",
                                        "Inactive": false,
                                        "MinValue": 54,
                                        "MaxValue": 64,
                                        "ImageIndex": 0,
                                        "ColorARGB": -16744448
                                    }, {
                                        "GID": "2a871edb-1732-4f2a-863e-7dc9cacd752c",
                                        "fScaleGID": "78bd32f1-398d-4779-850c-7ae4f0bc2290",
                                        "SeqNum": 6,
                                        "Code": "65+",
                                        "Inactive": false,
                                        "MinValue": 64,
                                        "MaxValue": 130,
                                        "ImageIndex": 0,
                                        "ColorARGB": -65536
                                    }]
                                };

```
                             **/
                            fetchESScale: function(scaleCode) {
                                if (!scaleCode) {
                                    throw new Error("Invalid parameter");
                                }
                                scaleCode = scaleCode.toLowerCase();

                                var deferred = $q.defer();
                                var cItem = esCache.getItem("ESGOSCALE_" + scaleCode);
                                if (cItem) {
                                    $timeout(function() {
                                        deferred.resolve(cItem);
                                    });
                                    return deferred.promise;
                                }

                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__FETCH_ESSCALE__, scaleCode);
                                var tt = esGlobals.trackTimer("FETCH", "FETCH_SCALE", scaleCode);
                                tt.startTime();

                                var ht = $http({
                                    method: 'get',
                                    headers: prepareHeaders(),
                                    url: surl
                                });
                                processWEBAPIPromise(ht, tt)
                                    .then(function(ret) {
                                        esCache.setItem("ESGOSCALE_" + scaleCode, ret.data);
                                        deferred.resolve(ret.data);
                                    }, function() {
                                        deferred.reject(arguments);
                                    });
                                return deferred.promise;
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fiImportDocument
                             * @methodOf es.Services.Web.esWebApi
                             * @kind function
                             * @description This function imports a ESFIDocument of all the supported classes i.e.(Trade, Cash, Adjustment and Stock) through the FIImportDoc service of the Entersoft Application Server.
                             * @param {string} xmldocstr The XML representation of the financial document to be inserted/updates through the
                             * Entersoft Application Server FIImportDocument service. For more, see the relative {@link http://www.entersoft.gr/KBArticle/%CE%94%CE%B9%CE%B1%CE%B4%CE%B9%CE%BA%CE%B1%CF%83%CE%AF%CE%B1%20%CE%B5%CE%B9%CF%83%CE%B1%CE%B3%CF%89%CE%B3%CE%AE%CF%82%20%CF%80%CE%B1%CF%81%CE%B1%CF%83%CF%84%CE%B1%CF%84%CE%B9%CE%BA%CF%8E%CE%BD%20%CE%B1%CF%80%CF%8C%20XML/MEMBERS_slh_KnowledgeBase Entersoft Knowledge Base article}.
                             * @return {httpPromise} If success i.e. function(ret) { ...} the ret.data contains the string result of the FIImportDocument function.
                             */
                            fiImportDocument: function(xmldocstr) {

                                if (!xmldocstr) {
                                    throw new Error("xmldocstr is not a valid string");
                                }

                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__FI_IMPORTDOCUMENT___);
                                var tt = esGlobals.trackTimer("ESGENERAL", "FIMPORTDOCUMENT");
                                tt.startTime();

                                var ht = $http({
                                    method: 'post',
                                    headers: prepareHeaders(),
                                    url: surl,
                                    data: xmldocstr
                                });
                                return processWEBAPIPromise(ht, tt);

                            },

                            /** 
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchES00DocumentBlobDataByGID
                             * @methodOf es.Services.Web.esWebApi
                             * @kind function
                             * @description This function returns the arraybuffer for the document stored in **ES00Document** as **BLOBDATA** for a given by GID ES00Document record.
                             * 
                             * **REQUIRES ESWebAPIServer >= 1.7.9**
                             * 
                             * @param {string} es00DocumentGID The GID of the ES00Document record the blobdata of which we are looking for.
                             * @return {httpPromise} If success i.e. function(ret) { ...} the ret.data contains the **arraybuffer** of the contents of the file stored in **blobdata** in the ES00Document record specified by its GID key.
                             * @example
```js
```
                             **/
                            fetchES00DocumentBlobDataByGID: function(es00documentGID) {
                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__FETCH_ES00DOCUMENT_BLOBDATA_BY_GID__, es00documentGID);
                                var tt = esGlobals.trackTimer("ES00DOCUMENT_BLOBDATA", "FETCH", es00documentGID);
                                tt.startTime();

                                var httpConfig = {
                                    method: 'GET',
                                    headers: prepareHeaders({
                                        "Authorization": esGlobals.getWebApiToken(),
                                        "Accept": undefined
                                    }),
                                    url: surl,
                                    params: {
                                        base64: false
                                    },
                                    responseType: 'arraybuffer',
                                };
                                var ht = $http(httpConfig);
                                return processWEBAPIPromise(ht, tt);
                            },

                            /**
                             @ngdoc function
                             * @name es.Services.Web.esWebApi#getMimeTypes
                             * @methodOf es.Services.Web.esWebApi
                             * @kind function
                             * @description This function returns an array of JSON objects representing the Mime types that the ES WEB API server supports
                             * @return {object[]} Array of json objects of the form {mime: string, extension: string, IsText: boolean}
                             * @example
```js
esWebApi.getMimeTypes()
    .then(function(ret) {
        $scope.pMimeTypes = JSON.stringify(ret);
    },
    function(err) {
        $scope.pMimeTypes = JSON.stringify(err);
    });

// The result will be like:
[{
    "mime": "application/andrew-inset",
    "extension": ["ez"],
    "IsText": false
}, {
    "mime": "application/applixware",
    "extension": ["aw"],
    "IsText": false
}, {
    "mime": "application/atom+xml",
    "extension": ["atom"],
    "IsText": false
},
...
]

```
                             */
                            getMimeTypes: fGetMimeTypes,


                            /** 
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchES00DocumentByGID
                             * @methodOf es.Services.Web.esWebApi
                             * @kind function
                             * @description This function returns the JSON object for the record of the ES00Document object that matches the es00DocumentGID parameter. 
                             * 
                             * **REQUIRES ESWebAPIServer >= 1.7.9**
                             * 
                             * @param {string} es00DocumentGID The GID of the ES00Document record that we are looking for
                             * @return {httpPromise} If success i.e. function(ret) { ...} the ret.data contains the JSON representation of the ES00Document record for the specific GID.
                             * The JSON object is of the form:
```js
// a sample document
var sampleDoc = {
    "GID": "cdb000bb-e7a1-49bf-a216-e11c192c3bcc",
    "Code": "0000029",
    "Title": "test",
    "Caption": "this is a caption",
    "EDate": "2015-09-21T00:00:00",
    "FType": ".pdf",
    "TableID": "ESTMTask",
    "TableName": "ESTMTask",
    "fGID": "611b490c-f3bc-4d33-9f55-03513e983e28",
    "UNCPath": "C:\\build\\ESDev\\out\\ERP-EL02-F45-Debug\\CSWebAssets\\test\\test.pdf",
    "OriginalPath": "C:\\build\\ESDev\\out\\ERP-EL02-F45-Debug\\CSWebAssets\\test\\test.pdf",
    "OriginalFN": "test",
    "fCompanyCode": "abc",
    "ESDModified": "0001-01-01T00:00:00",
    "ESDCreated": "2015-09-22T10:24:35.617",
    "ESUCreated": "ESMASTER",
    "IsBLOB": true,
    "Ingoing": false,
    "fRLSNodeGID": "00000000-0000-0000-0000-000000000000",
    "BLOBDATALength": 584849
};
```
                             * @example
```js
$scope.fetchES00DocumentByGID = function() {
    esWebApi.fetchES00DocumentByGID($scope.pES00Doc)
        .then(function(ret) {
                $scope.pES00DocResults = ret.data;
            },
            function(err) {
                $scope.pES00DocResults = err;
            });    
}
```

                             */
                            fetchES00DocumentByGID: function(es00DocumentGID) {
                                es00DocumentGID = es00DocumentGID ? es00DocumentGID.trim() : "";
                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__FETCH_ES00DOCUMENT_BY_GID__, es00DocumentGID);
                                var tt = esGlobals.trackTimer("ES00DOCUMENT", "FETCH", es00DocumentGID);
                                tt.startTime();

                                var ht = $http({
                                    method: 'get',
                                    headers: prepareHeaders(),
                                    url: surl
                                });
                                return processWEBAPIPromise(ht, tt);

                            },

                            /** 
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchES00DocumentByCode
                             * @methodOf es.Services.Web.esWebApi
                             * @kind function
                             * @description This function returns the JSON object for the record of the ES00Document object that matches the es00DocumentCode parameter. 
                             * 
                             * **REQUIRES ESWebAPIServer >= 1.7.9**
                             * 
                             * @param {string} es00DocumentCode The Code of the ES00Document record that we are looking for
                             * @return {httpPromise} If success i.e. function(ret) { ...} the ret.data contains the JSON representation of the ES00Document record for the specific doc Code.
                             * The JSON object is of the form:
```js
// a sample document
var sampleDoc = {
    "GID": "cdb000bb-e7a1-49bf-a216-e11c192c3bcc",
    "Code": "0000029",
    "Title": "test",
    "Caption": "this is a caption",
    "EDate": "2015-09-21T00:00:00",
    "FType": ".pdf",
    "TableID": "ESTMTask",
    "TableName": "ESTMTask",
    "fGID": "611b490c-f3bc-4d33-9f55-03513e983e28",
    "UNCPath": "C:\\build\\ESDev\\out\\ERP-EL02-F45-Debug\\CSWebAssets\\test\\test.pdf",
    "OriginalPath": "C:\\build\\ESDev\\out\\ERP-EL02-F45-Debug\\CSWebAssets\\test\\test.pdf",
    "OriginalFN": "test",
    "fCompanyCode": "abc",
    "ESDModified": "0001-01-01T00:00:00",
    "ESDCreated": "2015-09-22T10:24:35.617",
    "ESUCreated": "ESMASTER",
    "IsBLOB": true,
    "Ingoing": false,
    "fRLSNodeGID": "00000000-0000-0000-0000-000000000000",
    "BLOBDATALength": 584849
};
```
                             * @example
```js
$scope.fetchES00DocumentByCode = function() {
    esWebApi.fetchES00DocumentByCode($scope.pES00Doc)
        .then(function(ret) {
                $scope.pES00DocResults = ret.data;
            },
            function(err) {
                $scope.pES00DocResults = err;
            });    
}
```
                             */
                            fetchES00DocumentByCode: function(es00DocumentCode) {
                                es00DocumentCode = es00DocumentCode ? es00DocumentCode.trim() : "";
                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__FETCH_ES00DOCUMENT_BY_CODE__, es00DocumentCode);
                                var tt = esGlobals.trackTimer("ES00DOCUMENT", "FETCH", es00DocumentCode);
                                tt.startTime();

                                var ht = $http({
                                    method: 'get',
                                    headers: prepareHeaders(),
                                    url: surl
                                });
                                return processWEBAPIPromise(ht, tt);

                            },

                            /** 
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#fetchES00DocumentsByEntityGID
                             * @methodOf es.Services.Web.esWebApi
                             * @kind function
                             * @description This function returns an array of JSON objects for the records of type ES00Document that belong to entity with GID equal to entityGID. 
                             * 
                             * **REQUIRES ESWebAPIServer >= 1.7.9**
                             * 
                             * @param {string} entityGID The GID of the entity for which we want to get all the registered ES00Documents
                             * @return {httpPromise} If success i.e. function(ret) { ...} the ret.data contains the array of the JSON representation of the ES00Document records for the specific entity.
                             * The JSON object is of the form:
```js
// a sample document
var listOfDocs = [{
    "GID": "cdb000bb-e7a1-49bf-a216-e11c192c3bcc",
    "Code": "0000029",
    "Title": "test",
    "Caption": "this is a caption",
    "EDate": "2015-09-21T00:00:00",
    "FType": ".pdf",
    "TableID": "ESTMTask",
    "TableName": "ESTMTask",
    "fGID": "611b490c-f3bc-4d33-9f55-03513e983e28",
    "UNCPath": "C:\\build\\ESDev\\out\\ERP-EL02-F45-Debug\\CSWebAssets\\test\\test.pdf",
    "OriginalPath": "C:\\build\\ESDev\\out\\ERP-EL02-F45-Debug\\CSWebAssets\\test\\test.pdf",
    "OriginalFN": "test",
    "fCompanyCode": "abc",
    "ESDModified": "0001-01-01T00:00:00",
    "ESDCreated": "2015-09-22T10:24:35.617",
    "ESUCreated": "ESMASTER",
    "IsBLOB": true,
    "Ingoing": false,
    "fRLSNodeGID": "00000000-0000-0000-0000-000000000000",
    "BLOBDATALength": 584849
},
//...
// ...
]};
```
                             * @example
```js
$scope.fetchES00DocumentsByEntityGID = function() {
    esWebApi.fetchES00DocumentsByEntityGID($scope.pES00Doc)
        .then(function(ret) {
                $scope.pES00DocResults = ret.data;
            },
            function(err) {
                $scope.pES00DocResults = err;
            });    
}
```
                             */
                            fetchES00DocumentsByEntityGID: function(entityGID) {
                                entityGID = entityGID ? entityGID.trim() : "";
                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__FETCH_ES00DOCUMENT_BY_ENTITYGID__, entityGID);
                                var tt = esGlobals.trackTimer("ES00DOCUMENT_S", "FETCH", entityGID);
                                tt.startTime();

                                var ht = $http({
                                    method: 'get',
                                    headers: prepareHeaders(),
                                    url: surl
                                });
                                return processWEBAPIPromise(ht, tt);
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#deleteES00Document
                             * @methodOf es.Services.Web.esWebApi
                             * @kind function
                             * @description Deletes the ES00DocumentInfo record as specified by the parameters and returns the current set of ES00Documents
                             * that are corelated to the specified Entity object
                             * @param {object} es00Document The JSON object representation of the ES00Documen to be deleted. The following attributes are mandatory:
                             * * __GID__
                             * * __TableID__
                             * * __TableName__
                             * * __fGID__
                             * @example
```js
 $scope.deleteES00Document = function() {
    esWebApi.deleteES00Document($scope.pEntityType, $scope.pEntityGID, $scope.pDocumentGID)
        .then(function(ret) {
                $scope.pES00DocResults = ret.data;
            },
            function(err) {
                $scope.pES00DocResults = err;
            });
}
```
                             */
                            deleteES00Document: function(es00Document) {
                                es00Document = es00Document || {};

                                if (!es00Document.TableID || !es00Document.TableName || !es00Document.GID || !es00Document.fGID) {
                                    throw new Error("Invalid parameter. One or more of the properties TableID, TableName, fGID and GID are not specified");
                                }

                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__DELETE_ES00DOCUMENT__);
                                var tt = esGlobals.trackTimer("ES00DOCUMENT_S", "DELETE", es00Document.GID);
                                tt.startTime();

                                var ht = $http({
                                    method: 'post',
                                    headers: prepareHeaders(),
                                    url: surl,
                                    data: es00Document
                                });
                                return processWEBAPIPromise(ht, tt);
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#addOrUpdateES00Document
                             * @methodOf es.Services.Web.esWebApi
                             * @kind function
                             * @description Deletes the ES00DocumentInfo record as specified by the parameters and returns the current set of ES00Documents
                             * that are corelated to the specified Entity object. 
                             * 
                             * __ATTENTION__ 
                             * 
                             * This method requires the ngFileUpload module of AngularJS. In order to use it you must make sure that the appropriate js libraries have been loaded.
                             * For example, in the main html file e.g. index.html of the AngularJS application you have to include the ng-file-upload/ng-file-upload-shim.min.js prior to loading the angular library
                             * and the ng-file-upload/ng-file-upload.min.js just after the Angular library has been loaded, as shown in the example below:
```html
    <script src="bower_components/ng-file-upload/ng-file-upload-shim.min.js"></script>
    <script src="bower_components/angular/angular.js"></script>
    <script src="bower_components/ng-file-upload/ng-file-upload.min.js"></script>
```
                             * Also in your application Angular controller module or application module you should also require the ngFileUpload module as 
                             * shown in the code below:
```js
    var smeControllers = angular.module('smeControllers', ['kendo.directives', 'underscore', 'es.Web.UI', 'ui.bootstrap', 'uiGmapgoogle-maps', 'ngFileUpload']);
```
                             * And in the AngularJS application controller function you should inject the _Upload_ service as shown below:
```js
    smeControllers.controller('examplesCtrl', ['$log', '$q', '$scope', 'Upload', 'esWebApi', 'esUIHelper', 'esGlobals', 'esCache', 'esGeoLocationSrv', 'uiGmapGoogleMapApi',
    function($log, $q, $scope, Upload, esWebApi, esWebUIHelper, esGlobals, esCache, esGeoLocationSrv, GoogleMapApi) {
        // your application code
        // goes here
}
```
                             * @param {object} doc The JSON object representation of the ES00Document to be added or updated (in case that it exists)
                             * @param {file} file The file object holding the value of the <input> element of type file
                             * @param {function=} okfunc a function that will be called when the upload is completed
                             * @param {function=} errfunc a function that will called should an error occurs while uploading the file
                             * @param {function=} progressfunc a function that will be called as many times as necessary to indicate the progress of the
                             * uploading of the file i.e. to inform the user about the percentage of the bytes that have been uploaded so far
                             * @return {Upload} An object of type Upload. For detailed documentation please visit {@link https://github.com/danialfarid/ng-file-upload ng-file-upload}.
                             * @example
```js
 $scope.uploadPic = function(myFile) {
    var okf = function(retFile) {
        $log.info("file uploaded ....");
    };

    var errf = function(response) {
        if (response.status > 0)
            $scope.errorMsg = response.status + ': ' + response.data;
        else {
            $scope.errorMsg = "Ooops something wnet wrong";
        }
        $log.error($scope.errorMsg);
    };

    var progressf = function(evt) {
        myFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    };

    var doc = {
        "GID": "3536eaa3-6c67-4d15-a8d9-3519711969c9",
        "Title": "Hello File",
        "Description": $scope.username,
        "Caption": "Tehcnical Guide for Hello File",
        "OriginalFN": "xxx.pdf"
    };

    esWebApi.addES00Document(doc, myFile, okf, errf, progressf);
}
```
                             */
                            addOrUpdateES00Document: function(doc, file, okfunc, errfunc, progressfunc) {
                                var tt = esGlobals.trackTimer("ES00DOCUMENT_S", "UPLOAD", file);
                                tt.startTime();

                                if (!file) {
                                    throw new Error("Invalid File");
                                }

                                var Upload = $injector.get('Upload');
                                if (!Upload) {
                                    throw new Error("You have to include the ngFileUpload");
                                }

                                file.upload = Upload.upload({
                                    url: urlWEBAPI.concat(ESWEBAPI_URL.__ADD_OR_UPDATE_ES00DOCUMENT_BLOBDATA__),
                                    method: 'POST',
                                    headers: prepareHeaders(),
                                    fields: {
                                        esdoc: JSON.stringify(doc)
                                    },
                                    file: file,
                                });


                                file.upload.then(function(response) {
                                    $timeout(function() {
                                        file.result = response.data;
                                        tt.endTime().send();
                                        okfunc(file);
                                    });
                                }, errfunc);

                                file.upload.progress(progressfunc);

                                return file.upload;

                            },

                            /** 
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#eSearch
                             * @methodOf es.Services.Web.esWebApi
                             * @kind function
                             * @description This function acts as a facade to the Elastic Search Engine that has been registered with Entersoft WEB API Server.
                             * This function allows for almost any kind of operation can be executed by the ElasticSearch engine as an http method (i.e. GET, PUT, DELETE, POST, etc.)
                             * {@link es.Services.Web.esElasticSearch#methods_searchIndex searchIndex}.
                             * @param {string} eUrl the last segment of the URL (i.e. without the domain name) that contains the REST api part 
                             * e.g. twitter/_settings,_mappings (the full CURL type request URL would be http://localhost:9200/twitter/_settings,_mappings). 
                             * This call is an example from ElasticSearch documentation {@link https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-get-index.html GetIndex}
                             * that retrieves the settings and the mappings for the twitter index.
                             * @param {string} eMethod The http method verb (i.e. "GET", "PUT", "DELETE", "POST", etc.). In the example above the verb should be "GET"
                             * the index or indices specified by the elasticSearchIndex parameter.
                             * @param {string} eBody The http request payload as required by the ElasticSearch REST call we are executing. In the example above there is no payload so it would be emtpy or null.
                             * @return {httpPromise} The response that we get from Elastic Search service should we perform an AJAX call against the service
                             * 
                             */
                            eSearch: function(eUrl, eMethod, eBody) {
                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__ELASTICSEARCH__, eUrl);
                                var tt = esGlobals.trackTimer("ELASTIC_SEARCH", eMethod || "", eBody || "");
                                tt.startTime();

                                var ht = $http({
                                    method: eMethod,
                                    headers: prepareHeaders(),
                                    url: surl,
                                    data: eBody
                                }).success(function(data) {
                                    // if google analytics are enabled register the exception as well
                                    tt.endTime().send();
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
                                        tt.endTime().send();
                                        fregisterException(err);
                                    } catch (exc) {

                                    }
                                });

                                return processWEBAPIPromise(ht);
                            }
                        }
                    }
                ]
            }
        }
    );

    /**
     * @ngdoc service
     * @name es.Services.Web.esElasticSearch
     * @module es.Services.Web
     * @kind factory
     * @sortOrder 500
     * @description esElasticSerach is a facade provided by the ES WEB API in order to facilitate and secure the access to an Elastic Search, registered 
     * in the ES WEB API Server through the esWebApi service. All the calls are actually passed through to the registeredto the Entersoft WEB API Server
     * ElasticSearch engine.
     *
     * For more information about ElasticSearch please visit {@link https://www.elastic.co/ ElasticSearch} 
     * and for the complete reference guide visit {@link https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html Reference Guide}.
     *
     * #**ES WEB API Server and ElasticSearch**
     * In order to be able to use the esElasticSearch service of the Entersoft AgnularJS API, you have first to **register** to the {@link installation/es02wapis#Elastic-Search ES WEB API Server} 
     * the ElasticSearch engine that will be serve the queries of the service. 
     */
    esWebServices.factory('esElasticSearch', ['esWebApi',
        function(esWebApi) {
            return {
                /** 
                 * @ngdoc function
                 * @name es.Services.Web.esElasticSearch#searchIndex
                 * @methodOf es.Services.Web.esElasticSearch
                 * @kind function
                 * @description This function acts as a facade to the Elastic Search Engine that has been registered with Entersoft WEB API Server for the
                 * **Search** service based on the elastic search query language. This is the most common scenario of Elastic Search usage i.e. querying the Elastic Search database
                 * within the scope of one or more indices. See also {@link es.Services.Web.esElasticSearch#methods_searchIndexAndDocument searchIndexAndDocument}.
                 * @param {string} elasticSearchIndex The Elastic Search index name or comma separated index names or reg expression resolving to index - indices to which the _elasticSearchQuery_ statement will be executed against.
                 * @param {string} elasticSearchQuery The Elastic Search valid statement - query to be executed. For more information about ElsticSearch Query Language
                 * please visit {@link https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html ES Query DSL}.
                 * @return {httpPromise} The response that we get from Elastic Search service should we perform an AJAX call against the service
                 * @example
    ```js
// This example is taken from the Entersoft Knowledge Base WEB Application that is powered by the Entersoft AngularJS WEB API and the ElasticSearch
var esQuery = {
    "size": 10,
    "from": 0,
    "fields": ["Code", "Title", "Description", "Caption", "FType", "EDate", "RegistrationDate", "ArticleType", "DocCategoryCode", "Rating", "GID", "Product", "SEO", "Tag"],
    "query": {
        "filtered": {
            "query": {
                "multi_match": {
                    "query": "version mobile",
                    "fields": ["file", "Notes", "Description", "Title"]
                }
            },
            "filter": {
                "bool": {
                    "must": []
                }
            }
        }
    },
    "track_scores": true,
    "sort": [{
        "_score": "desc"
    }],
    "highlight": {
        "pre_tags": ["<em highlight=\"green\">", "<em highlight=\"orange\" >", "<em highlight=\"red\">"],
        "post_tags": ["</em>", "</em>", "</em>"],
        "fields": {
            "file": {
                "fragment_size": 250,
                "number_of_fragments": 1,
                "no_match_size": 100
            },
            "Notes": {
                "fragment_size": 250,
                "number_of_fragments": 1,
                "no_match_size": 100
            },
            "Title": {
                "fragment_size": 250,
                "number_of_fragments": 1,
                "no_match_size": 100
            },
            "Description": {
                "fragment_size": 250,
                "number_of_fragments": 1,
                "no_match_size": 100
            }
        }
    },
    "aggs": {
        "type": {
            "terms": {
                "field": "ArticleType.raw",
                "size": 0
            }
        },
        "product": {
            "terms": {
                "field": "Product",
                "size": 0
            }
        },
        "tags": {
            "terms": {
                "field": "Tags.raw",
                "size": 15
            }
        },
        "articleYear": {
            "date_histogram": {
                "min_doc_count": 0,
                "field": "RegistrationDate",
                "interval": "year",
                "format": "yyyy",
                "order": {
                    "_key": "desc"
                }
            }
        },
        "ftype": {
            "terms": {
                "field": "FType",
                "size": 0
            }
        }
    }
};

esElasticSearch.searchIndex("esknow", esQuery)
    .then(function(ret)
    {
        var esQueryResults = ret.data;
        $log.information("This query took " + esQueryResults.took + " ms to run");
        $log.information("Max scored Results " + esQueryResults.hits.max_score);
        $log.information("Total Number of Results " + esQueryResults.hits.total);
        $log.information("Results " + esQueryResults.hits.hits);

    });
```
                 * A sample response for this query is:
```js
// i.e. ret.data
var resp = {
    "took": 78,
    "timed_out": false,
    "_shards": {
        "total": 5,
        "successful": 5,
        "failed": 0
    },
    "hits": {
        "total": 286,
        "max_score": 0.7949327,
        "hits": [{
            "_index": "esknow",
            "_type": "eskbarticle",
            "_id": "a74fb1a7-3097-4fb2-92e9-8a0c25c7c925",
            "_score": 0.7949327,
            "fields": {
                "GID": ["a74fb1a7-3097-4fb2-92e9-8a0c25c7c925"],
                "Description": ["Online sales ordering via mobile"],
                "RegistrationDate": ["2012-06-01T21:25:42.827Z"],
                "Rating": [0],
                "Tag": ["ΕΜΠΟΡΙΚΟ", "ΛΕΙΤΟΥΡΓΙΚΟ"],
                "SEO": ["/online-sales-ordering-via-mobile/clip-00188"],
                "Code": ["CLIP-00188"]
            },
            "highlight": {
                "Description": ["Online sales ordering via <em highlight=\"orange\" >mobile</em>"],
                "Notes": ["input of key data for bids and sales orders for the salesperson. Structured menus, clear choices, easy movements and help on <em highlight=\"orange\" >mobile</em> or tablet devices without the need for extra training."]
            }
        }, {
            "_index": "esknow",
            "_type": "eskbarticle",
            "_id": "5bd500eb-705a-48f5-8297-283ef543af9b",
            "_score": 0.751858,
            "fields": {
                "GID": ["5bd500eb-705a-48f5-8297-283ef543af9b"],
                "Description": ["Mobile MIS 360° 2.0"],
                "RegistrationDate": ["2012-01-09T17:36:47.000Z"],
                "Rating": [0],
                "Product": ["MIS 360"],
                "SEO": ["/mis-360/new-features/mobile-mis-360-2-0/kb-01003"],
                "Code": ["KB-01003"],
                "ArticleType": ["NEW FEATURES"]
            },
            "highlight": {
                "Description": ["<em highlight=\"orange\" >Mobile</em> MIS 360° 2.0"],
                "Notes": ["Νέα Χαρακτηριστικά & Λειτουργικότητα\nΤα νέα χαρακτηριστικά και οι βελτιώσεις της έκδοσης περιγράφονται"]
            }
        }, {
            "_index": "esknow",
            "_type": "eskbarticle",
            "_id": "441a73c5-46f8-4b22-bb55-743af2d95780",
            "_score": 0.751858,
            "fields": {
                "GID": ["441a73c5-46f8-4b22-bb55-743af2d95780"],
                "Description": ["Mobile Suite 2.62"],
                "RegistrationDate": ["2014-12-19T13:39:44.323Z"],
                "Rating": [0],
                "Product": ["MOBILE"],
                "SEO": ["/mobile/new-features/mobile-suite-2-62/kb-01182"],
                "Code": ["KB-01182"],
                "ArticleType": ["NEW FEATURES"]
            },
            "highlight": {
                "Description": ["<em highlight=\"orange\" >Mobile</em> Suite 2.62"],
                "Notes": ["Summary description of the contents of this <em highlight=\"green\">version</em> \r\nRead a summary description of the contents of this <em highlight=\"green\">version</em>. A more extensive guide follows with customization guidelines follows.\r\n<em highlight=\"green\">Version</em> 2.62 of Entersoft <em highlight=\"orange\" >Mobile</em> Suite can be installed to iOS devices that"]
            }
        }, {
            "_index": "esknow",
            "_type": "eskbarticle",
            "_id": "600a5020-e3bd-4c98-9eab-9668ab7f227c",
            "_score": 0.67971146,
            "fields": {
                "GID": ["600a5020-e3bd-4c98-9eab-9668ab7f227c"],
                "Description": ["Mobile Suite 2.62"],
                "RegistrationDate": ["2014-12-19T13:36:10.900Z"],
                "Rating": [0],
                "Product": ["MOBILE"],
                "SEO": ["/mobile/new-features/mobile-suite-2-62/kb-01181"],
                "Code": ["KB-01181"],
                "ArticleType": ["NEW FEATURES"]
            },
            "highlight": {
                "Description": ["<em highlight=\"orange\" >Mobile</em> Suite 2.62"],
                "Notes": ["κατάλογος των νέων λειτουργιών & βελτιώσεων με οδηγίες χρήσης & παραδείγματα όπου χρειάζεται.\r\nΗ έκδοση 2.62 του Entersoft <em highlight=\"orange\" >Mobile</em> Suite μπορεί να εγκατασταθεί μόνο σε κινητές συσκευές που επικοινωνούν με το Entersoft Business Suite έκδοσης 4.0.26.2 ή μεταγενέστερης"]
            }
        }, {
            "_index": "esknow",
            "_type": "eskbarticle",
            "_id": "0507bdb7-3f3e-4818-801e-9af8fa897fda",
            "_score": 0.67971146,
            "fields": {
                "GID": ["0507bdb7-3f3e-4818-801e-9af8fa897fda"],
                "Description": ["Mobile Suite 2.12"],
                "RegistrationDate": ["2012-02-02T16:12:30.000Z"],
                "Rating": [0],
                "Product": ["MOBILE"],
                "Tag": ["MOBILE", "ΓΕΝΙΚΑ ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ"],
                "SEO": ["/mobile/new-features/mobile-suite-2-12/kb-00961"],
                "Code": ["KB-00961"],
                "ArticleType": ["NEW FEATURES"]
            },
            "highlight": {
                "Description": ["<em highlight=\"orange\" >Mobile</em> Suite 2.12"],
                "Notes": ["Νέα χαρακτηριστικά & Επεκτάσεις\nΣυνοπτική περιγραφή των σημαντικότερων προσθηκών της έκδοσης.\nΠαραστατικά"]
            }
        }, {
            "_index": "esknow",
            "_type": "eskbarticle",
            "_id": "3dbca594-b277-4be0-bb33-f58adc37c8c4",
            "_score": 0.67971146,
            "fields": {
                "GID": ["3dbca594-b277-4be0-bb33-f58adc37c8c4"],
                "Description": ["Mobile Suite 2.12"],
                "RegistrationDate": ["2012-02-02T17:16:11.000Z"],
                "Rating": [0],
                "Product": ["MOBILE"],
                "Tag": ["MOBILE", "ΓΕΝΙΚΑ ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ"],
                "SEO": ["/mobile/new-features/mobile-suite-2-12/kb-00964"],
                "Code": ["KB-00964"],
                "ArticleType": ["NEW FEATURES"]
            },
            "highlight": {
                "Description": ["<em highlight=\"orange\" >Mobile</em> Suite 2.12"],
                "Notes": ["notes, age analysis and status.\nThere is a new button in customer list, which presents the financial info of the customer from <em highlight=\"orange\" >mobile</em> device database: name, phone, tax registration number, tax office, balance, turnover, pending invoices/order etc.\nGeneral"]
            }
        }, {
            "_index": "esknow",
            "_type": "eskbarticle",
            "_id": "a1990c36-63c7-4914-86d4-2d1d4c358c34",
            "_score": 0.65732294,
            "fields": {
                "GID": ["a1990c36-63c7-4914-86d4-2d1d4c358c34"],
                "Description": ["Mobile Suite 2.16"],
                "RegistrationDate": ["2012-04-03T15:47:25.000Z"],
                "Rating": [0],
                "Product": ["MOBILE"],
                "SEO": ["/mobile/new-features/mobile-suite-2-16/kb-01000"],
                "Code": ["KB-01000"],
                "ArticleType": ["NEW FEATURES"]
            },
            "highlight": {
                "Description": ["<em highlight=\"orange\" >Mobile</em> Suite 2.16"],
                "Notes": ["Νέα χαρακτηριστικά & Επεκτάσεις\nΣυνοπτική περιγραφή των σημαντικότερων προσθηκών της έκδοσης.\nΓενικές"]
            }
        }, {
            "_index": "esknow",
            "_type": "eskbarticle",
            "_id": "f17d84d7-e8e6-45c8-a889-44fb14564468",
            "_score": 0.65732294,
            "fields": {
                "GID": ["f17d84d7-e8e6-45c8-a889-44fb14564468"],
                "Description": ["Mobile Suite 2.14"],
                "RegistrationDate": ["2012-02-22T10:20:58.000Z"],
                "Rating": [0],
                "Product": ["MOBILE"],
                "Tag": ["MOBILE", "ΓΕΝΙΚΑ ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ"],
                "SEO": ["/mobile/new-features/mobile-suite-2-14/kb-00970"],
                "Code": ["KB-00970"],
                "ArticleType": ["NEW FEATURES"]
            },
            "highlight": {
                "Description": ["<em highlight=\"orange\" >Mobile</em> Suite 2.14"],
                "Notes": ["Νέα χαρακτηριστικά & Επεκτάσεις\nΣυνοπτική περιγραφή των σημαντικότερων προσθηκών της έκδοσης.\nΠαραστατικά"]
            }
        }, {
            "_index": "esknow",
            "_type": "eskbarticle",
            "_id": "d3aa8714-9125-41b2-9a97-d49c0d4eca70",
            "_score": 0.65732294,
            "fields": {
                "GID": ["d3aa8714-9125-41b2-9a97-d49c0d4eca70"],
                "Description": ["Mobile Suite 2.10"],
                "RegistrationDate": ["2012-01-25T16:17:59.000Z"],
                "Rating": [0],
                "Product": ["MOBILE"],
                "Tag": ["MOBILE", "ΓΕΝΙΚΑ ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ"],
                "SEO": ["/mobile/new-features/mobile-suite-2-10/kb-00962"],
                "Code": ["KB-00962"],
                "ArticleType": ["NEW FEATURES"]
            },
            "highlight": {
                "Description": ["<em highlight=\"orange\" >Mobile</em> Suite 2.10"],
                "Notes": ["Νέα χαρακτηριστικά & Επεκτάσεις\nΣυνοπτική περιγραφή των σημαντικότερων προσθηκών της έκδοσης.\nΠαραστατικά"]
            }
        }, {
            "_index": "esknow",
            "_type": "eskbarticle",
            "_id": "68bc6975-01ee-43f8-8b84-e84e381f46f1",
            "_score": 0.65732294,
            "fields": {
                "GID": ["68bc6975-01ee-43f8-8b84-e84e381f46f1"],
                "Description": ["Entersoft Seminars | ES Mobile (Tech)"],
                "RegistrationDate": ["2015-01-30T16:50:04.853Z"],
                "Rating": [0],
                "Product": ["MOBILE"],
                "SEO": ["/mobile/education/entersoft-seminars--es-mobile-tech/kb-01222"],
                "Code": ["KB-01222"],
                "ArticleType": ["EDUDEF"]
            },
            "highlight": {
                "Description": ["Entersoft Seminars | ES <em highlight=\"orange\" >Mobile</em> (Tech)"],
                "Notes": ["ES <em highlight=\"orange\" >Mobile</em> (Tech)\r\n\r\n"]
            }
        }]
    },
    "aggregations": {
        "product": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [{
                "key": "EBS",
                "doc_count": 60
            }, {
                "key": "EXPERT",
                "doc_count": 51
            }, {
                "key": "MOBILE",
                "doc_count": 11
            }, {
                "key": "ALL",
                "doc_count": 9
            }, {
                "key": "MIS 360",
                "doc_count": 3
            }]
        },
        "ftype": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [{
                "key": ".pdf",
                "doc_count": 102
            }, {
                "key": ".doc",
                "doc_count": 45
            }, {
                "key": ".docx",
                "doc_count": 4
            }]
        },
        "articleYear": {
            "buckets": [{
                "key_as_string": "2015",
                "key": 1420070400000,
                "doc_count": 2
            }, {
                "key_as_string": "2014",
                "key": 1388534400000,
                "doc_count": 3
            }, {
                "key_as_string": "2013",
                "key": 1356998400000,
                "doc_count": 22
            }, {
                "key_as_string": "2012",
                "key": 1325376000000,
                "doc_count": 38
            }, {
                "key_as_string": "2011",
                "key": 1293840000000,
                "doc_count": 17
            }, {
                "key_as_string": "2010",
                "key": 1262304000000,
                "doc_count": 28
            }, {
                "key_as_string": "2009",
                "key": 1230768000000,
                "doc_count": 25
            }]
        },
        "type": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [{
                "key": "BUG FIXING",
                "doc_count": 82
            }, {
                "key": "NEW FEATURES",
                "doc_count": 41
            }, {
                "key": "QUESTION",
                "doc_count": 3
            }, {
                "key": "SYSTEM",
                "doc_count": 3
            }, {
                "key": "ERROR",
                "doc_count": 2
            }, {
                "key": "CASE",
                "doc_count": 1
            }, {
                "key": "EDUDEF",
                "doc_count": 1
            }, {
                "key": "MANUAL",
                "doc_count": 1
            }]
        },
        "tags": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 3,
            "buckets": [{
                "key": "FIX",
                "doc_count": 64
            }, {
                "key": "ΓΕΝΙΚΑ ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ",
                "doc_count": 25
            }, {
                "key": "MOBILE",
                "doc_count": 6
            }, {
                "key": "SETUP",
                "doc_count": 3
            }, {
                "key": "SYSTEM",
                "doc_count": 3
            }, {
                "key": "ΦΟΡΟΛΟΓΙΚΟΣ ΜΗΧΑΝΙΣΜΟΣ",
                "doc_count": 3
            }, {
                "key": "ΕΚΤΥΠΩΤΗΣ",
                "doc_count": 2
            }, {
                "key": "BACK UP",
                "doc_count": 1
            }, {
                "key": "BARCODE",
                "doc_count": 1
            }, {
                "key": "EXPORT",
                "doc_count": 1
            }, {
                "key": "PRINT",
                "doc_count": 1
            }, {
                "key": "PROGRAMMING - CUSTOMIZATION",
                "doc_count": 1
            }, {
                "key": "ΕΚΤΥΠΩΣΗ ΠΑΡΑΣΤΑΤΙΚΩΝ",
                "doc_count": 1
            }, {
                "key": "ΕΜΠΟΡΙΚΟ",
                "doc_count": 1
            }, {
                "key": "ΛΕΙΤΟΥΡΓΙΚΟ",
                "doc_count": 1
            }]
        }
    }
    };
```
                 * 
                 */
                searchIndex: function(elasticSearchIndex, elasticSearchQuery) {
                    var eUrl = elasticSearchIndex + "/_search";
                    return esWebApi.eSearch(eUrl, "post", elasticSearchQuery);
                },

                /** 
                 * @ngdoc function
                 * @name es.Services.Web.esElasticSearch#searchIndexAndDocument
                 * @methodOf es.Services.Web.esElasticSearch
                 * @kind function
                 * @description This function acts as a facade to the Elastic Search Engine that has been registered with Entersoft WEB API Server for the
                 * **Search** service based on the elastic search query language. This is the most common scenario of Elastic Search usage i.e. querying the Elastic Search database
                 * within the scope of one or more indices for a limited set of documents of the given Document Types. It is similar to 
                 * {@link es.Services.Web.esElasticSearch#methods_searchIndex searchIndex}.
                 * @param {string} elasticSearchIndex The Elastic Search index name or comma separated index names or reg expression resolving to index - indices to which the _elasticSearchQuery_ statement will be executed against.
                 * @param {string} elasticSearchDocumentType The Elastic Search Document Type or Types (in comma separated list) for which the elastic search query will be executed against within
                 * the index or indices specified by the elasticSearchIndex parameter.
                 * @param {string} elasticSearchQuery The Elastic Search valid statement - query to be executed. For more information about ElsticSearch Query Language
                 * please visit {@link https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html ES Query DSL}.
                 * @return {httpPromise} The response that we get from Elastic Search service should we perform an AJAX call against the service
                 * 
                 */
                searchIndexAndDocument: function(elasticSearchIndex, elasticSearchDocumentType, elasticSearchQuery) {
                    var eUrl = elasticSearchIndex + "/" + elasticSearchDocumentType + "/_search";
                    return esWebApi.eSearch(eUrl, "post", elasticSearchQuery);
                },

                /** 
                 * @ngdoc function
                 * @name es.Services.Web.esElasticSearch#searchFree
                 * @methodOf es.Services.Web.esElasticSearch
                 * @kind function
                 * @description This function acts as a facade to the Elastic Search Engine that has been registered with Entersoft WEB API Server.
                 * This function allows for almost any kind of operation can be executed by the ElasticSearch engine as an http method (i.e. GET, PUT, DELETE, POST, etc.)
                 * {@link es.Services.Web.esElasticSearch#methods_searchIndex searchIndex}.
                 *
                 * See also {@link es.Services.Web.esWebApi#methods_eSearch eSearch}
                 * @param {string} eUrl the last segment of the URL (i.e. without the domain name) that contains the REST api part 
                 * e.g. twitter/_settings,_mappings (the full CURL type request URL would be http://localhost:9200/twitter/_settings,_mappings). 
                 * This call is an example from ElasticSearch documentation {@link https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-get-index.html GetIndex}
                 * that retrieves the settings and the mappings for the twitter index.
                 * @param {string} eMethod The http method verb (i.e. "GET", "PUT", "DELETE", "POST", etc.). In the example above the verb should be "GET"
                 * the index or indices specified by the elasticSearchIndex parameter.
                 * @param {string} eBody The http request payload as required by the ElasticSearch REST call we are executing. In the example above there is no payload so it would be emtpy or null.
                 * @return {httpPromise} The response that we get from Elastic Search service should we perform an AJAX call against the service
                 * 
                 */
                searchFree: esWebApi.eSearch
            };
        }
    ]);

}());
