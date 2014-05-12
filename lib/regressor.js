var _ = require('lodash');
var Q = require('q');

/**
 * Regression
 */
module.exports = function (algorithmType, properties) {

    var algorithm = require(__dirname + '/regressor/' + algorithmType);
    var model = algorithm.apply( null, Array.prototype.slice.call(arguments, 1) );

    var regression = {
        /**
         * 
         */
         score: {
            /**
             * returns average distance between prediction and target
             */
            error: function (decimals) {
                if (regression.result.cache.error)
                    return regression.result.cache.error;

                var error = _.reduce(regression.result.predictions, function (sum, r) {
                    return sum + Math.abs(r.prediction-r.target);
                }, 0);

                var decimals = Math.pow(10, decimals) || 100;
                regression.result.cache.error = Math.round((error / regression.result.total)*decimals)/decimals;
                return regression.result.cache.error;
            }
        }
    };

    /**
     * Sends dataset to model for training
     */
    regression.training = function (dataset) {
        return model.training(dataset);
    };

    /**
     * Uses trained model to predict a value for x
     * returns array of prediction values
     */
    regression.predicting = function (X) {
        return Q.all(_.map(X, model.predicting));
    };
    
    /**
     * Accepts validation dataset and makes predictions for each feature vector
     * returns scoring object with methods for getting performance metrics of result
     */
    regression.scoring = function (dataset) {
        
        // this will hold the result of these predictions
        // used to calculate performance metrics
        regression.result = {cache: {}, dataset: dataset, results: [], total: 0};

        // get just X values in an array, for predicting
        var X = _.pluck(dataset, 'x');

        // make all predictions using classifier.predicting()
        return regression.predicting(X).then(function (predictions)  {
            // then map all predictions to new array of objects
            // with target and prediction keys
            return Q.all(_.map(predictions, function (prediction, i) {
                return {prediction: prediction, target: regression.result.dataset[i].y, index: i};
            })).then(function (results) {
                regression.result.predictions = results;
                regression.result.total = results.length;
                // return scoring object
                return regression.score;
            })
        });
    };

    return regression;
};
