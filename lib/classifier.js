var _ = require('lodash');
var Q = require('q');

/**
 * Classification
 */
module.exports = function (algorithmType, properties) {

    var algorithm = require(__dirname + '/classifier/' + algorithmType);
    var model = algorithm.apply( null, Array.prototype.slice.call(arguments, 1) );
    var classification = { train: model.train };

    /**
     *
     */
    classification.predict = function (X) {
        return Q.all(_.map(X, model.predict));
    };
    
    /**
     *
     */
    classification.score = function (X, Y) {
        classification.targets = Y;
        return classification.predict(X).then(function (predictions) {
            return _.reduce(predictions, function (totalError, x, key) {
                return totalError += (x === classification.targets[key] ? 1 : 0);
            }, 0) / classification.targets.length;
        });
    };

    return classification;
};
