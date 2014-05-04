var util = require('util');
var Q = require('q');

var startTime = Date.now(), dataStart = Date.now();
var mlearn = require(__dirname + '/../../mlearn.js')();
var logistic, scoreStart, trainStart;

Q.longStackSupport = true;

console.log('Loading Dataset...');
mlearn.data.from.csv(__dirname+'/datasets/digits/train.csv')
.then(function (dataSet, getTestData) {
    console.log('Finished Loading Dataset in', (Date.now() - dataStart) / 1000, 'Seconds');
    logistic = mlearn.classifier('logistic', {iterations: 100, alpha: 0.001, lambda: 0.001});
    console.log('Training Model...');

    trainStart = Date.now();
    return logistic.training(dataSet.train.features, dataSet.train.targets).then(function () {
        console.log('Completed Training in', (Date.now() - trainStart) / 1000, 'Seconds');
        return dataSet;
    });
}).then(function (dataSet) {
    scoreStart = Date.now();
    console.log('Scoring Model...');
    return logistic.scoring(dataSet.validation.features, dataSet.validation.targets);
}).then(function (score) {
    console.log('Finished Scoring W/ Accuracy of', (score * 100) + '%');
    console.log('Completed Scoring in', (Date.now() - scoreStart) / 1000, 'Seconds');
    console.log('Completed All in', (Date.now() - startTime) / 1000, 'Seconds');
}).catch(function (error) {
    // catch any errors thrown by any of the above promises
    util.error('Error at classifier.js promise chain:');
    util.error(error.stack);
});
