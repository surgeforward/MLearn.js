var _ = require('lodash');

/**
 * Classification
 */

module.exports = function (algorithmType, properties) {

    var algorithm = require('./classifier/'+algorithmType);
    var model = algorithm.apply( null, Array.prototype.slice.call(arguments, 1) );
    var classification = { train: model.train };

    /**
     *
     */
    classification.predict = function (X) {
        if (_.isArray(X)) {
            return _.map(X, function (x) {
                return model.predict(x);
            });
        }
        return model.predict(X);
    };

    /**
     *
     */
    classification.score = function (X, Y) {
        var targets = Y;
        return _.reduce(X, function (totalError, x, key) {
            return totalError += (model.predict(x) === targets[key]) ? 1 : 0 ;
        }, 0) / X.length;
    };

    return classification;

};
