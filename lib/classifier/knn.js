var _ = require('lodash');

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
        model.features = X;
        model.targets = Y;
    };

    /**
     * Calculates distance between all points in dataset and x
     * returns majority Y value for 
     */
    model.predict = function (x) {
        
        // get distances and sort from new point
        // and sort ascending
        var distances = model.sortByDistance(x);

        votes = {};
        for ( var i=0; i<this.neighbors; i++ )
        {
            var featureIndex = distances[i].featureIndex;
            var featureClass = this.targets[featureIndex];
            
            if (votes[featureClass]) {
                votes[featureClass] = votes[featureClass] + 1;
            }
            else {
                votes[featureClass] = 1;
            }
        }

        var majorityClass = null, majorityClassCount =0;
        
        for (vote in votes) {
            if (votes[vote] > majorityClassCount) {
                majorityClass = vote;
                majorityClassCount = votes[vote];
            }
        }

        // return class with the majority vote        
        return majorityClass;
    };

    /**
     * returns feature array sorted by distance from x
     *
     * @return  array
     */
    model.sortByDistance = function (x) {
        var distances = _.map(model.features, function (feature, key) {
            return {
                featureIndex: key,
                distance: model.getDistance(feature, x)
            };
        });
        
        return distances.sort(function (a,b) {
            return a.distance - b.distance;
        });
    };

    /**
     * Returns euclidean distance between item1 and item2
     *
     * @return  float
     */
    model.getDistance = function(item1, item2) {
        var difference = 0;
        _.each(item1, function (x, key) {
             difference = difference + Math.pow(x - item2[key], 2);
        });
        return Math.sqrt(difference/item1.length);
    };

    return model;
}
