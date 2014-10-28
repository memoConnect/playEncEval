'use strict';
define(['app',
        '_s/utilService',
        '_s/cryptoService',
        '_v/filesaver/filesaver',
        '_v/sjcl/main.min',
        '_v/base64',
        'directive/ngUpload'
    ],
    function (app) {
        app.register.controller('CmkeyExportCtrl', ['$scope', 'Util', 'Crypto',
            function ($scope, Util, Crypto) {
                var privKey = ['-----BEGIN RSA PRIVATE KEY-----',
                'MIIEoQIBAAKCAQBnky7uqoFJzMawRbWRnLiAF+6a3VjjziK+Ee5M0CRNsEdTsYv+',
                'kkg7IIqk5KDuEyjWtfK9pueYKqOVy6uWFsz6OG7SSJKJFJRNYKZX04e9c9oXAzfg',
                'JUYpMcR3FB945uq9KJNZc2kEcD/gsKoFgE+6TF6x2ikcHBa3u1SLQUY8gsNH2t6H',
                'eS4HG57Uux/hxPn8k2TH1br43grEfk9VXmYq7SABfWk9bY7ci0Dcy09U5s9YQ3yR',
                'TOMPP74jP/PLBR4kgfXw/kfzl7KAZwDbBwUnHUSIT+uZvH99mn59BgKMK/4UuQJL',
                '4ty0lRarfVVSesNpfb3KZcpqwRjHTIshETafAgMBAAECggEAXCJna1MtMzL/w6oe',
                '++rHjNq9G/GusuaZrS5SJu44fQtER8T2XXxO2Jn3+vqN1Xohp+2ugtpHxeqYHhZR',
                'CnA54pP0sQZxo5M04SgKkLHQW80EwdfRCojdwqNMuwihfnEbeyzu9nFdh986U2uT',
                'stUTFwv8aIVCcIjkBIiVilKEYiplR2Q2SOXJ4Ok24Ugqw9/grv7hF27UrZEj7kAA',
                'yB1DUyfGvrgPWOIgSOQlvQ00rsbxLN0QOP/ZdnzhEvpPGlL5hdIONS6rhLdBU2fV',
                'f6AN6ubKgpbDxSouAVZhYCBfnCA6uL1QMTZfxNetEVJyUcOnZP+i9JAUgRwrCTK3',
                'mz0q8QKBgQCxFgozgyUuf4IGjLNxDqGPTh89P9ccegHq+zeL0j8EQxYA/Xz+njon',
                '+r980GZZ3A2IyPHY61+ghcwTv93kJIoRYdXPdzeyj4ZRAn9qznqsvz1sM2I2ML4O',
                'JiGCTd7yxePjWAjSrjBJUblR35nycCu1hR5wB4nHloCHkRXiGNWwSwKBgQCVuv/Z',
                'TezBxLHcmRQpnve69UcFXbdXFWad9TBj5+IyjrqGoQLOFoEK4ZnRMwP3bj29CT6q',
                'E56TZ4PPRnKSYh4dT9f3Q7c/DZ5kUR4lyQEXtb7RGQSM3J/A/fFGfYmDoW5f68nV',
                '4h6Gg7dSaMWASWo/m1LycLQmy/5mRu+4hk0mfQKBgBdkUuqlCzdOLo3Q7i8kAKFe',
                'b2/2y+J+F1zD3H2Cw0I73l85HNbBbes0CzFgkfSSxdLowFGoHdSld+Sv9o6ZaQeM',
                'xeKG2/uhS9vNmakxJzFEfceaLgH8hE54KPr+cFHfZA/25At4aPZ2biVrhPlqacur',
                'ju67gC62Kbo+pwZbw3ZrAoGANzFtak79PRgicCzFb+o3a2VKvsGi+ajb4NIm+kzZ',
                '5sUSINptTEajXr12k9T4W1b5zxr/THZa9/8qaVeQmEEu1KM/+tetTsLYZiY4tLj5',
                'fCH0quNL+BjDksKJE/Dmpez14Mnr5rmpgvA+vVP9qaJmVfgNhWziG4MKzezMJPrs',
                'qYkCgYBmRKyM7oqweucc7faBV0Wf9/+90ak63Is/Jw1+EAJRZSU+sZ6oB/vybd4a',
                'is6NBCi9sl14hrn+rIfKUXsRaMieV8zpiAyt2TrLNB7psDTMfMCZOk/9Cj0drIXS',
                'NXNB5RjpFHgTj9i9ICUqi3CUpJwoEgjJkk6X5TbRRokszzd3Bg==',
                '-----END RSA PRIVATE KEY-----'].join('\n');


                $scope.mixIn = 'YVNRL-FXMOO-EQCFG-KYVME-ROVPL-IKONJ-PQUCS-WTDUI-LNYRX-BVUGT-RCNSK-OFQLJ';//Crypto.genKey();
                $scope.mimeType = 'multipart/encrypted';
                $scope.fileName = 'keyName.cameoKey';
                $scope.file = {};

                function encryptKey(){
                    var encryptedPrivKey = sjcl.json.encrypt(String($scope.mixIn), String(privKey), {
                        cipher: "aes", ks: 256, iter: 500
                    });

                    return _Base64.encode(encryptedPrivKey);
                }

                $scope.exportViaFileapi = function(){
                    navigator.webkitPersistentStorage.requestQuota(1024*1024, function() {
                        window.webkitRequestFileSystem(window.PERSISTENT , 1024*1024, function(dateisystem){
                            dateisystem.root.getFile($scope.fileName, {create: true}, function(datei) {
                                datei.createWriter(function(inhalt) {
                                    var blob = new Blob([encryptKey()], {type:$scope.mimeType});
                                    inhalt.write(blob);
                                });
                            });
                        });
                    });
                };

                $scope.exportViaSaveAs = function(){
                    saveAs(
                        new Blob([encryptKey()], {type:$scope.mimeType}),
                        $scope.fileName
                    );
                };

                $scope.isPristine = true;
                $scope.importSuccess = false;
                $scope.importMessage = '';

                $scope.importKey = function(){

                    $scope.isPristine = false;

                    var reader = new FileReader();
                    reader.addEventListener('loadend', function(e) {
                        console.log('filereader loaded',e)

                        var fileData = e.target.result,
                            _privKey_ = '';

                        try {
                            _privKey_ = sjcl.decrypt(String($scope.mixIn), _Base64.decode(fileData));
                            $scope.importSuccess = true;
                            $scope.importMessage = _privKey_;
                            console.log(_privKey_)
                        } catch (e) {
                            //                    cmLogger.warn('Unable to decrypt.', e)
                            //                    console.warn(e)
                            $scope.importSuccess = false;
                            $scope.importMessage = e.message;
                            console.log(e)
                        }

                        $scope.$apply();
                    });
                    console.log('filereader readAsBinaryString')
                    reader.readAsBinaryString($scope.file);
                };
            }
        ])
    }
)