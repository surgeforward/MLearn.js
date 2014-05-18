var util = require('util');
var Q = require('q');
var _ = require('lodash');

var startTime = Date.now(), dataStart = Date.now();
var mlearn = require(__dirname + '/../../index.js')();

var dataset = mlearn.dataset();
var logistic, scoreStart, trainStart;

Q.longStackSupport = true;

var pathToCSV = 'https://github.com/surgeforward/mlearn-datasets/raw/master/kaggle-hwdigits/train.csv';

var validationData, trainingData;

dataset.from.csv(pathToCSV)
    .then(function () {

        logistic = mlearn.classifier('logistic', {});

        dataset.normalize().shuffle();
        trainingData = dataset.split(.9);
        validationData = dataset.split(.1);

        util.log('Training Model W/ ' + trainingData.length + ' records and ' + trainingData[0].x.length + ' features');

        trainStart = Date.now();
        return logistic.training(trainingData).then(function () {
            util.log('Completed Training in ' + ((Date.now() - trainStart) / 1000) + ' seconds');
            return dataset;
        });

    }).then(function (dataset) {

        util.log('Scoring Model W/ ' + validationData.length + ' records and ' + validationData[0].x.length + ' features');

        scoreStart = Date.now();
        return logistic.scoring(validationData);

    }).then(function (score) {
       
        util.log('Completed Scoring in ' + ((Date.now() - scoreStart) / 1000) + ' seconds');
        util.log('Completed All in ' + ((Date.now() - startTime) / 1000) + ' seconds');

        util.log('Accuracy: ' + score.accuracy());
        util.log('Error: ' + score.error());

        var misses = score.misses();
        util.log('Misses: ' + misses.length);
        _.each(score.misses(), function (x) {
            util.log('Predicted: ' + x.prediction + ' Target: ' + x.target);
        });

    }).catch(function (error) {

        // catch any errors thrown by any of the above promises
        util.error('Error at classifier.js promise chain:');
        util.error(error.stack);

    });