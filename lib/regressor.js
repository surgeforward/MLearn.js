var _ = require('lodash');
var Q = require('q');

/**
 * Regression
 */
module.exports = function (algorithmType, properties) {

    var algorithm = require(__dirname + '/regressor/' + algorithmType);
    var model = algorithm.apply( null, Array.prototype.slice.call(arguments, 1) );
    var regression = {};

    /**
     *
     */
    regression.training = function (X, Y) {
        return model.training(X, Y);
    };

    /**
     *
     */
    regression.predicting = function (X) {
        return Q.all(_.map(X, model.predicting));
    };
    
    /**
     *
     */
    regression.scoring = function (X, Y) {
        regression.targets = Y;
        return regression.predicting(X).then(function (predictions) {
            return _.reduce(predictions, function (totalError, x, key) {
                return totalError + Math.abs(x - regression.targets[key]);
            }, 0) / regression.targets.length;
        });
    };

    return regression;
};
