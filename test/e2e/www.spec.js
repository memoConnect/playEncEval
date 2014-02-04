var url = require("url");

describe('angularAMD', function() {
    var ptor = protractor.getInstance();
        ptor.ignoreSynchronization = true

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

    describe("home", function () {
        var route = '#/home';
        beforeEach(function () {
            ptor_get(route);
        });

        it('tab should be active', function() {
            expect(ptor.getCurrentUrl()).toContain(route);
            ptor.wait(function () {
                return element(by.css('.navbar-nav li.active a')).getText().then(function (text) {
                    return text == "Home";
                });
            }, ptor.allScriptsTimeout, "Taking too long for home tab to become active")
        });
    });

    describe("crypto", function () {
        var route = '#/crypto/sjcl';
        beforeEach(function () {
            ptor_get(route);
        });

        it('tab should be active', function() {
            expect(ptor.getCurrentUrl()).toContain(route);
            ptor.wait(function () {
                return element(by.css('.dropdown-menu li.active a')).getAttribute('href').then(function (href) {
                    return href == ptor.baseUrl+route;
                });
            }, ptor.allScriptsTimeout, "Taking too long for crypto tab to become active")
        });
    });

    describe("tools", function () {
        var route = '#/tools/fileapi';
        beforeEach(function () {
            ptor_get(route);
        });

        it('tab should be active', function() {
            expect(ptor.getCurrentUrl()).toContain(route);
            ptor.wait(function () {
                return element(by.css('.dropdown-menu li.active a')).getAttribute('href').then(function (href) {
                    return href == ptor.baseUrl+route;
                });
            }, ptor.allScriptsTimeout, "Taking too long for tools tab to become active")
        });
    });

    describe("captcha", function () {
        var route = '#/captcha/captchagen';
        beforeEach(function() {
            ptor_get(route);
        });

        it('tab should be active', function() {
            expect(ptor.getCurrentUrl()).toContain(route);
            ptor.wait(function () {
                return element(by.css('.dropdown-menu li.active a')).getAttribute('href').then(function (href) {
                    return href == ptor.baseUrl+route;
                });
            }, ptor.allScriptsTimeout, "Taking too long for captcha tab to become active")
        });
    });
});