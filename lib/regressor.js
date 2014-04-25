var _ = require('lodash');

/**
 * Regression
 */

module.exports = function (algorithmType) {

    var algorithm = require(__dirname+'/regressor/'+algorithmType);
    var model = algorithm.apply( null, Array.prototype.slice.call(arguments, 1) );
    var regressor = { train: model.train };

    /**
     *
     */
    regressor.predict = function (X) {
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
    regressor.score = function (X, Y) {
        var targets = Y;
        return _.reduce(X, function (totalError, x, key) {
            return totalError += Math.abs(model.predict(x) - targets[key]);
        }, 0) / model.neighbors;
    };

    return regressor;

};
