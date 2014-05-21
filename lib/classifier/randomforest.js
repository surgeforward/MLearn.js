var _ = require('lodash');
var Q = require('q');

module.exports = function (properties) {
    var model = {};
    
    /**
     *
     */
    model.training = function (X, Y) {
        model.featureLength = X[0].length;
        return Q(_.map(X, function (x, i) {
            return {x: _.map(x, function (xi) {
                return parseInt(xi);
            }), y: Y[i]};
        })).then(function (data) {
            model.features = data;
        });
    };

    /**
     * 
     */
    model.predicting = function (x) {
        
    };

    /**
     * 
     */
    model.scoring = function (x) {
        return 1;
    };

    return model;
};
