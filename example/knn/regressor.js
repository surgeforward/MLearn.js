var util = require('util');
var Q = require('q');
var _ = require('lodash');

var getDataSet = require(__dirname + '/../../datasets/houses.js');

var startTime = Date.now(), dataStart = Date.now();
var mlearn = require(__dirname + '/../../mlearn.js')();
var knn, scoreStart, trainStart;

Q.longStackSupport = true;

var numNeighbors = parseInt(process.argv[2]) || 5 ;
var trainSize = process.argv[3] || '27000,3000' ;
trainSize = trainSize.split(',');
var metricType = process.argv[4] || 'euclidian' ;

var pathToCSV = 'path/to/mlearn/sample-hours/train.csv';

util.log('Loading Dataset...');
getDataSet(pathToCSV, parseInt(trainSize[0]), parseInt(trainSize[1]))
    .then(function (dataSet, getTestData) {

        knn = mlearn.regressor('knn', { neighbors: parseInt(numNeighbors), metric: metricType});
        util.log('Training Model...');

        trainStart = Date.now();
        return knn.training(dataSet.train).then(function () {
            
            util.log('Completed Training in ' + ((Date.now() - trainStart) / 1000) + ' seconds');
            return dataSet;

        });

    }).then(function (dataSet) {

        scoreStart = Date.now();
        util.log('Scoring Model...');
        return knn.scoring(dataSet.validation);

    }).then(function (score) {
       
        util.log('Completed Scoring in ' + ((Date.now() - scoreStart) / 1000) + ' seconds');
        util.log('Completed All in ' + ((Date.now() - startTime) / 1000) + ' seconds');

        util.log('Error: ' + score.error());

    }).catch(function (error) {

        // catch any errors thrown by any of the above promises
        util.error('Error at regressor.js promise chain:');
        util.error(error.stack);

    });
