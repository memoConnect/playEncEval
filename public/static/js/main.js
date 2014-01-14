require.config({
    baseUrl: "static/js/app",
    // alias libraries paths
    paths: {
        'angular': '../vendor/angular/angular.min'
       ,'angular-route': '../vendor/angular/angular-route.min'
       ,'angular-resource': '../vendor/angular/angular-resource.min'
       ,'angular-cookies': '../vendor/angular/angular-cookies.min'
        //,'async': 'vendor/requirejs/async'
       ,'angularAMD': '../vendor/requirejs/angularAMD'
       ,'ngload': '../vendor/requirejs/ngload'

       ,'HomeCtrl': 'controller/home_ctrl'

       ,'FileApiCtrl': 'controller/fileapi_ctrl'

       ,'JavascryptCtrl': 'controller/javascrypt_ctrl'
       ,'MovableCtrl': 'controller/movable_ctrl'
       ,'CryptoJsCtrl': 'controller/cryptojs_ctrl'

    },
    // Add angular modules that does not support AMD out of the box, put it in a shim
    shim: {
        'angularAMD': ['angular']
       ,'angular-route': ['angular']
    },
    // kick start application
    deps: ['app']
});