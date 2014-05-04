var _ = require('lodash');
var Q = require('q');

module.exports = function (properties) {
    var model = {};

    /**
     * Total number of neighbors to use when making predictions
     */
    model.neighbors = parseInt(properties.neighbors);

    /**
     * Distance metric to use when comparing features
     */
    model.metric = properties.metric || 'euclidian';

    /**
     * if TRUE will use weighted distance when sorting nearest neighbors
     */
    model.weights = properties.weights || false;

    /**
     * if TRUE will use radius when selecting number of neighbors
     * settings this to true ignores the value set in model.neighbors
     */
    model.radius = properties.radius || false;
    
    /**
     * Loads and pre-processes data set, then
     * initializes and prepares model for predicting
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
     * Calculates distance between all points in dataset andx
     * using distance metric provider, returns class prediction
     */
    model.predicting = function (x) {
        
        var metricFunc = model[model.metric] || model.euclidian ;
        var predictFunc = (model.weights) ? model.weightedNearestNeighbor : model.nearestNeighbor ;

        return metricFunc(x).then(function (sortedFeatures) {
            return predictFunc(sortedFeatures);
        });
    };

    /**
     *
     */
    model.nearestNeighbor = function (sortedFeatures) {
        return _(sortedFeatures).first(model.neighbors)
            .groupBy(function (neighbor) {
                return neighbor.y;
            })
            .sortBy(function(neighbors) {
                return neighbors.length;
            }).pop()[0].y;
    };

    /**
     *
     */
    model.weightedNearestNeighbor = function (sortedFeatures) {
        return _(sortedFeatures).first(model.neighbors)
            .groupBy(function (neighbor) {
                return neighbor.y;
            })
            .sortBy(function(neighbors) {
                return neighbors.reduce(function (sum, neighbor) {
                    return sum + (1/neighbor.distance);
                });
            }).pop()[0].y;
    };

     /**
      * sorts dataset by euclidian distance between each feature and x
      * Source - http://en.wikipedia.org/wiki/Euclidean_distance
      */
     model.euclidian = function (x) {
        return Q(_.sortBy(model.features, function (feature) {
            for (var i=0,sum=0; i<model.featureLength;i++) {
                sum += Math.pow(feature.x[i] - x[i], 2);
            }
            feature.distance = Math.sqrt(sum);
            return feature.distance;
        }));
    };

    /**
      * sorts dataset by manhattan distance between each feature and x
      * Source - http://en.wikipedia.org/wiki/Manhattan_distance
      */
    model.manhattan = function (x) {
        return Q(_.sortBy(model.features, function (feature) {
            for (var i=0,sum=0; i<model.featureLength;i++) {
                sum += Math.abs(feature.x[i] - x[i]);
            }
            feature.distance = sum;
            return feature.distance;
        }));
    };

    /**
      * sorts dataset by manhattan distance between each feature and x
      * difference between f[i]-x[i] is raised to the 2nd power, to
      * provide a positive number without doing absolute value calculation
      * and sum of the distances between each point in feature and x is returned
      * instead of the average of the distances between each point
      * Source - http://en.wikipedia.org/wiki/Manhattan_distance
      */
    model.lazyManhattan = function (x) {
        return Q(_.sortBy(model.features, function (feature) {
            for (var i=0,sum=0; i<model.featureLength;i++) {
                sum += Math.pow(feature.x[i] - x[i], 2);
            }
            feature.distance = sum;
            return feature.distance;
        }));
    };

    /**
      * sorts dataset by minkowski distance between each feature and x
      * Source - http://en.wikipedia.org/wiki/Minkowski_distance
      */
    model.minkowski = function (x) {
        console.log('not implemented');
    };

    /**
      * sorts dataset by mahalanobis distance between each feature and x
      * Source - http://en.wikipedia.org/wiki/Mahalanobis_distance
      */
    model.mahalanobis = function (x) {
        console.log('not implemented');
    };

    return model;
};
