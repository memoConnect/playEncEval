'use strict';

define(['app','angular-resource'], function (app) {
    app.register.factory('Api',
    function($http){
        return {
            sendText: function(text){
                return $http.post(cameo.restApi+"/sendText",{text:text})
            }
           ,getText: function(id){
                return $http.get(cameo.restApi+"/getText/"+id)
            }
           ,sendFile: function(file){
                return $http.post(
                    cameo.restApi+"/sendFile"
                   ,{
                        token: ""
                       ,username: ""
                       ,chunk: file.chunk
                    }
                   ,{
                        headers:{
                            "X-File-Name": file.blob.name
                           ,"X-File-Size": file.blob.size
                           ,"X-Index": file.index
                           ,"X-Max-Chunks": file.maxChunks
                        }
                    }
                )
            }
        };
    });
})