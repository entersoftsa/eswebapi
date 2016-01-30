// spec.js
describe('Protractor Demo App', function() {
    it('should have a title', function() {
        browser.get('http://localhost/StoreExample/#/priceCheck');

        expect(browser.getTitle()).toEqual('Super Calculator');
    });
});
