/*! Entersoft Application Server WEB API - v0.0.1 - 2015-09-17
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

    /**
     * @ngdoc service
     * @name es.Services.Web.esWebApiProvider
     * @module es.Services.Web
     * @kind provider
     * @sortOrder 1000
     * @description
     * Provides the functions needed to configure the esWebAPI service through the esWebApiProvider that is taking place typically in the _app.js_ file of the AngularJS SPA
     *  in the _app.config_ function.
     * Web API.
     */

    /**
     * @ngdoc service
     * @name es.Services.Web.esWebApi
     * @module es.Services.Web
     * @kind provider
     * @sortOrder 1000
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

                $get: ['$http', '$log', '$q', '$rootScope', 'ESWEBAPI_URL', 'esGlobals', 'esMessaging',
                    function($http, $log, $q, $rootScope, ESWEBAPI_URL, esGlobals, esMessaging) {

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
                            var ht = $http({
                                method: 'get',
                                headers: {
                                    "Authorization": esGlobals.getWebApiToken()
                                },
                                url: surl
                            });
                            processWEBAPIPromise(ht);
                            return ht;
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
                            groupID = groupID ? groupID.replace(/ /g, "") : "";
                            filterID = filterID ? filterID.replace(/ /g, "") : "";

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
                                                         * @return {httpPromise}  Returns a promise.
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
                                tableID = tableID ? tableID.replace(/ /g, "") : "";
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
                                                         * @return {httpPromise}  Returns a promise.
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
                                tableID = tableID ? tableID.replace(/ /g, "") : "";
                                columnID = columnID ? columnID.replace(/ /g, "") : "";
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
                                                         * @return {httpPromise}  Returns a promise.
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
                                relationID = relationID ? relationID.replace(/ /g, "") : "";
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
                                                         * @return {httpPromise}  Returns a promise..
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
                                tableID = tableID ? tableID.replace(/ /g, "") : "";
                                columnID = columnID ? columnID.replace(/ /g, "") : "";
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
                                                         * @return {httpPromise}  Returns a promise..
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
                                tableID = tableID ? tableID.replace(/ /g, "") : "";
                                columnID = columnID ? columnID.replace(/ /g, "") : "";
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
                             * @return {httpPromise} Returns a promise. 
                             ** If success i.e. success(function(ret) {...}) the response ret is a JSON object representing the Entersoft 
                             * Business Suite Janus based GridEx Layout. See the example on how to use the returned value in order to create an esGrid options object
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
                                return processWEBAPIPromise(ht, tt);
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
                             * @return {httpPromise} Returns a promise.
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
                            fetchStdZoom: function(zoomID, pqOptions) {
                                zoomID = zoomID ? zoomID.replace(/ /g, "") : "";
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
                                return processWEBAPIPromise(ht, tt);
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
                                pqGroupID = pqGroupID ? pqGroupID.replace(/ /g, "") : "";
                                pqFilterID = pqFilterID ? pqFilterID.replace(/ /g, "") : "";

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


    esWebFramework.provider('esCache', function() {
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
            publish: publish,
            subscribe: subscribe,
            unsubscribe: unsubscribe
        };

        return service;
    });


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
                            return ret + "\r\n" + "[" + i + "]" + x;
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
                credentials: null,
                connectionModel: null,

                getWebApiToken: function() {
                    return getAuthToken(fgetModel());
                },

                setModel: fsetModel,

                getModel: fgetModel,
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

                getUserMessage: getUserMessage,

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


    esWebFramework.run(['esGlobals', 'esWebApi', function(esGlobals, esWebApi) {
        var esSession = esGlobals.getClientSession();
        esSession.getModel();
        esSession.hostUrl = esWebApi.getServerUrl();
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
    var esWEBUI = angular.module('es.Web.UI', []);

    /*
        var dateRangeResolve = function(val, dateVal) {
            var d = new Date();

            switch (val.dType) {
                case 0:
                    {
                        if (!dateVal || !(angular.isDate(dateVal.fromD) && angular.isDate(dateVal.toD))) {
                            return val.title;
                        }

                        var s = "";
                        if (angular.isDate(dateVal.fromD)) {
                            s = dateVal.fromD.toLocaleDateString("el-GR");
                        }
                        s = s + " - ";

                        var toS = "";
                        if (angular.isDate(dateVal.toD)) {
                            toS = dateVal.toD.toLocaleDateString("el-GR");
                        }
                        s = s + toS;
                        return s;
                    }
                case 1:
                    {
                        if (!dateVal || !angular.isDate(dateVal.fromD)) {
                            return val.title;
                        }
                        return dateVal.fromD.toLocaleDateString("el-GR");
                    }
                case 2:
                    return val.title;
                case 3:
                    return d.toLocaleDateString();
                case 4:
                    return "-> " + d.toLocaleDateString();
                case 5:
                    return d.toLocaleDateString() + " ->";
                case 6:
                    {
                        d.setDate(d.getDate() - 1);
                        return d.toLocaleDateString();
                    }
                case 7:
                    {
                        d.setDate(d.getDate() - 1);
                        return d.toLocaleDateString() + " ->";
                    }
                case 8:
                    {
                        d.setDate(d.getDate() + 1);
                        return d.toLocaleDateString();
                    }
                case 9:
                    {
                        d.setDate(d.getDate() + 1);
                        return d.toLocaleDateString() + " ->";
                    }
                case 10:
                    {
                        var cDay = d.getDay();
                        var sDiff = (cDay == 0) ? 6 : (cDay - 1);

                        var f = new Date(d);
                        var t = new Date(d);
                        f.setDate(d.getDate() - sDiff);
                        t.setDate(f.getDate() + 6);

                        return f.toLocaleDateString() + " - " + t.toLocaleDateString();
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

                        return f.toLocaleDateString() + " - " + t.toLocaleDateString();
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

                        return f.toLocaleDateString() + " - " + t.toLocaleDateString();
                    }
                case 13:
                    {
                        d.setDate(1);

                        var f = new Date(d.getFullYear(), d.getMonth() + 1, 0);
                        return d.toLocaleDateString() + " - " + f.toLocaleDateString();
                    }
                case 14:
                    {
                        d.setDate(1);
                        return d.toLocaleDateString() + " ->";
                    }
                case 15:
                    {
                        var f = new Date(d.getFullYear(), d.getMonth() + 1, 0);
                        return "-> " + f.toLocaleDateString();
                    }
                case 16:
                    {
                        var f = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                        var t = new Date(d.getFullYear(), d.getMonth(), 0);
                        return f.toLocaleDateString() + " - " + t.toLocaleDateString();
                    }
                case 17:
                    {
                        var f = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                        return f.toLocaleDateString() + " ->";
                    }
                case 18:
                    {
                        var f = new Date(d.getFullYear(), d.getMonth(), 0);
                        return "-> " + f.toLocaleDateString();
                    }
                case 19:
                    {
                        var m = d.getMonth();
                        var r = m % 3;

                        var f = new Date(d.getFullYear(), m - r, 1);
                        var t = new Date(d.getFullYear(), m + (3 - r), 0);
                        return f.toLocaleDateString() + " -> " + t.toLocaleDateString();
                    }
                case 20:
                    {
                        var m = d.getMonth();
                        var r = m % 3;

                        var t = new Date(d.getFullYear(), m - r, 0);
                        var f = new Date(d.getFullYear(), t.getMonth() - 2, 1);
                        return f.toLocaleDateString() + " -> " + t.toLocaleDateString();
                    }
                case 21:
                    {
                        var f = new Date(d.getFullYear(), (m >= 6) ? 6 : 0, 1);
                        var t = new Date(d.getFullYear(), (m >= 6) ? 11 : 5, (m >= 6) ? 31 : 30);
                        return f.toLocaleDateString() + " -> " + t.toLocaleDateString();
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

                        return f.toLocaleDateString() + " -> " + t.toLocaleDateString();
                    }

                case 23:
                    {
                        var y = d.getFullYear();
                        var f = new Date(y, 0, 1);
                        var t = new Date(y, 11, 31);
                        return f.toLocaleDateString() + " -> " + t.toLocaleDateString();
                    }

                case 24:
                    {
                        var y = d.getFullYear() - 1;
                        var f = new Date(y, 0, 1);
                        var t = new Date(y, 11, 31);
                        return f.toLocaleDateString() + " -> " + t.toLocaleDateString();
                    }

                default:
                    return "ooops";
            }
        }

        */

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

                var pt = pParam.parameterType.toLowerCase()

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
         * These two parameters along with esExecuteParams will be supplied to the {@link es.Services.Web.esWebApi}
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
        .directive('esParam', ['$log', 'esWebApi', 'esUIHelper', function($log, esWebApiService, esWebUIHelper) {
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

                    // Case Date Range
                    if (scope.esParamDef.controlType == 6 || scope.esParamDef.controlType == 20) {
                        scope.dateRangeOptions = esWebUIHelper.getesDateRangeOptions(scope.esParamDef.controlType);
                        scope.dateRangeResolution = function() {
                            return "Hello World, I am parameter " + scope.esParamDef.caption;
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

    /**
     * @ngdoc service
     * @name es.Web.UI.esUIHelper
     * @description
     * **TBD**
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
                ESParamVal: ESParamVal,
                ESNumericParamVal: ESNumericParamVal,
                ESStringParamVal: ESStringParamVal,
                ESDateParamVal: ESDateParamVal,

                winGridInfoToESGridInfo: winGridInfoToESGridInfo,
                winColToESCol: winColToESCol,
                esColToKCol: esColToKCol,
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
