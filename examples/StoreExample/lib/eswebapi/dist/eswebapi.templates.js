angular.module('es.Web.UI').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/partials/es00DocumentsDetail.html',
    "<es-grid es-grid-options=\"esDocumentGridOptions\">"
  );


  $templateCache.put('src/partials/esChartPQ.html',
    "<div class=row><es-params-panel class=col-xs-12 ng-cloak es-panel-open=esPanelOpen ng-if=!esLocalData es-group-id=esPqDef es-local-data-source=\"'true'\" es-show-run=\"'true'\" es-run-click=::executePQ() es-data-source=esChartDataSource></es-params-panel><div class=col-xs-12><kendo-tab-strip><ul><li class=k-state-active><span class=\"glyphicon glyphicon-picture\"></span><span class=hidden-xs>{{'ESUI.ESCHARTPQ.CHART' | translate}}</span></li><li><span class=\"glyphicon glyphicon-align-justify\"></span><span class=hidden-xs>{{'ESUI.ESCHARTPQ.DATA' | translate}}</span></li></ul><div class=eschart-wrapper><div kendo-chart=esChartCtrl k-ng-delay=esChartOptions.dataSource k-options=esChartOptions></div></div><div><es-local-grid es-grid-options=esPqDef.esGridOptions es-data-source=esChartDataSource></es-local-grid></div></kendo-tab-strip></div></div>"
  );


  $templateCache.put('src/partials/esGauge.html',
    "<kendo-radialgauge ng-if=\"esGaugeType == 'radial'\" k-scale=esScaleOptions ng-model=esRow.GValue></kendo-radialgauge><kendo-lineargauge ng-if=\"esGaugeType != 'radial'\" k-scale=esScaleOptions ng-model=esRow.GValue></kendo-lineargauge>"
  );


  $templateCache.put('src/partials/esGaugePQ.html',
    "<es-gauge es-row=esRow></es-gauge>"
  );


  $templateCache.put('src/partials/esGrid.html',
    "<div kendo-grid k-ng-delay=esGridOptions.dataSource es-p-q-options=esPQOptions k-options=esGridOptions k-rebind=esGridOptions.reBind></div>"
  );


  $templateCache.put('src/partials/esInvestigate.html',
    "<div class=modal-header><h4 class=modal-title id=modal-title>{{'ESUI.PQ.INVESTIGATE' | translate}} - {{::invParams.paramDef.caption}}</h4></div><div class=modal-body id=modal-body><es-grid es-group-id=::invParams.paramDef.invSelectedMasterTable es-filter-id=\"::invParams.paramDef.invSelectedMasterTable + '_search'\" es-post-grid-options=investigateGridOptions es-execute-params=invParams.pVals></es-grid></div><div class=modal-footer><button class=\"btn btn-primary\" type=button ng-click=ok()>OK</button> <button class=\"btn btn-warning\" type=button ng-click=cancel()>Cancel</button></div>"
  );


  $templateCache.put('src/partials/esLocalGrid.html',
    "<div kendo-grid=esGridCtrl k-ng-delay=esGridOptions k-data-source=esDataSource k-rebind=esGridOptions.reBind k-options=esGridOptions></div>"
  );


  $templateCache.put('src/partials/esLogin.html',
    "<form name=esLoginFrm class=esLogin-form novalidate><div class=\"col-xs-12 col-sm-6\" ng-if=esShowSubscription><h4 class=esLogin-form>{{'ESUI.LOGIN_FORM.SUBSCRIPTION' | translate}}</h4><div ng-class=\"{'has-error': esLoginFrm.subscriptionId.$invalid}\"><label for=subscriptionId class=sr-only>{{'ESUI.LOGIN_FORM.SUBSCRIPTION_ID' | translate}}</label><input name=subscriptionId class=form-control placeholder=\"{{'ESUI.LOGIN_FORM.SUBSCRIPTION_ID' | translate}}\" ng-model=esCredentials.subscriptionId></div><div ng-class=\"{'has-error': esLoginFrm.subscriptionPwd.$invalid}\"><label for=subscriptionPwd class=sr-only>{{'ESUI.LOGIN_FORM.SUBSCRIPTION_PASSWORD' | translate}}</label><input type=password autocomplete=off name=subscriptionPwd class=form-control placeholder=\"{{'ESUI.LOGIN_FORM.SUBSCRIPTION_PASSWORD' | translate}}\" ng-model=esCredentials.subscriptionPassword required autofocus></div><div class=row ng-if=esShowOnPremises><div class=\"col-xs-12 col-sm-3\"><label for=serverUrl>On Premises <input type=checkbox name=onPremises ng-model=esCredentials.onPremises class=form-control placeholder=StickyMode></label></div><div ng-if=esCredentials.onPremises class=\"col-xs-12 col-sm-9\" ng-class=\"{'has-error': esLoginFrm.serverUrl.$invalid}\"><label for=serverUrl>{{'ESUI.LOGIN_FORM.SERVERURL' | translate}}</label><input autocomplete=off name=serverUrl class=form-control placeholder=\"{{'ESUI.LOGIN_FORM.SERVERURL' | translate}}\" ng-model=esCredentials.host></div></div></div><div class=\"col-xs-12 col-sm-6\"><h4 class=esLogin-form>{{'ESUI.LOGIN_FORM.SIGNIN' | translate}}</h4><div ng-class=\"{'has-error': esLoginFrm.userId.$invalid}\"><label for=userId class=sr-only>{{'ESUI.LOGIN_FORM.USER_ID' | translate}}</label><input name=userId class=form-control placeholder=\"{{'ESUI.LOGIN_FORM.USER_ID' | translate}}\" ng-model=esCredentials.UserID required autofocus></div><div ng-class=\"{'has-error': esLoginFrm.password.$invalid}\"><label for=password class=sr-only>{{'ESUI.LOGIN_FORM.USER_PASSWORD' | translate}}</label><input type=password name=password autocomplete=off class=form-control placeholder=\"{{'ESUI.LOGIN_FORM.USER_PASSWORD' | translate}}\" ng-model=esCredentials.Password required></div><div ng-if=esShowBridge ng-class=\"{'has-error': esLoginFrm.bridgeId.$invalid}\"><label for=bridgeId class=sr-only>{{'ESUI.LOGIN_FORM.COMPANY_ID' | translate}}</label><input name=bridgeId class=form-control placeholder=\"{{'ESUI.LOGIN_FORM.COMPANY_ID' | translate}}\" ng-model=esCredentials.bridgeId></div><div ng-class=\"{'has-error': esLoginFrm.branch.$invalid}\"><label for=branch class=sr-only>{{'ESUI.LOGIN_FORM.BRANCH_ID' | translate}}</label><input name=branch class=form-control placeholder=\"{{'ESUI.LOGIN_FORM.BRANCH_ID' | translate}}\" ng-model=esCredentials.BranchID required></div><div ng-class=\"{'has-error': esLoginFrm.lang.$invalid}\"><label for=lang class=sr-only>{{'ESUI.LOGIN_FORM.LANG_ID' | translate}}</label><select id=lang kendo-drop-down-list style=\"width: 100%\" k-ng-model=esCredentials.LangID k-options=esLangOptions></select></div></div><div ng-if=esShowStickySession class=form-group><input type=checkbox ng-model=esCredentials.StickySession class=form-control placeholder=StickyMode></div><button class=\"btn btn-lg btn-primary btn-block\" ng-disabled=esLoginFrm.$invalid ng-click=esOnSuccess()>{{'ESUI.LOGIN_FORM.SIGNIN' | translate}}</button></form>"
  );


  $templateCache.put('src/partials/esMapMarkers.html',
    "<ui-gmap-markers models=esMarkers coords=\"'self'\" click=esClick() options=\"'esOptions'\" fit=\"'true'\" dorebuildall=true type=esType typeoptions=esTypeOptions modelsbyref=true><ui-gmap-windows ng-if=esShowWindow show=\"'showWindow'\" dorebuildall=true templateurl=\"'esTempl'\" options=\"'esInfoWindowOptions'\" templateparameter=\"'esObj'\" ng-cloak></ui-gmap-windows></ui-gmap-markers>"
  );


  $templateCache.put('src/partials/esMapPQ.html',
    "<div class=row><div class=col-xs-12><es-params-panel ng-cloak es-panel-open=esPanelOpen es-group-id=esPqDef es-run-click=executePQ() es-show-run=\"'true'\" es-local-data-source=\"'true'\" es-run-title=\"{{'ESUI.ESMAPPQ.RUN_MAP' | translate}}\"></es-params-panel></div><div ng-show=esMapOptions.showOptions class=\"btn-group col-xs-6\"><label class=\"btn btn-primary\" ng-model=esToggleData uib-btn-radio=\"'Map'\">{{'ESUI.ESMAPPQ.MAP' | translate}}</label><label class=\"btn btn-primary\" ng-model=esToggleData uib-btn-radio=\"'Data'\">{{'ESUI.ESMAPPQ.DATA' | translate}}</label><label class=\"btn btn-primary\" ng-model=esToggleData uib-btn-radio=\"'Both'\">{{'ESUI.ESMAPPQ.BOTH' | translate}}</label></div><div ng-show=esMapOptions.showOptions class=\"btn-group col-xs-6\"><label class=\"btn btn-primary\" ng-model=esType uib-btn-radio=\"'standard'\">{{'ESUI.ESMAPPQ.CLUSTER_STANDARD' | translate}}</label><label class=\"btn btn-primary\" ng-model=esType uib-btn-radio=\"'cluster'\">{{'ESUI.ESMAPPQ.CLUSTER_CLUSTER' | translate}}</label><label class=\"btn btn-primary\" ng-model=esType uib-btn-radio=\"'spider'\">{{'ESUI.ESMAPPQ.CLUSTER_SPIDER' | translate}}</label></div><ui-gmap-google-map ng-hide=\"esToggleData == 'Data'\" ng-class=\"{ 'col-xs-6': esToggleData == 'Both', 'col-xs-12' : esToggleData == 'Map'}\" center=esMapOptions.center zoom=esMapOptions.zoom control=esMapControl pan=true><es-map-markers es-rows=mapDS es-pq-info=myPQInfo es-high-light=esHighLight es-type=esType es-type-options=esTypeOptions es-show-window=esShowWindow es-click=esClick()></es-map-markers></ui-gmap-google-map><es-local-grid ng-hide=\"esToggleData == 'Map'\" ng-class=\"{ 'col-xs-6': esToggleData == 'Both', 'col-xs-12' : esToggleData == 'Data'}\" es-grid-options=esPqDef.esGridOptions es-data-source=mapDS></es-local-grid></div>"
  );


  $templateCache.put('src/partials/esParamAdvancedNumeric.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><div class=row><div class=\"col-xs-12 col-md-4\"><select class=\"form-control es-param-control\" kendo-drop-down-list ng-cloak k-ng-delay=esParamDef k-data-text-field=\"'caption'\" k-data-value-field=\"'value'\" k-auto-bind=true k-data-source=esGlobals.getesComplexParamFunctionOptions() k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue.oper></select></div><div class=col-xs-12 ng-class=\"{'col-md-8': esParamVal[esParamDef.id].paramValue.oper != 'RANGE', 'col-md-4': esParamVal[esParamDef.id].paramValue.oper == 'RANGE'}\"><input type=number class=es-param-control kendo-numeric-text-box align=right k-ng-model=esParamVal[esParamDef.id].paramValue.value k-spinners=false k-decimals=esParamDef.precision k-format=\"'n'+'{{::esParamDef.precision}}'\"></div><div class=\"col-xs-12 col-md-4\" ng-hide=\"esParamVal[esParamDef.id].paramValue.oper != 'RANGE'\"><input class=es-param-control kendo-numeric-text-box align=right k-ng-model=esParamVal[esParamDef.id].paramValue.valueTo k-spinners=false k-decimals=esParamDef.precision k-format=\"'n'+'{{::esParamDef.precision}}'\"></div></div>"
  );


  $templateCache.put('src/partials/esParamAdvancedString.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><div class=row><div class=col-xs-12 ng-class=\"{'': esParamVal[esParamDef.id].paramValue.oper == 'NULL' || esParamVal[esParamDef.id].paramValue.oper == 'NOTNULL', 'col-md-4': esParamVal[esParamDef.id].paramValue.oper == 'RANGE', 'col-md-6': esParamVal[esParamDef.id].paramValue.oper != 'NULL' && esParamVal[esParamDef.id].paramValue.oper != 'NOTNULL' &&  esParamVal[esParamDef.id].paramValue.oper != 'RANGE'}\"><select class=\"form-control es-param-control\" kendo-drop-down-list ng-cloak k-ng-delay=esParamDef k-data-text-field=\"'caption'\" k-data-value-field=\"'value'\" k-auto-bind=true k-data-source=esGlobals.getesComplexParamFunctionOptions() k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue.oper></select></div><div class=col-xs-12 ng-hide=\"esParamVal[esParamDef.id].paramValue.oper == 'NOTNULL'|| esParamVal[esParamDef.id].paramValue.oper == 'NULL'\" ng-class=\"{'col-md-6': esParamVal[esParamDef.id].paramValue.oper != 'RANGE', 'col-md-4': esParamVal[esParamDef.id].paramValue.oper == 'RANGE'}\"><input class=\"form-control es-param-control\" kendo-masked-text-box ng-model=\"esParamVal[esParamDef.id].paramValue.value\"></div><div class=\"col-xs-12 col-md-4\" ng-hide=\"esParamVal[esParamDef.id].paramValue.oper != 'RANGE' || esParamVal[esParamDef.id].paramValue.oper == 'NOTNULL' || esParamVal[esParamDef.id].paramValue.oper == 'NULL'\"><input class=\"form-control es-param-control\" kendo-masked-text-box ng-model=\"esParamVal[esParamDef.id].paramValue.valueTo\"></div></div>"
  );


  $templateCache.put('src/partials/esParamDateRange.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><div class=row><div class=col-xs-12><select class=\"form-control es-param-control\" kendo-drop-down-list uib-tooltip=\"Hello World\" uib-tooltip-trigger=mouseenter k-data-text-field=\"'title'\" k-auto-bind=true k-data-value-field=\"'dValue'\" k-data-source=\"::esGlobals.getesDateRangeOptions({dateRangeClass: esParamDef.controlType})\" k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue.dRange></select></div><div class=col-xs-12 ng-hide=\"esParamVal[esParamDef.id].paramValue.dRange > '1'\"><input class=\"form-control es-param-control\" kendo-date-picker k-ng-model=\"esParamVal[esParamDef.id].paramValue.fromD\"></div><div class=col-xs-12 ng-hide=\"esParamVal[esParamDef.id].paramValue.dRange != '0'\"><input class=\"form-control es-param-control\" kendo-date-picker k-ng-model=\"esParamVal[esParamDef.id].paramValue.toD\"></div></div>"
  );


  $templateCache.put('src/partials/esParamEnum.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><select class=\"form-control es-param-control\" kendo-drop-down-list name={{::esParamDef.id}} ng-required=::esParamDef.required ng-cloak k-ng-delay=esParamDef k-data-text-field=\"'text'\" k-data-value-field=\"'value'\" k-auto-bind=true k-data-source=::esParamDef.enumList k-value-primitive=true k-ng-delay=esParamVal[esParamDef.id].paramValue k-ng-model=esParamVal[esParamDef.id].paramValue></select>"
  );


  $templateCache.put('src/partials/esParamInv.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><span class=\"k-textbox k-button k-space-right form-control es-param-control\"><input kendo-masked-text-box name={{::esParamDef.id}} ng-required=::esParamDef.required k-mask=::esParamDef.formatString ng-model-options=\"{getterSetter: true}\" ng-model=esParamVal[esParamDef.id].pValue><a class=\"k-icon k-i-search\" ng-click=onInvestigate()></a></span>"
  );


  $templateCache.put('src/partials/esParamMultiEnum.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><select class=\"form-control es-param-control\" name={{::esParamDef.id}} ng-required=::esParamDef.required kendo-multi-select k-placeholder=::esParamDef.id k-data-text-field=\"'text'\" k-data-value-field=\"'value'\" k-auto-bind=false k-value-primitive=true k-data-source=esParamDef.enumList k-ng-model=esParamVal[esParamDef.id].paramValue></select>"
  );


  $templateCache.put('src/partials/esParamMultiZoom.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><select class=\"form-control es-param-control\" kendo-multi-select name={{::esParamDef.id}} ng-required=::esParamDef.required k-placeholder=::esParamDef.caption k-template=\"'<span><b>#: Code #</b> -- #: Description #</span>'\" k-data-text-field=::esParamDef.invSelectedMasterField k-data-value-field=::esParamDef.invSelectedMasterField k-filter=\"'contains'\" k-auto-bind=false k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue k-data-source=esParamLookupDS></select>"
  );


  $templateCache.put('src/partials/esParamNumeric.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><input class=\"form-control es-param-control\" kendo-numeric-text-box name={{::esParamDef.id}} ng-required=::esParamDef.required align=right k-ng-model=esParamVal[esParamDef.id].paramValue k-spinners=false k-decimals=esParamDef.precision k-format=\"'n'+'{{::esParamDef.precision}}'\">"
  );


  $templateCache.put('src/partials/esParamText.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><input class=\"form-control es-param-control\" kendo-masked-text-box name={{::esParamDef.id}} ng-required=::esParamDef.required k-mask=::esParamDef.formatString ng-model-options=\"{getterSetter: true}\" ng-model=\"esParamVal[esParamDef.id].pValue\">"
  );


  $templateCache.put('src/partials/esParamZoom.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><select class=\"form-control es-param-control\" kendo-combo-box name={{::esParamDef.id}} ng-required=::esParamDef.required k-placeholder=::esParamDef.toolTip k-template=\"'<span><b>#: Code #</b> -- #: Description #</span>'\" k-data-text-field=::esParamDef.invSelectedMasterField k-data-value-field=::esParamDef.invSelectedMasterField k-filter=\"'contains'\" k-auto-bind=false k-min-length=3 k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue k-data-source=esParamLookupDS></select>"
  );


  $templateCache.put('src/partials/esParams.html',
    "<uib-accordion><div uib-accordion-group class=panel-default is-open=esPanelOpen><uib-accordion-heading>{{::(esForceTitle ? esForceTitle : esParamsDef.title)}}&nbsp;<span class=badge>{{::esParamsDef.visibleDefinitions().length}}</span> <i class=\"pull-right glyphicon\" ng-class=\"{'glyphicon-zoom-out': esPanelOpen, 'glyphicon-zoom-in': !esPanelOpen}\"></i></uib-accordion-heading><form novalidate class=form name=esParamsPanelForm><div class=row><div class=\"form-group col-xs-12 col-sm-6 col-md-4 col-lg-3\" ng-class=\"{'has-error': esParamsPanelForm.{{::param.id}}.$invalid}\" ng-repeat=\"param in esParamsDef.visibleDefinitions() | orderBy:'aa'\"><es-param class=es-param es-type=\"param | esParamTypeMapper\" es-param-val=esParamsValues es-param-def=param></es-param></div></div></form><div ng-if=esShowRun><button type=button class=\"btn btn-primary\" ng-click=esRunClick()>{{::esRunTitle}}</button></div></div></uib-accordion>"
  );


  $templateCache.put('src/partials/esParamsPanelPopover.html',
    "<div class=row ng-repeat=\"param in esParamsDef.definitions | filter:{visible: true} | orderBy:'aa'\"><div ng-if=esParamsValues[param.id].strVal()><span class=\"col-xs-12 col-sm-6\"><strong>{{::param.caption}}<strong></strong></strong></span> <span class=\"col-xs-12 col-sm-6\">{{esParamsValues[param.id].strVal()}}</span></div></div>"
  );


  $templateCache.put('src/partials/esWebPQ.html',
    "<div class=row><es-params-panel class=col-xs-12 ng-if=::esParamsDef.visibleDefinitions().length ng-cloak es-params-values=esParamsValues es-group-id=esGroupId es-filter-id=esFilterId es-force-title=::esForceTitle es-panel-open=::esPanelOpen es-params-def=esParamsDef></es-params-panel><div class=col-xs-12><kendo-pager ng-if=esShowTopPagination auto-bind=false page-size=20 page-sizes=esGridOptions.pageable.pageSizes refresh=true data-source=esGridOptions.dataSource></kendo-pager></div><es-grid class=\"esgrid col-xs-12\" ng-cloak es-group-id=esGroupId es-filter-id=esFilterId es-grid-options=esGridOptions es-p-q-options=esPQOptions es-execute-params=esParamsValues></es-grid></div>"
  );


  $templateCache.put('src/partials/esSurvey/esPropertyQuestion_0.html',
    "<input class=\"es-survey-question-control form-control\" name={{esGlobals.esConvertGIDtoId(esQuestion.GID)}} ng-required=esQuestion.Mandatory ng-model=\"esPsVal[esQuestion.Code]\">"
  );


  $templateCache.put('src/partials/esSurvey/esPropertyQuestion_1.html',
    "<input class=\"es-survey-question-control form-control\" type=number name={{esGlobals.esConvertGIDtoId(esQuestion.GID)}} ng-required=esQuestion.Mandatory align=right ng-model=esPsVal[esQuestion.Code] spinners=\"false\">"
  );


  $templateCache.put('src/partials/esSurvey/esPropertyQuestion_11.html',
    "<input class=\"es-survey-question-control es-param-control\" kendo-date-time-picker name={{esGlobals.esConvertGIDtoId(esQuestion.GID)}} ng-required=esQuestion.Mandatory ng-model=\"esPsVal[esQuestion.Code]\">"
  );


  $templateCache.put('src/partials/esSurvey/esPropertyQuestion_12.html',
    "<uib-timepicker class=\"es-survey-question-control es-param-control\" name={{esGlobals.esConvertGIDtoId(esQuestion.GID)}} ng-required=esQuestion.Mandatory ng-model=esPsVal[esQuestion.Code] hour-step=1 minute-step=30 show-meridian=false></uib-timepicker>"
  );


  $templateCache.put('src/partials/esSurvey/esPropertyQuestion_14.html',
    "<div ng-repeat=\"option in getChoicesOfQuestion()\"><label><input name={{esGlobals.esConvertGIDtoId(esQuestion.GID)}} type=checkbox es-checklist-model=esPsVal[esQuestion.Code] es-checklist-value=option.Value>{{option.Description}}</label></div>"
  );


  $templateCache.put('src/partials/esSurvey/esPropertyQuestion_15.html',
    "<input kendo-numeric-text-box k-min=0 k-max=100 class=\"es-survey-question-control es-param-control\" name={{esGlobals.esConvertGIDtoId(esQuestion.GID)}} ng-required=esQuestion.Mandatory ng-model=esPsVal[esQuestion.Code] style=\"width: 100%\">"
  );


  $templateCache.put('src/partials/esSurvey/esPropertyQuestion_2.html',
    "<input ng-if=!esQuestion.PArg class=\"es-survey-question-control form-control\" type=number name={{esGlobals.esConvertGIDtoId(esQuestion.GID)}} ng-required=esQuestion.Mandatory align=right pattern=[0-9]+ ng-model=\"esPsVal[esQuestion.Code]\"><uib-rating ng-if=\"esQuestion.PArg && (esQuestion.PArg.slice(0, 1) != '-')\" name={{esGlobals.esConvertGIDtoId(esQuestion.GID)}} es-positive-integer=!esQuestion.Mandatory ng-model=esPsVal[esQuestion.Code] max={{esQuestion.PArg}}></uib-rating><div ng-if=\"esQuestion.PArg && (esQuestion.PArg.slice(0, 1) == '-')\" ng-repeat=\"option in getScale(esQuestion.PArg)\"><label><input type=radio name={{esGlobals.esConvertGIDtoId(esQuestion.GID)}} ng-required=\"esQuestion.Mandatory && !esPsVal[esQuestion.Code]\" ng-model=esPsVal[esQuestion.Code] ng-value=option>{{option}}</label></div>"
  );


  $templateCache.put('src/partials/esSurvey/esPropertyQuestion_3.html',
    "<p class=input-group><input class=\"es-survey-question-control form-control\" is-open=calendarStatus.opened name={{esGlobals.esConvertGIDtoId(esQuestion.GID)}} ng-required=esQuestion.Mandatory uib-datepicker-popup={{calendarFormat}} ng-model=esPsVal[esQuestion.Code] close-text=\"Close\"> <span class=input-group-btn><button type=button class=\"btn btn-default\" ng-click=openCalendar($event)><i class=\"glyphicon glyphicon-calendar\"></i></button></span></p>"
  );


  $templateCache.put('src/partials/esSurvey/esPropertyQuestion_4.html',
    "<div ng-repeat=\"option in getChoicesOfQuestion()\"><label><input type=radio name={{esGlobals.esConvertGIDtoId(esQuestion.GID)}} ng-required=\"esQuestion.Mandatory && !esPsVal[esQuestion.Code]\" ng-model=esPsVal[esQuestion.Code] ng-value={{option.Value}}>{{option.Description}}</label></div>"
  );


  $templateCache.put('src/partials/esSurvey/esPropertyQuestion_6.html',
    "<input class=\"es-survey-question-control form-control\" type=number name={{esGlobals.esConvertGIDtoId(esQuestion.GID)}} ng-required=esQuestion.Mandatory align=right ng-model=esPsVal[esQuestion.Code] spinners=\"false\">"
  );


  $templateCache.put('src/partials/esSurvey/esPropertyQuestion_7.html',
    "<select kendo-drop-down-list name={{esGlobals.esConvertGIDtoId(esQuestion.GID)}} ng-required=esQuestion.Mandatory k-data-text-field=\"'Description'\" k-data-value-field=\"'Code'\" k-auto-bind=false k-ng-delay=esQuestion k-data-source=\"{{esQuestion.PArg + '_DS'}}\" k-value-primitive=true ng-model=esPsVal[esQuestion.Code] style=\"width: 100%\"></select>"
  );


  $templateCache.put('src/partials/esSurvey/esSurvey.html',
    "<div class=row><div ng-if=isIntroduction() class=es-survey-introduction><div><div ng-bind-html=esPsDef.Campaign.TaskNotes></div></div><div><button class=\"btn btn-primary\" ng-click=advanceStep()>{{'ESUI.ESSURVEY.START' | translate}}</button></div></div><div ng-show=\"esSectionIdx >= 0\"><h2>{{esSectionIdx + 1}}. {{esPsDef.Sections[esSectionIdx].Description}}</h2><form novalidate class=form name=esqsection><div class=row><ng-form name=esqsection><div class=\"es-survey-question form-group col-xs-12\" ng-class=\"{'has-error': esqsection.{{esGlobals.esConvertGIDtoId(question.GID)}}.$invalid && esqsection.{{esGlobals.esConvertGIDtoId(question.GID)}}.$dirty}\" ng-repeat=\"question in getQuestionsofSection()\"><label class=\"control-label es-survey-question-label\">{{$index + 1}}. {{question.Description}} <span ng-if=question.Mandatory>(*)</span></label><label class=es-survey-question-hint>{{question.AlternativeDescription}}</label><es-property-question es-ps-def=esPsDef es-question=question es-ps-val=\"esPsVal\"></div></ng-form><div><button class=\"btn btn-primary\" ng-click=backStep() ng-disabled=isIntroduction()>{{'ESUI.ESSURVEY.PREVIOUS' | translate}}</button> <button class=\"btn btn-primary\" ng-click=advanceStep() ng-hide=isLast() ng-disabled=esqsection.$invalid>{{'ESUI.ESSURVEY.NEXT' | translate}}</button> <button class=\"btn btn-primary\" ng-click=saveAndComplete() ng-show=isLast() ng-disabled=esqsection.$invalid>{{'ESUI.ESSURVEY.SAVE' | translate}}</button></div></div></form></div><div class=\"row es-survey-progress\"><uib-progressbar ng-show=!isIntroduction() animate=true value=progress() type=success><b>{{progress()}}%</b></uib-progressbar></div></div>"
  );

}]);
