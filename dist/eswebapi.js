/*! Entersoft Application Server WEB API - v1.3.0 - 2015-10-14
* Copyright (c) 2015 Entersoft SA; Licensed Apache-2.0 */
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
 * @requires ngSanitize
 * @kind module
 * @description
 * This module encapsulates the services, providers, factories and constants for the **Entersoft AngularJS WEB API** services that can be used
 * within the context of any AngularJS Single Page Application (SPA).
 * The core components of the ES WEB API is the Angular Provider {@link es.Services.Web.esWebApi esWebApiProvider}
 */

(function() {
    'use strict';

    /* Services */

    var esWebServices = angular.module('es.Services.Web', ['ngStorage', 'ngSanitize', 'ngFileUpload' /*, 'es.Services.Analytics' */ ]);

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
        __FETCH_WEB_EAS_ASSET__: "api/asset/",
        __FETCH_ES00DOCUMENT_BY_GID__: "api/ES00Documents/InfoByGID/",
        __FETCH_ES00DOCUMENT_BY_CODE__: "api/ES00Documents/InfoByCode/",
        __FETCH_ES00DOCUMENT_BY_ENTITYGID__: "api/ES00Documents/InfoByEntityGid/",
        __FETCH_ES00DOCUMENT_BLOBDATA_BY_GID__: "api/ES00Documents/BlobDataByGID/",
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

            var esConfigSettings = {
                host: "",
                allowUnsecureConnection: false,
                subscriptionId: "",
                subscriptionPassword: ""
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
                 * For more information on how to setup the Entersoft Web Api Server please refer to {@link installation/es02wapis ES API Server}.
                 * @param {object} settings A JSON object that contains the configuration properties for the esWebApi service to work. A typical form 
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

                $get: ['$http', '$log', '$q', '$timeout', '$rootScope', 'ESWEBAPI_URL', 'esGlobals', 'esMessaging', 'Upload', 'esCache',
                    function($http, $log, $q, $timeout, $rootScope, ESWEBAPI_URL, esGlobals, esMessaging, Upload, esCache) {

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
                                headers: {
                                    "Authorization": esGlobals.getWebApiToken()
                                },
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
                                throw "EntityID and CommandID properties must be defined";
                            }
                            var surl = urlWEBAPI + ESWEBAPI_URL.__FORM_COMMAND__;

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
                                headers: {
                                    "Authorization": esGlobals.getWebApiToken()
                                },
                                url: surl,
                                params: params
                            });

                            return processWEBAPIPromise(ht, tt);
                        }

                        function processWEBAPIPromise(promise, tt) {
                            if (tt) {
                                promise.then(function() {
                                    tt.endTime().send();
                                });
                            }

                            promise.error(function(a, b) {
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
                             * @module es.Services.Web
                             * @kind function
                             * @param {object} credentials Entersoft Business Suite login credentials in the form of a JSON object with the following form:
                             ```js
                             var credentials  = {
                                UserID: "xxxx", //Entersoft User id 
                                Password: "this is my password", // Entersoft User's password
                                BranchID: "Branch", // a valid Branch that the user has access rights and will be used as default for all operations requiring a BranchID
                                LangID: "el-GR"
                             }
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
                            openSession: function(credentials) {
                                var tt = esGlobals.trackTimer("AUTH", "LOGIN", "");
                                tt.startTime();

                                var promise = $http({
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

                                return processWEBAPIPromise(promise);
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
                                esGlobals.sessionClosed();
                                $log.info("LOGOUT User");
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
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
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
                             * @param {string[]=} esParams can be
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
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
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
                            fetchUserSites: function(ebsuser) {
                                var ht = $http({
                                    method: 'post',
                                    url: urlWEBAPI + ESWEBAPI_URL.__USERSITES__,
                                    data: {
                                        SubscriptionID: esConfigSettings.subscriptionId,
                                        SubscriptionPassword: esConfigSettings.subscriptionPassword,
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
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
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
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
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
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
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
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
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
                             * @param {string} GroupID Entersoft Public Query GroupID
                             * @param {string} FilterID Entersoft Public Query FilterID
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
                            fetchPublicQueryInfo: function(GroupID, FilterID, useCache) {
                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__PUBLICQUERY_INFO__, GroupID, "/", FilterID);

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

                                var tt = esGlobals.trackTimer("PQ", "INFO", GroupID.concat("/", FilterID));
                                tt.startTime();

                                var ht = $http({
                                    method: 'get',
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
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
                             * @param {object} pqOptions Entersoft Public Query execution options with respect to Paging, PageSize and CountOf.
                             * pqOptions is a JSON object of the following type:
 ```js
var pqOptions = {
    WithCount: boolean,
    Page: int,
    PageSize: int
};
```
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
    Count: int, // In contrast to fetchPublicQuery, for fetchZoom, Count will always have value no matter of the options parameter and fields.
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
                                        $307ut(function() {
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
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken(),
                                        "X-ESPQOptions": JSON.stringify(pqOptions)
                                    },
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
                             * @param {string} pqGroupID Entersoft Public Query GroupID
                             * @param {string} pqFilterID Entersoft Public Query FilterID
                             * @param {object} pqOptions Entersoft Public Query execution options with respect to Paging, PageSize and CountOf.
                             * pqOptions is a JSON object of the following type:
 ```js
var pqOptions = {
    WithCount: boolean,
    Page: int,
    PageSize: int
};
```
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
                                pqGroupID = pqGroupID ? pqGroupID.trim() : "";
                                pqFilterID = pqFilterID ? pqFilterID.trim() : "";

                                var surl = urlWEBAPI.concat(ESWEBAPI_URL.__PUBLICQUERY__, pqGroupID, "/", pqFilterID);
                                var tt = esGlobals.trackTimer("PQ", "FETCH", pqGroupID.concat("/", pqFilterID));
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
                                    params: pqParams
                                };

                                if (pqOptions) {
                                    httpConfig.headers["X-ESPQOptions"] = JSON.stringify(pqOptions);
                                }

                                //if called with 3 arguments then default to a GET request
                                httpConfig.method = httpVerb || 'GET';

                                //if not a GET request, switch to data instead of params
                                if (httpConfig.method !== 'GET') {
                                    delete httpConfig.params;
                                    httpConfig.data = pqParams;
                                }

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
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
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
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken(),
                                        "Accept": undefined
                                    },
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
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
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
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
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
                                    headers: {
                                        "Authorization": esGlobals.getWebApiToken()
                                    },
                                    url: surl
                                });
                                return processWEBAPIPromise(ht, tt);

                            },

                            addES00Document: function(entity, entityId, description, file, okfunc, errfunc, progressfunc) {

                                file.upload = Upload.upload({
                                    url: 'http://esrdfiles.azurewebsites.net/api/photo',
                                    method: 'POST',
                                    headers: {
                                        'my-header': 'my-header-value'
                                    },
                                    fields: {
                                        description: description
                                    },
                                    file: file,
                                });

                                file.upload.then(function(response) {
                                    $timeout(function() {
                                        file.result = response.data;
                                        okfunc(file);
                                    });
                                }, errfunc);

                                file.upload.progress(progressfunc);

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

                                var ht = $http({
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
(function() {
    'use strict';

    var underscore = angular.module('underscore', []);
    underscore.factory('_', function() {
        return window._; //Underscore must already be loaded on the page 
    });

    var version = "1.3.0";
    var vParts = _.map(version.split("."), function(x) {
        return parseInt(x);
    });

    var esAngularAPIVer = {
        Major: vParts[0],
        Minor: vParts[1],
        Patch: vParts[2]
    };


    var esWebFramework = angular.module('es.Services.Web');


    /**
     * @ngdoc service
     * @name es.Services.Web.esCacheProvider
     * @kind provider
     * @description
     * esCacheProvider exposes a set of functions that can be used to configure the esCache servive prior to its use. Configuration usually takes place
     * at the _app.js_ file of the AngularJS SPA in the _app.config_ function.
     */

    /**
     * @ngdoc service
     * @name es.Services.Web.esCache
     * @module es.Services.Web
     * @kind provider
     * @description
     * esCache is a service that provides chachinf functionality to the Entersoft AngularJS API library that can be also used from the application developer
     * for the needs of his/her Single Page Application. Although, the functions offered by the service are not specific to any of the publicly 
     * available javascript libraries, the current version of the service relies on jscache, but this can change any time in the future with 100%
     * compatibility to the functions offered by the service i.e. the exposed functions and their signature is an **interface** to the client developer, but not the
     * implementation.
     */
    esWebFramework.provider('esCache', function() {
        var cache = null;
        var settings = {};
        settings.maxSize = -1;
        settings.storage = null;

        return {
            /**
             * @ngdoc function
             * @name es.Services.Web.esCacheProvider#setMaxSize
             * @methodOf es.Services.Web.esCacheProvider
             * @module es.Services.Web
             * @kind function
             * @description This function is used to set the maximum number of items that the cache can hold.
             * @param {number} size the maximum number of items that the cache can hold. If parameter does not resolve to a number it is set to -1 i.e. 
             * **no limitation** in the number of cache items.
             **/
            setMaxSize: function(size) {
                if (angular.isNumber(size)) {
                    settings.maxSize = size;
                } else {
                    settings.maxSize = -1;
                }
            },

            /**
             * @ngdoc function
             * @name es.Services.Web.esCacheProvider#getMaxSize
             * @methodOf es.Services.Web.esCacheProvider
             * @module es.Services.Web
             * @kind function
             * @description This function returns the current maxsize for the cache.
             * @return {number} the maxSize that cache engine has been set to.
             **/
            getMaxSize: function() {
                return settings.maxSize;
            },

            /**
             * @ngdoc function
             * @name es.Services.Web.esCacheProvider#getStorageSettings
             * @methodOf es.Services.Web.esCacheProvider
             * @module es.Services.Web
             * @kind function
             * @description This function returns the storage object that cache engine has been configured to use, if any.
             * @return {Object} The storage object that cache engine has been configured to use, if any.
             **/
            getStorageSettings: function() {
                return settings.storage;
            },

            /**
             * @ngdoc function
             * @name es.Services.Web.esCacheProvider#setStorageSettings
             * @methodOf es.Services.Web.esCacheProvider
             * @module es.Services.Web
             * @kind function
             * @description This function sets the storage object to be used as a 2nd level cache by the cache engine.
             * @param {Object} storage The storage object to be used by the cache engine for 2nd level cache.
             **/
            setStorageSettings: function(storage) {
                if (settings) {
                    settings.storage = storage;
                }
            },

            $get: function() {
                if (typeof(Cache) === 'undefined') {
                    throw "You must include jscache.js";
                }

                window.Cache = Cache;
                cache = new Cache(settings.maxSize, false, settings.storage);

                return {
                    /**
                     * @ngdoc function
                     * @name es.Services.Web.esCache#getItem
                     * @methodOf es.Services.Web.esCache
                     * @module es.Services.Web
                     * @kind function
                     * @description This function is used to get a value that might exist in the cache under the unique id **key**.
                     * @param {Object|string} key Typically _key_ is of type string but it can be an object.
                     * @return {Object} If the key exists in the cache, the value of that key is returned, otherwise _undefined_
                     **/
                    getItem: function(key) {
                        return cache.getItem(key);
                    },

                    /**
                     * @ngdoc function
                     * @name es.Services.Web.esCache#setItem
                     * @methodOf es.Services.Web.esCache
                     * @module es.Services.Web
                     * @kind function
                     * @description This function is used to set a key, value pair in the cache. If the key is already in the cache, its value will 
                     * be replaced by the new value i.e. val
                     * @param {Object|string} key Typically _key_ is of type string but it can be an object.
                     * @param {Object} val The value to be stored under the key
                     * @param {Object=} options Caching options. For more information please visit [monsur jscache](https://github.com/monsur/jscache).
                     **/
                    setItem: function(key, val, options) {
                        cache.setItem(key, val, options);
                    },

                    /**
                     * @ngdoc function
                     * @name es.Services.Web.esCache#removeItem
                     * @methodOf es.Services.Web.esCache
                     * @module es.Services.Web
                     * @kind function
                     * @description This function is used to remove an entry from the cache identified by **key**
                     * @param {Object|string} key Typically _key_ is of type string but it can be an object.
                     **/
                    removeItem: function(key) {
                        cache.removeItem(key);
                    },

                    /**
                     * @ngdoc function
                     * @name es.Services.Web.esCache#removeWhere
                     * @methodOf es.Services.Web.esCache
                     * @module es.Services.Web
                     * @kind function
                     * @description This function is used to remove entries from the cache according to the resolution of the f supplied function
                     * @param {function(key, val)} f a function which takes two arguments (key, val) and it should return a boolean value. This function 
                     * will called against all cache entries and those that this function qualifies to true will be deleted from the cache.
                     **/
                    removeWhere: function(f) {
                        cache.removeWhere(function(k, v) {
                            return f(k, v);
                        });
                    },

                    /**
                     * @ngdoc function
                     * @name es.Services.Web.esCache#size
                     * @methodOf es.Services.Web.esCache
                     * @module es.Services.Web
                     * @kind function
                     * @description This function returns the current number of entries that the cache holds.
                     * @return {number} The current number of entries that the cache holds.
                     **/
                    size: function() {
                        return cache.size();
                    },

                    /**
                     * @ngdoc function
                     * @name es.Services.Web.esCache#clear
                     * @methodOf es.Services.Web.esCache
                     * @module es.Services.Web
                     * @kind function
                     * @description This function clears the cache, by removing **ALL** its entries.
                     **/
                    clear: function() {
                        cache.clear();
                    },

                    /**
                     * @ngdoc function
                     * @name es.Services.Web.esCache#stats
                     * @methodOf es.Services.Web.esCache
                     * @module es.Services.Web
                     * @kind function
                     * @description This function returns cache statistics
                     * @return {object} It returns an object holding all cache statistics i.e.
```js
{
    "hits": 5,
    "misses": 1
}

```
                     **/
                    stats: function() {
                        return cache.getStats();
                    }
                }
            }

        }

    });

    /**
     * @ngdoc service
     * @name es.Services.Web.esMessaging
     * @kind factory
     * @description
     * esMessaging is a factory service that provides all the primitive functions for a publisher-subscribers messaging event system that its is not based 
     * on the AngularJS events or watch pattern but in pure callaback function pattern.
     */
    esWebFramework.factory('esMessaging', function() {
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

            /**
             * @ngdoc function
             * @name es.Services.Web.esMessaging#publish
             * @methodOf es.Services.Web.esMessaging
             * @module es.Services.Web
             * @kind function
             * @description This function is used to raise - publish that an event-topic has occurred. As a consequence, all the subscribed to 
             * this topic-event subsciption callback functions will be triggered and executed sequentially.
             * @param {... number} args or more arguments, with the first being the string for the topic-event that occurred. The rest of the arguments
             * if any will be supplied to the callback functions that will be fired. These extra arguments are considered to be specific to the nature 
             * of the topic-event.
             * @example
             * esMessaging is also used by the Entersoft AngularJS API in order to implement the login, logout, session expired, etc. logical events
             * that need to be handled and properly managed in any application based on the API. 
             *
             * This call is used by the API to publish an event that occured. The topic-event is the "AUTH_CHANGED" and it is this event-topic that any interested in 
             * party should subscribe to in order to be notified whenever this event occurs. The rest arguments, i.e. esClientSession and getAuthToken(model) are the
             * parameters that will be supplied to the callback functions that have been registered to this topic-event.
```js
esMessaging.publish("AUTH_CHANGED", esClientSession, getAuthToken(model));
```
             **/
            publish: publish,


            /**
             * @ngdoc function
             * @name es.Services.Web.esMessaging#subscribe
             * @methodOf es.Services.Web.esMessaging
             * @module es.Services.Web
             * @kind function
             * @description This function is used to subscribe to a specific event-topic and register a callback function to be called (i.e. fired)
             * once the event-topic is being raised - published.
             * @param {string} topic the event name to which this function will subscribe to the callback
             * @param {function} callback the callback function that will be fired once this event-topic is being **raised - published**
             * @return {object} An object representic the handle to this specific subscription instance. 
             * If you need to unsubscribe from this event-topic then you need to store the returned handle value, otherwise you do not need to keep the result
             * @example
             * In a controller, typically the root controller of an ng-app, we need to register for the "AUTH_CHANGED" topic event in order to properly configure and
             * handle the logic of our application depending on the current login / authentication state with the Entersoft Application Server. For this, we need to
             * use the subscribe function as in the example below:
```js
smeControllers.controller('mainCtrl', ['$location', '$scope', '$log', 'esMessaging', 'esWebApi', 'esGlobals',
    function($location, $scope, $log, esMessaging, esWebApiService, esGlobals) {

        // ... other things

        esMessaging.subscribe("AUTH_CHANGED", function(sess, apitoken) {
            $scope.esnotify.error(s);
        });
    }
]);
```
            *  
            **/
            subscribe: subscribe,

            /**
             * @ngdoc function
             * @name es.Services.Web.esMessaging#unsubscribe
             * @methodOf es.Services.Web.esMessaging
             * @module es.Services.Web
             * @kind function
             * @description This function is used to unsubscribe from an event-topic to which there was a subscription with the subscribe function
             * @param {object} handle The handle that the subscribe function returned as a result when we first did the subscription.
             **/
            unsubscribe: unsubscribe
        };

        return service;
    });


    /**
     * @ngdoc service
     * @name es.Services.Web.esGlobals
     * @requires $sessionStorage
     * @requires $log
     * @requires $injector
     * @requires es.Services.Web.esMessaging
     * @kind factory
     * @description
     * esGlobals is a factory service that provides functions, constructs and messaging events for common _global_ nature in the context of a typical
     * AngularJS SPA based on Entersoft AngularJS API.
     */
    esWebFramework.factory('esGlobals', ['$sessionStorage', '$log', 'esMessaging', '$injector' /* 'es.Services.GA' */ ,
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

            function getUserMessage(err, status) {
                if (!err) {
                    switch (status) {
                        case 401:
                            return "Please Login first";
                        case 403:
                            return "You are not authorized. Please Login and try again";

                        case 500:
                        default:
                            return "General Error. Please check your network and internet access";
                    }
                }

                if (err instanceof ArrayBuffer) {
                    // In case that response is of type ArrayBuffer instead of an object
                    try {
                        err = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(err)));
                    } catch (x) {

                    }
                }

                var sMsg = "";
                if (err.UserMessage) {
                    sMsg = err.UserMessage;
                    if (err.MessageID) {
                        sMsg = sMsg + " (" + err.MessageID + ")";
                    }
                    return sMsg;
                }

                if (err.Messages) {
                    if (angular.isArray(err.Messages)) {
                        var i = 0;
                        sMsg = _.reduce(err.Messages, function(ret, x) {
                            return ret + "\r\n" + "[" + ++i + "] " + x;
                        }, "");

                    } else {
                        sMsg = err.Messages;
                    }

                    return sMsg ? sMsg : "General Error. Please check your network and internet access";
                } else {
                    return "General Error. Please check your network and internet access";
                }
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
                connectionModel: null,

                getWebApiToken: function() {
                    //sme fake
                    var s = getAuthToken(fgetModel());

                    /*
                    if (s) {
                        s = s.replace("j", "f").replace("x", "h");
                    }
                    */

                    return s;
                },

                setModel: fsetModel,

                getModel: fgetModel,
            };

            function getMimeTypes() {
                var mimes = [{
                    mime: "application/andrew-inset",
                    extension: ["ez"]
                }, {
                    mime: "application/applixware",
                    extension: ["aw"]
                }, {
                    mime: "application/atom+xml",
                    extension: ["atom"]
                }, {
                    mime: "application/atomcat+xml",
                    extension: ["atomcat"]
                }, {
                    mime: "application/atomsvc+xml",
                    extension: ["atomsvc"]
                }, {
                    mime: "application/ccxml+xml",
                    extension: ["ccxml"]
                }, {
                    mime: "application/cdmi-capability",
                    extension: ["cdmia"]
                }, {
                    mime: "application/cdmi-container",
                    extension: ["cdmic"]
                }, {
                    mime: "application/cdmi-domain",
                    extension: ["cdmid"]
                }, {
                    mime: "application/cdmi-object",
                    extension: ["cdmio"]
                }, {
                    mime: "application/cdmi-queue",
                    extension: ["cdmiq"]
                }, {
                    mime: "application/cu-seeme",
                    extension: ["cu"]
                }, {
                    mime: "application/davmount+xml",
                    extension: ["davmount"]
                }, {
                    mime: "application/docbook+xml",
                    extension: ["dbk"]
                }, {
                    mime: "application/dssc+der",
                    extension: ["dssc"]
                }, {
                    mime: "application/dssc+xml",
                    extension: ["xdssc"]
                }, {
                    mime: "application/ecmascript",
                    extension: ["ecma"]
                }, {
                    mime: "application/emma+xml",
                    extension: ["emma"]
                }, {
                    mime: "application/epub+zip",
                    extension: ["epub"]
                }, {
                    mime: "application/exi",
                    extension: ["exi"]
                }, {
                    mime: "application/font-tdpfr",
                    extension: ["pfr"]
                }, {
                    mime: "application/gml+xml",
                    extension: ["gml"]
                }, {
                    mime: "application/gpx+xml",
                    extension: ["gpx"]
                }, {
                    mime: "application/gxf",
                    extension: ["gxf"]
                }, {
                    mime: "application/hyperstudio",
                    extension: ["stk"]
                }, {
                    mime: "application/inkml+xml",
                    extension: ["ink", "inkml"]
                }, {
                    mime: "application/ipfix",
                    extension: ["ipfix"]
                }, {
                    mime: "application/java-archive",
                    extension: ["jar"]
                }, {
                    mime: "application/java-serialized-object",
                    extension: ["ser"]
                }, {
                    mime: "application/java-vm",
                    extension: ["class"]
                }, {
                    mime: "application/javascript",
                    extension: ["js"]
                }, {
                    mime: "application/json",
                    extension: ["json"]
                }, {
                    mime: "application/jsonml+json",
                    extension: ["jsonml"]
                }, {
                    mime: "application/lost+xml",
                    extension: ["lostxml"]
                }, {
                    mime: "application/mac-binhex40",
                    extension: ["hqx"]
                }, {
                    mime: "application/mac-compactpro",
                    extension: ["cpt"]
                }, {
                    mime: "application/mads+xml",
                    extension: ["mads"]
                }, {
                    mime: "application/marc",
                    extension: ["mrc"]
                }, {
                    mime: "application/marcxml+xml",
                    extension: ["mrcx"]
                }, {
                    mime: "application/mathematica",
                    extension: ["ma", "nb", "mb"]
                }, {
                    mime: "application/mathml+xml",
                    extension: ["mathml"]
                }, {
                    mime: "application/mbox",
                    extension: ["mbox"]
                }, {
                    mime: "application/mediaservercontrol+xml",
                    extension: ["mscml"]
                }, {
                    mime: "application/metalink+xml",
                    extension: ["metalink"]
                }, {
                    mime: "application/metalink4+xml",
                    extension: ["meta4"]
                }, {
                    mime: "application/mets+xml",
                    extension: ["mets"]
                }, {
                    mime: "application/mods+xml",
                    extension: ["mods"]
                }, {
                    mime: "application/mp21",
                    extension: ["m21", "mp21"]
                }, {
                    mime: "application/mp4",
                    extension: ["mp4s"]
                }, {
                    mime: "application/msword",
                    extension: ["doc", "dot"]
                }, {
                    mime: "application/mxf",
                    extension: ["mxf"]
                }, {
                    mime: "application/octet-stream",
                    extension: ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy"]
                }, {
                    mime: "application/oda",
                    extension: ["oda"]
                }, {
                    mime: "application/oebps-package+xml",
                    extension: ["opf"]
                }, {
                    mime: "application/ogg",
                    extension: ["ogx"]
                }, {
                    mime: "application/omdoc+xml",
                    extension: ["omdoc"]
                }, {
                    mime: "application/onenote",
                    extension: ["onetoc", "onetoc2", "onetmp", "onepkg"]
                }, {
                    mime: "application/oxps",
                    extension: ["oxps"]
                }, {
                    mime: "application/patch-ops-error+xml",
                    extension: ["xer"]
                }, {
                    mime: "application/pdf",
                    extension: ["pdf"]
                }, {
                    mime: "application/pgp-encrypted",
                    extension: ["pgp"]
                }, {
                    mime: "application/pgp-signature",
                    extension: ["asc", "sig"]
                }, {
                    mime: "application/pics-rules",
                    extension: ["prf"]
                }, {
                    mime: "application/pkcs10",
                    extension: ["p10"]
                }, {
                    mime: "application/pkcs7-mime",
                    extension: ["p7m", "p7c"]
                }, {
                    mime: "application/pkcs7-signature",
                    extension: ["p7s"]
                }, {
                    mime: "application/pkcs8",
                    extension: ["p8"]
                }, {
                    mime: "application/pkix-attr-cert",
                    extension: ["ac"]
                }, {
                    mime: "application/pkix-cert",
                    extension: ["cer"]
                }, {
                    mime: "application/pkix-crl",
                    extension: ["crl"]
                }, {
                    mime: "application/pkix-pkipath",
                    extension: ["pkipath"]
                }, {
                    mime: "application/pkixcmp",
                    extension: ["pki"]
                }, {
                    mime: "application/pls+xml",
                    extension: ["pls"]
                }, {
                    mime: "application/postscript",
                    extension: ["ai", "eps", "ps"]
                }, {
                    mime: "application/prs.cww",
                    extension: ["cww"]
                }, {
                    mime: "application/pskc+xml",
                    extension: ["pskcxml"]
                }, {
                    mime: "application/rdf+xml",
                    extension: ["rdf"]
                }, {
                    mime: "application/reginfo+xml",
                    extension: ["rif"]
                }, {
                    mime: "application/relax-ng-compact-syntax",
                    extension: ["rnc"]
                }, {
                    mime: "application/resource-lists+xml",
                    extension: ["rl"]
                }, {
                    mime: "application/resource-lists-diff+xml",
                    extension: ["rld"]
                }, {
                    mime: "application/rls-services+xml",
                    extension: ["rs"]
                }, {
                    mime: "application/rpki-ghostbusters",
                    extension: ["gbr"]
                }, {
                    mime: "application/rpki-manifest",
                    extension: ["mft"]
                }, {
                    mime: "application/rpki-roa",
                    extension: ["roa"]
                }, {
                    mime: "application/rsd+xml",
                    extension: ["rsd"]
                }, {
                    mime: "application/rss+xml",
                    extension: ["rss"]
                }, {
                    mime: "application/rtf",
                    extension: ["rtf"]
                }, {
                    mime: "application/sbml+xml",
                    extension: ["sbml"]
                }, {
                    mime: "application/scvp-cv-request",
                    extension: ["scq"]
                }, {
                    mime: "application/scvp-cv-response",
                    extension: ["scs"]
                }, {
                    mime: "application/scvp-vp-request",
                    extension: ["spq"]
                }, {
                    mime: "application/scvp-vp-response",
                    extension: ["spp"]
                }, {
                    mime: "application/sdp",
                    extension: ["sdp"]
                }, {
                    mime: "application/set-payment-initiation",
                    extension: ["setpay"]
                }, {
                    mime: "application/set-registration-initiation",
                    extension: ["setreg"]
                }, {
                    mime: "application/shf+xml",
                    extension: ["shf"]
                }, {
                    mime: "application/smil+xml",
                    extension: ["smi", "smil"]
                }, {
                    mime: "application/sparql-query",
                    extension: ["rq"]
                }, {
                    mime: "application/sparql-results+xml",
                    extension: ["srx"]
                }, {
                    mime: "application/srgs",
                    extension: ["gram"]
                }, {
                    mime: "application/srgs+xml",
                    extension: ["grxml"]
                }, {
                    mime: "application/sru+xml",
                    extension: ["sru"]
                }, {
                    mime: "application/ssdl+xml",
                    extension: ["ssdl"]
                }, {
                    mime: "application/ssml+xml",
                    extension: ["ssml"]
                }, {
                    mime: "application/tei+xml",
                    extension: ["tei", "teicorpus"]
                }, {
                    mime: "application/thraud+xml",
                    extension: ["tfi"]
                }, {
                    mime: "application/timestamped-data",
                    extension: ["tsd"]
                }, {
                    mime: "application/vnd.3gpp.pic-bw-large",
                    extension: ["plb"]
                }, {
                    mime: "application/vnd.3gpp.pic-bw-small",
                    extension: ["psb"]
                }, {
                    mime: "application/vnd.3gpp.pic-bw-var",
                    extension: ["pvb"]
                }, {
                    mime: "application/vnd.3gpp2.tcap",
                    extension: ["tcap"]
                }, {
                    mime: "application/vnd.3m.post-it-notes",
                    extension: ["pwn"]
                }, {
                    mime: "application/vnd.accpac.simply.aso",
                    extension: ["aso"]
                }, {
                    mime: "application/vnd.accpac.simply.imp",
                    extension: ["imp"]
                }, {
                    mime: "application/vnd.acucobol",
                    extension: ["acu"]
                }, {
                    mime: "application/vnd.acucorp",
                    extension: ["atc", "acutc"]
                }, {
                    mime: "application/vnd.adobe.air-application-installer-package+zip",
                    extension: ["air"]
                }, {
                    mime: "application/vnd.adobe.formscentral.fcdt",
                    extension: ["fcdt"]
                }, {
                    mime: "application/vnd.adobe.fxp",
                    extension: ["fxp", "fxpl"]
                }, {
                    mime: "application/vnd.adobe.xdp+xml",
                    extension: ["xdp"]
                }, {
                    mime: "application/vnd.adobe.xfdf",
                    extension: ["xfdf"]
                }, {
                    mime: "application/vnd.ahead.space",
                    extension: ["ahead"]
                }, {
                    mime: "application/vnd.airzip.filesecure.azf",
                    extension: ["azf"]
                }, {
                    mime: "application/vnd.airzip.filesecure.azs",
                    extension: ["azs"]
                }, {
                    mime: "application/vnd.amazon.ebook",
                    extension: ["azw"]
                }, {
                    mime: "application/vnd.americandynamics.acc",
                    extension: ["acc"]
                }, {
                    mime: "application/vnd.amiga.ami",
                    extension: ["ami"]
                }, {
                    mime: "application/vnd.android.package-archive",
                    extension: ["apk"]
                }, {
                    mime: "application/vnd.anser-web-certificate-issue-initiation",
                    extension: ["cii"]
                }, {
                    mime: "application/vnd.anser-web-funds-transfer-initiation",
                    extension: ["fti"]
                }, {
                    mime: "application/vnd.antix.game-component",
                    extension: ["atx"]
                }, {
                    mime: "application/vnd.apple.installer+xml",
                    extension: ["mpkg"]
                }, {
                    mime: "application/vnd.apple.mpegurl",
                    extension: ["m3u8"]
                }, {
                    mime: "application/vnd.aristanetworks.swi",
                    extension: ["swi"]
                }, {
                    mime: "application/vnd.astraea-software.iota",
                    extension: ["iota"]
                }, {
                    mime: "application/vnd.audiograph",
                    extension: ["aep"]
                }, {
                    mime: "application/vnd.blueice.multipass",
                    extension: ["mpm"]
                }, {
                    mime: "application/vnd.bmi",
                    extension: ["bmi"]
                }, {
                    mime: "application/vnd.businessobjects",
                    extension: ["rep"]
                }, {
                    mime: "application/vnd.chemdraw+xml",
                    extension: ["cdxml"]
                }, {
                    mime: "application/vnd.chipnuts.karaoke-mmd",
                    extension: ["mmd"]
                }, {
                    mime: "application/vnd.cinderella",
                    extension: ["cdy"]
                }, {
                    mime: "application/vnd.claymore",
                    extension: ["cla"]
                }, {
                    mime: "application/vnd.cloanto.rp9",
                    extension: ["rp9"]
                }, {
                    mime: "application/vnd.clonk.c4group",
                    extension: ["c4g", "c4d", "c4f", "c4p", "c4u"]
                }, {
                    mime: "application/vnd.cluetrust.cartomobile-config",
                    extension: ["c11amc"]
                }, {
                    mime: "application/vnd.cluetrust.cartomobile-config-pkg",
                    extension: ["c11amz"]
                }, {
                    mime: "application/vnd.commonspace",
                    extension: ["csp"]
                }, {
                    mime: "application/vnd.contact.cmsg",
                    extension: ["cdbcmsg"]
                }, {
                    mime: "application/vnd.cosmocaller",
                    extension: ["cmc"]
                }, {
                    mime: "application/vnd.crick.clicker",
                    extension: ["clkx"]
                }, {
                    mime: "application/vnd.crick.clicker.keyboard",
                    extension: ["clkk"]
                }, {
                    mime: "application/vnd.crick.clicker.palette",
                    extension: ["clkp"]
                }, {
                    mime: "application/vnd.crick.clicker.template",
                    extension: ["clkt"]
                }, {
                    mime: "application/vnd.crick.clicker.wordbank",
                    extension: ["clkw"]
                }, {
                    mime: "application/vnd.criticaltools.wbs+xml",
                    extension: ["wbs"]
                }, {
                    mime: "application/vnd.ctc-posml",
                    extension: ["pml"]
                }, {
                    mime: "application/vnd.cups-ppd",
                    extension: ["ppd"]
                }, {
                    mime: "application/vnd.curl.car",
                    extension: ["car"]
                }, {
                    mime: "application/vnd.curl.pcurl",
                    extension: ["pcurl"]
                }, {
                    mime: "application/vnd.dart",
                    extension: ["dart"]
                }, {
                    mime: "application/vnd.data-vision.rdz",
                    extension: ["rdz"]
                }, {
                    mime: "application/vnd.dece.data",
                    extension: ["uvf", "uvvf", "uvd", "uvvd"]
                }, {
                    mime: "application/vnd.dece.ttml+xml",
                    extension: ["uvt", "uvvt"]
                }, {
                    mime: "application/vnd.dece.unspecified",
                    extension: ["uvx", "uvvx"]
                }, {
                    mime: "application/vnd.dece.zip",
                    extension: ["uvz", "uvvz"]
                }, {
                    mime: "application/vnd.denovo.fcselayout-link",
                    extension: ["fe_launch"]
                }, {
                    mime: "application/vnd.dna",
                    extension: ["dna"]
                }, {
                    mime: "application/vnd.dolby.mlp",
                    extension: ["mlp"]
                }, {
                    mime: "application/vnd.dpgraph",
                    extension: ["dpg"]
                }, {
                    mime: "application/vnd.dreamfactory",
                    extension: ["dfac"]
                }, {
                    mime: "application/vnd.ds-keypoint",
                    extension: ["kpxx"]
                }, {
                    mime: "application/vnd.dvb.ait",
                    extension: ["ait"]
                }, {
                    mime: "application/vnd.dvb.service",
                    extension: ["svc"]
                }, {
                    mime: "application/vnd.dynageo",
                    extension: ["geo"]
                }, {
                    mime: "application/vnd.ecowin.chart",
                    extension: ["mag"]
                }, {
                    mime: "application/vnd.enliven",
                    extension: ["nml"]
                }, {
                    mime: "application/vnd.epson.esf",
                    extension: ["esf"]
                }, {
                    mime: "application/vnd.epson.msf",
                    extension: ["msf"]
                }, {
                    mime: "application/vnd.epson.quickanime",
                    extension: ["qam"]
                }, {
                    mime: "application/vnd.epson.salt",
                    extension: ["slt"]
                }, {
                    mime: "application/vnd.epson.ssf",
                    extension: ["ssf"]
                }, {
                    mime: "application/vnd.eszigno3+xml",
                    extension: ["es3", "et3"]
                }, {
                    mime: "application/vnd.ezpix-album",
                    extension: ["ez2"]
                }, {
                    mime: "application/vnd.ezpix-package",
                    extension: ["ez3"]
                }, {
                    mime: "application/vnd.fdf",
                    extension: ["fdf"]
                }, {
                    mime: "application/vnd.fdsn.mseed",
                    extension: ["mseed"]
                }, {
                    mime: "application/vnd.fdsn.seed",
                    extension: ["seed", "dataless"]
                }, {
                    mime: "application/vnd.flographit",
                    extension: ["gph"]
                }, {
                    mime: "application/vnd.fluxtime.clip",
                    extension: ["ftc"]
                }, {
                    mime: "application/vnd.framemaker",
                    extension: ["fm", "frame", "maker", "book"]
                }, {
                    mime: "application/vnd.frogans.fnc",
                    extension: ["fnc"]
                }, {
                    mime: "application/vnd.frogans.ltf",
                    extension: ["ltf"]
                }, {
                    mime: "application/vnd.fsc.weblaunch",
                    extension: ["fsc"]
                }, {
                    mime: "application/vnd.fujitsu.oasys",
                    extension: ["oas"]
                }, {
                    mime: "application/vnd.fujitsu.oasys2",
                    extension: ["oa2"]
                }, {
                    mime: "application/vnd.fujitsu.oasys3",
                    extension: ["oa3"]
                }, {
                    mime: "application/vnd.fujitsu.oasysgp",
                    extension: ["fg5"]
                }, {
                    mime: "application/vnd.fujitsu.oasysprs",
                    extension: ["bh2"]
                }, {
                    mime: "application/vnd.fujixerox.ddd",
                    extension: ["ddd"]
                }, {
                    mime: "application/vnd.fujixerox.docuworks",
                    extension: ["xdw"]
                }, {
                    mime: "application/vnd.fujixerox.docuworks.binder",
                    extension: ["xbd"]
                }, {
                    mime: "application/vnd.fuzzysheet",
                    extension: ["fzs"]
                }, {
                    mime: "application/vnd.genomatix.tuxedo",
                    extension: ["txd"]
                }, {
                    mime: "application/vnd.geogebra.file",
                    extension: ["ggb"]
                }, {
                    mime: "application/vnd.geogebra.tool",
                    extension: ["ggt"]
                }, {
                    mime: "application/vnd.geometry-explorer",
                    extension: ["gex", "gre"]
                }, {
                    mime: "application/vnd.geonext",
                    extension: ["gxt"]
                }, {
                    mime: "application/vnd.geoplan",
                    extension: ["g2w"]
                }, {
                    mime: "application/vnd.geospace",
                    extension: ["g3w"]
                }, {
                    mime: "application/vnd.gmx",
                    extension: ["gmx"]
                }, {
                    mime: "application/vnd.google-earth.kml+xml",
                    extension: ["kml"]
                }, {
                    mime: "application/vnd.google-earth.kmz",
                    extension: ["kmz"]
                }, {
                    mime: "application/vnd.grafeq",
                    extension: ["gqf", "gqs"]
                }, {
                    mime: "application/vnd.groove-account",
                    extension: ["gac"]
                }, {
                    mime: "application/vnd.groove-help",
                    extension: ["ghf"]
                }, {
                    mime: "application/vnd.groove-identity-message",
                    extension: ["gim"]
                }, {
                    mime: "application/vnd.groove-injector",
                    extension: ["grv"]
                }, {
                    mime: "application/vnd.groove-tool-message",
                    extension: ["gtm"]
                }, {
                    mime: "application/vnd.groove-tool-template",
                    extension: ["tpl"]
                }, {
                    mime: "application/vnd.groove-vcard",
                    extension: ["vcg"]
                }, {
                    mime: "application/vnd.hal+xml",
                    extension: ["hal"]
                }, {
                    mime: "application/vnd.handheld-entertainment+xml",
                    extension: ["zmm"]
                }, {
                    mime: "application/vnd.hbci",
                    extension: ["hbci"]
                }, {
                    mime: "application/vnd.hhe.lesson-player",
                    extension: ["les"]
                }, {
                    mime: "application/vnd.hp-hpgl",
                    extension: ["hpgl"]
                }, {
                    mime: "application/vnd.hp-hpid",
                    extension: ["hpid"]
                }, {
                    mime: "application/vnd.hp-hps",
                    extension: ["hps"]
                }, {
                    mime: "application/vnd.hp-jlyt",
                    extension: ["jlt"]
                }, {
                    mime: "application/vnd.hp-pcl",
                    extension: ["pcl"]
                }, {
                    mime: "application/vnd.hp-pclxl",
                    extension: ["pclxl"]
                }, {
                    mime: "application/vnd.hydrostatix.sof-data",
                    extension: ["sfd-hdstx"]
                }, {
                    mime: "application/vnd.ibm.minipay",
                    extension: ["mpy"]
                }, {
                    mime: "application/vnd.ibm.modcap",
                    extension: ["afp", "listafp", "list3820"]
                }, {
                    mime: "application/vnd.ibm.rights-management",
                    extension: ["irm"]
                }, {
                    mime: "application/vnd.ibm.secure-container",
                    extension: ["sc"]
                }, {
                    mime: "application/vnd.iccprofile",
                    extension: ["icc", "icm"]
                }, {
                    mime: "application/vnd.igloader",
                    extension: ["igl"]
                }, {
                    mime: "application/vnd.immervision-ivp",
                    extension: ["ivp"]
                }, {
                    mime: "application/vnd.immervision-ivu",
                    extension: ["ivu"]
                }, {
                    mime: "application/vnd.insors.igm",
                    extension: ["igm"]
                }, {
                    mime: "application/vnd.intercon.formnet",
                    extension: ["xpw", "xpx"]
                }, {
                    mime: "application/vnd.intergeo",
                    extension: ["i2g"]
                }, {
                    mime: "application/vnd.intu.qbo",
                    extension: ["qbo"]
                }, {
                    mime: "application/vnd.intu.qfx",
                    extension: ["qfx"]
                }, {
                    mime: "application/vnd.ipunplugged.rcprofile",
                    extension: ["rcprofile"]
                }, {
                    mime: "application/vnd.irepository.package+xml",
                    extension: ["irp"]
                }, {
                    mime: "application/vnd.is-xpr",
                    extension: ["xpr"]
                }, {
                    mime: "application/vnd.isac.fcs",
                    extension: ["fcs"]
                }, {
                    mime: "application/vnd.jam",
                    extension: ["jam"]
                }, {
                    mime: "application/vnd.jcp.javame.midlet-rms",
                    extension: ["rms"]
                }, {
                    mime: "application/vnd.jisp",
                    extension: ["jisp"]
                }, {
                    mime: "application/vnd.joost.joda-archive",
                    extension: ["joda"]
                }, {
                    mime: "application/vnd.kahootz",
                    extension: ["ktz", "ktr"]
                }, {
                    mime: "application/vnd.kde.karbon",
                    extension: ["karbon"]
                }, {
                    mime: "application/vnd.kde.kchart",
                    extension: ["chrt"]
                }, {
                    mime: "application/vnd.kde.kformula",
                    extension: ["kfo"]
                }, {
                    mime: "application/vnd.kde.kivio",
                    extension: ["flw"]
                }, {
                    mime: "application/vnd.kde.kontour",
                    extension: ["kon"]
                }, {
                    mime: "application/vnd.kde.kpresenter",
                    extension: ["kpr", "kpt"]
                }, {
                    mime: "application/vnd.kde.kspread",
                    extension: ["ksp"]
                }, {
                    mime: "application/vnd.kde.kword",
                    extension: ["kwd", "kwt"]
                }, {
                    mime: "application/vnd.kenameaapp",
                    extension: ["htke"]
                }, {
                    mime: "application/vnd.kidspiration",
                    extension: ["kia"]
                }, {
                    mime: "application/vnd.kinar",
                    extension: ["kne", "knp"]
                }, {
                    mime: "application/vnd.koan",
                    extension: ["skp", "skd", "skt", "skm"]
                }, {
                    mime: "application/vnd.kodak-descriptor",
                    extension: ["sse"]
                }, {
                    mime: "application/vnd.las.las+xml",
                    extension: ["lasxml"]
                }, {
                    mime: "application/vnd.llamagraphics.life-balance.desktop",
                    extension: ["lbd"]
                }, {
                    mime: "application/vnd.llamagraphics.life-balance.exchange+xml",
                    extension: ["lbe"]
                }, {
                    mime: "application/vnd.lotus-1-2-3",
                    extension: ["123"]
                }, {
                    mime: "application/vnd.lotus-approach",
                    extension: ["apr"]
                }, {
                    mime: "application/vnd.lotus-freelance",
                    extension: ["pre"]
                }, {
                    mime: "application/vnd.lotus-notes",
                    extension: ["nsf"]
                }, {
                    mime: "application/vnd.lotus-organizer",
                    extension: ["org"]
                }, {
                    mime: "application/vnd.lotus-screencam",
                    extension: ["scm"]
                }, {
                    mime: "application/vnd.lotus-wordpro",
                    extension: ["lwp"]
                }, {
                    mime: "application/vnd.macports.portpkg",
                    extension: ["portpkg"]
                }, {
                    mime: "application/vnd.mcd",
                    extension: ["mcd"]
                }, {
                    mime: "application/vnd.medcalcdata",
                    extension: ["mc1"]
                }, {
                    mime: "application/vnd.mediastation.cdkey",
                    extension: ["cdkey"]
                }, {
                    mime: "application/vnd.mfer",
                    extension: ["mwf"]
                }, {
                    mime: "application/vnd.mfmp",
                    extension: ["mfm"]
                }, {
                    mime: "application/vnd.micrografx.flo",
                    extension: ["flo"]
                }, {
                    mime: "application/vnd.micrografx.igx",
                    extension: ["igx"]
                }, {
                    mime: "application/vnd.mif",
                    extension: ["mif"]
                }, {
                    mime: "application/vnd.mobius.daf",
                    extension: ["daf"]
                }, {
                    mime: "application/vnd.mobius.dis",
                    extension: ["dis"]
                }, {
                    mime: "application/vnd.mobius.mbk",
                    extension: ["mbk"]
                }, {
                    mime: "application/vnd.mobius.mqy",
                    extension: ["mqy"]
                }, {
                    mime: "application/vnd.mobius.msl",
                    extension: ["msl"]
                }, {
                    mime: "application/vnd.mobius.plc",
                    extension: ["plc"]
                }, {
                    mime: "application/vnd.mobius.txf",
                    extension: ["txf"]
                }, {
                    mime: "application/vnd.mophun.application",
                    extension: ["mpn"]
                }, {
                    mime: "application/vnd.mophun.certificate",
                    extension: ["mpc"]
                }, {
                    mime: "application/vnd.mozilla.xul+xml",
                    extension: ["xul"]
                }, {
                    mime: "application/vnd.ms-artgalry",
                    extension: ["cil"]
                }, {
                    mime: "application/vnd.ms-cab-compressed",
                    extension: ["cab"]
                }, {
                    mime: "application/vnd.ms-excel",
                    extension: ["xls", "xlm", "xla", "xlc", "xlt", "xlw"]
                }, {
                    mime: "application/vnd.ms-excel.addin.macroenabled.12",
                    extension: ["xlam"]
                }, {
                    mime: "application/vnd.ms-excel.sheet.binary.macroenabled.12",
                    extension: ["xlsb"]
                }, {
                    mime: "application/vnd.ms-excel.sheet.macroenabled.12",
                    extension: ["xlsm"]
                }, {
                    mime: "application/vnd.ms-excel.template.macroenabled.12",
                    extension: ["xltm"]
                }, {
                    mime: "application/vnd.ms-fontobject",
                    extension: ["eot"]
                }, {
                    mime: "application/vnd.ms-htmlhelp",
                    extension: ["chm"]
                }, {
                    mime: "application/vnd.ms-ims",
                    extension: ["ims"]
                }, {
                    mime: "application/vnd.ms-lrm",
                    extension: ["lrm"]
                }, {
                    mime: "application/vnd.ms-officetheme",
                    extension: ["thmx"]
                }, {
                    mime: "application/vnd.ms-pki.seccat",
                    extension: ["cat"]
                }, {
                    mime: "application/vnd.ms-pki.stl",
                    extension: ["stl"]
                }, {
                    mime: "application/vnd.ms-powerpoint",
                    extension: ["ppt", "pps", "pot"]
                }, {
                    mime: "application/vnd.ms-powerpoint.addin.macroenabled.12",
                    extension: ["ppam"]
                }, {
                    mime: "application/vnd.ms-powerpoint.presentation.macroenabled.12",
                    extension: ["pptm"]
                }, {
                    mime: "application/vnd.ms-powerpoint.slide.macroenabled.12",
                    extension: ["sldm"]
                }, {
                    mime: "application/vnd.ms-powerpoint.slideshow.macroenabled.12",
                    extension: ["ppsm"]
                }, {
                    mime: "application/vnd.ms-powerpoint.template.macroenabled.12",
                    extension: ["potm"]
                }, {
                    mime: "application/vnd.ms-project",
                    extension: ["mpp", "mpt"]
                }, {
                    mime: "application/vnd.ms-word.document.macroenabled.12",
                    extension: ["docm"]
                }, {
                    mime: "application/vnd.ms-word.template.macroenabled.12",
                    extension: ["dotm"]
                }, {
                    mime: "application/vnd.ms-works",
                    extension: ["wps", "wks", "wcm", "wdb"]
                }, {
                    mime: "application/vnd.ms-wpl",
                    extension: ["wpl"]
                }, {
                    mime: "application/vnd.ms-xpsdocument",
                    extension: ["xps"]
                }, {
                    mime: "application/vnd.mseq",
                    extension: ["mseq"]
                }, {
                    mime: "application/vnd.musician",
                    extension: ["mus"]
                }, {
                    mime: "application/vnd.muvee.style",
                    extension: ["msty"]
                }, {
                    mime: "application/vnd.mynfc",
                    extension: ["taglet"]
                }, {
                    mime: "application/vnd.neurolanguage.nlu",
                    extension: ["nlu"]
                }, {
                    mime: "application/vnd.nitf",
                    extension: ["ntf", "nitf"]
                }, {
                    mime: "application/vnd.noblenet-directory",
                    extension: ["nnd"]
                }, {
                    mime: "application/vnd.noblenet-sealer",
                    extension: ["nns"]
                }, {
                    mime: "application/vnd.noblenet-web",
                    extension: ["nnw"]
                }, {
                    mime: "application/vnd.nokia.n-gage.data",
                    extension: ["ngdat"]
                }, {
                    mime: "application/vnd.nokia.n-gage.symbian.install",
                    extension: ["n-gage"]
                }, {
                    mime: "application/vnd.nokia.radio-preset",
                    extension: ["rpst"]
                }, {
                    mime: "application/vnd.nokia.radio-presets",
                    extension: ["rpss"]
                }, {
                    mime: "application/vnd.novadigm.edm",
                    extension: ["edm"]
                }, {
                    mime: "application/vnd.novadigm.edx",
                    extension: ["edx"]
                }, {
                    mime: "application/vnd.novadigm.ext",
                    extension: ["ext"]
                }, {
                    mime: "application/vnd.oasis.opendocument.chart",
                    extension: ["odc"]
                }, {
                    mime: "application/vnd.oasis.opendocument.chart-template",
                    extension: ["otc"]
                }, {
                    mime: "application/vnd.oasis.opendocument.database",
                    extension: ["odb"]
                }, {
                    mime: "application/vnd.oasis.opendocument.formula",
                    extension: ["odf"]
                }, {
                    mime: "application/vnd.oasis.opendocument.formula-template",
                    extension: ["odft"]
                }, {
                    mime: "application/vnd.oasis.opendocument.graphics",
                    extension: ["odg"]
                }, {
                    mime: "application/vnd.oasis.opendocument.graphics-template",
                    extension: ["otg"]
                }, {
                    mime: "application/vnd.oasis.opendocument.image",
                    extension: ["odi"]
                }, {
                    mime: "application/vnd.oasis.opendocument.image-template",
                    extension: ["oti"]
                }, {
                    mime: "application/vnd.oasis.opendocument.presentation",
                    extension: ["odp"]
                }, {
                    mime: "application/vnd.oasis.opendocument.presentation-template",
                    extension: ["otp"]
                }, {
                    mime: "application/vnd.oasis.opendocument.spreadsheet",
                    extension: ["ods"]
                }, {
                    mime: "application/vnd.oasis.opendocument.spreadsheet-template",
                    extension: ["ots"]
                }, {
                    mime: "application/vnd.oasis.opendocument.text",
                    extension: ["odt"]
                }, {
                    mime: "application/vnd.oasis.opendocument.text-master",
                    extension: ["odm"]
                }, {
                    mime: "application/vnd.oasis.opendocument.text-template",
                    extension: ["ott"]
                }, {
                    mime: "application/vnd.oasis.opendocument.text-web",
                    extension: ["oth"]
                }, {
                    mime: "application/vnd.olpc-sugar",
                    extension: ["xo"]
                }, {
                    mime: "application/vnd.oma.dd2+xml",
                    extension: ["dd2"]
                }, {
                    mime: "application/vnd.openofficeorg.extension",
                    extension: ["oxt"]
                }, {
                    mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    extension: ["pptx"]
                }, {
                    mime: "application/vnd.openxmlformats-officedocument.presentationml.slide",
                    extension: ["sldx"]
                }, {
                    mime: "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
                    extension: ["ppsx"]
                }, {
                    mime: "application/vnd.openxmlformats-officedocument.presentationml.template",
                    extension: ["potx"]
                }, {
                    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    extension: ["xlsx"]
                }, {
                    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
                    extension: ["xltx"]
                }, {
                    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    extension: ["docx"]
                }, {
                    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
                    extension: ["dotx"]
                }, {
                    mime: "application/vnd.osgeo.mapguide.package",
                    extension: ["mgp"]
                }, {
                    mime: "application/vnd.osgi.dp",
                    extension: ["dp"]
                }, {
                    mime: "application/vnd.osgi.subsystem",
                    extension: ["esa"]
                }, {
                    mime: "application/vnd.palm",
                    extension: ["pdb", "pqa", "oprc"]
                }, {
                    mime: "application/vnd.pawaafile",
                    extension: ["paw"]
                }, {
                    mime: "application/vnd.pg.format",
                    extension: ["str"]
                }, {
                    mime: "application/vnd.pg.osasli",
                    extension: ["ei6"]
                }, {
                    mime: "application/vnd.picsel",
                    extension: ["efif"]
                }, {
                    mime: "application/vnd.pmi.widget",
                    extension: ["wg"]
                }, {
                    mime: "application/vnd.pocketlearn",
                    extension: ["plf"]
                }, {
                    mime: "application/vnd.powerbuilder6",
                    extension: ["pbd"]
                }, {
                    mime: "application/vnd.previewsystems.box",
                    extension: ["box"]
                }, {
                    mime: "application/vnd.proteus.magazine",
                    extension: ["mgz"]
                }, {
                    mime: "application/vnd.publishare-delta-tree",
                    extension: ["qps"]
                }, {
                    mime: "application/vnd.pvi.ptid1",
                    extension: ["ptid"]
                }, {
                    mime: "application/vnd.quark.quarkxpress",
                    extension: ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"]
                }, {
                    mime: "application/vnd.realvnc.bed",
                    extension: ["bed"]
                }, {
                    mime: "application/vnd.recordare.musicxml",
                    extension: ["mxl"]
                }, {
                    mime: "application/vnd.recordare.musicxml+xml",
                    extension: ["musicxml"]
                }, {
                    mime: "application/vnd.rig.cryptonote",
                    extension: ["cryptonote"]
                }, {
                    mime: "application/vnd.rim.cod",
                    extension: ["cod"]
                }, {
                    mime: "application/vnd.rn-realmedia",
                    extension: ["rm"]
                }, {
                    mime: "application/vnd.rn-realmedia-vbr",
                    extension: ["rmvb"]
                }, {
                    mime: "application/vnd.route66.link66+xml",
                    extension: ["link66"]
                }, {
                    mime: "application/vnd.sailingtracker.track",
                    extension: ["st"]
                }, {
                    mime: "application/vnd.seemail",
                    extension: ["see"]
                }, {
                    mime: "application/vnd.sema",
                    extension: ["sema"]
                }, {
                    mime: "application/vnd.semd",
                    extension: ["semd"]
                }, {
                    mime: "application/vnd.semf",
                    extension: ["semf"]
                }, {
                    mime: "application/vnd.shana.informed.formdata",
                    extension: ["ifm"]
                }, {
                    mime: "application/vnd.shana.informed.formtemplate",
                    extension: ["itp"]
                }, {
                    mime: "application/vnd.shana.informed.interchange",
                    extension: ["iif"]
                }, {
                    mime: "application/vnd.shana.informed.package",
                    extension: ["ipk"]
                }, {
                    mime: "application/vnd.simtech-mindmapper",
                    extension: ["twd", "twds"]
                }, {
                    mime: "application/vnd.smaf",
                    extension: ["mmf"]
                }, {
                    mime: "application/vnd.smart.teacher",
                    extension: ["teacher"]
                }, {
                    mime: "application/vnd.solent.sdkm+xml",
                    extension: ["sdkm", "sdkd"]
                }, {
                    mime: "application/vnd.spotfire.dxp",
                    extension: ["dxp"]
                }, {
                    mime: "application/vnd.spotfire.sfs",
                    extension: ["sfs"]
                }, {
                    mime: "application/vnd.stardivision.calc",
                    extension: ["sdc"]
                }, {
                    mime: "application/vnd.stardivision.draw",
                    extension: ["sda"]
                }, {
                    mime: "application/vnd.stardivision.impress",
                    extension: ["sdd"]
                }, {
                    mime: "application/vnd.stardivision.math",
                    extension: ["smf"]
                }, {
                    mime: "application/vnd.stardivision.writer",
                    extension: ["sdw", "vor"]
                }, {
                    mime: "application/vnd.stardivision.writer-global",
                    extension: ["sgl"]
                }, {
                    mime: "application/vnd.stepmania.package",
                    extension: ["smzip"]
                }, {
                    mime: "application/vnd.stepmania.stepchart",
                    extension: ["sm"]
                }, {
                    mime: "application/vnd.sun.xml.calc",
                    extension: ["sxc"]
                }, {
                    mime: "application/vnd.sun.xml.calc.template",
                    extension: ["stc"]
                }, {
                    mime: "application/vnd.sun.xml.draw",
                    extension: ["sxd"]
                }, {
                    mime: "application/vnd.sun.xml.draw.template",
                    extension: ["std"]
                }, {
                    mime: "application/vnd.sun.xml.impress",
                    extension: ["sxi"]
                }, {
                    mime: "application/vnd.sun.xml.impress.template",
                    extension: ["sti"]
                }, {
                    mime: "application/vnd.sun.xml.math",
                    extension: ["sxm"]
                }, {
                    mime: "application/vnd.sun.xml.writer",
                    extension: ["sxw"]
                }, {
                    mime: "application/vnd.sun.xml.writer.global",
                    extension: ["sxg"]
                }, {
                    mime: "application/vnd.sun.xml.writer.template",
                    extension: ["stw"]
                }, {
                    mime: "application/vnd.sus-calendar",
                    extension: ["sus", "susp"]
                }, {
                    mime: "application/vnd.svd",
                    extension: ["svd"]
                }, {
                    mime: "application/vnd.symbian.install",
                    extension: ["sis", "sisx"]
                }, {
                    mime: "application/vnd.syncml+xml",
                    extension: ["xsm"]
                }, {
                    mime: "application/vnd.syncml.dm+wbxml",
                    extension: ["bdm"]
                }, {
                    mime: "application/vnd.syncml.dm+xml",
                    extension: ["xdm"]
                }, {
                    mime: "application/vnd.tao.intent-module-archive",
                    extension: ["tao"]
                }, {
                    mime: "application/vnd.tcpdump.pcap",
                    extension: ["pcap", "cap", "dmp"]
                }, {
                    mime: "application/vnd.tmobile-livetv",
                    extension: ["tmo"]
                }, {
                    mime: "application/vnd.trid.tpt",
                    extension: ["tpt"]
                }, {
                    mime: "application/vnd.triscape.mxs",
                    extension: ["mxs"]
                }, {
                    mime: "application/vnd.trueapp",
                    extension: ["tra"]
                }, {
                    mime: "application/vnd.ufdl",
                    extension: ["ufd", "ufdl"]
                }, {
                    mime: "application/vnd.uiq.theme",
                    extension: ["utz"]
                }, {
                    mime: "application/vnd.umajin",
                    extension: ["umj"]
                }, {
                    mime: "application/vnd.unity",
                    extension: ["unityweb"]
                }, {
                    mime: "application/vnd.uoml+xml",
                    extension: ["uoml"]
                }, {
                    mime: "application/vnd.vcx",
                    extension: ["vcx"]
                }, {
                    mime: "application/vnd.visio",
                    extension: ["vsd", "vst", "vss", "vsw"]
                }, {
                    mime: "application/vnd.visionary",
                    extension: ["vis"]
                }, {
                    mime: "application/vnd.vsf",
                    extension: ["vsf"]
                }, {
                    mime: "application/vnd.wap.wbxml",
                    extension: ["wbxml"]
                }, {
                    mime: "application/vnd.wap.wmlc",
                    extension: ["wmlc"]
                }, {
                    mime: "application/vnd.wap.wmlscriptc",
                    extension: ["wmlsc"]
                }, {
                    mime: "application/vnd.webturbo",
                    extension: ["wtb"]
                }, {
                    mime: "application/vnd.wolfram.player",
                    extension: ["nbp"]
                }, {
                    mime: "application/vnd.wordperfect",
                    extension: ["wpd"]
                }, {
                    mime: "application/vnd.wqd",
                    extension: ["wqd"]
                }, {
                    mime: "application/vnd.wt.stf",
                    extension: ["stf"]
                }, {
                    mime: "application/vnd.xara",
                    extension: ["xar"]
                }, {
                    mime: "application/vnd.xfdl",
                    extension: ["xfdl"]
                }, {
                    mime: "application/vnd.yamaha.hv-dic",
                    extension: ["hvd"]
                }, {
                    mime: "application/vnd.yamaha.hv-script",
                    extension: ["hvs"]
                }, {
                    mime: "application/vnd.yamaha.hv-voice",
                    extension: ["hvp"]
                }, {
                    mime: "application/vnd.yamaha.openscoreformat",
                    extension: ["osf"]
                }, {
                    mime: "application/vnd.yamaha.openscoreformat.osfpvg+xml",
                    extension: ["osfpvg"]
                }, {
                    mime: "application/vnd.yamaha.smaf-audio",
                    extension: ["saf"]
                }, {
                    mime: "application/vnd.yamaha.smaf-phrase",
                    extension: ["spf"]
                }, {
                    mime: "application/vnd.yellowriver-custom-menu",
                    extension: ["cmp"]
                }, {
                    mime: "application/vnd.zul",
                    extension: ["zir", "zirz"]
                }, {
                    mime: "application/vnd.zzazz.deck+xml",
                    extension: ["zaz"]
                }, {
                    mime: "application/voicexml+xml",
                    extension: ["vxml"]
                }, {
                    mime: "application/widget",
                    extension: ["wgt"]
                }, {
                    mime: "application/winhlp",
                    extension: ["hlp"]
                }, {
                    mime: "application/wsdl+xml",
                    extension: ["wsdl"]
                }, {
                    mime: "application/wspolicy+xml",
                    extension: ["wspolicy"]
                }, {
                    mime: "application/x-7z-compressed",
                    extension: ["7z"]
                }, {
                    mime: "application/x-abiword",
                    extension: ["abw"]
                }, {
                    mime: "application/x-ace-compressed",
                    extension: ["ace"]
                }, {
                    mime: "application/x-apple-diskimage",
                    extension: ["dmg"]
                }, {
                    mime: "application/x-authorware-bin",
                    extension: ["aab", "x32", "u32", "vox"]
                }, {
                    mime: "application/x-authorware-map",
                    extension: ["aam"]
                }, {
                    mime: "application/x-authorware-seg",
                    extension: ["aas"]
                }, {
                    mime: "application/x-bcpio",
                    extension: ["bcpio"]
                }, {
                    mime: "application/x-bittorrent",
                    extension: ["torrent"]
                }, {
                    mime: "application/x-blorb",
                    extension: ["blb", "blorb"]
                }, {
                    mime: "application/x-bzip",
                    extension: ["bz"]
                }, {
                    mime: "application/x-bzip2",
                    extension: ["bz2", "boz"]
                }, {
                    mime: "application/x-cbr",
                    extension: ["cbr", "cba", "cbt", "cbz", "cb7"]
                }, {
                    mime: "application/x-cdlink",
                    extension: ["vcd"]
                }, {
                    mime: "application/x-cfs-compressed",
                    extension: ["cfs"]
                }, {
                    mime: "application/x-chat",
                    extension: ["chat"]
                }, {
                    mime: "application/x-chess-pgn",
                    extension: ["pgn"]
                }, {
                    mime: "application/x-conference",
                    extension: ["nsc"]
                }, {
                    mime: "application/x-cpio",
                    extension: ["cpio"]
                }, {
                    mime: "application/x-csh",
                    extension: ["csh"]
                }, {
                    mime: "application/x-debian-package",
                    extension: ["deb", "udeb"]
                }, {
                    mime: "application/x-dgc-compressed",
                    extension: ["dgc"]
                }, {
                    mime: "application/x-director",
                    extension: ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"]
                }, {
                    mime: "application/x-doom",
                    extension: ["wad"]
                }, {
                    mime: "application/x-dtbncx+xml",
                    extension: ["ncx"]
                }, {
                    mime: "application/x-dtbook+xml",
                    extension: ["dtb"]
                }, {
                    mime: "application/x-dtbresource+xml",
                    extension: ["res"]
                }, {
                    mime: "application/x-dvi",
                    extension: ["dvi"]
                }, {
                    mime: "application/x-envoy",
                    extension: ["evy"]
                }, {
                    mime: "application/x-eva",
                    extension: ["eva"]
                }, {
                    mime: "application/x-font-bdf",
                    extension: ["bdf"]
                }, {
                    mime: "application/x-font-ghostscript",
                    extension: ["gsf"]
                }, {
                    mime: "application/x-font-linux-psf",
                    extension: ["psf"]
                }, {
                    mime: "application/x-font-otf",
                    extension: ["otf"]
                }, {
                    mime: "application/x-font-pcf",
                    extension: ["pcf"]
                }, {
                    mime: "application/x-font-snf",
                    extension: ["snf"]
                }, {
                    mime: "application/x-font-ttf",
                    extension: ["ttf", "ttc"]
                }, {
                    mime: "application/x-font-type1",
                    extension: ["pfa", "pfb", "pfm", "afm"]
                }, {
                    mime: "application/x-font-woff",
                    extension: ["woff"]
                }, {
                    mime: "application/x-freearc",
                    extension: ["arc"]
                }, {
                    mime: "application/x-futuresplash",
                    extension: ["spl"]
                }, {
                    mime: "application/x-gca-compressed",
                    extension: ["gca"]
                }, {
                    mime: "application/x-glulx",
                    extension: ["ulx"]
                }, {
                    mime: "application/x-gnumeric",
                    extension: ["gnumeric"]
                }, {
                    mime: "application/x-gramps-xml",
                    extension: ["gramps"]
                }, {
                    mime: "application/x-gtar",
                    extension: ["gtar"]
                }, {
                    mime: "application/x-hdf",
                    extension: ["hdf"]
                }, {
                    mime: "application/x-install-instructions",
                    extension: ["install"]
                }, {
                    mime: "application/x-iso9660-image",
                    extension: ["iso"]
                }, {
                    mime: "application/x-java-jnlp-file",
                    extension: ["jnlp"]
                }, {
                    mime: "application/x-latex",
                    extension: ["latex"]
                }, {
                    mime: "application/x-lzh-compressed",
                    extension: ["lzh", "lha"]
                }, {
                    mime: "application/x-mie",
                    extension: ["mie"]
                }, {
                    mime: "application/x-mobipocket-ebook",
                    extension: ["prc", "mobi"]
                }, {
                    mime: "application/x-ms-application",
                    extension: ["application"]
                }, {
                    mime: "application/x-ms-shortcut",
                    extension: ["lnk"]
                }, {
                    mime: "application/x-ms-wmd",
                    extension: ["wmd"]
                }, {
                    mime: "application/x-ms-wmz",
                    extension: ["wmz"]
                }, {
                    mime: "application/x-ms-xbap",
                    extension: ["xbap"]
                }, {
                    mime: "application/x-msaccess",
                    extension: ["mdb"]
                }, {
                    mime: "application/x-msbinder",
                    extension: ["obd"]
                }, {
                    mime: "application/x-mscardfile",
                    extension: ["crd"]
                }, {
                    mime: "application/x-msclip",
                    extension: ["clp"]
                }, {
                    mime: "application/x-msdownload",
                    extension: ["exe", "dll", "com", "bat", "msi"]
                }, {
                    mime: "application/x-msmediaview",
                    extension: ["mvb", "m13", "m14"]
                }, {
                    mime: "application/x-msmetafile",
                    extension: ["wmf", "wmz", "emf", "emz"]
                }, {
                    mime: "application/x-msmoney",
                    extension: ["mny"]
                }, {
                    mime: "application/x-mspublisher",
                    extension: ["pub"]
                }, {
                    mime: "application/x-msschedule",
                    extension: ["scd"]
                }, {
                    mime: "application/x-msterminal",
                    extension: ["trm"]
                }, {
                    mime: "application/x-mswrite",
                    extension: ["wri"]
                }, {
                    mime: "application/x-netcdf",
                    extension: ["nc", "cdf"]
                }, {
                    mime: "application/x-nzb",
                    extension: ["nzb"]
                }, {
                    mime: "application/x-pkcs12",
                    extension: ["p12", "pfx"]
                }, {
                    mime: "application/x-pkcs7-certificates",
                    extension: ["p7b", "spc"]
                }, {
                    mime: "application/x-pkcs7-certreqresp",
                    extension: ["p7r"]
                }, {
                    mime: "application/x-rar-compressed",
                    extension: ["rar"]
                }, {
                    mime: "application/x-research-info-systems",
                    extension: ["ris"]
                }, {
                    mime: "application/x-sh",
                    extension: ["sh"]
                }, {
                    mime: "application/x-shar",
                    extension: ["shar"]
                }, {
                    mime: "application/x-shockwave-flash",
                    extension: ["swf"]
                }, {
                    mime: "application/x-silverlight-app",
                    extension: ["xap"]
                }, {
                    mime: "application/x-sql",
                    extension: ["sql"]
                }, {
                    mime: "application/x-stuffit",
                    extension: ["sit"]
                }, {
                    mime: "application/x-stuffitx",
                    extension: ["sitx"]
                }, {
                    mime: "application/x-subrip",
                    extension: ["srt"]
                }, {
                    mime: "application/x-sv4cpio",
                    extension: ["sv4cpio"]
                }, {
                    mime: "application/x-sv4crc",
                    extension: ["sv4crc"]
                }, {
                    mime: "application/x-t3vm-image",
                    extension: ["t3"]
                }, {
                    mime: "application/x-tads",
                    extension: ["gam"]
                }, {
                    mime: "application/x-tar",
                    extension: ["tar"]
                }, {
                    mime: "application/x-tcl",
                    extension: ["tcl"]
                }, {
                    mime: "application/x-tex",
                    extension: ["tex"]
                }, {
                    mime: "application/x-tex-tfm",
                    extension: ["tfm"]
                }, {
                    mime: "application/x-texinfo",
                    extension: ["texinfo", "texi"]
                }, {
                    mime: "application/x-tgif",
                    extension: ["obj"]
                }, {
                    mime: "application/x-ustar",
                    extension: ["ustar"]
                }, {
                    mime: "application/x-wais-source",
                    extension: ["src"]
                }, {
                    mime: "application/x-x509-ca-cert",
                    extension: ["der", "crt"]
                }, {
                    mime: "application/x-xfig",
                    extension: ["fig"]
                }, {
                    mime: "application/x-xliff+xml",
                    extension: ["xlf"]
                }, {
                    mime: "application/x-xpinstall",
                    extension: ["xpi"]
                }, {
                    mime: "application/x-xz",
                    extension: ["xz"]
                }, {
                    mime: "application/x-zmachine",
                    extension: ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"]
                }, {
                    mime: "application/xaml+xml",
                    extension: ["xaml"]
                }, {
                    mime: "application/xcap-diff+xml",
                    extension: ["xdf"]
                }, {
                    mime: "application/xenc+xml",
                    extension: ["xenc"]
                }, {
                    mime: "application/xhtml+xml",
                    extension: ["xhtml", "xht"]
                }, {
                    mime: "application/xml",
                    extension: ["xml", "xsl"]
                }, {
                    mime: "application/xml-dtd",
                    extension: ["dtd"]
                }, {
                    mime: "application/xop+xml",
                    extension: ["xop"]
                }, {
                    mime: "application/xproc+xml",
                    extension: ["xpl"]
                }, {
                    mime: "application/xslt+xml",
                    extension: ["xslt"]
                }, {
                    mime: "application/xspf+xml",
                    extension: ["xspf"]
                }, {
                    mime: "application/xv+xml",
                    extension: ["mxml", "xhvml", "xvml", "xvm"]
                }, {
                    mime: "application/yang",
                    extension: ["yang"]
                }, {
                    mime: "application/yin+xml",
                    extension: ["yin"]
                }, {
                    mime: "application/zip",
                    extension: ["zip"]
                }, {
                    mime: "audio/adpcm",
                    extension: ["adp"]
                }, {
                    mime: "audio/basic",
                    extension: ["au", "snd"]
                }, {
                    mime: "audio/midi",
                    extension: ["mid", "midi", "kar", "rmi"]
                }, {
                    mime: "audio/mp4",
                    extension: ["mp4a"]
                }, {
                    mime: "audio/mpeg",
                    extension: ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"]
                }, {
                    mime: "audio/ogg",
                    extension: ["oga", "ogg", "spx"]
                }, {
                    mime: "audio/s3m",
                    extension: ["s3m"]
                }, {
                    mime: "audio/silk",
                    extension: ["sil"]
                }, {
                    mime: "audio/vnd.dece.audio",
                    extension: ["uva", "uvva"]
                }, {
                    mime: "audio/vnd.digital-winds",
                    extension: ["eol"]
                }, {
                    mime: "audio/vnd.dra",
                    extension: ["dra"]
                }, {
                    mime: "audio/vnd.dts",
                    extension: ["dts"]
                }, {
                    mime: "audio/vnd.dts.hd",
                    extension: ["dtshd"]
                }, {
                    mime: "audio/vnd.lucent.voice",
                    extension: ["lvp"]
                }, {
                    mime: "audio/vnd.ms-playready.media.pya",
                    extension: ["pya"]
                }, {
                    mime: "audio/vnd.nuera.ecelp4800",
                    extension: ["ecelp4800"]
                }, {
                    mime: "audio/vnd.nuera.ecelp7470",
                    extension: ["ecelp7470"]
                }, {
                    mime: "audio/vnd.nuera.ecelp9600",
                    extension: ["ecelp9600"]
                }, {
                    mime: "audio/vnd.rip",
                    extension: ["rip"]
                }, {
                    mime: "audio/webm",
                    extension: ["weba"]
                }, {
                    mime: "audio/x-aac",
                    extension: ["aac"]
                }, {
                    mime: "audio/x-aiff",
                    extension: ["aif", "aiff", "aifc"]
                }, {
                    mime: "audio/x-caf",
                    extension: ["caf"]
                }, {
                    mime: "audio/x-flac",
                    extension: ["flac"]
                }, {
                    mime: "audio/x-matroska",
                    extension: ["mka"]
                }, {
                    mime: "audio/x-mpegurl",
                    extension: ["m3u"]
                }, {
                    mime: "audio/x-ms-wax",
                    extension: ["wax"]
                }, {
                    mime: "audio/x-ms-wma",
                    extension: ["wma"]
                }, {
                    mime: "audio/x-pn-realaudio",
                    extension: ["ram", "ra"]
                }, {
                    mime: "audio/x-pn-realaudio-plugin",
                    extension: ["rmp"]
                }, {
                    mime: "audio/x-wav",
                    extension: ["wav"]
                }, {
                    mime: "audio/xm",
                    extension: ["xm"]
                }, {
                    mime: "chemical/x-cdx",
                    extension: ["cdx"]
                }, {
                    mime: "chemical/x-cif",
                    extension: ["cif"]
                }, {
                    mime: "chemical/x-cmdf",
                    extension: ["cmdf"]
                }, {
                    mime: "chemical/x-cml",
                    extension: ["cml"]
                }, {
                    mime: "chemical/x-csml",
                    extension: ["csml"]
                }, {
                    mime: "chemical/x-xyz",
                    extension: ["xyz"]
                }, {
                    mime: "image/bmp",
                    extension: ["bmp"]
                }, {
                    mime: "image/cgm",
                    extension: ["cgm"]
                }, {
                    mime: "image/g3fax",
                    extension: ["g3"]
                }, {
                    mime: "image/gif",
                    extension: ["gif"]
                }, {
                    mime: "image/ief",
                    extension: ["ief"]
                }, {
                    mime: "image/jpeg",
                    extension: ["jpeg", "jpg", "jpe"]
                }, {
                    mime: "image/ktx",
                    extension: ["ktx"]
                }, {
                    mime: "image/png",
                    extension: ["png"]
                }, {
                    mime: "image/prs.btif",
                    extension: ["btif"]
                }, {
                    mime: "image/sgi",
                    extension: ["sgi"]
                }, {
                    mime: "image/svg+xml",
                    extension: ["svg", "svgz"]
                }, {
                    mime: "image/tiff",
                    extension: ["tiff", "tif"]
                }, {
                    mime: "image/vnd.adobe.photoshop",
                    extension: ["psd"]
                }, {
                    mime: "image/vnd.dece.graphic",
                    extension: ["uvi", "uvvi", "uvg", "uvvg"]
                }, {
                    mime: "image/vnd.dvb.subtitle",
                    extension: ["sub"]
                }, {
                    mime: "image/vnd.djvu",
                    extension: ["djvu", "djv"]
                }, {
                    mime: "image/vnd.dwg",
                    extension: ["dwg"]
                }, {
                    mime: "image/vnd.dxf",
                    extension: ["dxf"]
                }, {
                    mime: "image/vnd.fastbidsheet",
                    extension: ["fbs"]
                }, {
                    mime: "image/vnd.fpx",
                    extension: ["fpx"]
                }, {
                    mime: "image/vnd.fst",
                    extension: ["fst"]
                }, {
                    mime: "image/vnd.fujixerox.edmics-mmr",
                    extension: ["mmr"]
                }, {
                    mime: "image/vnd.fujixerox.edmics-rlc",
                    extension: ["rlc"]
                }, {
                    mime: "image/vnd.ms-modi",
                    extension: ["mdi"]
                }, {
                    mime: "image/vnd.ms-photo",
                    extension: ["wdp"]
                }, {
                    mime: "image/vnd.net-fpx",
                    extension: ["npx"]
                }, {
                    mime: "image/vnd.wap.wbmp",
                    extension: ["wbmp"]
                }, {
                    mime: "image/vnd.xiff",
                    extension: ["xif"]
                }, {
                    mime: "image/webp",
                    extension: ["webp"]
                }, {
                    mime: "image/x-3ds",
                    extension: ["3ds"]
                }, {
                    mime: "image/x-cmu-raster",
                    extension: ["ras"]
                }, {
                    mime: "image/x-cmx",
                    extension: ["cmx"]
                }, {
                    mime: "image/x-freehand",
                    extension: ["fh", "fhc", "fh4", "fh5", "fh7"]
                }, {
                    mime: "image/x-icon",
                    extension: ["ico"]
                }, {
                    mime: "image/x-mrsid-image",
                    extension: ["sid"]
                }, {
                    mime: "image/x-pcx",
                    extension: ["pcx"]
                }, {
                    mime: "image/x-pict",
                    extension: ["pic", "pct"]
                }, {
                    mime: "image/x-portable-anymap",
                    extension: ["pnm"]
                }, {
                    mime: "image/x-portable-bitmap",
                    extension: ["pbm"]
                }, {
                    mime: "image/x-portable-graymap",
                    extension: ["pgm"]
                }, {
                    mime: "image/x-portable-pixmap",
                    extension: ["ppm"]
                }, {
                    mime: "image/x-rgb",
                    extension: ["rgb"]
                }, {
                    mime: "image/x-tga",
                    extension: ["tga"]
                }, {
                    mime: "image/x-xbitmap",
                    extension: ["xbm"]
                }, {
                    mime: "image/x-xpixmap",
                    extension: ["xpm"]
                }, {
                    mime: "image/x-xwindowdump",
                    extension: ["xwd"]
                }, {
                    mime: "message/rfc822",
                    extension: ["eml", "mime"]
                }, {
                    mime: "model/iges",
                    extension: ["igs", "iges"]
                }, {
                    mime: "model/mesh",
                    extension: ["msh", "mesh", "silo"]
                }, {
                    mime: "model/vnd.collada+xml",
                    extension: ["dae"]
                }, {
                    mime: "model/vnd.dwf",
                    extension: ["dwf"]
                }, {
                    mime: "model/vnd.gdl",
                    extension: ["gdl"]
                }, {
                    mime: "model/vnd.gtw",
                    extension: ["gtw"]
                }, {
                    mime: "model/vnd.mts",
                    extension: ["mts"]
                }, {
                    mime: "model/vnd.vtu",
                    extension: ["vtu"]
                }, {
                    mime: "model/vrml",
                    extension: ["wrl", "vrml"]
                }, {
                    mime: "model/x3d+binary",
                    extension: ["x3db", "x3dbz"]
                }, {
                    mime: "model/x3d+vrml",
                    extension: ["x3dv", "x3dvz"]
                }, {
                    mime: "model/x3d+xml",
                    extension: ["x3d", "x3dz"]
                }, {
                    mime: "text/cache-manifest",
                    extension: ["appcache"]
                }, {
                    mime: "text/calendar",
                    extension: ["ics", "ifb"]
                }, {
                    mime: "text/css",
                    extension: ["css"]
                }, {
                    mime: "text/csv",
                    extension: ["csv"]
                }, {
                    mime: "text/html",
                    extension: ["html", "htm"]
                }, {
                    mime: "text/n3",
                    extension: ["n3"]
                }, {
                    mime: "text/plain",
                    extension: ["txt", "text", "conf", "def", "list", "log", "in"]
                }, {
                    mime: "text/prs.lines.tag",
                    extension: ["dsc"]
                }, {
                    mime: "text/richtext",
                    extension: ["rtx"]
                }, {
                    mime: "text/sgml",
                    extension: ["sgml", "sgm"]
                }, {
                    mime: "text/tab-separated-values",
                    extension: ["tsv"]
                }, {
                    mime: "text/troff",
                    extension: ["t", "tr", "roff", "man", "me", "ms"]
                }, {
                    mime: "text/turtle",
                    extension: ["ttl"]
                }, {
                    mime: "text/uri-list",
                    extension: ["uri", "uris", "urls"]
                }, {
                    mime: "text/vcard",
                    extension: ["vcard"]
                }, {
                    mime: "text/vnd.curl",
                    extension: ["curl"]
                }, {
                    mime: "text/vnd.curl.dcurl",
                    extension: ["dcurl"]
                }, {
                    mime: "text/vnd.curl.scurl",
                    extension: ["scurl"]
                }, {
                    mime: "text/vnd.curl.mcurl",
                    extension: ["mcurl"]
                }, {
                    mime: "text/vnd.dvb.subtitle",
                    extension: ["sub"]
                }, {
                    mime: "text/vnd.fly",
                    extension: ["fly"]
                }, {
                    mime: "text/vnd.fmi.flexstor",
                    extension: ["flx"]
                }, {
                    mime: "text/vnd.graphviz",
                    extension: ["gv"]
                }, {
                    mime: "text/vnd.in3d.3dml",
                    extension: ["3dml"]
                }, {
                    mime: "text/vnd.in3d.spot",
                    extension: ["spot"]
                }, {
                    mime: "text/vnd.sun.j2me.app-descriptor",
                    extension: ["jad"]
                }, {
                    mime: "text/vnd.wap.wml",
                    extension: ["wml"]
                }, {
                    mime: "text/vnd.wap.wmlscript",
                    extension: ["wmls"]
                }, {
                    mime: "text/x-asm",
                    extension: ["s", "asm"]
                }, {
                    mime: "text/x-c",
                    extension: ["c", "cc", "cxx", "cpp", "h", "hh", "dic"]
                }, {
                    mime: "text/x-fortran",
                    extension: ["f", "for", "f77", "f90"]
                }, {
                    mime: "text/x-java-source",
                    extension: ["java"]
                }, {
                    mime: "text/x-opml",
                    extension: ["opml"]
                }, {
                    mime: "text/x-pascal",
                    extension: ["p", "pas"]
                }, {
                    mime: "text/x-nfo",
                    extension: ["nfo"]
                }, {
                    mime: "text/x-setext",
                    extension: ["etx"]
                }, {
                    mime: "text/x-sfv",
                    extension: ["sfv"]
                }, {
                    mime: "text/x-uuencode",
                    extension: ["uu"]
                }, {
                    mime: "text/x-vcalendar",
                    extension: ["vcs"]
                }, {
                    mime: "text/x-vcard",
                    extension: ["vcf"]
                }, {
                    mime: "video/3gpp",
                    extension: ["3gp"]
                }, {
                    mime: "video/3gpp2",
                    extension: ["3g2"]
                }, {
                    mime: "video/h261",
                    extension: ["h261"]
                }, {
                    mime: "video/h263",
                    extension: ["h263"]
                }, {
                    mime: "video/h264",
                    extension: ["h264"]
                }, {
                    mime: "video/jpeg",
                    extension: ["jpgv"]
                }, {
                    mime: "video/jpm",
                    extension: ["jpm", "jpgm"]
                }, {
                    mime: "video/mj2",
                    extension: ["mj2", "mjp2"]
                }, {
                    mime: "video/mp4",
                    extension: ["mp4", "mp4v", "mpg4"]
                }, {
                    mime: "video/mpeg",
                    extension: ["mpeg", "mpg", "mpe", "m1v", "m2v"]
                }, {
                    mime: "video/ogg",
                    extension: ["ogv"]
                }, {
                    mime: "video/quicktime",
                    extension: ["qt", "mov"]
                }, {
                    mime: "video/vnd.dece.hd",
                    extension: ["uvh", "uvvh"]
                }, {
                    mime: "video/vnd.dece.mobile",
                    extension: ["uvm", "uvvm"]
                }, {
                    mime: "video/vnd.dece.pd",
                    extension: ["uvp", "uvvp"]
                }, {
                    mime: "video/vnd.dece.sd",
                    extension: ["uvs", "uvvs"]
                }, {
                    mime: "video/vnd.dece.video",
                    extension: ["uvv", "uvvv"]
                }, {
                    mime: "video/vnd.dvb.file",
                    extension: ["dvb"]
                }, {
                    mime: "video/vnd.fvt",
                    extension: ["fvt"]
                }, {
                    mime: "video/vnd.mpegurl",
                    extension: ["mxu", "m4u"]
                }, {
                    mime: "video/vnd.ms-playready.media.pyv",
                    extension: ["pyv"]
                }, {
                    mime: "video/vnd.uvvu.mp4",
                    extension: ["uvu", "uvvu"]
                }, {
                    mime: "video/vnd.vivo",
                    extension: ["viv"]
                }, {
                    mime: "video/webm",
                    extension: ["webm"]
                }, {
                    mime: "video/x-f4v",
                    extension: ["f4v"]
                }, {
                    mime: "video/x-fli",
                    extension: ["fli"]
                }, {
                    mime: "video/x-flv",
                    extension: ["flv"]
                }, {
                    mime: "video/x-m4v",
                    extension: ["m4v"]
                }, {
                    mime: "video/x-matroska",
                    extension: ["mkv", "mk3d", "mks"]
                }, {
                    mime: "video/x-mng",
                    extension: ["mng"]
                }, {
                    mime: "video/x-ms-asf",
                    extension: ["asf", "asx"]
                }, {
                    mime: "video/x-ms-vob",
                    extension: ["vob"]
                }, {
                    mime: "video/x-ms-wm",
                    extension: ["wm"]
                }, {
                    mime: "video/x-ms-wmv",
                    extension: ["wmv"]
                }, {
                    mime: "video/x-ms-wmx",
                    extension: ["wmx"]
                }, {
                    mime: "video/x-ms-wvx",
                    extension: ["wvx"]
                }, {
                    mime: "video/x-msvideo",
                    extension: ["avi"]
                }, {
                    mime: "video/x-sgi-movie",
                    extension: ["movie"]
                }, {
                    mime: "video/x-smv",
                    extension: ["smv"]
                }, {
                    mime: "x-conference/x-cooltalk",
                    extension: ["ice"]
                }];
                return mimes;
            }

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

                /**
                 * @ngdoc function
                 * @name es.Services.Web.esGlobals#getVersion
                 * @methodOf es.Services.Web.esGlobals
                 * @module es.Services.Web
                 * @kind function
                 * @description Function that returns the current version of the Entersoft AngularJS API.
                 * @return {object} A JSON object representing the current version of the Entersoft AngularJS API in sem-ver semantics
```js
var esAPIversion = {
    Major: int, // i.e. 1
    Minor: int, // i.e. 0
    Patch: int // i.e. 1
}
```
                **/
                getVersion: function() {
                    return esAngularAPIVer;
                },

                /**
                 * @ngdoc function
                 * @name es.Services.Web.esGlobals#getMimeTypeForExt
                 * @methodOf es.Services.Web.esGlobals
                 * @module es.Services.Web
                 * @kind function
                 * @description Function that returns the mime-type for the given input filename or extension.
                 * 
                 * **REQUIRES ESWebAPIServer >= 1.7.9**
                 * 
                 * @param {string} filenamewithext the fullpath or just the filename or just the extension for which we want to have the corresponding mime-type
                 * i.e. "/abc/xyz/masterfile.pdf" or "docx" or ".xlsx", etc.
                 * @return {string} The mime-type string for the extension or filename provided in the _filenamewithext_ param. If no mime-type is registered for 
                 * this extension the function returns an empty string ''.
                 * @example
                 * 
```js
var mimeType = esGlobals.getMimeTypeForExt("myfile.docx");
// mimeType will be "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
```
                */
                getMimeTypeForExt: function(filenamewithext) {
                    if (!filenamewithext) {
                        return "";
                    }
                    var parts = filenamewithext.split(".");
                    var ext = parts[parts.length - 1].toLowerCase();
                    if (!ext) {
                        return "";
                    }

                    var mime = _.find(getMimeTypes(), function(x) {
                        return x.extension.indexOf(ext) != -1;
                    });
                    if (mime) {
                        return mime.mime;
                    }
                    return "";
                },

                /**
                 * @ngdoc function
                 * @name es.Services.Web.esGlobals#getExtensionsForMimeType
                 * @methodOf es.Services.Web.esGlobals
                 * @module es.Services.Web
                 * @kind function
                 * @description Function that returns an array of extensions that match the given mimeType
                 * 
                 * **REQUIRES ESWebAPIServer >= 1.7.9**
                 * 
                 * @param {string} mimeType The mimeType string for which we want the string array of extensions that are mapped to this mimeType
                 * @return {array} The array of strings that are mapped to this mimeType. If no map is found, an empty array i.e. [] will be returned
                 * @example
                 * 
```js
var exts = esGlobals.getExtensionsForMimeType("text/plain");
//exts will be ["txt", "text", "conf", "def", "list", "log", "in"]
```
                */
                getExtensionsForMimeType: function(mimeType) {
                    if (!mimeType) {
                        return [];
                    }

                    mimeType = mimeType.toLowerCase();
                    var mime = _.find(getMimeTypes(), function(x) {
                        return x.mime == mimeType;
                    });

                    if (mime) {
                        return mime.extension;
                    }
                    return [];
                },

                getGA: fgetGA,

                getWebApiToken: function() {
                    return esClientSession.getWebApiToken();
                },

                getClientSession: function() {
                    return esClientSession;
                },

                /**
                 * @ngdoc function
                 * @name es.Services.Web.esGlobals#getUserMessage
                 * @methodOf es.Services.Web.esGlobals
                 * @module es.Services.Web
                 * @kind function
                 * @description This function is used to process the error obejct as well as the status code of any type of error in order to get the best match
                 * for a user **Error Message** string to be presented to the user.
                 * @param {object} err The error object we got from i.e. http or promise failure. 
                 * @param {int=} status The status int code we got from an http or promise failure
                 * @return {string} The string for the best match for user message
                 * @example
```js
smeControllers.controller('mainCtrl', ['$location', '$scope', '$log', 'esMessaging', 'esWebApi', 'esGlobals',
    function($location, $scope, $log, esMessaging, esWebApiService, esGlobals) {

        // other things to do

        esMessaging.subscribe("ES_HTTP_CORE_ERR", function(rejection, status) {
            var s = esGlobals.getUserMessage(rejection, status);
            $scope.esnotify.error(s);
        });
    }
]);
```             **/
                getUserMessage: getUserMessage,

                sessionClosed: function() {
                    esClientSession.setModel(null);
                },

                trackTimer: function(category, variable, opt_label) {
                    return new TrackTiming(category, variable, opt_label);
                },

                sessionOpened: function(data, credentials) {
                    try {
                        data.Model.LangID = data.Model.LangID || credentials.LangID;
                        data.Model.LangID = data.Model.LangID || "el-GR";

                        data.Model.BranchID = data.Model.BranchID || credentials.BranchID || "-";
                        
                        esClientSession.setModel(data.Model);

                        var esga = fgetGA();
                        if (angular.isDefined(esga)) {
                            esga.registerEventTrack({
                                category: 'AUTH',
                                action: 'LOGIN',
                                label: data.Model.GID
                            });
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


    esWebFramework.run(['esGlobals', 'esWebApi', function(esGlobals, esWebApi) {
        /*
        var esSession = esGlobals.getClientSession();
        esSession.getModel();
        esSession.hostUrl = esWebApi.getServerUrl();
        */
    }]);
})();


(function() {
    'use strict';

    var esWebFramework = angular.module('es.Services.Web');

    /**
     * @ngdoc service
     * @name es.Services.Web.esStackTrace
     * @description
     * # esStackTrace and other services
     * Factory used to provide the stacktracejs javascript library for complete stack trace error reporting.
     */
    esWebFramework.factory(
        "esStackTrace",

        /**
         * @ngdoc
         * @name es.Services.Web.esStackTrace#print
         * @methodOf es.Services.Web.esStackTrace
         *
         * @description
         * Method that returns the printStackTrace object from the corresponding javascript library.
         * For more information on printStackTrace please see {@link https://github.com/stacktracejs/stacktrace.js/ stacktrace.js}
         * @returns {function} printStackTrace
         **/
        function() {
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
                    lt.setCustomField("branchId", session.connectionModel.BranchID);
                    lt.setCustomField("langId", session.connectionModel.LangID);
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

                $get: ['esMessaging',
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

                $get: ['$log', '$window', 'esStackTrace', '$injector',
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
                                    var ESWEBAPI = $injector.get('esWebApi');

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

/**
 * @ngdoc overview
 * @name es.Web.UI
 * @module es.Web.UI
 * @kind module
 * @description
 * This module encapsulates a set of directives, filters, services and methods for UI
 */

(function() {
    'use strict';
    var esWEBUI = angular.module('es.Web.UI', ['ngAnimate', 'ui.bootstrap']);

    esWEBUI.run(['esMessaging', function(esMessaging) {

        esMessaging.subscribe("AUTH_CHANGED", function(sess, apitoken) {
            if (!kendo) {
                return;
            }
            if (sess && sess.connectionModel && sess.connectionModel.LangID) {
                kendo.culture(sess.connectionModel.LangID);
            } else {
                kendo.culture("el-GR");
            }
        });
    }]);

    var dateRangeResolve = function(dateVal) {
        if (!dateVal || !dateVal.dRange) {
            return '';
        }

        var d = new Date();

        var dObj = _.findWhere(esDateRangeOptions, {
            dValue: dateVal.dRange
        });
        if (!dObj) {
            return '';
        }

        var loc = "el-GR";
        var injector = angular.element(document.querySelector('[ng-app]')).injector();

        var v = injector.get('esGlobals');
        if (v) {
            var t = v.getClientSession();
            if (t && t.connectionModel && t.connectionModel.LangID) {
                loc = t.connectionModel.LangID;
            }
        }

        switch (dObj.dType) {
            case 0:
                {
                    if (!angular.isDate(dateVal.fromD) && !angular.isDate(dateVal.toD)) {
                        return "";
                    }

                    var s = "";
                    if (angular.isDate(dateVal.fromD)) {
                        s = dateVal.fromD.toLocaleDateString(loc);
                    }
                    s = s + " - ";

                    var toS = "";
                    if (angular.isDate(dateVal.toD)) {
                        toS = dateVal.toD.toLocaleDateString(loc);
                    }
                    s = s + toS;
                    return s;
                }
            case 1:
                {
                    if (!angular.isDate(dateVal.fromD)) {
                        return "";
                    }
                    return dateVal.fromD.toLocaleDateString(loc);
                }
            case 2:
                return "";
            case 3:
                return d.toLocaleDateString(loc);
            case 4:
                return "-> " + d.toLocaleDateString(loc);
            case 5:
                return d.toLocaleDateString(loc) + " ->";
            case 6:
                {
                    d.setDate(d.getDate() - 1);
                    return d.toLocaleDateString(loc);
                }
            case 7:
                {
                    d.setDate(d.getDate() - 1);
                    return d.toLocaleDateString(loc) + " ->";
                }
            case 8:
                {
                    d.setDate(d.getDate() + 1);
                    return d.toLocaleDateString(loc);
                }
            case 9:
                {
                    d.setDate(d.getDate() + 1);
                    return d.toLocaleDateString(loc) + " ->";
                }
            case 10:
                {
                    var cDay = d.getDay();
                    var sDiff = (cDay == 0) ? 6 : (cDay - 1);

                    var f = new Date(d);
                    var t = new Date(d);
                    f.setDate(d.getDate() - sDiff);
                    t.setDate(f.getDate() + 6);

                    return f.toLocaleDateString(loc) + " - " + t.toLocaleDateString(loc);
                }
            case 11:
                {
                    d.setDate(d.getDate() - 7);

                    var cDay = d.getDay();
                    var sDiff = (cDay == 0) ? 6 : (cDay - 1);

                    var f = new Date(d);
                    var t = new Date(d);
                    f.setDate(d.getDate() - sDiff);
                    t.setDate(f.getDate() + 6);

                    return f.toLocaleDateString(loc) + " - " + t.toLocaleDateString(loc);
                }
            case 12:
                {
                    d.setDate(d.getDate() + 7);

                    var cDay = d.getDay();
                    var sDiff = (cDay == 0) ? 6 : (cDay - 1);

                    var f = new Date(d);
                    var t = new Date(d);
                    f.setDate(d.getDate() - sDiff);
                    t.setDate(f.getDate() + 6);

                    return f.toLocaleDateString(loc) + " - " + t.toLocaleDateString(loc);
                }
            case 13:
                {
                    d.setDate(1);

                    var f = new Date(d.getFullYear(), d.getMonth() + 1, 0);
                    return d.toLocaleDateString(loc) + " - " + f.toLocaleDateString(loc);
                }
            case 14:
                {
                    d.setDate(1);
                    return d.toLocaleDateString(loc) + " ->";
                }
            case 15:
                {
                    var f = new Date(d.getFullYear(), d.getMonth() + 1, 0);
                    return "-> " + f.toLocaleDateString(loc);
                }
            case 16:
                {
                    var f = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    var t = new Date(d.getFullYear(), d.getMonth(), 0);
                    return f.toLocaleDateString(loc) + " - " + t.toLocaleDateString(loc);
                }
            case 17:
                {
                    var f = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    return f.toLocaleDateString(loc) + " ->";
                }
            case 18:
                {
                    var f = new Date(d.getFullYear(), d.getMonth(), 0);
                    return "-> " + f.toLocaleDateString(loc);
                }
            case 19:
                {
                    var m = d.getMonth();
                    var r = m % 3;

                    var f = new Date(d.getFullYear(), m - r, 1);
                    var t = new Date(d.getFullYear(), m + (3 - r), 0);
                    return f.toLocaleDateString(loc) + " -> " + t.toLocaleDateString(loc);
                }
            case 20:
                {
                    var m = d.getMonth();
                    var r = m % 3;

                    var t = new Date(d.getFullYear(), m - r, 0);
                    var f = new Date(d.getFullYear(), t.getMonth() - 2, 1);
                    return f.toLocaleDateString(loc) + " -> " + t.toLocaleDateString(loc);
                }
            case 21:
                {
                    var f = new Date(d.getFullYear(), (m >= 6) ? 6 : 0, 1);
                    var t = new Date(d.getFullYear(), (m >= 6) ? 11 : 5, (m >= 6) ? 31 : 30);
                    return f.toLocaleDateString(loc) + " -> " + t.toLocaleDateString(loc);
                }
            case 22:
                {
                    var f;
                    var t;
                    var y = d.getFullYear();
                    if (m >= 6) {
                        f = new Date(y, 0, 1);
                        t = new Date(y, 5, 30);
                    } else {
                        f = new Date(y - 1, 6, 1);
                        t = new Date(y - 1, 11, 31);
                    }

                    return f.toLocaleDateString(loc) + " -> " + t.toLocaleDateString(loc);
                }

            case 23:
                {
                    var y = d.getFullYear();
                    var f = new Date(y, 0, 1);
                    var t = new Date(y, 11, 31);
                    return f.toLocaleDateString(loc) + " -> " + t.toLocaleDateString(loc);
                }

            case 24:
                {
                    var y = d.getFullYear() - 1;
                    var f = new Date(y, 0, 1);
                    var t = new Date(y, 11, 31);
                    return f.toLocaleDateString(loc) + " -> " + t.toLocaleDateString(loc);
                }
            default:
                return dObj.title;
        }
    }


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
        caption: "[]",
        value: "RANGE"
    }, {
        caption: "Κενό",
        value: "NULL"
    }, {
        caption: "Μη κενό",
        value: "NOTNULL"
    }];

    var dDateRangeClass = {
        6: [0, 1, 2, 3, 6, 8, 10, 11, 12, 13, 16, 19, 20, 21, 22, 23, 24],
        20: [0, 1, 25, 26, 27, 28, 29, 30],
    };

    var esDateRangeOptions = [{
        dValue: "0",
        dType: 0,
        title: "Specific Date Range"
    }, {
        dValue: "1",
        dType: 1,
        title: "Specific Date"
    }, {
        dValue: 'ESDateRange(SpecificDate, #9999/01/01#, SpecificDate, #1753/01/01#)',
        dType: 2,
        title: "Anything"
    }, {
        dValue: "ESDateRange(Day)",
        dType: 3,
        title: "Today"
    }, {
        dValue: 'ESDateRange(SpecificDate, #1753/01/01#, Day, 0)',
        dType: 4,
        title: "Up Today"
    }, {
        dValue: 'ESDateRange(Day, 0, SpecificDate, #9999/01/01#)',
        dType: 5,
        title: "Starting from Today"
    }, {
        dValue: "ESDateRange(Day, -1)",
        dType: 6,
        title: "Yesterday"
    }, {
        dValue: 'ESDateRange(SpecificDate, #1753/01/01#, Day, -1)',
        dType: 7,
        title: "Up To Yesterday"
    }, {
        dValue: "ESDateRange(Day, 1)",
        dType: 8,
        title: "Tomorrow"
    }, {
        dValue: 'ESDateRange(Day, 1, SpecificDate, #9999/01/01#)',
        dType: 9,
        title: "Starting from Tomorrow"
    }, {
        dValue: "ESDateRange(Week)",
        dType: 10,
        title: "Current week"
    }, {
        dValue: "ESDateRange(Week, -1)",
        dType: 11,
        title: "Previous week"
    }, {
        dValue: "ESDateRange(Week, 1)",
        dType: 12,
        title: "Next week"
    }, {
        dValue: "ESDateRange(Month)",
        dType: 13,
        title: "Current month"
    }, {
        dValue: 'ESDateRange(Month, 0, SpecificDate, #9999/01/01#)',
        dType: 14,
        title: "Since 1st of month"
    }, {
        dValue: 'ESDateRange(SpecificDate, #1753/01/01#, Month, 0)',
        dType: 15,
        title: "Up to end of month"
    }, {
        dValue: "ESDateRange(Month, -1)",
        dType: 16,
        title: "Last month"
    }, {
        dValue: 'ESDateRange(Month, -1, SpecificDate, #9999/01/01#)',
        dType: 17,
        title: "Since 1st of last month"
    }, {
        dValue: 'ESDateRange(SpecificDate, #1753/01/01#, Month, -1)',
        dType: 18,
        title: "Up to end of last month"
    }, {
        dValue: "ESDateRange(Quarter)",
        dType: 19,
        title: "Current quarter"
    }, {
        dValue: "ESDateRange(Quarter, -1)",
        dType: 20,
        title: "Last quarter"
    }, {
        dValue: "ESDateRange(SixMonth)",
        dType: 21,
        title: "This HY"
    }, {
        dValue: "ESDateRange(SixMonth, -1)",
        dType: 22,
        title: "Last HY"
    }, {
        dValue: "ESDateRange(Year)",
        dType: 23,
        title: "Current Year"
    }, {
        dValue: "ESDateRange(Year, -1)",
        dType: 24,
        title: "Last Year"
    }, {
        dValue: "ESDateRange(FiscalPeriod, 0)",
        dType: 25,
        title: "Current Fiscal Period"
    }, {
        dValue: "ESDateRange(FiscalYear, 0, Day, 0)",
        dType: 26,
        title: "Since start of FY up today"
    }, {
        dValue: "ESDateRange(FiscalYear, 0, FiscalPeriod, 0)",
        dType: 27,
        title: "Since start of FY up to end of Fiscal Period"
    }, {
        dValue: "ESDateRange(FiscalPeriod, -1)",
        dType: 28,
        title: "Last Fiscal Period"
    }, {
        dValue: "ESDateRange(FiscalPeriod, -1, Day, 0)",
        dType: 29,
        title: "Since start of last Fiscal Period up today"
    }, {
        dValue: "ESDateRange(FiscalYear, 0, FiscalPeriod, -1)",
        dType: 30,
        title: "Since start of FY up to last Fiscal Period"
    }, ];

    function ESParamVal(paramId, paramVal) {
        this.paramCode = paramId;
        this.paramValue = paramVal;
    }

    ESParamVal.prototype.getExecuteVal = function() {
        return this.paramValue;
    };

    ESParamVal.prototype.strVal = function() {
        return this.paramValue ? this.paramValue.toString() : '';
    };

    function ESNumericParamVal(paramId, paramVal) {
        //call super constructor
        ESParamVal.call(this, paramId, paramVal);
    }

    //inherit from ESParamval SuperClass
    ESNumericParamVal.prototype = Object.create(ESParamVal.prototype);

    ESNumericParamVal.prototype.strVal = function() {
        var zero = 0;
        zero = zero.toString();
        var froms = this.paramValue.value ? this.paramValue.value.toString() : zero;
        var tos = this.paramValue.valueTo ? this.paramValue.valueTo.toString() : zero;
        switch (this.paramValue.oper) {
            case "RANGE":
                return "ΑΠΟ " + froms + " ΕΩΣ " + tos;

            case "NULL":
                return "KENO";

            case "NOTNULL":
                return "MH KENO";

            default:
                return this.paramValue.oper.toString() + " " + froms;
        }
    }

    ESNumericParamVal.prototype.getExecuteVal = function() {
        this.paramValue.value = this.paramValue.value || 0;
        this.paramValue.valueTo = this.paramValue.valueTo || 0;

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

    ESStringParamVal.prototype.strVal = function() {
        var froms = this.paramValue.value ? this.paramValue.value.toString() : '';
        var tos = this.paramValue.valueTo ? this.paramValue.valueTo.toString() : '';
        switch (this.paramValue.oper) {
            case "RANGE":
                return "ΑΠΟ " + froms + " ΕΩΣ " + tos;

            case "NULL":
                return "KENO";

            case "NOTNULL":
                return "MH KENO";

            default:
                return this.paramValue.oper.toString() + " " + froms;
        }
    }

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

    function ESDateParamVal(paramId, paramVal) {
        //call super constructor
        //param id will be given at a later assignment
        if (!paramVal) {
            paramVal = {
                // empty date range is treated as ANYTHING
                dRange: 'ESDateRange(SpecificDate, #9999/01/01#, SpecificDate, #1753/01/01#)',
                fromD: null,
                toD: null
            };
        }
        ESParamVal.call(this, paramId, paramVal);
    }

    ESDateParamVal.prototype = Object.create(ESParamVal.prototype);

    ESDateParamVal.prototype.strVal = function() {
        return dateRangeResolve(this.paramValue);
    }

    ESDateParamVal.prototype.getExecuteVal = function() {
        var s = this.paramValue.dRange;
        if (s == "0" || s == "1") {
            var sFromD = "#1753/01/01#";
            var sToD = "#9999/01/01#";
            var isEmpty = true;

            // Fix the fromD
            var mFromD = moment(this.paramValue.fromD);
            if (mFromD.isValid()) {
                isEmpty = false;
                sFromD = mFromD.format('YYYY/MM/DD');
            }

            var mToD = moment(this.paramValue.toD);
            if (mToD.isValid()) {
                isEmpty = false;
                sToD = mToD.format('YYYY/MM/DD');
            }

            if (s == "0" || isEmpty) {
                return "ESDateRange(SpecificDate, " + "#" + sFromD + "#" + ", SpecificDate, " + "#" + sToD + "#" + ")";
            }

            return "ESDateRange(SpecificDate, " + "#" + sFromD + "#" + ")";
        }

        return this.paramValue.dRange;
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

                if (p.paramValue || (angular.isNumber(p.paramValue) && p.paramValue == 0)) {
                    ret[p.paramCode] = p.getExecuteVal();
                }
            }
        }
        return ret;
    }

    function prepareStdZoom($log, zoomID, esWebApiService, useCache) {
        var xParam = {
            transport: {
                read: function(options) {

                    $log.info("FETCHing ZOOM data for [", zoomID, "] with options ", JSON.stringify(options));

                    var pqOptions = {};
                    esWebApiService.fetchStdZoom(zoomID, pqOptions, useCache)
                        .then(function(ret) {
                            var pq = ret.data;

                            // SME CHANGE THIS ONCE WE HAVE CORRECT PQ
                            if (pq.Count == -1) {
                                pq.Count = pq.Rows ? pq.Rows.length : 0;
                            }
                            // END tackling

                            options.success(pq);
                            $log.info("FETCHed ZOOM data for [", zoomID, "] with options ", JSON.stringify(options));
                        }, function(err) {
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

    /**
     * @ngdoc filter
     * @name es.Web.UI.filter:esTrustHtml
     *
     * @description
     * Creates `esGrid` Directive
     * * If `source` is not an object or array (inc. `null` and `undefined`), `source` is returned.
     * * If `source` is identical to 'destination' an exception will be thrown.
     *
     * @requires $sce
     */
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

                var pt = pParam.parameterType.toLowerCase();

                //ESDateRange
                if (pt.indexOf("entersoft.framework.platform.esdaterange, queryprocess") == 0) {
                    return "esParamDateRange";
                }

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
        /**
         * @ngdoc directive
         * @name es.Web.UI.directive:esGrid
         * @requires es.Services.Web.esWebApi Entersoft AngularJS WEB API for Entersoft Application Server
         * @requires es.Web.UI.esUIHelper
         * @requires $log
         * @restrict AE
         * @param {template} esGroupId The Entersoft Public Query Group ID
         * @param {template} esFilterId The Entersoft Public Query Filter ID
         * @param {esGridInfoOptions=} esGridOptions should grid options are already available you can explicitly assign
         * @param {object=} esExecuteParams Params object that will be used when executing the public query
         *
         * @description
         *
         * **TBD**
         * This directive is responsible to render the html for the presentation of the results / data of an Entersoft Public Query.
         * The esGrid generates a Telerik kendo-grid web ui element {@link http://docs.telerik.com/KENDO-UI/api/javascript/ui/grid kendo-grid}.
         * 
         * In order to instantiate an esGrid with an Angular application, you have to provide the parameters esGroupId and esFilterId are required.
         * These two parameters along with esExecuteParams will be supplied to the {@link es.Web.UI.esUIHelper#methods_esGridInfoToKInfo esToKendoTransform function}
         */
        .directive('esGrid', ['esWebApi', 'esUIHelper', '$log', function(esWebApiService, esWebUIHelper, $log) {
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
                link: function($scope, iElement, iAttrs) {
                    if (!$scope.esGroupId || !$scope.esFilterId) {
                        throw "You must set GroupID and FilterID for esgrid to work";
                    }

                    if (!$scope.esGridOptions && !iAttrs.esGridOptions) {
                        // Now esGridOption explicitly assigned so ask the server 
                        esWebApiService.fetchPublicQueryInfo($scope.esGroupId, $scope.esFilterId)
                            .then(function(ret) {
                                var p1 = ret.data;
                                var p2 = esWebUIHelper.winGridInfoToESGridInfo($scope.esGroupId, $scope.esFilterId, p1);
                                $scope.esGridOptions = esWebUIHelper.esGridInfoToKInfo(esWebApiService, $scope.esGroupId, $scope.esFilterId, $scope.esExecuteParams, p2);
                            });
                    }
                }
            };
        }])
        /**
         * @ngdoc directive
         * @name es.Web.UI.directive:esParam
         * @function
         *
         * @description
         * **TBD**
         *
         * 
         */
        .directive('esParam', ['$log', '$uibModal', 'esWebApi', 'esUIHelper', function($log, $uibModal, esWebApiService, esWebUIHelper) {
            return {
                restrict: 'AE',
                scope: {
                    esParamDef: "=",
                    esParamVal: "=",
                    esType: "="
                },
                template: '<div ng-include src="\'src/partials/\'+esType+\'.html\'"></div>',
                link: function($scope, iElement, iAttrs) {

                    if (!$scope.esParamDef) {
                        throw "You must set a param";
                    }

                    $scope.esWebUIHelper = esWebUIHelper;
                    $scope.esWebApiService = esWebApiService;

                    if ($scope.esParamDef.invSelectedMasterTable) {
                        $scope.esParamLookupDS = prepareStdZoom($log, $scope.esParamDef.invSelectedMasterTable, esWebApiService);
                    }

                    // Case Date Range
                    if ($scope.esParamDef.controlType == 6 || $scope.esParamDef.controlType == 20) {
                        $scope.dateRangeOptions = esWebUIHelper.getesDateRangeOptions($scope.esParamDef.controlType);
                        $scope.dateRangeResolution = function() {
                            return "Hello World, I am parameter " + $scope.esParamDef.caption;
                        }
                    }
                }
            };
        }])
        /**
         * @ngdoc directive
         * @name es.Web.UI.directive:esWebPq
         * @element div
         * @function
         *
         * @description
         * **TBD**
         *
         * 
         */
        .directive('esWebPq', ['$log', 'esWebApi', 'esUIHelper', function($log, esWebApiService, esWebUIHelper) {
            return {
                restrict: 'AE',
                scope: {
                    esGroupId: "=",
                    esFilterId: "=",
                    esGridOptions: "=",
                    esParamsValues: "=",
                },
                templateUrl: function(element, attrs) {
                    $log.info("Parameter element = ", element, " Parameter attrs = ", attrs);
                    return "src/partials/esWebPQ.html";
                },
                link: function($scope, iElement, iAttrs) {
                    if (!$scope.esGroupId || !$scope.esFilterId) {
                        throw "You must set the pair es-group-id and es-filter-id attrs";
                    }

                    $scope.executePQ = function() {
                        $scope.esGridOptions.dataSource.read();
                    }

                    esWebApiService.fetchPublicQueryInfo($scope.esGroupId, $scope.esFilterId)
                        .then(function(ret) {
                            var v = esWebUIHelper.winGridInfoToESGridInfo($scope.esGroupId, $scope.esFilterId, ret.data);
                            $scope.esParamsValues = v.defaultValues;
                            $scope.esParamsDef = v.params;
                            $scope.esGridOptions = esWebUIHelper.esGridInfoToKInfo(esWebApiService, $scope.esGroupId, $scope.esFilterId, $scope.esParamsValues, v);
                        });
                }
            };
        }])
        /**
         * @ngdoc directive
         * @name es.Web.UI.directive:esParamsPanel
         * @function
         *
         * @description
         * **TBD**
         *
         * 
         */
        .directive('esParamsPanel', ['$log', 'esWebApi', 'esUIHelper', function($log, esWebApiService, esWebUIHelper) {
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
                link: function($scope, iElement, iAttrs) {
                    if (!iAttrs.esParamsDef && !iAttrs.esPqInfo && (!$scope.esGroupId || !$scope.esFilterId)) {
                        throw "You must set either the es-params-def or ea-pq-info or the pair es-group-id and es-filter-id attrs";
                    }

                    if (!iAttrs.esParamsDef) {
                        if (!iAttrs.esPqInfo) {
                            // we are given groupid and filterid =>
                            // we must retrieve pqinfo on owr own
                            esWebApiService.fetchPublicQueryInfo($scope.esGroupId, $scope.esFilterId)
                                .function(function(ret) {
                                    var v = esWebUIHelper.winGridInfoToESGridInfo($scope.esGroupId, $scope.esFilterId, ret.data);
                                    $scope.esParamsValues = v.defaultValues;
                                    $scope.esParamsDef = v.params;
                                });
                        } else {
                            $scope.esParamDef = esPqInfo.params;
                        }
                    }
                }
            };
        }]);

    /**
     * @ngdoc service
     * @name es.Web.UI.esUIHelper
     * @requires es.Services.Web.esWebApi Entersoft AngularJS WEB API for Entersoft Application Server
     * @requires $log
     * @description This service provides a set of javascript objects and functions to support UI oriented operations such as preparation
     * of schema model for a web grid to show the results of a PQ, Entersoft PQ Parameters meta-data manipulation , etc.
     * yh
     */
    esWEBUI.factory('esUIHelper', ['esWebApi', '$log',
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
                        refresh: true,
                        pageSizes: [20, 50, 100, "All"]
                    },
                    sortable: true,
                    filterable: true,
                    resizable: true,
                    toolbar: ["pdf", "excel"],
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
            function dateEval(pInfo, expr) {
                var SpecificDate = "SpecificDate";
                var Month = "Month";
                var SixMonth = "SixMonth";
                var Week = "Week";
                var Year = "Year";
                var Quarter = "Quarter";
                var Day = "Day";

                function isActualDate(v) {
                    return v && v != "1753/01/01" && v != "9999/01/01";
                }

                var dVal = eval(expr.replace(/#/g, '"'));
                var esdate = new ESDateParamVal(pInfo.id);

                // Specific Date
                var mD = moment(dVal, "YYYY/MM/DD");
                if (!dVal.fromType && !dVal.toType && !dVal.fromD && !dVal.toD && mD.isValid()) {
                    esdate.paramValue.dRange = "1";
                    esdate.paramValue.fromD = mD.toDate();
                    return esdate;
                }

                //From Specific Date To Specific Date
                if (dVal.fromType == SpecificDate && isActualDate(dVal.fromD) && dVal.toType == SpecificDate && isActualDate(dVal.toD)) {
                    esdate.paramValue.dRange = "0";
                    esdate.paramValue.fromD = new Date(dVal.fromD);
                    esdate.paramValue.toD = new Date(dVal.toD);
                    return esdate;
                }

                //From Specific Date To Specific Date
                if (dVal.fromType == SpecificDate && isActualDate(dVal.fromD)) {
                    esdate.paramValue.dRange = "1";
                    esdate.paramValue.fromD = new Date(dVal.fromD);
                    return esdate;
                }

                // all toher cases of esdaterange
                esdate.paramValue.dRange = expr;
                return esdate;
            }

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

            function ESDateRange(fromType, fromD, toType, toD) {
                return {
                    "fromType": fromType,
                    "fromD": fromD,
                    "toType": toType,
                    "toD": toD
                }
            }

            function getEsParamVal(esParamInfo, dx) {
                var ps = esParamInfo.parameterType.toLowerCase();

                //ESNumeric
                if (ps.indexOf("entersoft.framework.platform.esnumeric") == 0) {
                    if (!dx || dx.length == 0) {
                        return new ESNumericParamVal(esParamInfo.id, {
                            oper: "EQ",
                            value: 0
                        });
                    }
                    return esEval(esParamInfo, dx[0].Value);
                }

                //ESDateRange
                if (ps.indexOf("entersoft.framework.platform.esdaterange, queryprocess") == 0) {
                    if (!dx || dx.length == 0) {
                        return new ESDateParamVal(esParamInfo.id, esParamInfo.controlType == 6 ? null : {
                            dRange: "ESDateRange(FiscalPeriod, 0)",
                            fromD: null,
                            toD: null
                        });
                    }
                    return dateEval(esParamInfo, dx[0].Value);
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

            function ESParamInfo() {
                this.id = undefined;
                this.aa = undefined;
                this.caption = undefined;
                this.toolTip = undefined;
                this.controlType = undefined;
                this.parameterType = undefined;
                this.precision = undefined;
                this.multiValued = undefined;
                this.visible = undefined;
                this.required = undefined;
                this.oDSTag = undefined;
                this.formatStrng = undefined;
                this.tags = undefined;
                this.visibility = undefined;
                this.invSelectedMasterTable = undefined;
                this.invSelectedMasterField = undefined;
                this.invTableMappings = undefined;
                this.defaultValues = undefined;
                this.enumOptionAll = undefined;
                this.enumList = undefined;
            }

            ESParamInfo.prototype.strVal = function() {
                return "Hello World esParaminfo";
            };

            function ESParamsDefinitions(title, params) {
                this.title = title;
                this.definitions = params;
            }

            ESParamsDefinitions.prototype.strVal = function(vals) {
                if (!vals || !this.definitions || this.definitions.length == 0) {
                    return '';
                }

                var s = _.reduce(_.sortBy(_.where(this.definitions, {
                    visible: true
                }), "aa"), function(memo, p) {
                    return memo + "<h3>" + p.caption + ": </h3>" + vals[p.id].strVal() + "<br/>";
                }, '');

                return s;
            }

            function winParamInfoToesParamInfo(winParamInfo, gridexInfo) {
                if (!winParamInfo) {
                    return null;
                }

                var espInfo = new ESParamInfo();

                espInfo.id = winParamInfo.ID;
                espInfo.aa = parseInt(winParamInfo.AA);
                espInfo.caption = winParamInfo.Caption;
                espInfo.toolTip = winParamInfo.Tooltip;
                espInfo.controlType = parseInt(winParamInfo.ControlType);
                espInfo.parameterType = winParamInfo.ParameterType;
                espInfo.precision = parseInt(winParamInfo.Precision);
                espInfo.multiValued = winParamInfo.MultiValued == "true";
                espInfo.visible = winParamInfo.Visible == "true";
                espInfo.required = winParamInfo.Required == "true";
                // sme boot
                //if (espInfo.id == "fRegionGroupCode" || espInfo.id == "Code4") {
                if (true) {
                    espInfo.required = true;
                }
                // boot
                espInfo.oDSTag = winParamInfo.ODSTag;
                espInfo.tags = winParamInfo.Tags;
                espInfo.visibility = parseInt(winParamInfo.Visibility);
                espInfo.invSelectedMasterTable = winParamInfo.InvSelectedMasterTable;
                espInfo.invSelectedMasterField = winParamInfo.InvSelectedMasterField;
                espInfo.invTableMappings = winParamInfo.InvTableMappings;

                espInfo.enumOptionAll = winParamInfo.EnumOptionAll;
                var enmList = _.sortBy(_.map(_.filter(gridexInfo.EnumItem, function(x) {
                    return x.fParamID == espInfo.id && (typeof x.ID != 'undefined');
                }), function(e) {
                    return {
                        text: espInfo.oDSTag ? e.Caption.substring(e.Caption.indexOf(".") + 1) : e.Caption,
                        value: !isNaN(e.ID) ? parseInt(e.ID) : null
                    };
                }), "value");

                espInfo.enumList = (enmList.length) ? enmList : undefined;


                var gxDef = gridexInfo.DefaultValue;
                if (gxDef && angular.isArray(gxDef)) {
                    var dx = _.where(gxDef, {
                        fParamID: espInfo.id
                    });

                    espInfo.defaultValues = getEsParamVal(espInfo, dx);
                }

                return espInfo;
            }

            function winGridInfoToESGridInfo(inGroupID, inFilterID, gridexInfo) {
                if (!gridexInfo || !gridexInfo.LayoutColumn) {
                    return null;
                }

                var fId = inFilterID.toLowerCase();
                var filterInfo = _.filter(gridexInfo.Filter, function(x) {
                    return x.ID.toLowerCase() == fId;
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

                var z2 = _.map(_.filter(gridexInfo.LayoutColumn, function(y) {
                    return y.fFilterID.toLowerCase() == fId;
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

                esGridInfo.params = new ESParamsDefinitions(esGridInfo.caption, _.map(gridexInfo.Param, function(p) {
                    return winParamInfoToesParamInfo(p, gridexInfo);
                }));


                var dfValues = _.map(esGridInfo.params.definitions, function(p) {
                    return p.defaultValues;
                });

                esGridInfo.defaultValues = new ESParamValues(dfValues);
                return esGridInfo;
            }

            return ({
                ESParamVal: ESParamVal,
                ESNumericParamVal: ESNumericParamVal,
                ESStringParamVal: ESStringParamVal,
                ESDateParamVal: ESDateParamVal,

                /**
                 * @ngdoc function
                 * @name es.Web.UI.esUIHelper#winGridInfoToESGridInfo
                 * @methodOf es.Web.UI.esUIHelper
                 * @module es.Web.UI
                 * @kind function
                 * @description  This function processes and transforms an Entersoft Windows - Janus specific definition of the UI layout of an
                 * Entersoft Public Query or Entersoft Scroller to an abstract web-oriented defintion of the layout to be used by WEB UI components
                 * such as telerik kendo-ui, jQuery grids, etc.
                 * @param {string} inGroupID The Entersoft PQ (or Scroller) GroupID the the gridexInfo object describes
                 * @param {string} inFilterID The Entersoft PQ (or Scroller) FilterID the the gridexInfo object describes
                 * @param {object} gridexInfo The definition object for an Entersoft Public Query (or Scroller) as provided by the result
                 * of the function {@link es.Services.Web.esWebApi#methods_fetchPublicQueryInfo fetchPublicQueryInfo}.
                 * @return {object} Returns an object that is the abstract (not Janus specific) representation of the gridexInfo.
                 * @example
```js
var inGroupID = "ESMMStockItem";
var inFilterID = "ESMMStockItem_Def";
var gridexInfo = {
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

var esgridInfo = esUIHelper.winGridInfoToESGridInfo(inGroupID, inFilterID, gridexInfo);
```
* __The result will be:__
```js
{
    "id": "ESMMStockItem_Def",
    "caption": "Είδη Αποθήκης",
    "rootTable": "ESFIItem",
    "selectedMasterTable": "ESFIItem",
    "selectedMasterField": "ISUDGID",
    "totalRow": "0",
    "columnHeaders": "0",
    "columnSetHeaders": "0",
    "columnSetRowCount": "2",
    "columnSetHeaderLines": "1",
    "headerLines": "1",
    "groupByBoxVisible": "false",
    "filterLineVisible": "false",
    "previewRow": "false",
    "previewRowMember": "",
    "previewRowLines": "3",
    "columns": [{
        "field": "Code",
        "title": "Κωδικός"
    }, {
        "field": "ESDCreated",
        "title": "Ημ/νία δημιουργίας",
        "format": "{0:d}"
    }, {
        "field": "ESDModified",
        "title": "Ημ/νία τελ.μεταβολής",
        "format": "{0:d}"
    }, {
        "field": "ESUCreated",
        "title": "Χρήστης δημιουργίας"
    }, {
        "field": "Description",
        "title": "Περιγραφή"
    }, {
        "field": "Price",
        "title": "Τιμή χονδρικής",
        "attributes": {
            "style": "text-align: right;"
        },
        "format": "{0:#,0.00}"
    }, {
        "field": "RetailPrice",
        "title": "Τιμή λιανικής",
        "attributes": {
            "style": "text-align: right;"
        },
        "format": "{0:#,0.00}"
    }, {
        "field": "AssemblyType",
        "title": "Τύπος σύνθεσης"
    }, {
        "field": "ItemClass",
        "title": "Κλάση"
    }, {
        "field": "ItemType",
        "title": "Τύπος"
    }, {
        "field": "Name",
        "title": "Επωνυμία/Ονοματεπώνυμο"
    }, {
        "field": "Description1",
        "title": "Περιγραφή1"
    }, {
        "field": "fItemFamilyCode",
        "title": "Οικογένεια"
    }, {
        "field": "fItemGroupCode",
        "title": "Ομάδα"
    }, {
        "field": "fItemCategoryCode",
        "title": "Κατηγορία"
    }, {
        "field": "fItemSubcategoryCode",
        "title": "Υποκατηγορία"
    }, {
        "field": "ESUModified",
        "title": "Χρήστης τελ.μεταβολής"
    }, {
        "field": "Comment",
        "title": "Σχόλιο"
    }],
    "params": [{
        "id": "ESDCreated",
        "aa": 1,
        "caption": "Ημ/νία δημιουργίας",
        "toolTip": "Ημ/νία δημιουργίας",
        "controlType": 6,
        "parameterType": "Entersoft.Framework.Platform.ESDateRange, QueryProcess",
        "precision": 0,
        "multiValued": false,
        "visible": true,
        "required": false,
        "oDSTag": "AA049FD6-4EFF-499F-8F6B-0573BD14D183",
        "tags": "",
        "visibility": 0,
        "defaultValues": {
            "paramCode": "ESDCreated",
            "paramValue": {
                "dRange": "1",
                "fromD": "2006-04-14T21:00:00.000Z",
                "toD": null
            }
        }
    }, {
        "id": "ESUCreated",
        "aa": 2,
        "caption": "Χρήστης δημιουργίας",
        "toolTip": "Χρήστης δημιουργίας",
        "controlType": 9,
        "parameterType": "Entersoft.Framework.Platform.ESString, QueryProcess",
        "precision": 0,
        "multiValued": false,
        "visible": true,
        "required": false,
        "oDSTag": "0ABDC77C-119B-4729-A99F-C226EBCE0C1B",
        "tags": "",
        "visibility": 0,
        "defaultValues": {
            "paramCode": "ESUCreated",
            "paramValue": {
                "value": "wλμ",
                "valueTo": "χχω",
                "oper": "RANGE"
            }
        }
    }, {
        "id": "ESDModified",
        "aa": 3,
        "caption": "Ημ/νία τελ.μεταβολής",
        "toolTip": "Ημ/νία τελ.μεταβολής",
        "controlType": 20,
        "parameterType": "Entersoft.Framework.Platform.ESDateRange, QueryProcess",
        "precision": 0,
        "multiValued": false,
        "visible": true,
        "required": false,
        "oDSTag": "4E4E17A4-ECA5-4CB0-9F11-02C943F6E6C8",
        "tags": "",
        "visibility": 0,
        "defaultValues": {
            "paramCode": "ESDModified",
            "paramValue": {
                "dRange": "1",
                "fromD": "2011-03-13T22:00:00.000Z",
                "toD": null
            }
        }
    }],
    "defaultValues": {
        "ESDCreated": {
            "paramCode": "ESDCreated",
            "paramValue": {
                "dRange": "1",
                "fromD": "2006-04-14T21:00:00.000Z",
                "toD": null
            }
        },
        "ESUCreated": {
            "paramCode": "ESUCreated",
            "paramValue": {
                "value": "wλμ",
                "valueTo": "χχω",
                "oper": "RANGE"
            }
        },
        "ESDModified": {
            "paramCode": "ESDModified",
            "paramValue": {
                "dRange": "1",
                "fromD": "2011-03-13T22:00:00.000Z",
                "toD": null
            }
        }
    }
}
```
                 **/
                winGridInfoToESGridInfo: winGridInfoToESGridInfo,

                winColToESCol: winColToESCol,
                esColToKCol: esColToKCol,

                /**
                 * @ngdoc function
                 * @name es.Web.UI.esUIHelper#esGridInfoToKInfo
                 * @methodOf es.Web.UI.esUIHelper
                 * @module es.Web.UI
                 * @kind function
                 * @description  This function processes and transforms an {@link es.Web.UI.esUIHelper#methods_winGridInfoToESGridInfo esgridInfo} object (abstract definition of gridexInfo)
                 * to a Telerik kendo-grid layout definition object.
                 * @param {service} esWebApiService The {@link es.Services.Web.esWebApi esWebApi Service}.
                 * @param {string} inGroupID The Entersoft PQ (or Scroller) GroupID the the gridexInfo object describes
                 * @param {string} inFilterID The Entersoft PQ (or Scroller) FilterID the the gridexInfo object describes
                 * @param {object} executeParams The object that will hold or alread holds the values of the Entersoft Public Query Paramters i.e. the object
                 * that holds the values of the params panel (EBS terminology). If the object is not an empty one i.e. {} BUT is has values for some of the named parameters
                 * these values will be used as default values for those parameters, overiding any default values coming from the grid layout definition object.
                 * @param {object} esGridInfo The Entersoft abstract definition object that is the result of {@link es.Web.UI.esUIHelper#methods_winGridInfoToESGridInfo winGridInfoToESGridInfo}.
                 * of the function {@link es.Services.Web.esWebApi#methods_fetchPublicQueryInfo fetchPublicQueryInfo}.
                 * @return {object} Returns an object that is the __Telerik kendo-grid specific__ schema definition object that can be used to initialize the
                 * UI of a kendo-grid or kendo-grid like widget.
                 *
                 * The returned object can be directly assigned to the _k-options_ attribute of a __kendo-grid__ Telerik widget
                 * @example
                 * This is a screenshot from Pulic Query Info results (geridexInfo, esgridInfo and Telerik kendo-grid options)
                 * ![Sample run for am ESMMStockItem PQInfo](images/api/es010fetchpqinfo.png)
                 * 
```js
//fetchPublicQueryInfo sample
$scope.fetchPQInfo = function() {
    esWebApi.fetchPublicQueryInfo($scope.pGroup, $scope.pFilter)
        .then(function(ret) {
            // This is the gridlayout as defined in the EBS Public Query based on .NET Janus GridEx Layout
            $scope.esJanusGridLayout = ret.data;

            // This is the neutral-abstract representation of the Janus GridEx Layout according to the ES WEB UI simplification
            $scope.esWebGridInfo = esWebUIHelper.winGridInfoToESGridInfo($scope.pGroup, $scope.pFilter, $scope.esJanusGridLayout);

            // This is the kendo-grid based layout ready to be assigned to kendo-grid options attribute for rendering the results
            // and for executing the corresponding Public Query
            $scope.esGridOptions = esWebUIHelper.esGridInfoToKInfo(esWebApi, $scope.pGroup, $scope.pFilter, {}, $scope.esWebGridInfo);
        }, function(err, status) {
            alert(a.UserMessage || a.MessageID || "Generic Error");
        });
}
```
                 * __HTML__
```html
 <span>
        <input type="text" ng-model="pGroup"  placeholder="PQ GroupID">
        <input type="text" ng-model="pFilter" placeholder="PQ FilterID">
        <button ng-click="fetchPQInfo()">fetchPublicQueryInfo</button>
        <div kendo-grid k-ng-delay="esGridOptions" k-auto-bind="false" k-options="esGridOptions" />
    </span>
```
                 **/
                esGridInfoToKInfo: esGridInfoToKInfo,

                getZoomDataSource: prepareStdZoom,
                getPQDataSource: prepareWebScroller,

                getesDateRangeOptions: function(dateRangeClass) {
                    if (!dateRangeClass || !dDateRangeClass[dateRangeClass]) {
                        return esDateRangeOptions;
                    }

                    var arr = dDateRangeClass[dateRangeClass];
                    if (!_.isArray(arr) || arr.length == 0) {
                        return esDateRangeOptions;
                    }

                    var x = [];
                    var i;
                    for (i = 0; i < arr.length; i++) {
                        x[i] = esDateRangeOptions[arr[i]];
                    }
                    return x;
                },

                getesComplexParamFunctionOptions: function() {
                    return esComplexParamFunctionOptions;
                },

            });
        }
    ]);

})();
