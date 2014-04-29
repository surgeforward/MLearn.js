var _ = require('lodash');
var Q = require('q');

module.exports = function (properties) {
    var model = { cache: {} };

    /**
     * Total number of neighbors to use when making predictions
     */
    model.neighbors = parseInt(properties.neighbors);
    
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
     * Calculates distance between all points in dataset and x
     * finds closes neighbors and returns majority class
     */
    model.predicting = function (x) {
        return Q(_.sortBy(model.features, function (feature) {
                for (var i=0,sum=0; i<model.featureLength;i++) {
                    sum += Math.pow(feature.x[i] - x[i], 2);
                }
                return sum/model.featureLength;
            }))
            .then(function (sortedFeatures) {
                return _(sortedFeatures).first(model.neighbors)
                    .groupBy(function (neighbor) {
                        return neighbor.y;
                    })
                    .sortBy(function(neighbors) {
                        return neighbors.length;
                    }).pop()[0].y
            });
    };

    return model;
};
