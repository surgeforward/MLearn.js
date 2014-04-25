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
    model.train = function (X, Y) {
        var deferTrain = Q.defer();
        model.features = X;
        model.targets = Y;
        deferTrain.resolve();
        return deferTrain.promise;
    };

    /**
     * Calculates distance between all points in dataset and x
     * finds closes neighbors and returns majority class
     */
    model.predict = function (x) {
        return model.soryByDistanceTo(x).then(function (sortedFeatures) {
            var votes = {}, count = 0;

            for (var feature in sortedFeatures) {
                var index = _.indexOf(model.features, sortedFeatures[feature]);
                var featureClass = model.targets[index];
                
                if (votes[featureClass]) {
                    votes[featureClass] = votes[featureClass] + 1;
                } else {
                    votes[featureClass] = 1;
                }

                count++;
                if (count >= model.neighbors) {
                    break;
                }
            }

            var majorityClass = null, majorityClassCount = 0;
            
            for (var vote in votes) {
                if (votes[vote] > majorityClassCount) {
                    majorityClass = vote;
                    majorityClassCount = votes[vote];
                }
            }

            return majorityClass;
        });
    };

    /**
     * returns feature array sorted by distance from x
     *
     * @return  array
     */
    model.soryByDistanceTo = function (x) {
        return Q(_.sortBy(model.features , function (feature) {
            return getDistanceBetween(feature, x);
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
