describe('Hello World form', function() {
 it('display initial text', function() {
   browser.get('');
   expect(element(by.binding('HelloWorldCtrl')).getText()).toEqual("Hello World");
 });
});