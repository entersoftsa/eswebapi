describe("ES Authentication", function() {
    'use strict';

    var esWebApi;
    var $rootScope;

    var apiSettings = {
        host: "192.168.1.190/eswebapijti",
        subscriptionId: "",
        subscriptionPassword: "passx",
        allowUnsecureConnection: true
    };

    beforeEach(module('es.Services.Web', function(esWebApiProvider) {
        //Ensure angular modules available
        esWebApiProvider.setSettings(apiSettings);
    }));

    beforeEach(inject(function(_esWebApi_, _$rootScope_) {
        esWebApi = _esWebApi_;
        $rootScope = _$rootScope_;
    }));

    it('esWebApi should be defined', function() {
    	expect(esWebApi).toBeDefined();
    });

    it('esWebApiProvider Settings', function() {
        var outUrl = esWebApi.getServerUrl();
        expect(outUrl).toBe((apiSettings.allowUnsecureConnection ? 'http' : 'https') + '://' + apiSettings.host);
    });

    describe("ES Login", function() {
        var credentials = {
            UserID: 'admin',
            Password: 'entersoft',
            BranchID: 'ΑΘΗ',
            LangID: 'el-GR'
        };

        it('Success Login', function() {
        	esWebApi.openSession(credentials)
        	.then(function(ret) {
        		var data = ret.data;
        		expect(data).not.toBeDefined();
        		expect(data.Model.Name).toEqual("stavros");
        	});

        	$rootScope.$digest();
        });
    });

});
