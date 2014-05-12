var util = require('util');
var Q = require('q');
var _ = require('lodash');

var startTime = Date.now(), dataStart = Date.now();
var mlearn = require(__dirname + '/../../mlearn.js')();
var dataset = mlearn.dataset();
var knn, scoreStart, trainStart;

Q.longStackSupport = true;

var numNeighbors = parseInt(process.argv[2]) || 5 ;
var trainSize = process.argv[3] || '27000,3000' ;
trainSize = trainSize.split(',');
var metricType = process.argv[4] || 'euclidian' ;

var pathToCSV = '../mlearn-datasets/sample-houses/train.csv';

dataset.from.csv(pathToCSV)
    .then(function () {

        knn = mlearn.regressor('knn', {
            neighbors: parseInt(numNeighbors),
            metric: metricType
        });

        dataset.shuffle();
        trainingData = dataset.split(.7);
        validationData = dataset.split(.3);

        util.log('Training Model W/ ' + trainingData.length + ' records and ' + trainingData[0].x.length + ' features');

        trainStart = Date.now();
        return knn.training(trainingData).then(function () {
            util.log('Completed Training in ' + ((Date.now() - trainStart) / 1000) + ' seconds');
            return dataset;
        });

    }).then(function (dataset) {

        util.log('Scoring Model W/ ' + validationData.length + ' records and ' + validationData[0].x.length + ' features');

        scoreStart = Date.now();
        return knn.scoring(validationData);

    }).then(function (score) {
       
        util.log('Completed Scoring in ' + ((Date.now() - scoreStart) / 1000) + ' seconds');
        util.log('Completed All in ' + ((Date.now() - startTime) / 1000) + ' seconds');
        util.log('Error: ' + score.error());

    }).catch(function (error) {

        // catch any errors thrown by any of the above promises
        util.error('Error at regressor.js promise chain:');
        util.error(error.stack);

    });
