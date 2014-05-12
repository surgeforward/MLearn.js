var _ = require('lodash');
var Q = require('q');

/**
 * Classification
 */
module.exports = function (algorithmType, properties) {

    var algorithm = require(__dirname + '/classifier/' + algorithmType);
    var model = algorithm.apply( null, Array.prototype.slice.call(arguments, 1) );
    
    var classification = {
        score: {
            /**
             * returns array of target/prediction keys all incorrect predictions
             */
            misses: function () {
                return classification.result.misses;
            },
            /**
             * returns accuracy of classifier in percentage
             */
            accuracy: function () {
                return (classification.result.dataset.length-classification.result.misses.length)/classification.result.dataset.length;
            },
            /**
             * returns error rate of classifier in percentage
             */
            error: function () {
                return 1-((classification.result.dataset.length-classification.result.misses.length)/classification.result.dataset.length);
            }
        }
    };

    /**
     * Sends dataset to model for training
     */
    classification.training = function (dataset) {
        return model.training(dataset);
    };

    /**
     * Uses trained model to predict a category for x
     * returns array of prediction categories
     */
    classification.predicting = function (X) {
        return Q.all(_.map(X, model.predicting));
    };
    
    /**
     * Accepts validation dataset and makes predictions for each feature vector
     * returns scoring object with methods for getting performance metrics of result
     */
    classification.scoring = function (dataset) {
        
        // this will hold the result of these predictions
        // used to calculate performance metrics
        classification.result = {dataset: dataset, misses: []};

        // get just X values in an array, for predicting
        var X = _.pluck(dataset, 'x');

        // make all predictions using classifier.predicting()
        return classification.predicting(X).then(function (predictions)  {
            // then map all predictions to new array of objects
            // with target and prediction keys
            return Q.all(_.map(predictions, function (prediction, i) {
                return {prediction: prediction, target: classification.result.dataset[i].y, index: i};
            })).then(function (results) {
                // save all misses in result
                _.each(results, function (r) {
                    if (r.prediction!=r.target) {
                        classification.result.misses.push(r);
                    }
                });
                // return scoring object
                return classification.score;
            })
        });
    };

    return classification;
};
