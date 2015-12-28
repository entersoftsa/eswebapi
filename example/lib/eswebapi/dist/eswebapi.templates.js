angular.module('es.Web.UI').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/partials/es00DocumentsDetail.html',
    "<es-grid es-grid-options=esDocumentGridOptions es-srv-paging=\"false\">"
  );


  $templateCache.put('src/partials/esGrid.html',
    "<div kendo-grid=esGridCtrl k-ng-delay=esGridOptions.dataSource es-srv-paging=esSrvPaging k-options=esGridOptions></div>"
  );


  $templateCache.put('src/partials/esParamAdvancedNumeric.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><div class=row><div class=\"col-xs-12 col-md-4\"><select class=\"form-control es-param-control\" kendo-drop-down-list ng-cloak k-ng-delay=esParamDef k-data-text-field=\"'caption'\" k-data-value-field=\"'value'\" k-auto-bind=true k-data-source=esWebUIHelper.getesComplexParamFunctionOptions() k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue.oper></select></div><div class=col-xs-12 ng-class=\"{'col-md-8': esParamVal[esParamDef.id].paramValue.oper != 'RANGE', 'col-md-4': esParamVal[esParamDef.id].paramValue.oper == 'RANGE'}\"><input type=number class=es-param-control kendo-numeric-text-box align=right k-ng-model=esParamVal[esParamDef.id].paramValue.value k-spinners=false k-decimals=esParamDef.precision k-format=\"'n'+'{{::esParamDef.precision}}'\"></div><div class=\"col-xs-12 col-md-4\" ng-hide=\"esParamVal[esParamDef.id].paramValue.oper != 'RANGE'\"><input class=es-param-control kendo-numeric-text-box align=right k-ng-model=esParamVal[esParamDef.id].paramValue.valueTo k-spinners=false k-decimals=esParamDef.precision k-format=\"'n'+'{{::esParamDef.precision}}'\"></div></div>"
  );


  $templateCache.put('src/partials/esParamAdvancedString.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><div class=row><div class=\"col-xs-12 col-md-4\"><select class=\"form-control es-param-control\" kendo-drop-down-list ng-cloak k-ng-delay=esParamDef k-data-text-field=\"'caption'\" k-data-value-field=\"'value'\" k-auto-bind=true k-data-source=esWebUIHelper.getesComplexParamFunctionOptions() k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue.oper></select></div><div class=col-xs-12 ng-class=\"{'col-md-8': esParamVal[esParamDef.id].paramValue.oper != 'RANGE', 'col-md-4': esParamVal[esParamDef.id].paramValue.oper == 'RANGE'}\"><input class=\"form-control es-param-control\" kendo-masked-text-box ng-model=\"esParamVal[esParamDef.id].paramValue.value\"></div><div class=\"col-xs-12 col-md-4\" ng-hide=\"esParamVal[esParamDef.id].paramValue.oper != 'RANGE'\"><input class=\"form-control es-param-control\" kendo-masked-text-box ng-model=\"esParamVal[esParamDef.id].paramValue.valueTo\"></div></div>"
  );


  $templateCache.put('src/partials/esParamDateRange.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><div class=row><div class=col-xs-12 ng-class=\"{'col-md-4': esParamVal[esParamDef.id].paramValue.dRange == '0' || esParamVal[esParamDef.id].paramValue.dRange =='1'}\"><select class=\"form-control es-param-control\" kendo-drop-down-list uib-tooltip=\"Hello World\" uib-tooltip-trigger=mouseenter k-data-text-field=\"'title'\" k-auto-bind=true k-data-value-field=\"'dValue'\" k-data-source=dateRangeOptions k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue.dRange></select></div><div class=col-xs-12 ng-class=\"{'col-md-8': esParamVal[esParamDef.id].paramValue.dRange == '1', 'col-md-4': esParamVal[esParamDef.id].paramValue.dRange == '0'}\" ng-hide=\"esParamVal[esParamDef.id].paramValue.dRange > '1'\"><input class=\"form-control es-param-control\" kendo-date-picker k-ng-model=\"esParamVal[esParamDef.id].paramValue.fromD\"></div><div class=col-xs-12 ng-class=\"{'col-md-4': esParamVal[esParamDef.id].paramValue.dRange == '0'}\" ng-hide=\"esParamVal[esParamDef.id].paramValue.dRange != '0'\"><input class=\"form-control es-param-control\" kendo-date-picker k-ng-model=\"esParamVal[esParamDef.id].paramValue.toD\"></div></div>"
  );


  $templateCache.put('src/partials/esParamEnum.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><select class=\"form-control es-param-control\" kendo-drop-down-list name={{::esParamDef.id}} ng-required=::esParamDef.required ng-cloak k-ng-delay=esParamDef k-data-text-field=\"'text'\" k-data-value-field=\"'value'\" k-auto-bind=true k-option-label=\"{ text: 'All', value: null}\" k-data-source=::esParamDef.enumList k-value-primitive=true ng-model-options=\"{getterSetter: true}\" ng-model=esParamVal[esParamDef.id].pValue></select>"
  );


  $templateCache.put('src/partials/esParamMultiEnum.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><select class=\"form-control es-param-control\" name={{::esParamDef.id}} ng-required=::esParamDef.required kendo-multi-select k-placeholder=::esParamDef.id k-data-text-field=\"'text'\" k-data-value-field=\"'value'\" k-auto-bind=false k-value-primitive=true k-data-source=esParamDef.enumList ng-model-options=\"{getterSetter: true}\" ng-model=esParamVal[esParamDef.id].pValue></select>"
  );


  $templateCache.put('src/partials/esParamMultiZoom.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><select class=form-control kendo-multi-select name={{::esParamDef.id}} ng-required=::esParamDef.required k-placeholder=::esParamDef.caption k-template=\"'<span><b>#: Code #</b> -- #: Description #</span>'\" k-data-text-field=::esParamDef.invSelectedMasterField k-data-value-field=::esParamDef.invSelectedMasterField k-filter=\"'contains'\" k-auto-bind=false ng-model=esParamVal[esParamDef.id].paramValue k-data-source=esParamLookupDS></select>"
  );


  $templateCache.put('src/partials/esParamNumeric.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><input class=form-control kendo-numeric-text-box name={{::esParamDef.id}} ng-required=::esParamDef.required align=right k-ng-model=esParamVal[esParamDef.id].paramValue k-spinners=false k-decimals=esParamDef.precision k-format=\"'n'+'{{::esParamDef.precision}}'\">"
  );


  $templateCache.put('src/partials/esParamText.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><input class=\"form-control es-param-control\" kendo-masked-text-box name={{::esParamDef.id}} ng-required=::esParamDef.required k-mask=::esParamDef.formatString ng-model-options=\"{getterSetter: true}\" ng-model=\"esParamVal[esParamDef.id].pValue\">"
  );


  $templateCache.put('src/partials/esParamZoom.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><select class=form-control kendo-combo-box name={{::esParamDef.id}} ng-required=::esParamDef.required k-placeholder=::esParamDef.toolTip k-template=\"'<span><b>#: Code #</b> -- #: Description #</span>'\" k-data-text-field=::esParamDef.invSelectedMasterField k-data-value-field=::esParamDef.invSelectedMasterField k-filter=\"'contains'\" ng-required=::esParamDef.required k-auto-bind=false k-min-length=3 ng-model=esParamVal[esParamDef.id].paramValue k-data-source=esParamLookupDS></select>"
  );


  $templateCache.put('src/partials/esParams.html',
    "<uib-accordion><uib-accordion-group is-open=esPanelOpen><uib-accordion-heading>{{::esParamsDef.title}} - Parameters <span class=badge>{{::esParamsDef.visibleDefinitions().length}}</span> <i class=\"pull-right glyphicon\" uib-popover-placement=left uib-popover-append-to-body=true uib-popover-template=\"'src/partials/esParamsPanelPopover.html'\" popover-title={{::esParamsDef.title}} popover-trigger=mouseenter ng-class=\"{'glyphicon-zoom-out': esPanelOpen, 'glyphicon-zoom-in': !esPanelOpen}\"></i></uib-accordion-heading><form novalidate class=form name=esParamsPanelForm><div class=row><div class=\"form-group col-xs-12 col-sm-6 col-md-4 col-lg-3\" ng-class=\"{'has-error': esParamsPanelForm.{{::param.id}}.$invalid}\" ng-repeat=\"param in esParamsDef.visibleDefinitions() | orderBy:'aa'\"><es-param class=es-param es-type=\"param | esParamTypeMapper\" es-param-val=esParamsValues es-param-def=param></es-param></div></div></form></uib-accordion-group></uib-accordion>"
  );


  $templateCache.put('src/partials/esParamsPanelPopover.html',
    "<div class=row ng-repeat=\"param in esParamsDef.definitions | filter:{visible: true} | orderBy:'aa'\"><div ng-if=esParamsValues[param.id].strVal()><span class=\"col-xs-12 col-sm-6\"><strong>{{::param.caption}}<strong></strong></strong></span> <span class=\"col-xs-12 col-sm-6\">{{esParamsValues[param.id].strVal()}}</span></div></div>"
  );


  $templateCache.put('src/partials/esWebPQ.html',
    "<div class=row ng-if=::esParamsDef.visibleDefinitions().length><es-params-panel ng-cloak es-params-values=esParamsValues es-group-id=esGroupId es-filter-id=esFilterId es-params-def=esParamsDef></es-params-panel></div><div ng-if=esShowTopPagination class=row><kendo-pager auto-bind=false page-size=20 page-sizes=\"[20, 50, 100, 'All']\" refresh=true data-source=\"esGridOptions.dataSource\"></div><div class=row ng-cloak><es-grid es-group-id=esGroupId es-filter-id=esFilterId es-grid-options=esGridOptions es-srv-paging=esSrvPaging es-execute-params=\"esParamsValues\"></div>"
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
    "<input ng-if=!esQuestion.PArg class=\"es-survey-question-control form-control\" type=number name={{esGlobals.esConvertGIDtoId(esQuestion.GID)}} ng-required=esQuestion.Mandatory align=right pattern=[0-9]+ ng-model=\"esPsVal[esQuestion.Code]\"><uib-rating ng-if=\"esQuestion.PArg && (esQuestion.PArg.slice(0, 1) != '-')\" name={{esGlobals.esConvertGIDtoId(esQuestion.GID)}} es-positive-integer=!esQuestion.Mandatory ng-model=esPsVal[esQuestion.Code] max={{esQuestion.PArg}}></uib-rating><div ng-if=\"esQuestion.PArg && (esQuestion.PArg.slice(0, 1) == '-')\" ng-repeat=\"option in getScale(esQuestion.PArg)\"><label><input type=radio name={{esGlobals.esConvertGIDtoId(esQuestion.GID)}} ng-required=\"esQuestion.Mandatory && !esPsVal[esQuestion.Code]\" ng-model=esPsVal[esQuestion.Code] ng-value=option>{{option}}</label></div>{{esQuestion.PArg}}"
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
    "<div class=row><div ng-if=isIntroduction() class=es-survey-introduction><div><div ng-bind-html=esPsDef.Campaign.TaskNotes></div></div><div><button class=\"btn btn-primary\" ng-click=advanceStep()>Start</button></div></div><div ng-show=\"esSectionIdx >= 0\"><h2>{{esSectionIdx + 1}}. {{esPsDef.Sections[esSectionIdx].Description}}</h2><form novalidate class=form name=esqsection><div class=row><ng-form name=esqsection><div class=\"es-survey-question form-group col-xs-12\" ng-class=\"{'has-error': esqsection.{{esGlobals.esConvertGIDtoId(question.GID)}}.$invalid && esqsection.{{esGlobals.esConvertGIDtoId(question.GID)}}.$dirty}\" ng-repeat=\"question in getQuestionsofSection()\"><label class=\"control-label es-survey-question-label\">{{$index + 1}}. {{question.Description}} <span ng-if=question.Mandatory>(*)</span></label><label class=es-survey-question-hint>{{question.AlternativeDescription}}</label><es-property-question es-ps-def=esPsDef es-question=question es-ps-val=\"esPsVal\"></div></ng-form><div><button class=\"btn btn-primary\" ng-click=backStep() ng-disabled=isIntroduction()>Previous</button> <button class=\"btn btn-primary\" ng-click=advanceStep() ng-hide=isLast() ng-disabled=esqsection.$invalid>Next</button> <button class=\"btn btn-primary\" ng-click=saveAndComplete() ng-show=isLast() ng-disabled=esqsection.$invalid>Save and Close</button></div></div></form></div><div class=\"row es-survey-progress\"><uib-progressbar ng-show=!isIntroduction() animate=true value=progress() type=success><b>{{progress()}}%</b></uib-progressbar></div></div>"
  );

}]);
