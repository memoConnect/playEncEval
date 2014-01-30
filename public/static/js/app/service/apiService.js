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
           ,sendFile: function(data){
                return $http.post(
                    cameo.restApi+"/sendFile"+('assetId' in data && data.assetId != "" ? "/"+data.assetId : "")
                   ,{
                        chunk: data.chunk
                    }
                   ,{
                        headers:{
                            "X-File-Name": data.file.name
                           ,"X-File-Size": data.file.size
                           ,"X-File-Type": data.file.type
                           ,"X-Index": data.index
                           ,"X-Max-Chunks": data.chunksTotal
                        }
                    }
                )
            }
           ,getFile: function(assetId, chunkId){
                return $http.get(cameo.restApi+"/getFile/"+assetId+(angular.isDefined(chunkId)?"/"+chunkId:""))
            }
        };
    });
})