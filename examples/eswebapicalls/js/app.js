(function (angular) {
	var eskbApp = angular.module('smeApp', [

			/* angular modules */
			'ui.router',
			'ngStorage',
			'ui.bootstrap',
			'pascalprecht.translate',

			/* Entersoft AngularJS WEB API Provider */
			'es.Services.Web',
			'smeControllers',

	]);


	eskbApp.run(['esGlobals',
			function (esGlobals) {
				//esGlobals.getESUISettings().mobile = "phone";
				//esGlobals.getESUISettings().defaultGridHeight = "auto";
			}
	])


	eskbApp.config(['$logProvider',
			'$stateProvider',
			'$urlRouterProvider',
			'esWebApiProvider',
			'$exceptionHandlerProvider',
			'$translateProvider',
			function ($logProvider, $stateProvider, $urlRouterProvider, esWebApiServiceProvider, $exceptionHandlerProvider, $translateProvider) {

				$translateProvider.useStaticFilesLoader({
					files: [{
						prefix: 'lib/eswebapi/dist/languages/eswebapi-locale-',
						suffix: '.json'
					}]
				});
				$translateProvider.preferredLanguage('el');
				$translateProvider.fallbackLanguage('en');
				$translateProvider.useSanitizeValueStrategy('escape');

				$urlRouterProvider.when('/', '/login');
				$urlRouterProvider.when('', '/login');
				$urlRouterProvider.otherwise('/login');

				$stateProvider
						.state('login', {
							templateUrl: 'login.html',
							controller: 'loginCtrl',
							url: '/login'
						})
						.state('properties', {
							templateUrl: 'properties.html',
							controller: 'propertiesCtrl',
							url: '/properties'
						})
						.state('pq', {
							templateUrl: 'pq.html',
							controller: 'pqCtrl',
							url: '/pq'
						})
						.state('webpq', {
							templateUrl: 'webpq.html',
							controller: 'webpqCtrl',
							url: '/webpq'
						})
						.state('masdetpq', {
							templateUrl: 'masdetpq.html',
							controller: 'masdetpqCtrl',
							url: '/masdetpq'
						})
						.state('opportunities', {
							templateUrl: 'opportunities.html',
							controller: 'opportunitiesCtrl',
							url: '/opps'
						})
						.state('examples', {
							templateUrl: 'examples.html',
							controller: 'examplesCtrl',
							url: '/examples'
						})
						.state('survey', {
							templateUrl: 'survey.html',
							controller: 'surveyCtrl',
							url: '/survey'
						})
						.state('maps', {
							templateUrl: 'maps.html',
							controller: 'mapsCtrl',
							url: '/maps'
						})
						.state('salesforce', {
							templateUrl: 'sales.html',
							controller: 'salesCtrl',
							url: '/salesf'
						});

				$logProvider.addDefaultAppenders();
				$exceptionHandlerProvider.setPushToServer(true);
				$exceptionHandlerProvider.setLogServer("Azure");

				var subscriptionId = "";
				esWebApiServiceProvider.setSettings({
					//host: "eswebapi.azurewebsites.net",
					//"host": "192.168.1.190/Entersoft.Web.Api",
					//"host": "eswebapi.entersoft.gr",
					//host: "10.211.55.3/entersoftapi",
					//"host": "esmasterapp.entersoft.gr",
					"host": "api.entersoft.gr",
					//subscriptionId: subscriptionId,
					//subscriptionPassword: "***",
					allowUnsecureConnection: false,
					//additionalHeaders: {
					//	"Ocp-Apim-Subscription-Key": "8"
					//}
				});

				//$logProvider.addESWebApiAppender(esWebApiServiceProvider.getServerUrl(), subscriptionId);

			}
	]);

})(window.angular);