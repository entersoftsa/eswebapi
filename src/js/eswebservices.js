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
 * This module encapsulates the services, providers, factories and constants for the **Entersoft AngularJS WEB API**
 * The main functions provided are:
 ** a()
 ** b()
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
     * @name es.Services.Web.esWebApi
     * @module es.Services.Web
     * @kind provider
     * @description
     * # esWebApi
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

                            getServerUrl: function() {
                                return urlWEBAPI;
                            },

                            /**
                             * @ngdoc function
                             * @name es.Services.Web.esWebApi#openSession
                             * @methodOf es.Services.Web.esWebApi
                             * @description this is a descr
                             * @module es.Services.Web
                             * @kind function
                             * @param {object} credentials Entersoft Business Suite login credentials in the form of a JSON object with the following form:
                             <pre>
                             var credentials  = {
                                UserID: "xxxx", //Entersoft User id 
                                Password: "this is my password", // Entersoft User's password
                                BranchID: "Branch", // a valid Branch that the user has access rights and will be used as default for all operations requiring a BranchID
                                LangID: "el-GR"
                             }
                             </pre>
                             * @return {httpPromise} Returns a promise.
                             ** If success i.e. success(function(ret) {...}) the response ret is a JSON object that holds the current web session
                             * properties. In an Entersoft AngularJS SPA typical template, upon successful login i.e. openSession, the response object is stored
                             * in the browser's local storage and in most of the cases the developer will not need to use or retrieve it manually. It is up to
                             * Entersoft AngularJS WEB API calls that need the access token in order to access the Web API services and methods to retrieve it from the 
                             * local storage.
                             * 
                             * A success response object has the following form:
<pre>
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
</pre>
                             * In case of an error i.e. function(err) {...} the err contains the Entersoft's Application Server error message and 
                             * the http error codes in case the error is network related. As in the case of success, should you use the typical Entersoft
                             * AngularJS development template for SPAs, the framework automatically handles the error response of openSession call and 
                             * performs a clean-up in browsers local storage, cache, messaging, etc. so that no valid web session exists (as if the user never)
                             * logged-in or performed a logout operation
                             * 
                             * An Entersoft application server releated response error e.g. User does not exist has the following form:
<pre>
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

</pre>
                             * @example
<pre>
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
</pre>
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
                             * related to the current web session, if any, is cleaned-up and no valid web session is available. The application/user must login again through openSession
                             * in order to be able to call any Entersoft WEB API autheticated method or service.
                             * @module es.Services.Web
                             * @kind function
                             * @example
<pre>
//logout sample
$scope.doLogout = function ()
{
    esWebApi.logout();
    alert("LOGGED OUT. You must relogin to run the samples");
};
</pre>
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
<pre>
var x = {
    "ID": "MyValidParamKey",
    "Value": "hello world",
    "Description": "Password for use of Google mapping service",
    "Help": "Password for use of Google mapping service",
    "ESType": 0
};
</pre>
                             *
                             * Error promise return value i.e. function(err) is of the following form:
<pre>
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
</pre> 
                            * @example
<pre>
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

</pre>
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
<pre>
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

</pre>
                             *
                             * Error promise return value i.e. function(err) is of the following form:
<pre>
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
</pre> 
                            * @example
<pre>
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
</pre>
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
<pre>
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
</pre>
                             *
                             * Error promise return value i.e. function(err) is of the following form:
<pre>
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

</pre> 
                            * @example
<pre>
//fetchODSTableInfo example
$scope.fetchOdsTableInfo = function() {
    esWebApi.fetchOdsTableInfo($scope.odsID)
        .then(function(ret) {
            $scope.pTableInfo = ret.data;
        }, function(err) {
            $scope.pTableInfo = err;
        });
}
</pre>
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
<pre>
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
</pre>
                             *
                             * Error promise return value i.e. function(err) is of the following form:
<pre>
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

</pre> 
                            * @example
<pre>
 //fetchODSColumnInfo example
$scope.fetchOdsColumnInfo = function() {
    esWebApi.fetchOdsColumnInfo($scope.odsID, $scope.odsColumnID)
        .then(function(ret) {
            $scope.pColumnInfo = ret.data;
        }, function(err) {
            $scope.pColumnInfo = err;
        });
}
</pre>
*/
                            fetchOdsColumnInfo: function(tableID, columnID) {
                                tableID = tableID ? tableID.replace(/ /g, "") : "";
                                columnID = columnID ? columnID.replace(/ /g, "") : "";
                                var odsItem = "";columnID ? tableID + "/" + columnID : tableID;
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
<pre>
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

</pre>
                             *
                             * Error promise return value i.e. function(err) is of the following form:
<pre>
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


</pre> 
                            * @example
<pre>
//fetchOdsRelationInfo example
$scope.fetchOdsRelationInfo = function() {
    esWebApi.fetchOdsRelationInfo($scope.odsID)
        .then(function(ret) {
            $scope.pRelationInfo = ret.data;
        }, function(err) {
            $scope.pRelationInfo = err;
        });
}
</pre>
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
<pre>
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
</pre>
                             *
                             * Error promise return value i.e. function(err) is of the following form:
<pre>
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
</pre>
                            * @example
<pre>
//fetchOdsMasterRelationsInfo example
$scope.fetchOdsMasterRelationsInfo = function() {
    esWebApi.fetchOdsMasterRelationsInfo($scope.odsID, $scope.odsColumnID)
        .then(function(ret) {
            $scope.pRelationInfo = ret.data;
        }, function(err) {
            $scope.pRelationInfo = err;
        });
}
</pre>
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
<pre>
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

</pre>
                             *
                             * Error promise return value i.e. function(err) is of the following form:
<pre>
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
</pre>
                            * @example
<pre>
//fetchOdsDetailRelationsInfo example
$scope.fetchOdsDetailRelationsInfo = function() {
    esWebApi.fetchOdsDetailRelationsInfo($scope.odsID, $scope.odsColumnID)
        .then(function(ret) {
            $scope.pRelationInfo = ret.data;
        }, function(err) {
            $scope.pRelationInfo = err;
        });
}
</pre>
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
<pre>
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
</pre>
                             * @example
<pre>
$scope.fetchServerCapabilities = function()
{
    esWebApi.fetchServerCapabilities()
        .then(function(ret) {
            $scope.pSrvCapabilities = ret;
        }, function(err) {
            $scope.pSrvCapabilities = err;
        });
}
</pre>
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

                            fetchScroller: function(groupID, filterID, params) {
                                return execScroller(ESWEBAPI_URL.__SCROLLER__, groupID, filterID, params);
                            },

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
<pre>
var UserSite = {
    Key: string,  // The ESGOSite Code i.e. "ΑΘΗ",
    Value: string // The ESGOSite Description i.e. "Κεντρικά Entersoft" 
};
</pre>
                             * @example
<pre>
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
</pre>
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
<pre>
var sessprop = {
    ID: string, // property ID i.e. "101"
    Description: string, // property Description in the session's language translation i.e. "Έκδοση Εγκατάστασης"
    ValueS: string, // property Value in string format i.e. "4.0.36 - 2"
    Type: int // property EBS Type i.e. 0
};
</pre>
                             ** If error the err.data object contains the Entersoft Application Server error definition. Typically the user error message is 
                             * err.data.UserMessage
                             *
                             * Success promise return value i.e. response.data is of the following form:
<pre>
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

</pre>
                             * @example
<pre>
//fetchSessionInfo example
$scope.fetchSessionInfo = function() {
    esWebApi.fetchSessionInfo()
        .then(function(ret) {
            $scope.pSessionInfo = ret.data;
        }, function(err) {
            $scope.pSessionInfo = err;
        });
}
</pre>
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
<pre>
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
</pre>
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
 <pre>
var pqOptions = {
    WithCount: boolean,
    Page: int,
    PageSize: int
};
</pre>
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
<pre>
var x = {
    Table: string, // The name of the standard i.e. in the form ESXXZxxxx provided in the **_zoomID_** parameter
    Rows: [{Record 1}, {Record 2}, ....], // An array of JSON objects each one representing a record in the form of fieldName: fieldValue
    Count: int, // In contrast to fetchPublicQuery, for fetchZoom, Count will always have value no matter of the options parameter and fields.
    Page: int, // If applicable the requested Page Number (1 based), otherwise -1
    PageSize: int, // If applicable the Number of records in the Page (i.e. less or equal to the requested PageSize) otherwise -1
}
</pre>                        
                             *
                             ** If error i.e. function(err) { ... } then err.data contains the Entersoft Application server error object.
                             * @example
<pre>
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
</pre>
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
                             * @param {string} pqGroupID Entersoft Public Query GroupID
                             * @param {string} pqFilterID Entersoft Public Query FilterID
                             * @param {object} pqOptions Entersoft Public Query execution options with respect to Paging, PageSize and CountOf.
                             * pqOptions is a JSON object of the following type:
 <pre>
var pqOptions = {
    WithCount: boolean,
    Page: int,
    PageSize: int
};
</pre>
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
<pre>
var pqParams = {
    Name: "a*",
    RegDate: "ESDateRange(Day)"
};
</pre>
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
<pre>
var x = {
    Table: string, // The name of the MasterTable as defined in the Public Query definition (through the Scroller Designer)
    Rows: [{Record 1}, {Record 2}, ....], // An array of JSON objects each one representing a record in the form of fieldName: fieldValue
    Count: int, // If applicable and capable the total number of records found in the server at the execution time for the current execution of Public Query / pqParams 
    Page: int, // If applicable the requested Page Number (1 based), otherwise -1
    PageSize: int, // If applicable the Number of records in the Page (i.e. less or equal to the requested PageSize) otherwise -1
}
</pre>                        
                             *                              * 
                             * If **NO PAGING** is taking place (no matter how), which means that all data are returned from the server THEN
                             * ret.data.Count will always be greater or equal to 0 and it will always be equal to the ret.data.Rows.length i.e. the number of 
                             * records returned by the server. If the query returns no data, the ret.Count will be 0 and ret.data.Rows will always be an empty array []. 
                             * So, if NO PAGING is taking place, we always have ret.data.Count == ret.data.Rows.length.
                             * 
                             * **ATTENTION** If no records are returned by the Server ret.data.Rows will NOT BE null or undefined or not defined. It will be an empty array. ret.data.PageSize will be -1, ret.data.Page will be -1, 
                             * 
                             *If **PAGING** is taking place the following pseudo code diagram reflects the contents of ret.data response:
<pre>
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
</pre>
                             *
                             ** If error i.e. function(err) { ... } then err.data contains the Entersoft Application server error object.
                             * @example
<pre>
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
</pre>
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

    esWebServices.factory('esElasticSearch', ['esWebApi',
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
