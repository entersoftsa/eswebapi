(function() {
    'use strict';

    var underscore = angular.module('underscore', []);
    underscore.factory('_', function() {
        return window._; //Underscore must already be loaded on the page 
    });

    var version = "1.2.7";
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
                credentials: null,
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
                        esClientSession.setModel(data.Model);
                        esClientSession.credentials = credentials;


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
        var esSession = esGlobals.getClientSession();
        esSession.getModel();
        esSession.hostUrl = esWebApi.getServerUrl();
    }]);
})();
