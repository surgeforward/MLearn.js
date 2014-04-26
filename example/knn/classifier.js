var util = require('util');
var Q = require('q');

var getDataSet = require(__dirname + '/../../datasets/digits.js');

var startTime = Date.now();
var mlearn = require(__dirname + '/../../index.js')();
var knn, scoreStart;

Q.longStackSupport = true;

console.log('Loading Digits Dataset...');
getDataSet().then(function (dataSet, getTestData) {
    console.log('Digits Dataset Loaded');
    
    knn = mlearn.classifier('knn', { neighbors: 5 });
    console.log('Training Model...');

    return knn.train(dataSet.train.features, dataSet.train.targets).then(function () {
        return dataSet;
    });
}).then(function (dataSet) {
    console.log('Model Trained');

    scoreStart = Date.now();
    console.log('Scoring Model With Validation Data...');

    return knn.score(dataSet.validation.features, dataSet.validation.targets);
}).then(function (score) {
    console.log('Finished Scoring');
    console.log('Accuracy: ', (score * 100) + '%');
    console.log('Completed Scoring In', (Date.now() - scoreStart) / 1000, 'Seconds');
    console.log('Completed All In', (Date.now() - startTime) / 1000, 'Seconds');
}).catch(function (error) {
    // catch any errors thrown by any of the above promises
    util.error('Error at classifier.js promise chain:');
    util.error(error.stack);
});
