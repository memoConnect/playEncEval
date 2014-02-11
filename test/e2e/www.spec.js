var url = require("url");

describe('angularAMD', function() {
    var ptor;

    function redirect(rel_path) {
        ptor.get(url.resolve(ptor.baseUrl, rel_path));
        ptor.wait(function () {
            return ptor.getCurrentUrl().then(function(in_url) {
                var re = new RegExp(rel_path, "i");
                return re.test(in_url);
            });
        }, ptor.allScriptsTimeout, "Taking too long to load " + rel_path);
    }

    beforeEach(function() {
        ptor = protractor.getInstance();
        ptor.ignoreSynchronization = true;
        browser.ignoreSynchronization = true;
    });

    it('open app and should redirect to #/home', function(){
        ptor.get(ptor.baseUrl);
        ptor.sleep(3000);
        ptor.getCurrentUrl().
            then(function(url) {
                expect(url).toMatch('#/home');

                ptor.findElement(by.css('div.navbar')).getAttribute('class').
                then(function(cssClass) {
                    expect(cssClass).toMatch(/navbar-default/);
                });
            });
    }, 30000);

    describe("home", function () {
        var route = '#/home';
        it('route should be active', function() {
            expect(ptor.getCurrentUrl()).toContain(route);
        });

        it('nav-btn should be active',function(){
            expect($('.dropdown.active a').getAttribute('href')).toMatch(route)
        });

        it('page-header should be welcome you',function(){
            expect($('.page-header').getText()).toBe('Welcome to First Angular Cameo Test Environment');
        });
    });

    describe("crypto", function () {
        var route = '#/crypto/sjcl';

        it('route should be active', function() {
            redirect(route);
            expect(ptor.getCurrentUrl()).toContain(route);
        });

        it('nav-btn should be active', function() {
            expect($('.dropdown-menu .active a').getAttribute('href')).toMatch(route);
        });
    });

    describe("tools", function () {
        var route = '#/tools/fileapi';

        it('route should be active', function() {
            redirect(route);
            expect(ptor.getCurrentUrl()).toContain(route);
        });

        it('nav-btn should be active', function() {
            expect($('.dropdown-menu .active a').getAttribute('href')).toMatch(route);
        });
    });

    describe("captcha", function () {
        var route = '#/captcha/captchagen';

        it('tab should be active', function() {
            redirect(route);
            expect(ptor.getCurrentUrl()).toContain(route);
        });

        it('nav-btn should be active', function() {
            expect($('.dropdown-menu .active a').getAttribute('href')).toMatch(route);
        });

        describe("form-control", function () {
            var tmpPass, passInp
                ,defDim = '400x200'
                ,newDim = '300x100'
                ,inpDim = $('[ng-model="dim"]')
                ,canvas = $('canvas');

            it('dimensions should be '+defDim, function() {
                inpDim.getAttribute('value').then(function(value){
                    expect(value).toBe(defDim);
                });
            });

            it('canvas element should has size of dim '+defDim, function(){
                canvas.getSize().then(function(canvasDim){
                    expect(canvasDim.width+"x"+canvasDim.height).toBe(defDim);
                });
            });

            it('dimension gets new input and should be '+newDim, function(){
                inpDim.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a"));
                inpDim.sendKeys(protractor.Key.BACK_SPACE);
                inpDim.clear();
                inpDim.sendKeys(newDim);

                expect(inpDim.getAttribute('value')).toBe(newDim);
            });

            it('canvas element should has new size '+newDim, function(){
                canvas.getSize().then(function(canvasDim){
                    expect(canvasDim.width+"x"+canvasDim.height).toBe(newDim);
                });
            });

            it('pass should be not empty', function() {
                passInp = $('[ng-model="pass"]');
                tmpPass = passInp.getAttribute('value');
                expect(tmpPass).not.toBe('');
            });

            it('button generate new should generate another pass', function() {
                $('[ng-click="genKey()"]').click();
                expect(passInp.getAttribute('value')).not.toBe(tmpPass);
            });
        });
    });
});