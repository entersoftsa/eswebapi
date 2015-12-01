(function() {
    'use strict';

    var underscore = angular.module('underscore', []);
    underscore.factory('_', function() {
        return window._; //Underscore must already be loaded on the page 
    });

    var version = "1.5.3";
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
    esWebFramework.factory('esGlobals', ['$sessionStorage', '$log', 'esMessaging', 'esCache', '$injector' /* 'es.Services.GA' */ ,
        function($sessionStorage, $log, esMessaging, esCache, $injector) {

            function ESPublicQueryDef(ctxId, groupId, filterId, pqOptions, params) {
                this.CtxID = ctxId;
                this.GroupID = groupId;
                this.FilterID = filterId;
                this.PQOptions = pqOptions;
                this.Params = params;
            }

            function ESMultiZoomDef(zoomId, pqOptions, useCache) {
                this.ZoomID = zoomId;
                this.PQOptions = pqOptions;
                this.UseCache = !!useCache;
            }

            function ESPQOptions(page, pageSize, withCount) {
                this.Page = page;
                this.PageSize = pageSize;
                this.WithCount = withCount;
            }

            function ESPropertySet(
                GID,
                Code,
                Description,
                AlternativeDescription,
                ESDCreated,
                ESUCreated,
                ESDModified,
                ESUModified,
                Inactive,
                fCategoryGID,
                MapProfile,
                GridLayout,
                Type,
                TS,
                MobileSurvey, 
                Lines) 
            {
                this.GID = GID;
                this.Code = Code;
                this.Description = Description;
                this.AlternativeDescription = AlternativeDescription;
                this.ESDCreated = ESDCreated;
                this.ESUCreated = ESUCreated;
                this.ESDModified = ESDModified;
                this.ESUModified = ESUModified;
                this.Inactive = Inactive;
                this.fCategoryGID = fCategoryGID;
                this.MapProfile = MapProfile;
                this.GridLayout = GridLayout;
                this.Type = Type;
                this.TS = TS;
                this.MobileSurvey = MobileSurvey;
                this.Lines = Lines;
            }

            function ESPropertySetLine(
                GID,
                fPropertySetGID,
                SeqNum,
                fPropertyGID,
                fPropertyCategoryCode,
                ESDCreated,
                ESUCreated,
                ESDModified,
                ESUModified,
                DefaultValue,
                DefaultDisplayValue,
                Mandatory,
                VisualizationStyle,
                Inactive,
                PhotoRelated,
                NotApplicable,
                TS) {
                this.GID = GID;
                this.fPropertySetGID = fPropertySetGID;
                this.SeqNum = SeqNum;
                this.fPropertyGID = fPropertyGID;
                this.fPropertyCategoryCode = fPropertyCategoryCode;
                this.ESDCreated = ESDCreated;
                this.ESUCreated = ESUCreated;
                this.ESDModified = ESDModified;
                this.ESUModified = ESUModified;
                this.DefaultValue = DefaultValue;
                this.DefaultDisplayValue = DefaultDisplayValue;
                this.Mandatory = Mandatory;
                this.VisualizationStyle = VisualizationStyle;
                this.Inactive = Inactive;
                this.PhotoRelated = PhotoRelated;
                this.NotApplicable = NotApplicable;
                this.TS = TS;
            }

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
                 * @param {object[]} mimelist An array of objects of type {mime: string, extension: string, IsText: boolean} that holds a mime representation record.
                 * For more information on how to get a list of supported mime types please read {@link es.Services.Web.esWebApi#methods_getMimeTypes mimeTypes}.
                 * @param {string} filenamewithext the fullpath or just the filename or just the extension for which we want to have the corresponding mime-type
                 * i.e. "/abc/xyz/masterfile.pdf" or "docx" or ".xlsx", etc.
                 * @return {string} The mime-type string for the extension or filename provided in the _filenamewithext_ param. If no mime-type is registered for 
                 * this extension the function returns an empty string ''.
                 * @example
                 * 
```js
var mimeType = esGlobals.getMimeTypeForExt(mimelist, "myfile.docx");
// mimeType will be "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
```
                */
                getMimeTypeForExt: function(mimelist, filenamewithext) {
                    if (!filenamewithext) {
                        return "";
                    }
                    var parts = filenamewithext.split(".");
                    var ext = parts[parts.length - 1].toLowerCase();
                    if (!ext) {
                        return "";
                    }

                    var mime = _.find(mimelist, function(x) {
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
                 * @param {object[]} mimelist An array of objects of type {mime: string, extension: string, IsText: boolean} that holds a mime representation record.
                 * For more information on how to get a list of supported mime types please read {@link es.Services.Web.esWebApi#methods_getMimeTypes mimeTypes}.
                 * @param {string} mimeType The mimeType string for which we want the string array of extensions that are mapped to this mimeType
                 * @return {string[]} The array of strings that are mapped to this mimeType. If no map is found, an empty array i.e. [] will be returned
                 * @example
                 * 
```js
var exts = esGlobals.getExtensionsForMimeType(mimelist, "text/plain");
//exts will be ["txt", "text", "conf", "def", "list", "log", "in"]
```
                */
                getExtensionsForMimeType: function(mimilist, mimeType) {
                    if (!mimeType) {
                        return [];
                    }

                    mimeType = mimeType.toLowerCase();
                    var mime = _.find(mimelist, function(x) {
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
                 * @param {number=} status The status int code we got from an http or promise failure
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

                /**
                 * @ngdoc function
                 * @name es.Services.Web.esGlobals#ESPublicQueryDef
                 * @methodOf es.Services.Web.esGlobals
                 * @module es.Services.Web
                 * @kind constructor
                 * @constructor
                 * @description Constructs an ESPublicQueryDef object that will be used to specify the execution of a PublicQuery in a call to multiPublicQuery
                 * @param {string} CtxID A unique identifier for this PQ execution call (unique in the context of the array of ESPublicQueryDef that will be used in the execution of multiPublicQuery)
                 * @param {string} GroupID The GroupID of the Public Query
                 * @param {string} FilterID The FilterID of the Public Query
                 * @param {ESPQOptions} The paging options for the Public Query Execution. See {@link es.Services.Web.esGlobals#methods_ESPQOptions ESPQOptions}.
                 * @param {object} Params The params to be used for the execution of the Public Query
                 */
                ESPublicQueryDef: ESPublicQueryDef,

                /**
                 * @ngdoc function
                 * @name es.Services.Web.esGlobals#ESMultiZoomDef
                 * @methodOf es.Services.Web.esGlobals
                 * @module es.Services.Web
                 * @kind constructor
                 * @constructor
                 * @description Constructs an ESPublicQueryDef object that will be used to specify the execution of a PublicQuery in a call to multiPublicQuery
                 * @param {string} ZoomID The ID of the ES Zoom to be retrieved i.e. "__ESGOZCountry__"
                 * @param {ESPQOptions} PQOptions The server side paging options to be used for the Zoom retrieval. See {@link es.Services.Web.esGlobals#methods_ESPQOptions ESPQOptions}.
                 * @param {boolean} UseCache A boolean value indicating whether the contents of this specific Zoom will be retrieved and stored in the ESWebAPI client-side memory cache.
                 */
                ESMultiZoomDef: ESMultiZoomDef,

                /**
                 * @ngdoc constructor
                 * @name es.Services.Web.esGlobals#ESPQOptions
                 * @methodOf es.Services.Web.esGlobals
                 * @module es.Services.Web
                 * @kind constructor
                 * @constructor
                 * @description Constructs an ESPQOptions object that specifies the server side paging options of a Public Query execution
                 * @param {number} Page The Server Side Page Number (__1-based__) to be retrieved. Valid is considered any value represeting a number >= 1
                 * @param {number} PageSize The Server Side size of page (> =1) to be retrieved from the server. 
                 * @param {boolean} WithCount If true, the result of the execution will also have the total number of records that exist for this execution run of the PQ
                 */
                ESPQOptions: ESPQOptions,

                /**
                * @ngdoc constructor
                * @name es.Services.Web.esGlobals#ESPropertySet
                * @methodOf es.Services.Web.esGlobals
                * @module es.Services.Web
                * @kind constructor
                * @constructor
                * @description Constructs an ESPropertySet object that corresponds to a Questionnaire Defininition
                * @param {string} GID TBD 
                * @param {string} Code TBD 
                * @param {string} Description TBD 
                * @param {string} AlternativeDescription TBD 
                * @param {date} ESDCreated TBD 
                * @param {string} ESUCreated TBD 
                * @param {date} ESDModified TBD 
                * @param {string} ESUModified TBD 
                * @param {boolean} Inactive TBD 
                * @param {string} fCategoryGID TBD 
                * @param {string} MapProfile TBD 
                * @param {string} GridLayout TBD 
                * @param {string} Type TBD 
                * @param {number} TS TBD 
                * @param {boolean} MobileSurvey  TBD 
                * @param {ESPropertySetLine[]} Lines TBD 
                */
                ESPropertySet: ESPropertySet,

                /**
                * @ngdoc constructor
                * @name es.Services.Web.esGlobals#ESPropertySetLine
                * @methodOf es.Services.Web.esGlobals
                * @module es.Services.Web
                * @kind constructor
                * @constructor
                * @description Constructs an ESPropertySet object that corresponds to a Questionnaire question Defininition
                * @param {string} GID TBD 
                * @param {string} fPropertySetGID TBD 
                * @param {number} SeqNum TBD 
                * @param {string} fPropertyGID TBD 
                * @param {string} fPropertyCategoryCode TBD 
                * @param {date} ESDCreated TBD 
                * @param {string} ESUCreated TBD 
                * @param {date} ESDModified TBD 
                * @param {string} ESUModified TBD 
                * @param {string} DefaultValue TBD 
                * @param {string} DefaultDisplayValue TBD 
                * @param {boolean} Mandatory TBD 
                * @param {string} VisualizationStyle TBD 
                * @param {boolean} Inactive TBD 
                * @param {boolean} PhotoRelated TBD 
                * @param {boolean} NotApplicable TBD 
                * @param {number} TS TBD
                */
                ESPropertySetLine: ESPropertySetLine,


                sessionClosed: function() {
                    esClientSession.setModel(null);
                    try {
                        esCache.clear();
                    } catch (x) {

                    }
                },

                trackTimer: function(category, variable, opt_label) {
                    return new TrackTiming(category, variable, opt_label);
                },

                sessionOpened: function(data, credentials) {
                    try {
                        try {
                            esCache.clear();
                        } catch (x) {

                        }

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
})();
