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
        
        var metricFunc = model[model.metric+'Metric'] || model.euclidianMetric ;

        return metricFunc(x).then(function (sortedFeatures) {
            return _(sortedFeatures).first(model.neighbors)
                .groupBy(function (neighbor) {
                    return neighbor.y;
                })
                .sortBy(function(neighbors) {
                    return neighbors.length;
                }).pop()[0].y
        });
    };

     /**
      * sorts dataset by euclidian distance between each feature and x
      * Source - http://en.wikipedia.org/wiki/Euclidean_distance
      */
     model.euclidianMetric = function (x) {
        return Q(_.sortBy(model.features, function (feature) {
            for (var i=0,sum=0; i<model.featureLength;i++) {
                sum += Math.pow(feature.x[i] - x[i], 2);
            }
            return Math.sqrt(sum);
        }));
    };

    /**
      * sorts dataset by manhattan distance between each feature and x
      * Source - http://en.wikipedia.org/wiki/Manhattan_distance
      */
    model.manhattanMetric = function (x) {
        return Q(_.sortBy(model.features, function (feature) {
            for (var i=0,sum=0; i<model.featureLength;i++) {
                sum += Math.abs(feature.x[i] - x[i]);
            }
            return sum/model.featureLength;
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
    model.lazyManhattanMetric = function (x) {
        return Q(_.sortBy(model.features, function (feature) {
            for (var i=0,sum=0; i<model.featureLength;i++) {
                sum += Math.pow(feature.x[i] - x[i], 2);
            }
            return sum;
        }));
    };

    /**
      * sorts dataset by hamming distance between each feature and x
      * Source - http://en.wikipedia.org/wiki/Hamming_distance
      */
    model.hammingMetric = function (x) {
        return Q(_.sortBy(model.features, function (feature) {
            return feature.x|x;
        }));
    };

    return model;
};
