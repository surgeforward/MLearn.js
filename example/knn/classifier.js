var getDataSet = require(__dirname+'/../../datasets/digits.js');

console.log('Loading Digits Dataset');
getDataSet().then(function (dataSet, getTestData) {
	console.log('Digits Dataset Loaded');

	var mlearn = require(__dirname+'/../../index.js')();
	var knn = mlearn.classifier('knn', { neighbors: 5 });

	console.log('Training Model');
	knn.train(dataSet.train.features, dataSet.train.targets);
	console.log('Model Trained');

	console.log('Scoring Model With Validation data');
	var score = knn.score(dataSet.validation.features, dataSet.validation.targets);
	console.log('Finished Scoring: ', score);

}, function (error) {
    console.log(error);
});