# Entersoft AngularJS Web API

Please refer to [Entersoft AngularJS Complete Guide](http://developer.entersoft.gr/eswebapi/#/api/es.Services.Web.esWebApi)

**Version 1.16
- esWebService: New function [downloadAssetURL](http://developer.entersoft.gr/eswebapi/#/api/es.Services.Web.esWebApi#methods_downloadasseturl) to get a download URL for an EAS Asset.
- esWebService: New function [downloadES00BlobURLByGID](http://developer.entersoft.gr/eswebapi/#/api/es.Services.Web.esWebApi#methods_downloades00bloburlbygid) to get the byte array buffer of the contents of the ES00Blob identified by the GID.
- esWebService: New function [downloadURLForBlobDataDownload](http://developer.entersoft.gr/eswebapi/#/api/es.Services.Web.esWebApi#methods_downloadurlforblobdatadownload) to get the url in order to download the contents of the ES00Blob as being a file.
- eswebService: Bug fuxing in execScrollerCommand (the web api url wan not formed properly).
- eswebService: Bug fuxing in fetchES00DocumentBlobDataByGID whan base64 was set to false.
- esGlobals: New function [esSupportedLanguages](http://developer.entersoft.gr/eswebapi/#/api/es.Services.Web.esGlobals#methods_essupportedlanguages)
- esGlobals: New function [suggestESLanguageID](http://developer.entersoft.gr/eswebapi/#/api/es.Services.Web.esGlobals#methods_suggesteslanguageid)
- esGlobals: New function [esDetectMobileBrowsers](http://developer.entersoft.gr/eswebapi/#/api/es.Services.Web.esGlobals#methods_esdetectmobilebrowsers)
- directive esLogin: Bug fix on language selection
- directive esGrid: The attributes esSrvPaging and esAutoExecute have been removed and replaced by a richer and more functional attribute esPQOptions that incorporates both removed attributes as field members.
- directive esMapPq: New attribute esPanelOpen of type boolean. The Params Panel will be expanded i.e. opened or not depending on the resolved value of the attribute.
- All alert dialogs that have been for debugging purposes have been removed.

**Version 1.14
- In Public Queries Grid i.e. kendo grids, when you press "Run" or "Αποστολή" it resets the next fetch to Page 1 of the results if any
- The logout function of the WebApiService caused an error "no authorization token" which has been fixed

**Version 1.12
- Support for F3 Params in ParamsPanel
- Support of AngularJS 1.5.8 and Kendo-UI 2016.03.914
- Bug Fixes

**Version 1.10.0
- Support from total aggregates and group aggregates
- Fixes in the documentation
- Minor bug fixing

**Version 1.9.0
- Restructured examples
- Hybrid sources for smarphone and tablet hybrid applications
- Move from underscore to lodash
- Significant changes in the esWebApi Services. Check the on-line documentation

**Version 1.8.0
- Full support of Entersoft Claims, as specified in [openSession](http://developer.entersoft.gr/eswebapi/#/api/es.Services.Web.esWebApi#methods_opensession)
- New directive element <es-login> for Entersoft Login Form 
- 

**Version 1.7.2
- googlemaps integration with Entersoft Public Query
- Enhanced documentation 
- change in the esGlobals.getUserMessage 
- A new example found in the StoreExample directory

**Version 1.6.0 Requires ES WEB API 1.8.3 or later**
- stickySession
- fetchUserLogo
- uploadUserLogo
- removeCurrentUserLogo
- fetchPersonLogo
- ebsService
- eventLog
- multiPublicQuery
- fetchMultiStdZoom
- fetchEntity
- fetchEntityByCode
- RenewToken on every % time 
- ESPQOptions object
- ESMultiZoomDef object
- ESMultiPublicQuery object
- addOrUpdateES00Document
- deleteES00Document
- fiImportDocument
- fetchPropertySet

**Version 1.2.7**
- More documentation on fetchPublicQueryInfo
- More documentation on esCache provider

**Version 1.2.6**
- fetchPublicQueryInfo supports use of cache

**Version 1.2.5**
- Better support for premises
- fetchStdZoom can cache the results for subsequent calls
- fetchODSxxx methods cache the results
- Bug fixing 

**Version 1.1.0**

- Full support for the fetchEASAsset that has been provided by the Entersoft WEB API Server v1.7.9
