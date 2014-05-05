var _ = require('lodash');
var Q = require('q');

/**
 * Classification
 */
module.exports = function (algorithmType, properties) {

    var algorithm = require(__dirname + '/classifier/' + algorithmType);
    var model = algorithm.apply( null, Array.prototype.slice.call(arguments, 1) );
    
    var classification = {
        score: {
            misses: function () {
                return classification.result.misses;
            },
            accuracy: function () {
                return (classification.result.targets.length-classification.result.misses.length)/100;
            },
            error: function () {
                return 1-((classification.result.targets.length-classification.result.misses.length)/100);
            }
        }
    };

    /**
     *
     */
    classification.training = function (X, Y) {
        return model.training(X, Y);
    };

    /**
     *
     */
    classification.predicting = function (X) {
        return Q.all(_.map(X, model.predicting));
    };
    
    /**
     *
     */
    classification.scoring = function (X, Y) {
        classification.result = {targets: Y, misses: []};
        return classification.predicting(X).then(function (predictions) {
            return Q.all(_.each(predictions, function (prediction, key) {
                if (prediction !== classification.result.targets[key]) {
                    classification.result.misses.push({
                        target: classification.result.targets[key],
                        prediction: prediction
                    });
                }
            })).then(function () {
                return classification.score;
            });
        });
    };

    return classification;
};
