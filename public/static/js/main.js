require.config({
    baseUrl: "static/js/app"
    // alias libraries paths
   ,urlArgs: "bust=" + (new Date()).getTime()
   ,paths: {
        'angular': '../vendor/angular/angular'
       ,'angular-route': '../vendor/angular/angular-route'
       ,'angular-resource': '../vendor/angular/angular-resource'
       ,'angular-cookies': '../vendor/angular/angular-cookies'

       ,'jquery': '../vendor/jquery/jquery.min'
       ,'bootstrap': '../vendor/bootstrap/bootstrap.min'

       ,'angularAMD': '../vendor/requirejs/angularAMD'
       ,'ngload': '../vendor/requirejs/ngload'
    }
   ,packages: [
        {name: '_v', location: '../vendor'}
       ,{name: '_s', location: 'service'}
       ,{name: '_d', location: 'directive'}
    ]
    // Add angular modules that does not support AMD out of the box, put it in a shim
   ,shim: {
        'angularAMD': ['angular']
       ,'angular-route': ['angular']
       ,'bootstrap': ['jquery']
    }
    // kick start application
   ,deps: ['bootstrap', 'app']
});