var _ = require('lodash');
var Q = require('q');
var Parallel = require('paralleljs');

module.exports = function (properties) {
    var model = {};

    /**
     * Total number of neighbors to use when making predictions
     */
    model.neighbors = parseInt(properties.neighbors);
    
    /**
     *
     */
    model.training = function (X, Y) {
        
        var training = Q.defer();

        model.features = X;
        model.targets = Y;

        model.seed = _.map(_.range(X[0].length), function (i) {
            return 1;
        });
         
        return model.getFeaturesDistanceToSeed().then(function (sortedFeatures) {
            model.features = sortedFeatures;
        });
    };

    /**
     * Calculates distance between all points in dataset and x
     * finds closes neighbors and returns majority class
     */
    model.predicting = function (x) {

        var predicting = Q.defer();

        setTimeout(function () {

            var votes = {};
            var predictionDistanceToSeed = model.getDistanceBetween(model.seed, x);
            
            var nearestNeighbors = _.sortBy(model.features, function (feature) {
                return feature.distance + predictionDistanceToSeed;
            });

            _.some(nearestNeighbors, function (neighbor, index) {

                if ( ! _.isObject( votes[neighbor.y] ) ) {
                    votes[neighbor.y] = {total: 1, target: neighbor.y};
                } else {
                    votes[neighbor.y].total = votes[neighbor.y].total + 1;
                }

                if (index >10) return true;
            });

            predicting.resolve(
                _.sortBy(votes, function (vote) {
                    return vote.total;
                }).pop().target
            );
        });

        return predicting.promise;
    };

    /**
     * returns feature array sorted by distance from x
     *
     * @return  array
     */
    model.getFeaturesDistanceToSeed = function () {
        return Q(_.map(model.features, function (feature, index) {
            var distance = model.getDistanceBetween(model.seed, feature);
            return {
                distance: distance,
                x: model.features[index],
                y: model.targets[index]
            };
        }));
    };

    /**
     * Returns euclidean distance between item1 and item2
     *
     * @return  float
     */
    model.getDistanceBetween = function (feature, x) {
        var sum = _.reduce(feature, function (sum, i, key) {
             return sum + Math.pow(i - x[key], 2);
        }, 0);
        return Math.sqrt(sum) / feature.length;
    };

    return model;
};
