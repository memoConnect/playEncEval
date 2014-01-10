'use strict';

cameo.ctrl = angular.module('cameoControllers', []);

cameo.ctrl.controller('SendTextCtrl', ['$scope', '$location', 'Crypt',
  function($scope, $location, Crypt) {
    $scope.key = ""
    $scope.hs = ""
    $scope.keytype = "text"
    $scope.encoding = "codegroup"
    $scope.textId = ""
    $scope.massiveSize = 1024
    $scope.placeholder = {
        key: "PrivateKey"
       ,plainText: "PlainText"
       ,encryptText: "Encrypted"
       ,textId: "optional textId"
    };
    $scope.formData = {};
    $scope.api = {state:"not called yet",res:{}};
    $scope.decrypted = {cipher:"",text:""}

    $scope.genKey = function(){
        var i, j, k = "";

        addEntropyTime();
        var seed = keyFromEntropy();
        var prng = new AESprng(seed);
        if ($scope.keytype == "text") {
            //	Text key
            var charA = ("A").charCodeAt(0);

            for (i = 0; i < 12; i++) {
                if (i > 0) {
                    k += "-";
                }
                for (j = 0; j < 5; j++) {
                    k += String.fromCharCode(charA + prng.nextInt(25));
                }
            }
        } else {
            // Hexadecimal key
            var hexDigits = "0123456789ABCDEF";

            for (i = 0; i < 64; i++) {
                k += hexDigits.charAt(prng.nextInt(15));
            }
        }
        // set value
        $scope.formData.key = k;

        //delete prng;
    };

    $scope.setKey = function(){
        if ($scope.keytype == "text") {
            var s = encode_utf8($scope.formData.key);
            var i, kmd5e, kmd5o;

            if (s.length == 1) {
                s += s;
            }

            md5_init();
            for (i = 0; i < s.length; i += 2) {
                md5_update(s.charCodeAt(i));
            }
            md5_finish();
            kmd5e = byteArrayToHex(digestBits);

            md5_init();
            for (i = 1; i < s.length; i += 2) {
                md5_update(s.charCodeAt(i));
            }
            md5_finish();
            kmd5o = byteArrayToHex(digestBits);

            var hs = kmd5e + kmd5o;
            $scope.key =  hexToByteArray(hs);
            $scope.hs = byteArrayToHex($scope.key);
        } else {    	    // Hexadecimal key
            var s = $scope.formData.plainText;
            var hexDigits = "0123456789abcdefABCDEF";
            var hs = "", i, bogus = false;

            for (i = 0; i < s.length; i++) {
                var c = s.charAt(i);
                if (hexDigits.indexOf(c) >= 0) {
                    hs += c;
                } else {
                    bogus = true;
                }
            }
            if (bogus) {
                alert("Error: Improper character(s) in hexadecimal key.");
            }
            if (hs.length > (keySizeInBits / 4)) {
                alert("Warning: hexadecimal key exceeds " +
                    (keySizeInBits / 4) + " digit maximum; truncated.");
                $scope.formData.plainText = hs = hs.slice(0, 64);
            } else {
                //  If key is fewer than 64 hex digits, fill it with zeroes
                while (hs.length < (keySizeInBits / 4)) {
                    hs += "0";
                }
            }
            $scope.key = hexToByteArray(hs);
        }
    };

    $scope.determineArmourType = function(s) {
          var kt, pcg, phex, pb64, pmin;

          pcg = s.indexOf(codegroupSentinel);
          phex = s.indexOf(hexSentinel);
          pb64 = s.indexOf(base64sent);
          if (pcg == -1) {
              pcg = s.length;
          }
          if (phex == -1) {
              phex = s.length;
          }
          if (pb64 == -1) {
              pb64 = s.length;
          }
          pmin = Math.min(pcg, Math.min(phex, pb64));
          if (pmin < s.length) {
              if (pmin == pcg) {
                  kt = 0;
              } else if (pmin == phex) {
                  kt = 1;
              } else {
                  kt = 2;
              }
          } else {
              if ($scope.encoding == "codegroup") {
                  kt = 0;
              } else if ($scope.encoding == "hex") {
                  kt = 1;
              } else if ($scope.encoding == "base64") {
                  kt = 2;
              }
          }
          return kt;
      };

    $scope.encrypt = function(){
        var v, i;
        var prefix = "#####  Encrypted: decrypt with cameo/\n",
            suffix = "#####  End encrypted message\n";

        if ($scope.formData.key == "") {
            alert("Please specify a key with which to encrypt the message.");
            return;
        }
        if ($scope.formData.plainText == "") {
            alert("No plain text to encrypt!  Please enter or paste plain text in the field above.");
            return;
        }
        $scope.formData.encryptText = "";
        $scope.setKey();

        addEntropyTime();
        prng = new AESprng(keyFromEntropy());
        var plaintext = encode_utf8($scope.formData.plainText);

        //  Compute MD5 sum of message text and add to header

        md5_init();
        for (i = 0; i < plaintext.length; i++) {
            md5_update(plaintext.charCodeAt(i));
        }
        md5_finish();
        var header = "";
        for (i = 0; i < digestBits.length; i++) {
            header += String.fromCharCode(digestBits[i]);
        }

        //  Add message length in bytes to header

        i = plaintext.length;
        header += String.fromCharCode(i >>> 24);
        header += String.fromCharCode(i >>> 16);
        header += String.fromCharCode(i >>> 8);
        header += String.fromCharCode(i & 0xFF);

        /*  The format of the actual message passed to rijndaelEncrypt
         is:

         Bytes   	Content
         0-15   	MD5 signature of plaintext
         16-19   	Length of plaintext, big-endian order
         20-end  	Plaintext

         Note that this message will be padded with zero bytes
         to an integral number of AES blocks (blockSizeInBits / 8).
         This does not include the initial vector for CBC
         encryption, which is added internally by rijndaelEncrypt.
         */

        var ct = rijndaelEncrypt(header + plaintext, $scope.key, "CBC");
        if ($scope.encoding == "codegroup") {
            v = armour_codegroup(ct);
        } else if ($scope.encoding == "hex") {
            v = armour_hex(ct);
        } else if ($scope.encoding == "base64") {
            v = armour_base64(ct);
        }
        $scope.formData.encryptText = prefix + v + suffix;
    };

    $scope.decrypt = function(){
        if ($scope.formData.key == "") {
            alert("Please specify a key with which to decrypt the message.");
            return;
        }
        if ($scope.decrypted.cipher == "") {
            alert("No cipher text to decrypt!  Please enter or paste cipher text in the field above.");
            return;
        }
        //document.plain.text.value = "";
        $scope.setKey();
        var ct = new Array(), kt;
        kt = $scope.determineArmourType($scope.decrypted.cipher);
        if (kt == 0) {
            ct = disarm_codegroup($scope.decrypted.cipher);
        } else if (kt == 1) {
            ct = disarm_hex($scope.decrypted.cipher);
        } else if (kt == 2) {
            ct = disarm_base64($scope.decrypted.cipher);
        }

        var result = rijndaelDecrypt(ct, $scope.key, "CBC");

        var header = result.slice(0, 20);
        result = result.slice(20);

        /*  Extract the length of the plaintext transmitted and
         verify its consistency with the length decoded.  Note
         that in many cases the decrypted messages will include
         pad bytes added to expand the plaintext to an integral
         number of AES blocks (blockSizeInBits / 8).  */

        var dl = (header[16] << 24) | (header[17] << 16) | (header[18] << 8) | header[19];
        if ((dl < 0) || (dl > result.length)) {
            alert("Message (length " + result.length + ") truncated.  " +
                dl + " characters expected.");
            //	Try to sauve qui peut by setting length to entire message
            dl = result.length;
        }

        /*  Compute MD5 signature of message body and verify
         against signature in message.  While we're at it,
         we assemble the plaintext result string.  Note that
         the length is that just extracted above from the
         message, *not* the full decrypted message text.
         AES requires all messages to be an integral number
         of blocks, and the message may have been padded with
         zero bytes to fill out the last block; using the
         length from the message header elides them from
         both the MD5 computation and plaintext result.  */

        var i, plaintext = "";

        md5_init();
        for (i = 0; i < dl; i++) {
            plaintext += String.fromCharCode(result[i]);
            md5_update(result[i]);
        }
        md5_finish();

        for (i = 0; i < digestBits.length; i++) {
            if (digestBits[i] != header[i]) {
                alert("Message corrupted.  Checksum of decrypted message does not match.");
                break;
            }
        }

        //  That's it; plug plaintext into the result field

        $scope.decrypted.text = decode_utf8(plaintext);
    };

    $scope.decryptWithoutApi = function(){
        $scope.decrypted.cipher = $scope.formData.encryptText;
        $scope.decrypt()
    };

    $scope.sendText = function(){
        Crypt.sendText($scope.formData.encryptText).
            success(function(res,state){
                $scope.api.res = {success:true,res:res};
                $scope.api.state = state;
                $scope.textId = res.id;
            }).
            error(function(res, state){
                $scope.api.res = {error:true,res:res};
                $scope.api.state = state == 0?"404":state;
            })
    };

    $scope.getText = function(){
        if($scope.textId != ""){
            Crypt.getText($scope.textId).
                success(function(res,state){
                    $scope.api.res = {success:true,res:res};
                    $scope.api.state = state;

                    $scope.decrypted.cipher = res.text;
                    $scope.decrypt();
                }).
                error(function(res, state){
                    $scope.api.res = {error:true,res:res};
                    $scope.api.state = state == 0?"404":state;
                })
        }
    };

    $scope.genMassiveMessage = function(){
        var length = $scope.massiveSize*1000;
        $scope.formData.plainText = "";
        for(var i=0; i<length; i++){
            $scope.formData.plainText += "x"
        }
    };
  }]);

