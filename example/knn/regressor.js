var util = require('util');
var Q = require('q');

var getDataSet = require(__dirname + '/../../datasets/houses.js');

var startTime = Date.now(), dataStart = Date.now();
var mlearn = require(__dirname + '/../../index.js')();
var knn, scoreStart, trainStart;

Q.longStackSupport = true;

console.log('Loading Dataset...');
getDataSet().then(function (dataSet, getTestData) {
    console.log('Finished Loading Dataset in', (Date.now() - dataStart) / 1000, 'Seconds');
    knn = mlearn.regressor('knn', { neighbors: 5 });
    console.log('Training Model...');

    trainStart = Date.now();
    return knn.training(dataSet.train.features, dataSet.train.targets).then(function () {
        console.log('Completed Training in', (Date.now() - trainStart) / 1000, 'Seconds');
        return dataSet;
    });
}).then(function (dataSet) {
    scoreStart = Date.now();
    console.log('Scoring Model...');
    return knn.scoring(dataSet.validation.features, dataSet.validation.targets);
}).then(function (score) {
    console.log('Finished Scoring W/ Error of', score );
    console.log('Completed Scoring in', (Date.now() - scoreStart) / 1000, 'Seconds');
    console.log('Completed All in', (Date.now() - startTime) / 1000, 'Seconds');
}).catch(function (error) {
    // catch any errors thrown by any of the above promises
    util.error('Error at regressor.js promise chain:');
    util.error(error.stack);
});
