var _ = require('lodash');
var Q = require('q');
var async = require('async');

/**
 * Classification
 */

module.exports = function (algorithmType, properties) {

    var algorithm = require(__dirname+'/classifier/'+algorithmType);
    var model = algorithm.apply( null, Array.prototype.slice.call(arguments, 1) );
    var classification = { train: model.train };

    /**
     *
     */
    classification.predict = function (X) {
        var deferPredict = Q.defer();

        classification.predictions = [];

        async.each(X,
            function (x, callback) {
                model.predict(x).then(function (prediction) {
                    classification.predictions.push(prediction);
                    callback();
                });
            },
            function (error) {
                if ( ! error) {
                    deferPredict.resolve(classification.predictions);
                } else {
                    deferPredict.reject(error);
                }
            }
        );

        return deferPredict.promise;
    };

    /**
     *
     */
    classification.score = function (X, Y) {
        var deferScore = Q.defer();

        classification.targets = Y;

        classification.predict(X).then(function () {

            var totalCorrect = _.reduce(classification.predictions, function (totalError, x, key) {
                return totalError += (x === classification.targets[key]) ? 1 : 0 ;
            }, 0);

            deferScore.resolve( totalCorrect / classification.targets.length );

        }, function (error) {
            deferScore.reject(error);
        });

        return deferScore.promise;
    };

    return classification;

};
