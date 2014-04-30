/**
 * Created with IntelliJ IDEA.
 * User: reimerei
 * Date: 1/16/14
 * Time: 11:55 AM
 * To change this template use File | Settings | File Templates.
 */


define(['app', '_s/cryptoService', '_s/utilService'], function (app) {
    app.register.factory('Benchmark',
        function (Crypto, Util) {

            var my_scope
            var startTime

            return {

                start: function(){
                    startTime = new Date();
                },
                end: function(){
                    //return secondsToString(((new Date).getTime() - startTime.getTime())/1000);
                    return Util.millisecondsToStr(((new Date).getTime() - startTime.getTime()));
                },

                run: function ($scope) {
                    my_scope = $scope
                    var benchmark_enc = {}
                    var benchmark_dec = {}

                    var seq = [1, 2, 3, 5, 10, 20, 30, 50, 100]
                    //var seq = [1,2,3]

                    seq.forEach(function (rep) {

                        my_scope.formData.plainText = Crypto.getLoremIpsum(rep)
                        my_scope.encrypt()
                        //my_scope.decrypt()

                        benchmark_enc[rep * 10 + 'K'] = my_scope.time.encrypt
                        //benchmark_dec[rep * 10 + 'K'] = my_scope.time.decrypt

                    })

                    my_scope.time = {
                        enc: benchmark_enc,
                        dec: benchmark_dec
                    }

                }




            }
        }
    )
});

