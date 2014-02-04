var url = require("url");

describe('captchagen Controller', function() {
    var ptor = protractor.getInstance();
//        ptor.ignoreSynchronization = true

    function ptor_get(rel_path) {
        ptor.driver.get(url.resolve(ptor.baseUrl, rel_path));
        ptor.wait(function () {
            //waits(500);
            return ptor.driver.getCurrentUrl().then(function(in_url) {
                var re = new RegExp(rel_path, "i");
                return re.test(in_url);
            });
        }, ptor.allScriptsTimeout, "Taking too long to load " + rel_path);
    }

    describe("tab", function () {
        var route = '#/captcha/captchagen';
        beforeEach(function() {
            ptor_get(route);
        });

        it('should be active', function() {
            expect(ptor.getCurrentUrl()).toContain(route);
            ptor.wait(function () {
                return element(by.css('.dropdown-menu li.active a')).getAttribute('href').then(function (href) {
                    return href == ptor.baseUrl+route;
                });
            }, ptor.allScriptsTimeout, "Taking too long for captcha tab to become active")
        });
    });

    describe("form-control", function () {
        it('dimensions should not empty', function() {
            expect(element(by.css('[ng-model="dim"]')).getAttribute('value')).toBe('400x200');
        });

        var pass = "";

        it('pass should not empty', function() {
            pass = element(by.css('[ng-model="pass"]')).getAttribute('value');
            expect(pass).not.toBe('');
        });

        it('button generate new should be another pass', function() {
            element(by.css('[ng-click="genKey()"]')).click();
            expect(element(by.css('[ng-model="pass"]')).getAttribute('value')).not.toBe(pass);
        });
    });
});