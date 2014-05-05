var util = require('util');
var Q = require('q');

var getDataSet = require(__dirname + '/../../datasets/digits.js');

var startTime = Date.now(), dataStart = Date.now();
var mlearn = require(__dirname + '/../../mlearn.js')();
var knn, scoreStart, trainStart;

Q.longStackSupport = true;

var numNeighbors = parseInt(process.argv[2]) || 5 ;
var trainSize = process.argv[3].split(',') || [27000,3000] ;
var metricType = process.argv[4] || 'euclidian' ;
var weightedKNN = process.argv[5] || false ;

console.log('Loading Dataset...');
getDataSet(parseInt(trainSize[0]), parseInt(trainSize[1]))
    .then(function (dataSet, getTestData) {

        knn = mlearn.classifier('knn', { neighbors: parseInt(numNeighbors), metric: metricType, weights: (weightedKNN) ? true : false });
        console.log('Training Model...');

        trainStart = Date.now();
        return knn.training(dataSet.train).then(function () {
            
            console.log('Completed Training in', (Date.now() - trainStart) / 1000, 'Seconds');
            return dataSet;

        });

    }).then(function (dataSet) {

        scoreStart = Date.now();
        console.log('Scoring Model...');
        return knn.scoring(dataSet.validation);

    }).then(function (score) {
       
        console.log('Completed Scoring in', (Date.now() - scoreStart) / 1000, 'Seconds');
        console.log('Completed All in', (Date.now() - startTime) / 1000, 'Seconds');

        console.log('Accuracy: ', score.accuracy());
        console.log('Error: ', score.error());

        console.log('Misses:');
        _.each(score.misses(), function (x) {
            console('Predicted: ' + x.prediction + ', Target: ' + x.target);
        });

    }).catch(function (error) {

        // catch any errors thrown by any of the above promises
        util.error('Error at classifier.js promise chain:');
        util.error(error.stack);

    });
