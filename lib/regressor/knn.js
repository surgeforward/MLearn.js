var _ = require('lodash');
var Q = require('q');

module.exports = function (properties) {
    var model = {};

    /**
     * Total number of neighbors to use when making predictions
     */
    model.neighbors = parseInt(properties.neighbors);
    
    /**
     * Loads and pre-processes data set, then
     * initializes and prepares model for predicting
     */
    model.training = function (dataset) {
        model.featureLength = _(dataset).first().x.length;

        return Q(_.map(dataset, function (row) {
            return {x: _.map(row.x, function (xi) {
                return parseInt(xi);
            }), y: row.y};
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
        return metricFunc(x).then(function (sortedFeatures) {
            return model.nearestNeighbor(sortedFeatures);
        });
    };

     /**
     *
     */
     model.nearestNeighbor = function (sortedFeatures) {
        var nearestNeighbors = _.first(sortedFeatures, model.neighbors);
        return _.reduce(nearestNeighbors, function (sum, n) {
            return parseInt(sum) + parseInt(n.y);
        }, 0) / model.neighbors;
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
        return Q(_.sortBy(model.features, function (feature) {
            for (var i=0,sum=0; i<model.featureLength;i++) {
                sum += Math.pow(Math.abs(feature.x[i] - x[i]), 2);
            }
            feature.distance = Math.pow(sum, 1/2);
            return feature.distance;
        }));
    };

    /**
      * sorts dataset by mahalanobis distance between each feature and x
      * Source - http://en.wikipedia.org/wiki/Mahalanobis_distance
      */
    model.mahalanobis = function (x) {};

    return model;
};