// spec.js
describe('Protractor Demo App', function() {
    it('should have a title', function() {
        browser.get('http://localhost/~stavros%20menegos/webclean/StoreExample/#/priceCheck');

        expect(browser.getTitle()).toEqual('Super Calculator');
    });
});