cameo.ctrl.controller('SendFileCtrl', ['$scope', '$location', 'Crypt',
    function($scope, $location, Crypt){
        $scope.percent = "Waiting...";
        $scope.placeholder = {file:"chooseFile"};
        $scope.slicesTotal = 0;

        var BYTES_PER_CHUNK = 1024 * 1024; // 1MB chunk sizes.
        var slices; // slices, value that gets decremented

        function str2ab_blobreader(str, callback) {
            var blob;
            var BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;
            if (typeof(BlobBuilder) !== 'undefined') {
                var bb = new BlobBuilder();
                bb.append(str);
                blob = bb.getBlob();
            } else {
                blob = new Blob([str]);
            }
            var f = new FileReader();
            f.onload = function(e) {
                callback(e.target.result)
            }
            f.readAsArrayBuffer(blob);
        }

        function uploadFile(blob, index, start, end) {
            var chunk;

            if (blob.webkitSlice) {
                console.log("webkitSlice")
                chunk = blob.webkitSlice(start, end);
            } else if (blob.mozSlice) {
                chunk = blob.mozSlice(start, end);
            } else {
                chunk = blob.slice(start, end);
            }

            if (blob.webkitSlice) { // android default browser in version 4.0.4 has webkitSlice instead of slice()
                var buffer = str2ab_blobreader(chunk, function(buf) { // we cannot send a blob, because body payload will be empty
                    chunkReady(blob,index,buf);
                });
            } else {
                chunkReady(blob,index,chunk);
            }
        }

        function chunkReady(blob,index,chunk){
            var reader = new FileReader();
            reader.onload = function(loadEvent){
                Crypt.sendFile({
                    blob: blob
                   ,index: index
                   ,chunk: loadEvent.target.result
                   ,maxChunks: $scope.slicesTotal
                }).
                success(function(res,state){
                    slices--;

                    $scope.progress = index;
                    $scope.percent = Math.round(index/$scope.slicesTotal * 100) + "%";

                    // if we have finished all slices
                    if(slices == 0) {
                        //mergeFile(blob);
                    }
                }).
                error(function(res, state){

                })/*.
                progress(function(evt){
                    if (evt.lengthComputable){
                        $scope.progress.$attrs.max = $scope.slicesTotal;
                        $scope.progress = index;
                        $scope.percent = Math.round(index/$scope.slicesTotal * 100) + "%";
                    }
                });*/
            };
            reader.readAsDataURL(chunk);
        }

        $scope.sendFile = function(){
            var blob = $scope.uploadme;

            var start = 0;
            var end;
            var index = 0;

            // calculate the number of slices
            slices = Math.ceil(blob.size / BYTES_PER_CHUNK);
            $scope.slicesTotal = slices;

            while(start < blob.size) {
                end = start + BYTES_PER_CHUNK;
                if(end > blob.size) {
                    end = blob.size;
                }

                uploadFile(blob, index, start, end);

                start = end;
                index++;
            }
        };
  }]).
    directive("fileread", [function () {
        return {
            scope: {
                fileread: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    scope.$apply(function () {
                        scope.fileread = changeEvent.target.files[0];
                        // or all selected files:
                        // scope.fileread = changeEvent.target.files;
                    });
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread.base = loadEvent.target.result;
                        });
                    }
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }]);