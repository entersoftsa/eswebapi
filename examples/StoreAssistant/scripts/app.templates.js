angular.module('esStoreAssistant').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/about.html',
    "<div class=\"panel panel-primary\"><uif-spinner ng-show=state.isRunning uif-size=large>{{'MENU.WORKING' | translate}}</uif-spinner><div class=panel-heading>{{'MENU.SYSTEMINFO' | translate}}</div><table class=\"table table-striped table-bordered table-hover\"><thead><tr><th>{{'MENU.SUBSYSTEM' | translate}}</th><th>{{'MENU.VERSION' | translate}}</th></tr></thead><tbody><tr ng-repeat=\"ver in versionInfo | orderBy:'code'\"><td>{{ver.code}}</td><td>{{ver.value}}</td></tr></tbody></table></div>"
  );


  $templateCache.put('views/appmenu.html',
    "<nav class=\"navbar navbar-inverse navbar-fixed-top\"><div class=container-fluid><div class=navbar-header><button type=button class=\"navbar-toggle collapsed\" data-toggle=collapse data-target=#es-navbar aria-expanded=false><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a class=navbar-brand href=#><img alt=\"Entersoft SA\" src=https://www.entersoft.gr/esaddin/eslogo32.png></a></div><div class=\"collapse navbar-collapse\" id=es-navbar><ul class=\"nav navbar-nav\"><li class=dropdown><a class=dropdown-toggle data-toggle=dropdown role=button aria-haspopup=true aria-expanded=false>{{'MENU.SALES.TITLE' | translate}}<span class=caret></span></a><ul class=dropdown-menu><li><a ui-sref=salesScore>{{'MENU.SALES.SCORE' | translate}}</a></li><li><a ui-sref=salesInfo>{{'MENU.SALES.INFORMATION' | translate}}</a></li></ul></li><li class=dropdown><a class=dropdown-toggle data-toggle=dropdown role=button aria-haspopup=true aria-expanded=false>{{'MENU.SKU.TITLE' | translate}}<span class=caret></span></a><ul class=dropdown-menu><li><a ui-sref=skuAvailability>{{'MENU.SKU.AVAILABILITY' | translate}}</a></li><li><a ui-sref=skuPrice>{{'MENU.SKU.PRICE' | translate}}</a></li><li><a ui-sref=skuInfo>{{'MENU.SKU.INFORMATION' | translate}}</a></li></ul></li><li class=dropdown><a class=dropdown-toggle data-toggle=dropdown role=button aria-haspopup=true aria-expanded=false>{{'MENU.CUSTOMER.TITLE' | translate}}<span class=caret></span></a><ul class=dropdown-menu><li><a ui-sref=customer_search>{{'MENU.CUSTOMER.INFORMATION' | translate}}</a></li><li><a ui-sref=customer_new>{{'MENU.CUSTOMER.NEW' | translate}}</a></li></ul></li><li class=dropdown><a class=dropdown-toggle data-toggle=dropdown role=button aria-haspopup=true aria-expanded=false>{{'MENU.DOCS.TITLE' | translate}}<span class=caret></span></a><ul class=dropdown-menu><li><a ui-sref=docsOrders>{{'MENU.DOCS.ORDERS' | translate}}</a></li><li><a ui-sref=docsReturns>{{'MENU.DOCS.RETURNS' | translate}}</a></li></ul></li><li class=dropdown><a class=dropdown-toggle data-toggle=dropdown role=button aria-haspopup=true aria-expanded=false>{{'MENU.STORE.TITLE' | translate}}<span class=caret></span></a><ul class=dropdown-menu><li><a ui-sref=storeSales>{{'MENU.STORE.SALES' | translate}}</a></li><li><a ui-sref=storeScore>{{'MENU.STORE.SCORE' | translate}}</a></li></ul></li></ul><div class=\"navbar-text navbar-right\"><img aria-hidden=true ng-src={{theSession.UserLogoUrl}} style=\"display: inline; width: 32px; height: 32px\"></div><ul class=\"nav navbar-nav navbar-right\"><li class=dropdown><a class=dropdown-toggle data-toggle=dropdown role=button aria-haspopup=true aria-expanded=false>{{theSession.UserName}}<span class=caret></span></a><ul class=dropdown-menu><li><a ng-click=signOut()>{{'MENU.SIGNOUT' | translate}}</a></li></ul></li></ul></div></div></nav><div ui-view>"
  );


  $templateCache.put('views/customer_new.html',
    "<div class=\"container esContainer\"><es-params-panel es-params-def=vm.customerFields es-params-values=vm.customerValues es-panel-open=true es-run-click=vm.addCustomer() es-run-title=Add es-show-run=true></es-params-panel></div>"
  );


  $templateCache.put('views/customer_search.html',
    "<div class=container><button ng-click=vm.myHide()>Status is {{vm.status.xxx}}</button><uib-accordion close-others=true><div uib-accordion-group class=panel-danger heading=\"1. Locate a customer ...\" is-open=vm.status.listisOpen><es-web-pq es-group-id=vm.pqDef.GroupID es-force-title=\"'Search'\" es-panel-open=vm.status.xxx es-filter-id=vm.pqDef.FilterID es-params-values=vm.pqDef.Params es-p-q-options=vm.pqDef.PQOptions es-post-process-grid-options=vm.handleGridOptions(arg1)></div><div uib-accordion-group class=panel-success heading=\"2. Customer\" is-open=vm.status.formisOpen><h5>{{vm.CustomerCode}}</h5></div></uib-accordion></div>"
  );


  $templateCache.put('views/es00documents.html',
    "<div id=esContainer><div class=\"modal-header esContainer\"><h4 class=modal-title id=modal-title>{{vm.title}}</h4></div><div class=\"modal-body esContainer\" id=modal-body><uif-spinner ng-show=vm.state.isRunning uif-size=large>{{'MENU.WORKING' | translate}}</uif-spinner><es00-documents-detail es-isudgid=vm.cRow.fTaskGID></es00-documents-detail></div><div class=modal-footer><button class=\"btn btn-primary\" type=button ng-click=vm.ok()>{{'MENU.CLOSE' | translate}}</button></div></div>"
  );


  $templateCache.put('views/login.html',
    "<div ng-cloak class=\"container esContainer\"><es-login ng-show=showLogin es-credentials=esCredentials es-on-success=authenticate() es-show-subscription=true es-show-bridge=true es-show-sticky-session=0></es-login><uif-spinner ng-show=!showLogin uif-size=large>{{'MENU.AUTHENTICATING' | translate}}</uif-spinner></div>"
  );


  $templateCache.put('views/recipients.html',
    "<div class=\"alert alert-warning\" role=alert><uif-spinner ng-show=recipients.state.isRunning uif-size=large>{{'MENU.WORKING' | translate}}</uif-spinner><strong>{{recipients.Rows.length}} eMail {{'PERSON.CONTACT' | translate}}</strong> {{'MENU.FOUNDINENTERSOFT' | translate}}</div><div ng-repeat=\"cRow in recipients.Rows\"><uif-persona-card uif-style=round uif-size=xlarge uif-image-url={{cRow.contactPhoto}}><uif-persona-card-primary-text>{{cRow.Name}}</uif-persona-card-primary-text><uif-persona-card-secondary-text>{{cRow.Department}}, {{cRow.CompanyName}}</uif-persona-card-secondary-text><uif-persona-card-tertiary-text>{{'PERSON.POSITION' | translate}}: {{cRow.Title}}</uif-persona-card-tertiary-text><uif-persona-card-optional-text>{{cRow.CompanyAddress}}</uif-persona-card-optional-text><uif-persona-card-action uif-icon=mail uif-placeholder=regular><uif-persona-card-detail-line ng-if=cRow.PersomEmail><uif-persona-card-detail-label>{{'PERSON.PERSONAL' | translate}}:</uif-persona-card-detail-label><uif-link ng-href=mailto:{{cRow.PersomEmail}}>{{cRow.PersomEmail}}</uif-link></uif-persona-card-detail-line><uif-persona-card-detail-line ng-if=cRow.ContactEmail><uif-persona-card-detail-label>{{'PERSON.CONTACT' | translate}}:</uif-persona-card-detail-label><uif-link ng-href=mailto:{{cRow.ContactEmail}}>{{cRow.ContactEmail}}</uif-link></uif-persona-card-detail-line></uif-persona-card-action><uif-persona-card-action uif-icon=phone uif-placeholder=regular><uif-persona-card-detail-line><uif-persona-card-detail-label>{{'PERSON.MOBILE' | translate}}:</uif-persona-card-detail-label>{{cRow.Mobile1}} / {{cRow.Mobile2}}</uif-persona-card-detail-line><uif-persona-card-detail-line><uif-persona-card-detail-label>{{'PERSON.PHONE' | translate}}(s):</uif-persona-card-detail-label>{{cRow.Person_Telephone1}} / {{cRow.Person_Telephone2}}</uif-persona-card-detail-line></uif-persona-card-action><uif-persona-card-action uif-icon=phone uif-placeholder=regular><uif-persona-card-detail-line><uif-persona-card-detail-label>{{'PERSON.COMPANY' | translate}}:</uif-persona-card-detail-label>{{cRow.Person_Telephone1}}</uif-persona-card-detail-line><uif-persona-card-detail-line><uif-persona-card-detail-label>{{'PERSON.COMPANY' | translate}}:</uif-persona-card-detail-label>{{cRow.Company_Telephone2}}</uif-persona-card-detail-line></uif-persona-card-action><uif-persona-card-action uif-icon=org ng-click=\"alert('hello')\" uif-placeholder=topright><uif-link ng-href=mailto:{{cRow.PersomEmail}}>{{cRow.PersomEmail}}</uif-link></uif-persona-card-action></uif-persona-card><br></div>"
  );


  $templateCache.put('views/sales.html',
    "<h1>Hello World</h1>"
  );


  $templateCache.put('views/sku_availability.html',
    "<div class=container><uib-accordion close-others=true><div uib-accordion-group class=panel-primary heading=\"1. Search ...\" is-open=vm.status.searchisOpen><form name=search_sku class=form><div class=row><div class=\"form-group col-xs-12\"><input id=searchctrl class=\"form-control input-lg\" placeholder=\"Barcode, Code, Multiple Codes\" ng-required=true ng-model-options=\"{getterSetter: true}\" ng-model=vm.searchValue.pValue></div></div><button class=\"btn btn-primary\" type=button ng-disabled=\"search_sku.$invalid || vm.status.isrunning\" ng-click=vm.searchSKU()>{{'ESUI.GENERIC.OK' | translate}}</button></form></div><div uib-accordion-group class=panel-danger heading=\"2. Local Store\" is-open=vm.status.storeisOpen is-disabled=!vm.myStoreRow><table class=\"table table-hover table-condensed\"><thead><tr><th>{{'TABLE.FIELD' | translate}}</th><th>{{'TABLE.VALUE' | translate}}</th></tr></thead><tbody><tr><td>Scan Code</td><td>{{vm.searchValue.strVal()}}</td></tr><tr ng-repeat=\"col in vm.myStoreInfo.columns\"><td>{{col.title}}</td><td>{{vm.myStoreRow[col.field]}}</td></tr></tbody></table></div><div uib-accordion-group class=panel-success heading=\"3. Other Stores\" is-open=vm.status.otherisOpen is-disabled=!vm.myStoreRow><es-grid es-group-id=vm.otherDef.GroupID es-filter-id=vm.otherDef.FilterID es-execute-params=vm.otherDef.Params es-pq-options=vm.otherDef.PQOptions es-data-source=vm.otherDS></div></uib-accordion></div>"
  );


  $templateCache.put('views/storeSales.html',
    "<div id=esContainer><es-combo-pq es-pq-def=vm.storeSalesPQs></es-combo-pq></div>"
  );

}]);
