var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/\.spec\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/public/static/js/'

   ,paths: {
        'angular': 'vendor/angular/angular'
       ,'angular-route': 'vendor/angular/angular-route'
       ,'angular-resource': 'vendor/angular/angular-resource'
       ,'angular-cookies': 'vendor/angular/angular-cookies'

//       ,'jquery': 'vendor/jquery/jquery.min'
//       ,'bootstrap': 'vendor/bootstrap/bootstrap.min'

       ,'angularAMD': 'vendor/requirejs/angularAMD'
       ,'ngload': 'vendor/requirejs/ngload'

       ,'app': 'app/app'

       ,'home_ctrl': 'app/controller/home_ctrl'
       ,'crypto_sjcl_ctrl': 'app/controller/crypto/sjcl_ctrl'
     }

    ,packages: [
        {name: '_b', location: ''}
       ,{name: '_v', location: 'vendor'}
       ,{name: '_s', location: 'app/service'}
       ,{name: '_d', location: 'app/directive'}
    ]

   ,shim: {
        'angularAMD': ['angular']
       ,'angular-route': ['angular']
       ,'app': ['angularAMD']

       ,'home_ctrl': ['app']
       ,'crypto_sjcl_ctrl': ['app']
//       ,'bootstrap': ['jquery']
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});